import { ImageResponse } from "next/og";
import { hero } from "@/data/site";
import { personalInfo } from "@/lib/portfolio";

export const alt = `${personalInfo.name} — ${personalInfo.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#FAFAF8",
          color: "#171717",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#3478F6",
            }}
          />
          <div style={{ fontSize: 28, color: "#71717A" }}>{personalInfo.title}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 104, fontWeight: 600, letterSpacing: -4, lineHeight: 1 }}>
            {personalInfo.name}
          </div>
          <div style={{ fontSize: 36, color: "#71717A", lineHeight: 1.3, maxWidth: 940 }}>
            {hero.lead}
          </div>
        </div>
        <div style={{ display: "flex", gap: 48, fontSize: 26, color: "#71717A" }}>
          {hero.stats.map((stat) => (
            <div key={stat.label} style={{ display: "flex", gap: 10 }}>
              <span style={{ color: "#171717", fontWeight: 600 }}>{stat.value}</span>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
