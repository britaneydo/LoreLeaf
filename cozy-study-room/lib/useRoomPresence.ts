"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "./supabaseClient";

export type OccupiedSeat = {
  seat_id:      string;
  user_id:      string;
  display_name: string;
  avatar_type:  string;
  task_name:    string;
  sat_down_at:  string;
};

type UseRoomPresenceOptions = {
  userId:      string | null;
  displayName: string | null;
  avatarType:  string | null;
};

export function useRoomPresence({ userId, displayName, avatarType }: UseRoomPresenceOptions) {
  const [seats, setSeats] = useState<OccupiedSeat[]>([]);
  const mySeatIdRef = useRef<string | null>(null);

  // load initial seat state
  useEffect(() => {
    supabase
      .from("room_seats")
      .select("*")
      .then(({ data }) => {
        if (data) setSeats(data as OccupiedSeat[]);
      });
  }, []);

  // LIVE. real time changes
  useEffect(() => {
    const channel = supabase
      .channel("room_seats_live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "room_seats" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setSeats((prev) => {
              const exists = prev.some((s) => s.seat_id === (payload.new as OccupiedSeat).seat_id);
              return exists ? prev : [...prev, payload.new as OccupiedSeat];
            });
          } else if (payload.eventType === "UPDATE") {
            setSeats((prev) =>
              prev.map((s) =>
                s.seat_id === (payload.new as OccupiedSeat).seat_id
                  ? (payload.new as OccupiedSeat)
                  : s
              )
            );
          } else if (payload.eventType === "DELETE") {
            setSeats((prev) =>
              prev.filter((s) => s.seat_id !== (payload.old as { seat_id: string }).seat_id)
            );
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // vacate seat helper
  const vacateSeat = useCallback(async () => {
    if (!userId) return;
    mySeatIdRef.current = null;
    await supabase.from("room_seats").delete().eq("user_id", userId);
  }, [userId]);

  // tab close = release seat using the live session token so RLS allows the DELETE
  useEffect(() => {
    if (!userId) return;

    const handleUnload = () => {
      // Get the current session token synchronously from storage
      // (supabase-js stores it in localStorage under a predictable key)
      const storageKey = Object.keys(localStorage).find(k => k.startsWith("sb-") && k.endsWith("-auth-token"));
      const raw = storageKey ? localStorage.getItem(storageKey) : null;
      let token = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed?.access_token) token = parsed.access_token;
        } catch {}
      }

      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/room_seats?user_id=eq.${userId}`;
      fetch(url, {
        method: "DELETE",
        keepalive: true,
        headers: {
          apikey:        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [userId]);

  // claim a seat
  const claimSeat = useCallback(async (seatId: string, taskName: string = "") => {
    if (!userId || !displayName || !avatarType) return;

    // vacate any previous seat first
    await supabase.from("room_seats").delete().eq("user_id", userId);

    const row: OccupiedSeat = {
      seat_id:      seatId,
      user_id:      userId,
      display_name: displayName,
      avatar_type:  avatarType,
      task_name:    taskName,
      sat_down_at:  new Date().toISOString(),
    };

    const { error } = await supabase.from("room_seats").insert(row);
    if (!error) {
      mySeatIdRef.current = seatId;
    }
  }, [userId, displayName, avatarType]);

  return {
    seats,
    claimSeat,
    vacateSeat,
    mySeatId: mySeatIdRef.current,
  };
}