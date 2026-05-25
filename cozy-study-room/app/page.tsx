"use client";

import { useEffect, useState} from "react";
import { supabase } from "@/lib/supabaseClient"

// Imports the Pomodoro timer component.
import PomodoroTimer from "@/components/PomodoroTimer";

// loads current tree data from supabase and reads tree_progression table
export default function Home() {
  const [points, setPoints] = useState(0);
  const [stage, setStage] = useState("seed");
  const [message, setMessage] = useState("");

  async function loadTree() {
    const { data, error } = await supabase
      .from("tree_progression")
      .select("total_points, tree_stage")
      .eq("id", 1)  // req tree row where id = 1
      .single(); // one row is expected
  
  // log error
  if (error) {
    console.error("Error loading tree: ", error);
    // updates front-end
    setMessage("Could not load tree data.");

    return;
  }

  setPoints(data.total_points);
  setStage(data.tree_stage);
}

// calls postgreSQL func add_tree_points()
async function add_tree_point(pointsToAdd: number) {
  // Calls RPC func
  const { data, error } = await supabase.rpc('add_tree_points', {points_to_add: pointsToAdd});

  console.log("RPC Data:", data);
  console.log("RPC Error:", error);

  // log error
  if (error) {
    console.error("Error adding point: ", error);
    // updates front-end
    setMessage("Point could not be added.");

    return;
  }

  // Updates the page directly from the returned SQL data.
  if (data && data.length > 0) {
    setPoints(data[0].new_total_points);
    setStage(data[0].new_tree_stage);
  }


    setMessage(`Added +${pointsToAdd} point(s)!`);
   
}
/*
  // runs once the page loads and the [] meanas that it only runs on first render
  useEffect(() => {
  // Creates an async function inside useEffect to avoid unnecessary renders
  async function fetchTreeOnLoad() {
    // Calls our Supabase loading function.
    await loadTree();
  }

  // Runs the async function.
  fetchTreeOnLoad();
}, []);
*/
  // runs once the page loads and the [] meanas that it only runs on first render
  // Creates an async function inside useEffect to avoid unnecessary renders
  // Calls our Supabase loading function.
  // Runs the async function.
  useEffect(() => {async function fetchTreeOnLoad() {await loadTree();}  fetchTreeOnLoad(); }, []);


  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Cozy Study Room</h1>

      <p>Tree Points: {points}</p>
      <p>Tree Stage: {stage}</p>
      {/*PomodoroTimer component */}
      <PomodoroTimer onEarnpoint={add_tree_point} />

      <p>{message}</p>
    </main>
  );
}