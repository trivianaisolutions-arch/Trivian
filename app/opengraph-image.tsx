import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "trivian.ai — We build digital systems that think.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The six-layer system stack from the homepage, flattened to an isometric drawing.
function Stack() {
  return (
    <svg width="420" height="440" viewBox="0 0 400 420">
      {Array.from({ length: 6 }, (_, i) => {
        const y = 330 - i * 52;
        const on = i === 2;
        return (
          <path
            key={i}
            d={`M200 ${y - 60} L360 ${y} L200 ${y + 60} L40 ${y} Z`}
            fill="#1a1b1f"
            stroke={on ? "#ff5a1f" : "#e9e5dc"}
            strokeOpacity={on ? 1 : 0.3}
            strokeWidth="2"
          />
        );
      })}
      {[120, 200, 280].map((x) => (
        <line key={x} x1={x} y1="70" x2={x} y2="370" stroke="#ff5a1f" strokeOpacity="0.6" strokeDasharray="3 10" strokeWidth="2" />
      ))}
    </svg>
  );
}

export default async function Image() {
  const mark = `data:image/png;base64,${(await readFile(join(process.cwd(), "public/brand/trivian-mark.png"))).toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0d0e10", color: "#e9e5dc", padding: 72 }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 26, letterSpacing: 4, color: "#e9e5dc" }}>
            <img src={mark} width={64} height={64} alt="" />
            TRIVIAN.AI
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 84, fontWeight: 700, lineHeight: 0.95, letterSpacing: -3 }}>
            <span>WE BUILD</span>
            <span>DIGITAL SYSTEMS</span>
            <span style={{ display: "flex" }}>
              THAT THINK<span style={{ color: "#ff5a1f" }}>.</span>
            </span>
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#b3b0a9" }}>AI automation · Websites · 3D · Search · Digital systems</div>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Stack />
        </div>
      </div>
    ),
    size,
  );
}
