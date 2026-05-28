"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { addEarnedPoints } from "./databaseService";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// maps tree stages to numeric values for easier comparison and state management
const STAGE_MAP: Record<string, number> = {
  sprout:             0,
  baby_tree:          1,
  small_tree:         2,
  medium_tree:        3,
  large_magical_tree: 4,
};

export function useTreeCounter() {
    const [stage, setStage] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);

    // Fetch initial tree state when the room loads.
    useEffect(() => {
        async function loadTree() {
            const { data, error } = await supabase
                .from("tree_progression")
                .select("total_points, tree_stage")
                .eq("id", 1)
                .single();
            // Error Handling
            if (error) {
                console.error("Failed to load tree:", error);
                return;
            }

            if (data) {
                setTotalPoints(data.total_points);
                setStage(STAGE_MAP[data.tree_stage] ?? 0);
            }
        }

        loadTree();
    }, []);

    // Listen for live updates to the shared tree.
    useEffect(() => {
        const channel = supabase
            .channel("tree_progression_changes")
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "tree_progression",
                    filter: "id=eq.1",
                },
                (payload) => {
                    const updatedTree = payload.new as {
                        total_points: number;
                        tree_stage: string;
                    };

                    setTotalPoints(updatedTree.total_points);
                    setStage(STAGE_MAP[updatedTree.tree_stage] ?? 0);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Adds points through the database helper.
    // This updates both user_progress and tree_progression.
    const addPoints = useCallback(async (amount: number) => {
        await addEarnedPoints(amount);
    }, []);

    return {
        stage,
        totalPoints,
        addPoints,
    };
}