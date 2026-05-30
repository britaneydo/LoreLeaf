"use client";

import { useState } from "react";

// HeartButton

export function HeartButton({ hidden }: { hidden?: boolean }) {
  const [open, setOpen] = useState(false);
  console.log("HeartButton hidden:", hidden);

  return (
    <>
      <div
        style={{
            position: "absolute",
            bottom: 80,
            left: 29,
            zIndex: 960,
            cursor: "pointer",
            animation: "heartBob 2.8s ease-in-out infinite",
            imageRendering: "pixelated",
            opacity: hidden ? 0.4 : 1,
            pointerEvents: hidden ? "none" : "auto",
            transition: "opacity 0.2s ease",
        }}
        onClick={() => setOpen(true)}
        title="About Us"
      >
        <img
          src="/assets/heart.png"
          alt="About Us"
          style={{
            width: 40,
            height: 40,
            imageRendering: "pixelated",
            display: "block",
            filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.6))",
          }}
        />
      </div>
          
        {/* reset UI */}
        {open && <AboutOverlay onClose={() => setOpen(false)} />}

      <style>{`
        @keyframes heartBob {
          0%, 100% { transform: translateY(0px);  }
          50%       { transform: translateY(-5px); }
        }
      `}</style>
    </>
  );
}

// Overlay

type OverlayProps = { onClose: () => void };

function AboutOverlay({ onClose }: OverlayProps) {
  const [view, setView] = useState<"menu" | "about" | "feedback">("menu");

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 950,
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
          backgroundImage: "url('/assets/AboutUs_UI.png')",
          backgroundSize: "100% 100%",
          imageRendering: "pixelated",
          width: 460,
          height: 240,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
        }}
      >
        {/* close X */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 15,
            right: 15,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#4e3333",
            fontSize: 18,
            lineHeight: 1,
            padding: 0,
            fontFamily: "monospace",
            zIndex: 10,
          }}
        >
          ✕
        </button>

        {view === "menu"    && <MenuView    onAbout={() => setView("about")} onFeedback={() => setView("feedback")} />}
        {view === "about"   && <AboutView   onBack={() => setView("menu")} />}
        {view === "feedback"&& <FeedbackView onBack={() => setView("menu")} />}
      </div>
    </div>
  );
}

// Pixel button

function PixelBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 160,
        height: 48,
        backgroundImage: "url('/assets/button.png')",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        imageRendering: "pixelated",
        border: "none",
        borderRadius: 0,
        boxShadow: "none",
        cursor: "pointer",
        fontFamily: "'PixelOperatorSC', monospace",
        fontSize: 24,
        fontWeight: "bold",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "#dbd2c0",
        transition: "filter 0.1s ease, transform 0.08s ease",
        paddingBottom: "10px",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.3)")}
      onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
      onMouseDown={(e)  => (e.currentTarget.style.transform = "translateY(2px)")}
      onMouseUp={(e)    => (e.currentTarget.style.transform = "translateY(0px)")}
    >
      {label}
    </button>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontFamily: "'PixelOperatorSC', monospace",
        fontSize: 13,
        color: "#7a3a20",
        letterSpacing: "0.08em",
        textDecoration: "underline",
        padding: 0,
      }}
    >
      ← back
    </button>
  );
}

// Menu view (two buttons)

function MenuView({ onAbout, onFeedback }: { onAbout: () => void; onFeedback: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={{ display: "flex", gap: 24 }}>
        <PixelBtn label="About Us" onClick={onAbout} />
        <PixelBtn label="Feedback" onClick={onFeedback} />
      </div>
    </div>
  );
}

// About Us view

