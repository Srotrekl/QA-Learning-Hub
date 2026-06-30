import { ImageResponse } from "next/og";
import { getAllSlugs, getTopicBySlug } from "@/lib/topics";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function TopicOGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = await getTopicBySlug(slug);

  const title = topic?.title ?? "QA Learning Hub";
  const category = topic?.category ?? "";
  const difficulty = topic?.difficulty ?? "";

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

        {/* Back label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "28px",
          }}
        >
          <span style={{ color: "#00d4aa", fontSize: "16px" }}>&#9654;</span>
          <span style={{ color: "#8b949e", fontSize: "15px", letterSpacing: "1px" }}>
            qa-learning-hub.vercel.app
          </span>
        </div>

        {/* Topic title */}
        <div
          style={{
            fontSize: "56px",
            fontWeight: "bold",
            color: "#e6edf3",
            lineHeight: 1.15,
            marginBottom: "28px",
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "20px",
            color: "#8b949e",
            marginBottom: "44px",
          }}
        >
          QA Automation Engineer
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: "12px" }}>
          {[category, difficulty].filter(Boolean).map((tag) => (
            <div
              key={tag}
              style={{
                border: "1px solid #30363d",
                borderRadius: "6px",
                padding: "6px 14px",
                color: "#00d4aa",
                fontSize: "14px",
                fontFamily: "monospace",
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Bottom right — Steve Rotrekl */}
        <div
          style={{
            position: "absolute",
            bottom: "48px",
            right: "80px",
            color: "#484f58",
            fontSize: "15px",
            fontFamily: "monospace",
          }}
        >
          Steve Rotrekl
        </div>
      </div>
    ),
    { ...size },
  );
}
