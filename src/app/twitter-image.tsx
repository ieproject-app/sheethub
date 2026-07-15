import { ImageResponse } from "next/og";

export const alt = "SheetHub - Excel and Google Sheets Tutorials";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #065f46 100%)",
          position: "relative",
          overflow: "hidden",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Decorative accent circle top-right */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "450px",
            height: "450px",
            borderRadius: "50%",
            background: "radial-gradient(circle, #22c55e22 0%, transparent 70%)",
          }}
        />
        {/* Decorative accent circle bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background: "radial-gradient(circle, #22c55e18 0%, transparent 70%)",
          }}
        />

        {/* Accent top border line */}
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            height: "5px",
            background: "linear-gradient(90deg, #15803d, #22c55e, #15803d)",
          }}
        />

        {/* Sheet icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="64"
          height="64"
          style={{ marginBottom: "24px" }}
          fill="none"
          stroke="#22c55e"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="3" x2="9" y2="21" />
        </svg>

        {/* Site name */}
        <div
          style={{
            color: "#ffffff",
            fontSize: "72px",
            fontWeight: "900",
            letterSpacing: "-3px",
            lineHeight: 1,
            marginBottom: "16px",
          }}
        >
          SheetHub
        </div>

        {/* Tagline */}
        <div
          style={{
            color: "#86efac",
            fontSize: "26px",
            fontWeight: "400",
            letterSpacing: "0.3px",
            marginBottom: "36px",
            textAlign: "center",
            maxWidth: "700px",
          }}
        >
          Excel & Google Sheets — Tutorials, Formulas, and Quick Updates
        </div>

        {/* Domain pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            borderRadius: "999px",
            border: "1.5px solid #22c55e55",
            background: "#22c55e11",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#22c55e",
            }}
          />
          <span style={{ color: "#86efac", fontSize: "18px", fontWeight: "500" }}>
            sheethub.web.id
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
