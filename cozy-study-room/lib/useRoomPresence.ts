"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
  const [mySeatId, setMySeatId ] = useState<string | null>(null);
  const [playerCount, setPlayerCount] = useState(0);

  // Refs so claimSeat always sees the latest values without needing
  // to be recreated every time props change.
  const displayNameRef = useRef(displayName);
  const avatarTypeRef  = useRef(avatarType);
  useEffect(() => { displayNameRef.current = displayName; }, [displayName]);
  useEffect(() => { avatarTypeRef.current  = avatarType;  }, [avatarType]);



  // Cleans up any old seat row for this user when they first enter the room.
  // Uses a ref so it only ever fires once — re-running on userId change would
  // delete other users' rows from local state via the realtime DELETE handler.
  // Run cleanup exactly once when userId first becomes available.
  // Must NOT re-run if userId changes or after claimSeat inserts a row.
  const cleanedUpRef = useRef(false);
  useEffect(() => {
    if (!userId || cleanedUpRef.current) return;
    cleanedUpRef.current = true;
    console.log("[PRESENCE] cleanup firing for", userId.slice(0,8));
    supabase.from("room_seats").delete().eq("user_id", userId);
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps


  // LIVE. real time changes
  useEffect(() => {
    const channel = supabase
      .channel("room_seats_live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "room_seats" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            console.log("[PRESENCE] INSERT received:", payload.new);
            setSeats((prev) => {
              const exists = prev.some((s) => s.user_id === (payload.new as OccupiedSeat).user_id);
              console.log("[PRESENCE] exists?", exists, "prev:", prev.map(s => s.user_id.slice(0,8)));
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
            console.log("[PRESENCE] DELETE received:", payload.old);
            setSeats((prev) =>
              prev.filter((s) => s.seat_id !== (payload.old as { seat_id: string }).seat_id)
            );
          }
        }
      )
      .subscribe(async (status) => {
        console.log("[PRESENCE] channel status:", status);
        if (status === "SUBSCRIBED") {
          const { data } = await supabase.from("room_seats").select("*");
          console.log("[PRESENCE] post-subscribe fetch:", data);
          if (data) {
            // Merge with current state instead of replacing it — a live INSERT
            // may have already arrived while this fetch was in flight, so we
            // union both sets keyed by user_id to avoid wiping live updates.
            setSeats((prev) => {
              const merged = [...(data as OccupiedSeat[])];
              prev.forEach((s) => {
                if (!merged.some((m) => m.user_id === s.user_id)) {
                  merged.push(s);
                }
              });
              return merged;
            });
          }
        }
      });

    return () => { supabase.removeChannel(channel); };
  }, []);

    // Tracks how many users are currently connected to the room.
    // Counts all users even if they are not sitting.
    useEffect(() => {
        if (!userId) return;

        const channel = supabase.channel("study-room-presence", {
            config: {
                presence: {
                    key: userId,
                },
            },
        });

        channel
            .on("presence", { event: "sync" }, () => {
                const state = channel.presenceState();

                // Counts unique connected users.
                setPlayerCount(Object.keys(state).length);
            })
            .subscribe(async (status) => {
                if (status === "SUBSCRIBED") {
                    await channel.track({
                        user_id: userId,
                        display_name: displayName ?? "Guest",
                        avatar_type: avatarType ?? "unknown",
                        online_at: new Date().toISOString(),
                    });
                }
            });

        return () => {
            channel.untrack();
            supabase.removeChannel(channel);
        };
    }, [userId, displayName, avatarType]);


  // vacate seat helper
  const vacateSeat = useCallback(async () => {
    if (!userId) return;
    setMySeatId(null);
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

  // claim a seat — accepts optional overrides for avatarType and displayName
  // so the caller can pass the latest values directly without relying on refs.
  const claimSeat = useCallback(async (
    seatId: string,
    taskName: string = "",
    avatarTypeOverride?: string,
    displayNameOverride?: string,
  ) => {
    if (!userId) return;

    const resolvedAvatar      = avatarTypeOverride   ?? avatarTypeRef.current   ?? "default";
    const resolvedDisplayName = displayNameOverride  ?? displayNameRef.current  ?? "Guest";

    // vacate any previous seat first
    await supabase.from("room_seats").delete().eq("user_id", userId);

    const row: OccupiedSeat = {
      seat_id:      seatId,
      user_id:      userId,
      display_name: resolvedDisplayName,
      avatar_type:  resolvedAvatar,
      task_name:    taskName,
      sat_down_at:  new Date().toISOString(),
    };

    console.log("[PRESENCE] inserting row:", row);
    const { error } = await supabase.from("room_seats").insert(row);
    if (error) {
      console.error("[PRESENCE] insert error:", error);
    } else {
      setMySeatId(seatId);
    }
  }, [userId]);

  return {
    seats,
    playerCount,
    claimSeat,
    vacateSeat,
    mySeatId,
  };
}