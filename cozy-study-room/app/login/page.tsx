"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useEffect } from "react";

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode]         = useState<"login" | "signup">("login");
  const [message, setMessage]   = useState<string | null>(null);
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) window.location.href = "/room";
    });
  }, []);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    setMessage(null);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setMessage("Check your email to confirm your account!");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else window.location.href = "/room";
    }

    setLoading(false);
  }

  return (
    <>
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
        .login-input {
          width: 100%;
          padding: 15px 18px;
          border-radius: 4px;
          border: 1px solid rgba(240,216,168,0.2);
          background: rgba(255,255,255,0.04);
          color: #f0d8a8;
          font-size: 24px;
          font-family: 'PixelOperator', monospace;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.15s ease;
        }
        .login-input::placeholder {
          color: rgba(240,216,168,0.35);
        }
        .login-input:focus {
          border-color: rgba(240,216,168,0.5);
        }
        .mode-btn {
          flex: 1;
          padding: 12px 0;
          border-radius: 4px;
          border: 1px solid rgba(240,216,168,0.25);
          background: transparent;
          color: #7a6a5a;
          cursor: pointer;
          font-size: 21px;
          font-family: 'PixelOperatorSC', monospace;
          font-weight: bold;
          letter-spacing: 0.08em;
          transition: background 0.15s, color 0.15s;
        }
        .mode-btn.active {
          background: rgba(240,216,168,0.12);
          color: #f0d8a8;
        }
        .submit-btn {
          width: 100%;
          padding: 18px 0;
          border-radius: 4px;
          border: 1px solid rgba(240,216,168,0.25);
          background: rgba(240,216,168,0.1);
          color: #f0d8a8;
          cursor: pointer;
          font-size: 22px;
          font-family: 'PixelOperatorSC', monospace;
          font-weight: bold;
          letter-spacing: 0.15em;
          transition: background 0.15s;
        }
        .submit-btn:hover:not(:disabled) {
          background: rgba(240,216,168,0.18);
        }
        .submit-btn:disabled {
          opacity: 0.5;
          cursor: default;
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#1c1917",
      }}>
        <div style={{
          background: "rgba(24, 18, 10, 0.97)",
          border: "1px solid rgba(240,216,168,0.18)",
          borderRadius: 8,
          padding: "66px 72px",
          width: 570,
          display: "flex",
          flexDirection: "column",
          gap: 24,
          boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
        }}>

          {/* Title */}
          <div style={{ textAlign: "center", marginBottom: 8 }}>
            <div style={{
              fontFamily: "'PixelOperatorSC', monospace",
              fontWeight: "bold",
              fontSize: 33,
              color: "#f0d8a8",
              letterSpacing: "0.18em",
              textShadow: "0 0 18px rgba(255,180,60,0.4)",
              marginBottom: 10,
            }}>
              LORELEAF
            </div>
            <div style={{
              fontFamily: "'PixelOperator', monospace",
              fontSize: 19,
              color: "rgba(240,216,168,0.45)",
              letterSpacing: "0.12em",
            }}>
              ✦ a cozy fantasy library ✦
            </div>
          </div>

          {/* Mode toggle */}
          <div style={{ display: "flex", gap: 12 }}>
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                className={`mode-btn${mode === m ? " active" : ""}`}
                onClick={() => { setMode(m); setError(null); setMessage(null); }}
              >
                {m === "login" ? "LOG IN" : "SIGN UP"}
              </button>
            ))}
          </div>

          {/* Fields */}
          <input
            className="login-input"
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <input
            className="login-input"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />

          {/* Feedback */}
          {error && (
            <p style={{ fontFamily: "'PixelOperator', monospace", color: "#e07070", fontSize: 19, margin: 0 }}>
              {error}
            </p>
          )}
          {message && (
            <p style={{ fontFamily: "'PixelOperator', monospace", color: "#7a9e7a", fontSize: 19, margin: 0 }}>
              {message}
            </p>
          )}

          {/* Submit */}
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "..." : mode === "login" ? "ENTER LIBRARY" : "CREATE ACCOUNT"}
          </button>

        </div>
      </div>
    </>
  );
}