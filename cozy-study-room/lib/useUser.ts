"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import type { User } from "@supabase/supabase-js";

export function useUser() {
  const [user, setUser]               = useState<User | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null); // stores user's display name from profile tab (superbase)
  const [loading, setLoading]         = useState(true); // tracks user/profile data is still loading

    const fetchDisplayName = useCallback(async(userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", userId)
      .single();

    if (error){
      console.error("Failed to fetch Display Name:", error);
      setDisplayName(null);
      setLoading(false);
    }
    setDisplayName(data?.display_name ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    // get current session
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) fetchDisplayName(data.user.id);
      else setLoading(false);
    });

    // LIVE, sync across mult users
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchDisplayName(session.user.id);
      else setDisplayName(null);
    });

    return () => listener.subscription.unsubscribe();
  },[fetchDisplayName]);

  return { user, displayName, loading };
}