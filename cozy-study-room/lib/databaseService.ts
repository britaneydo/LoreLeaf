import { supabase } from "./supabaseClient";

// Gets the currently logged in user
export async function getCurrentUser()
{
    const
    {
            data: { user },
            error 
    } = await supabase.auth.getUser();

    if (error)
    {
        throw error;
    }

    return user;

}


// Gets the current user's profile row from the profiles table.
export async function getCurrentProfile()
{
    const user = await getCurrentUser();

    if (!user) 
    {
        return null;
    }

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (error)
    {
        throw error;
    }

    return data;
}

// Gets the row for the shared tree.
export async function getSharedTreeProgress()
{
    const { data, error } = await supabase
        .from("tree_progression")
        .select("*")
        .eq("id", 1)
        .single();

    if (error)
    {
        throw error;
    }

    return data;
}

// Updates the current user's selected avatar
// The avatarType must match one of the allowed database values.
export async function updateAvatarType(avatarType: string)
{
    const user = await getCurrentUser();

    if (!user)
    {
        throw new Error("User is not logged in");
    }

    const { data, error } = await supabase
        .from("profiles")
        .update({ avatar_type: avatarType })
        .eq("id", user.id)
        .select()
        .single();

    if (error)
    {
        throw error;
    }

    return data;
}

// Gets users personal progress.
export async function getUserProgress()
{
    const user = await getCurrentUser();

    if (!user) 
    {
        return null;
    }

    const { data, error } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id)
        .single();

    if (error)
    {
        throw error;
    }
    return data;
}

// Add earned points to a users personal progress
// also adds the same points to the shared tree
export async function addEarnedPoints(pointsToAdd: number)
{
    const user = await getCurrentUser();
    if (!user)
    {
        throw new Error("User is not logged in");
    }

    if (pointsToAdd <= 0)
    {
        throw new Error("Points must be positive");
    }

    // Start by getting the users current progress
    const { data: currentProgress, error: progressFetchError } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id)
        .single();

    if (progressFetchError)
    {
        throw progressFetchError;
    }

    const newTotalPoints = currentProgress.total_points + pointsToAdd;

    // Next update that progress.
    const { data: updatedProgress, error: progressUpdateError } = await supabase
        .from("user_progress")
        .update
        ({
            total_points: newTotalPoints,
            last_session_date: new Date().toISOString().slice(0, 10)
        })
        .eq("user_id", user.id)
        .select()
        .single();

    if (progressUpdateError)
    {
        throw progressUpdateError;
    }

    // Lastly, update the shared room tree
    const { data: updatedTree, error: treeError } = await supabase.rpc("add_tree_points", { points_to_add: pointsToAdd })

    if (treeError)
    {
        throw treeError;
    }

    return{
        pointsAdded: pointsToAdd,
        updatedProgress,
        updatedTree
    };
}


// Saves a study session once the timer reaches 0
export async function saveCompletedStudySession(
    taskName: string,
    durationMinutes: number,
    pointsEarned: number
)
{
    const user = await getCurrentUser();

    if (!user)
    {
        throw new Error("User is not logged in")
    }

    const { data, error } = await supabase
        .from("study_sessions")
        .insert({
            user_id: user.id,
            task_name: taskName,
            duration_minutes: durationMinutes,
            points_earned: pointsEarned,
            completed: true,
            completed_at: new Date().toISOString()
        })
        .select()
        .single();

    if (error)
    {
        throw error;
    }

    return data;
}

// Lets the user continue as a guest.
export async function continueAsGuest()
{
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError)
    {
        throw sessionError;
    }

    if (session)
    {
        return session;
    }
    const { data, error } = await supabase.auth.signInAnonymously();

    if (error)
    {
        throw error;
    }

    return data.session;
}

// Listens for live updates to the shared tree_progression row.
// When another user adds points, this lets the frontend update automatically.
export function subscribeToSharedTreeProgress(
    onTreeUpdate: (treeRow: {
        id: number;
        total_points: number;
        max_points: number;
        tree_stage: string;
        updated_at: string;
    }) => void
) {
    const channel = supabase
        .channel("shared-tree-progress")
        .on(
            "postgres_changes",
            {
                event: "UPDATE",
                schema: "public",
                table: "tree_progression",
                filter: "id=eq.1"
            },
            (payload) => {
                onTreeUpdate(payload.new as {
                    id: number;
                    total_points: number;
                    max_points: number;
                    tree_stage: string;
                    updated_at: string;
                });
            }
        )
        .subscribe();

    return channel;
}

        



// Signs out users
export async function signOutUser()
{
    const { error } = await supabase.auth.signOut();

    if (error)
    {
        throw error;
    }
}
