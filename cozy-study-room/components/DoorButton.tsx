"use client";

import { supabase } from "../lib/supabaseClient";

export function DoorButton({ hidden }: { hidden?: boolean }) {
  async function handleLogout() {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      await supabase.from("room_seats").delete().eq("user_id", data.user.id);
    }
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div
      onClick={handleLogout}
      title="Leave the library"
      style={{
        position: "absolute",
        bottom: 24,
        left: 33,
        zIndex: 940,
        cursor: "pointer",
        opacity: hidden ? 0.4 : 1,
        pointerEvents: hidden ? "none" : "auto",
        transition: "opacity 0.2s ease",
        animation: "doorBob 3.2s ease-in-out infinite",
      }}
      onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.2)")}
      onMouseLeave={e => (e.currentTarget.style.filter = "brightness(1)")}
    >
      <img
        src="/assets/door.png"
        alt="Logout"
        style={{
          width: 30,
          height: 42,
          imageRendering: "pixelated",
          display: "block",
          filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.6))",
        }}
      />
      <style>{`
        @keyframes doorBob {
          0%, 100% { transform: translateY(0px);  }
          50%       { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}