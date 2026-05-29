"use client";

import { useState } from "react";
import PomodoroTimer from "./PomodoroTimer";
import { saveCompletedStudySession } from "@/lib/databaseService";

type TomatoButtonProps = {
  addPoints: (pts: number) => Promise<void> | void;
  onOpenChange: (open: boolean) => void;
  hidden?: boolean;
};

export function TomatoButton({ addPoints, onOpenChange, hidden }: TomatoButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* tomato icon */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: 24,
          zIndex: 900,
          cursor: "pointer",
          animation: "tomatoBob 2.4s ease-in-out infinite",
          imageRendering: "pixelated",
          opacity: hidden ? 0.4 : 1,
          pointerEvents: hidden ? "none" : "auto",
          transition: "opacity 0.2s ease",
        }}
        onClick={() => { setOpen(true); onOpenChange(true); }}
        title="Open Pomodoro Timer"
      >
        <img
          src="/assets/tomato_icon.png"
          alt="Pomodoro Timer"
          style={{
            width: 48,
            height: 48,
            imageRendering: "pixelated",
            display: "block",
            filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.6))",
          }}
        />
      </div>

        {/* allows pomodoro timer to run even when closed */}
      <div style={{ display: open ? "contents" : "none" }}>
        <PomodoroOverlay
            onClose={() => { setOpen(false); onOpenChange(false); }}
            addPoints={addPoints}
        />
        </div>

      <style>{`
        @keyframes tomatoBob {
          0%, 100% { transform: translateY(0px);  }
          50%       { transform: translateY(-5px); }
        }
      `}</style>
    </>
  );
}

// overlay

type OverlayProps = {
  onClose: () => void;
  addPoints: (pts: number) => Promise<void> | void;
};

export default function PomodoroOverlay({ onClose, addPoints }: OverlayProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(14, 10, 6, 0.78)",
        backdropFilter: "blur(2px)",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          backgroundImage: "url('/assets/pomodoroUI.png')",
          backgroundSize: "100% 100%",
          imageRendering: "pixelated",
          padding: "35px 40px 44px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: 350,
          height: 500
        }}
      >
        {/* close x */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 15,
            right: 15,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#8F0808",
            fontSize: 18,
            lineHeight: 1,
            padding: 0,
            fontFamily: "monospace",
          }}
          title="Close"
        >
          ✕
        </button>

        <PomodoroSkin addPoints={addPoints} />
      </div>

      <style>{`
        @font-face {
          font-family: 'PixelOperator';
          src: url('/fonts/PixelOperator.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        @font-face {
          font-family: 'PixelOperatorSC';
          src: url('/fonts/PixelOperatorSC.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        @font-face {
          font-family: 'PixelOperatorSC';
          src: url('/fonts/PixelOperatorSC-Bold.ttf') format('truetype');
          font-weight: bold;
          font-style: normal;
        }
      `}</style>
    </div>
  );
}

// Skin
// Wraps PomodoroTimer and overrides its Tailwind styles to match the pixel-art

function PomodoroSkin({ addPoints }: { addPoints: (pts: number) => Promise<void> | void; }) {
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>

      {/* Title */}
      <h1 style={{
        fontFamily: "'PixelOperatorSC', monospace",
        fontWeight: "bold",
        fontSize: 34,
        color: "#6b1a1a",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        margin: "0 0 0px",
        textAlign: "center",
      }}>
        Pomodoro Timer
      </h1>

      {/* Tomato icon */}
      <img
        src="/assets/tomato_icon.png"
        alt=""
        style={{ width: 80, height: 80, imageRendering: "pixelated", marginBottom: 0 }}
      />

      <div className="pomodoro-skin-wrapper">
        <PomodoroTimer 
            onEarnpoint={addPoints}
        />

      </div>

      <style>{`
        /* hide PomodoroTimer's own h2 title — we drew ours above */
        .pomodoro-skin-wrapper h2 { display: none; }

        /* strip the grey section background */
        .pomodoro-skin-wrapper section {
          background: transparent !important;
          padding: 0 !important;
          gap: 12px !important;
          border-radius: 0 !important;
          color: #3a1a0a !important;
          align-items: center !important;
        }

        /* "Session Length:" */
        .pomodoro-skin-wrapper .text-neutral-300 {
        font-family: 'PixelOperatorSC', monospace !important;
        font-size: 20px !important;
        letter-spacing: 0.05em;
        color: #7a3a20 !important;
        margin: 0;
        }

        /* countdown digits */
        .pomodoro-skin-wrapper .text-5xl {
          font-family: 'PixelOperator', monospace !important;
          font-size: 80px !important;
          font-weight: normal !important;
          color: #8b1a1a !important;
          letter-spacing: 0.04em;
          line-height: 1;
          margin: 4px 0;
        }

        /* "Points Earned" line */
        .pomodoro-skin-wrapper .text-green-300 {
          font-family: 'PixelOperatorSC', monospace !important;
          font-size: 20px !important;
          color: #000000 !important;
          letter-spacing: 0.04em;
        }

        /* All timer buttons use button.png as their background */
        .pomodoro-skin-wrapper button {
          /* layout */
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 90px;
          height: 54px;
          padding: 0 12px !important;

          background-image: url('/assets/button.png') !important;
          background-color: transparent !important;
          background-size: 100% 100% !important;
          background-repeat: no-repeat !important;
          image-rendering: pixelated;

          /* text */
          font-family: 'PixelOperatorSC', monospace !important;
          font-size: 18px !important;
          font-weight: bold !important;
          letter-spacing: 0.12em !important;
          text-transform: uppercase !important;
          color: #f0d8b0 !important;

          /* no default browser button chrome */
          border: none !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          outline: none;
          cursor: pointer;

          transition: filter 0.1s ease, transform 0.08s ease;
        }

        .pomodoro-skin-wrapper button:hover:not(:disabled) {
          filter: brightness(1.3);
        }

        .pomodoro-skin-wrapper button:active:not(:disabled) {
          filter: brightness(0.85);
          transform: translateY(2px);
        }

        .pomodoro-skin-wrapper button:disabled {
          opacity: 0.35 !important;
          cursor: not-allowed !important;
        }

        /* break-reminder sits above the overlay */
        .pomodoro-skin-wrapper .fixed {
          z-index: 1100 !important;
        }
        .pomodoro-skin-wrapper .fixed h2,
        .pomodoro-skin-wrapper .fixed p,
        .pomodoro-skin-wrapper .fixed button {
          font-family: 'PixelOperatorSC', monospace !important;
        }
      `}</style>
    </div>
  );
}