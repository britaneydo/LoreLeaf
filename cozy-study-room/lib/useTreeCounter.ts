"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

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

  // fetch initial state
  useEffect(() => {
    supabase
      .from("tree_progression")
      .select("tree_stage")
      .eq("id", 1)
      .single()
      .then(({ data }) => {
        if (data) setStage(STAGE_MAP[data.tree_stage] ?? 0);
      });
  }, []);

  // live updates
  useEffect(() => {
    const channel = supabase
      .channel("tree_progression_changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "tree_progression" },
        (payload) => {
          const newStage = payload.new.tree_stage as string;
          setStage(STAGE_MAP[newStage] ?? 0);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // handles point adding and stage updating atomically
  async function addPoints(amount: number) {
    const { error } = await supabase.rpc("add_tree_points", {
      points_to_add: amount,
    });
    if (error) console.error("Failed to add tree points:", error.message);
  }

  return { stage, addPoints };
}