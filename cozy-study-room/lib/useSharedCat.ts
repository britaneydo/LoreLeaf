"use client"; 

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "./supabaseClient"

// define the cats state
export type CatState = {
    x: number;
    y: number;
    anim: string  // Direction the cat is facing
    frame: number;          
    updated_at: number;     
}

// Syncs the cat across multiple users using supabase Realtime
export function useSharedCat(userId: string | null)
{
    const [catState, setCatState] = useState<CatState>(() => ({
        x: 700,
        y: 500,
        anim: "loaf_left",
        frame: 0,
        updated_at: Date.now(),
    }));

    // Determines if this specific user is responsible for updating/moving the cat
    const [isCatHost, setIsCatHost] = useState(false);

    // Holds the Supabase channel instance
    const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

    // Keeps a refrence of when a user joined
    const joinedAtRef = useRef<number | null>(null);

    useEffect(() => {
        // Does not let unauthorized users from becoming hosts (must be logged in)
        if (!userId) return;
        if (joinedAtRef.current === null) {
            joinedAtRef.current = Date.now();
        }

        // Initialize a Supabase Realtime channel named "shared-cat-room"
        const channel = supabase.channel("shared-cat-room", { config: { broadcast: { self: false, }, presence: { key: userId, }, }, });

        // Listen for incoming updates from other clients.
        channel.on("broadcast", { event: "cat_state" }, (payload) =>
        {
            // Update local state with the cat data sent by the host
            setCatState(payload.payload as CatState);
        });

        // Track who is online
        channel.on("presence", { event: "sync" }, () =>
        {
            const state = channel.presenceState<{
                user_id: string;
                joined_at: number;
            }>();

            const users = Object.values(state)
                .flat()
                .filter((presence) => presence.user_id && presence.joined_at)
                .sort((a, b) => a.joined_at - b.joined_at);

            const hostUserId = users[0]?.user_id ?? null;

            // Sets the oldest user as the cats host.
            setIsCatHost(hostUserId === userId);
        });

        // Subscribe to the channel and track presence
        channel.subscribe(async (status) =>
        {
            if (status === "SUBSCRIBED") {
                await channel.track({
                    user_id: userId,
                    joined_at: joinedAtRef.current,
                    online_at: new Date().toISOString(),
                });
            }
        });

        // Store the channel refrence so the broadcast function can actually use it
        channelRef.current = channel;

        return () => {
            channel.untrack();
            supabase.removeChannel(channel);
            channelRef.current = null;
        };


    }, [userId]);

    // Updates the local cat state and broadcasts it
    const broadcastCatState = useCallback((nextCatState: CatState) => {
        setCatState(nextCatState);

        channelRef.current?.send({
            type: "broadcast",
            event: "cat_state",
            payload: nextCatState,
        });
    }, []);

    return {
        catState,
        isCatHost,
        broadcastCatState,

    };
   
}

