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

// stores the points required for each stage
const TREE_STAGES = [
  { key: "sprout", label: "Sprout", pointsNeeded: 0 },
  { key: "baby_tree", label: "Baby Tree", pointsNeeded: 11 },
  { key: "small_tree", label: "Small Tree", pointsNeeded: 51 },
  { key: "medium_tree", label: "Medium Tree", pointsNeeded: 151 },
  { key: "large_magical_tree", label: "Large Magical Tree", pointsNeeded: 501 },
];

function getTreeProgressionInfo(totalPoints: number, maxPoints: number) {
    const nextStage = TREE_STAGES.find(
        (stage) => totalPoints < stage.pointsNeeded
    );

    if (nextStage) {
        return {
            nextGoal: nextStage.pointsNeeded,
            nextStageName: nextStage.label,
            pointsRemaining: nextStage.pointsNeeded - totalPoints,
        };
    }

    return {
        nextGoal: maxPoints,
        nextStageName: "Max",
        pointsRemaining: Math.max(maxPoints - totalPoints, 0),
    };
}

export function useTreeCounter() {
    const [stage, setStage] = useState(0);
    const [treeStageName, setTreeStageName] = useState("sprout");
    const [totalPoints, setTotalPoints] = useState(0);
    const [maxPoints, setMaxPoints] = useState(10000);

    const progressInfo = getTreeProgressionInfo(totalPoints, maxPoints);

    // Fetch initial tree state when the room loads.
    useEffect(() => {
        async function loadTree() {
            const { data, error } = await supabase
                .from("tree_progression")
                .select("total_points, max_points, tree_stage")
                .eq("id", 1)
                .single();
            // Error Handling
            if (error) {
                console.error("Failed to load tree:", error);
                return;
            }

            if (data) {
                setTotalPoints(data.total_points);
                setMaxPoints(data.max_points);
                setTreeStageName(data.tree_stage);
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
                        max_points: number,
                        tree_stage: string;
                    };

                    setTotalPoints(updatedTree.total_points);
                    setMaxPoints(updatedTree.max_points);
                    setTreeStageName(updatedTree.tree_stage);
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
        treeStageName,
        maxPoints,
        nextGoal: progressInfo.nextGoal,
        nextStageName: progressInfo.nextStageName,
        pointsRemaining: progressInfo.pointsRemaining,
    };
}