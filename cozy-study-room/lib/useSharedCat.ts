"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "./supabaseClient";

export type CatState = {
  x: number;
  y: number;
  anim: string;
  frame: number;
  updated_at: number;
};

export function useSharedCat(userId: string | null) {
  const [catState, setCatState] = useState<CatState>({
    x: 700, y: 500, anim: "loaf_left", frame: 0, updated_at: Date.now(),
  });

  const [isCatHost, setIsCatHost] = useState(false);
  const isCatHostRef  = useRef(false);
  const channelRef    = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const lastHBRef     = useRef<number>(0);
  const presentIdsRef = useRef<string[]>([]);

  useEffect(() => { isCatHostRef.current = isCatHost; }, [isCatHost]);

  const claimHost = useCallback(() => {
    if (!userId || isCatHostRef.current) return;
    console.log(`[CAT] claim: ${userId.slice(0,8)}`);
    isCatHostRef.current = true;
    lastHBRef.current    = Date.now();
    setIsCatHost(true);
  }, [userId]);

  const releaseHost = useCallback(() => {
    if (!isCatHostRef.current) return;
    console.log(`[CAT] release: ${userId?.slice(0,8)}`);
    isCatHostRef.current = false;
    setIsCatHost(false);
  }, [userId]);

  // Channel
  useEffect(() => {
    if (!userId) return;

    const channel = supabase.channel("shared-cat-room", {
      config: { broadcast: { self: false }, presence: { key: userId } },
    });

    channel.on("broadcast", { event: "cat_state" }, (payload) => {
      setCatState(payload.payload as CatState);
    });

    channel.on("broadcast", { event: "cat_heartbeat" }, (payload) => {
      const { host_id } = payload.payload as { host_id: string };

      if (host_id === "__vacating__") {
        console.log(`[CAT] host vacating — zeroing HB`);
        lastHBRef.current = 0;
        return;
      }

      lastHBRef.current = Date.now();
      if (host_id !== userId && isCatHostRef.current) releaseHost();
    });

    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState<{ user_id: string }>();
      presentIdsRef.current = Object.values(state).flat()
        .map(p => p.user_id).filter(Boolean);
    });

    channel.subscribe(async (status) => {
      if (status !== "SUBSCRIBED") return;
      await channel.track({ user_id: userId });
      await new Promise<void>(res => setTimeout(res, 2500));
      const alive = lastHBRef.current > 0 && Date.now() - lastHBRef.current < 5000;
      if (!alive && !document.hidden) claimHost();
    });

    channelRef.current = channel;
    return () => {
      channel.untrack();
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [userId, claimHost, releaseHost]);

  // Heartbeat
  useEffect(() => {
    if (!isCatHost || !userId) return;

    const id = setInterval(() => {
      if (document.hidden) {
        console.log(`[CAT] tab hidden — vacating`);
        channelRef.current?.send({
          type: "broadcast", event: "cat_heartbeat",
          payload: { host_id: "__vacating__" },
        });
        releaseHost();
        return;
      }
      channelRef.current?.send({
        type: "broadcast", event: "cat_heartbeat",
        payload: { host_id: userId },
      });
    }, 2000);

    return () => clearInterval(id);
  }, [isCatHost, userId, releaseHost]);

  // Watchdog
  useEffect(() => {
    if (!userId) return;

    const id = setInterval(() => {
      // Never self-elect when hidden
      if (document.hidden) return;

      const age   = lastHBRef.current ? Date.now() - lastHBRef.current : Infinity;
      const alive = age < 5000;

      console.log(`[CAT] watchdog alive=${alive} age=${Math.round(age)}ms host=${isCatHostRef.current}`);

      if (alive) {
        if (isCatHostRef.current) return; // we are the living host, all good
        return; // someone else is host, all good
      }

      // No live host and our tab is visible — claim it regardless of userId sort order.
      // We don't know if other clients are visible, but we know WE are.
      // If multiple visible clients try to claim simultaneously, the first
      // heartbeat received will cause the others to stand down.
      console.log(`[CAT] no host, I am visible — claiming`);
      claimHost();
    }, 1000);

    return () => clearInterval(id);
  }, [userId, claimHost]);

  // Broadcast
  const broadcastCatState = useCallback((nextState: CatState) => {
    if (document.hidden) return;
    setCatState(nextState);
    channelRef.current?.send({
      type: "broadcast", event: "cat_state", payload: nextState,
    });
  }, []);

  return { catState, isCatHost, broadcastCatState };
}