function AboutView({ onBack }: { onBack: () => void }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 12,
      padding: "0 32px",
      width: "100%",
    }}>
      <h2 style={{
        fontFamily: "'PixelOperatorSC', monospace",
        fontWeight: "bold",
        fontSize: 24,
        color: "#6b1a1a",
        margin: 0,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}>
        {"LoreLeaf's Team"}
      </h2>

      <div style={{ display: "flex", gap: 24 }}>
        {[
          { name: "Britaney Do",    href: "https://www.linkedin.com/in/britaneydo/",   img: "/assets/team/britaney.png" },
          { name: "Richard Le",     href: "https://www.linkedin.com/in/richard-le-cs/",      img: "/assets/team/richard.png"  },
          { name: "Israel Zavala",  href: "https://www.linkedin.com/in/israel-zavala-alvarez-714b90298/", img: "/assets/team/israel.png"   },
        ].map(({ name, href, img }) => (
          <a key={name} href={href} target="_blank" rel="noreferrer"
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                     color: "#6b1a1a", textDecoration: "none" }}>
            <img
              src={img}
              alt={name}
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/assets/tomato_icon.png"; }}
              style={{ width: 48, height: 48, borderRadius: "50%", imageRendering: "pixelated",
                       objectFit: "cover", border: "2px solid #7a3a20" }}
            />
            <span style={{ fontFamily: "'PixelOperatorSC', monospace", fontSize: 14,
                           textDecoration: "underline", letterSpacing: "0.05em" }}>
              {name}
            </span>
          </a>
        ))}
      </div>

      <BackBtn onClick={onBack} />
    </div>
  );
}

// Feedback view
// uses EmailJS

const EMAILJS_SERVICE_ID  = "service_jmtn0um";  
const EMAILJS_TEMPLATE_ID = "template_31enqch";
const EMAILJS_PUBLIC_KEY  = "I8EEFULIxzQHAfwev";

type FeedbackState = "idle" | "sending" | "sent" | "error";

type EmailJSWindow = Window & { emailjs?: { // ? means that emailjs is optional since EmailJS might not be loaded
    send: (
      serviceId: string,
      templateId: string,
      templateParams: {
        from_name: string;
        message: string;
      },
      publicKey: string
    ) => Promise<unknown>;
  };
};

function FeedbackView({ onBack }: { onBack: () => void }) {
  const [name, setName]       = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus]   = useState<FeedbackState>("idle");

  async function handleSubmit() {
    if (!name.trim() || !message.trim()) return;
    setStatus("sending");

    try {
      const emailjs = (window as EmailJSWindow).emailjs;
      if(!emailjs) {
        throw new Error("EmailJS is not loaded.");
      }
      await emailjs.send( // sneds feedback message using EmailJS
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { from_name: name, message },
        EMAILJS_PUBLIC_KEY,
      );
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,245,230,0.6)",
    border: "2px solid #7a3a20",
    borderRadius: 2,
    padding: "4px 8px",
    fontFamily: "'PixelOperator', monospace",
    fontSize: 14,
    color: "#3a1a0a",
    outline: "none",
    boxSizing: "border-box",
  };

  if (status === "sent") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <p style={{ fontFamily: "'PixelOperatorSC', monospace", fontSize: 16, color: "#3a6a2a", margin: 0 }}>
          Thanks for your feedback! ♥
        </p>
        <BackBtn onClick={onBack} />
      </div>
    );
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 10,
      padding: "0 36px",
      width: "100%",
      boxSizing: "border-box",
    }}>
      <h2 style={{
        fontFamily: "'PixelOperatorSC', monospace",
        fontWeight: "bold",
        fontSize: 18,
        color: "#6b1a1a",
        margin: 0,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}>
        Feedback
      </h2>

      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inputStyle}
        maxLength={60}
      />

      <textarea
        placeholder="Leave us a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        style={{ ...inputStyle, resize: "none" }}
        maxLength={500}
      />

      {status === "error" && (
        <p style={{ fontFamily: "'PixelOperatorSC', monospace", fontSize: 12, color: "#8b1a1a", margin: 0 }}>
          Something went wrong — try again!
        </p>
      )}

      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <PixelBtn
          label={status === "sending" ? "Sending…" : "Send"}
          onClick={handleSubmit}
        />
        <BackBtn onClick={onBack} />
      </div>
    </div>
  );
}