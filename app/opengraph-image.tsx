import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "QA Learning Hub - Steve Rotrekl";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0d1117",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "monospace",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "#00d4aa",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "32px",
          }}
        >
          <span style={{ color: "#00d4aa", fontSize: "18px" }}>&#10003;</span>
          <span style={{ color: "#00d4aa", fontSize: "16px", letterSpacing: "2px" }}>
            available for hire
          </span>
        </div>

        {/* Main heading */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: "bold",
            color: "#e6edf3",
            lineHeight: 1.1,
            marginBottom: "24px",
          }}
        >
          QA Automation
          <br />
          Engineer
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "22px",
            color: "#8b949e",
            marginBottom: "48px",
            lineHeight: 1.4,
          }}
        >
          Playwright &middot; API testing &middot; CI/CD &middot; AI/LLM security
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: "12px" }}>
          {["playwright", "pytest", "github-actions", "ai-llm-security"].map((tag) => (
            <div
              key={tag}
              style={{
                border: "1px solid #30363d",
                borderRadius: "6px",
                padding: "6px 14px",
                color: "#848d97",
                fontSize: "14px",
                fontFamily: "monospace",
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Bottom right — site name */}
        <div
          style={{
            position: "absolute",
            bottom: "48px",
            right: "80px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ color: "#00d4aa", fontSize: "16px" }}>&#9654;</span>
          <span style={{ color: "#e6edf3", fontSize: "18px", fontFamily: "monospace" }}>
            qa-learning-hub.vercel.app
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
