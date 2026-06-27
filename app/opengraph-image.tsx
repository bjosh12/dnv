import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Digital Nomad In Spain — Spain Visa Consultants";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0F1F3D 0%, #1B3A6B 60%, #2D5BA3 100%)",
          fontFamily: "system-ui, sans-serif",
          padding: "60px",
        }}
      >
        {/* Sunset icon */}
        <div style={{ display: "flex", marginBottom: "32px" }}>
          <svg width="80" height="80" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <line x1="4" y1="22" x2="28" y2="22" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" />
            <path d="M10 22 A6 6 0 0 1 22 22" fill="#FF6B35" />
            <line x1="16" y1="22" x2="16" y2="8" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" />
            <line x1="16" y1="22" x2="7" y2="13" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" />
            <line x1="16" y1="22" x2="25" y2="13" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" />
            <line x1="16" y1="22" x2="4" y2="18" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="16" y1="22" x2="28" y2="18" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: "900",
            color: "white",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: "16px",
          }}
        >
          Digital Nomad{" "}
          <span style={{ color: "#FF6B35" }}>In Spain</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "24px",
            color: "rgba(255,255,255,0.75)",
            textAlign: "center",
            maxWidth: "800px",
          }}
        >
          Spain Visa Consultants · 98% Success Rate · 500+ Approved
        </div>

        {/* Domain */}
        <div
          style={{
            marginTop: "40px",
            fontSize: "18px",
            color: "#FF6B35",
            fontWeight: "600",
          }}
        >
          digitalnomadinspain.com
        </div>
      </div>
    ),
    { ...size }
  );
}
