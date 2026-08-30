/**
 * Per-article Open Graph card with a "spreadsheet window" motif.
 *
 * Rendered through next/og (satori), so all styles must be inline —
 * Tailwind classes and CSS variables are not available here. Note:
 * satori in this Next version crashes on `undefined` style values —
 * absent borders must use "none" instead.
 */

const GRADIENT = "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #065f46 100%)";
const ACCENT = "#22c55e";
const ACCENT_SOFT = "#86efac";
const PILL_BORDER = "1.5px solid #22c55e55";
const PILL_BG = "#22c55e11";
const FONT_STACK = "system-ui, -apple-system, sans-serif";
const WINDOW_BORDER = "#e2e8f0";
const WINDOW_HEAD_BG = "#f8fafc";
const GRID_LINE = "#e2e8f0";
const GRID_HEAD_TEXT = "#64748b";
const HIGHLIGHT_BG = "#d1fae5";

const COLUMNS = ["A", "B", "C", "D"];
const ROWS = [1, 2, 3];

export function ArticleOGContent({
  title,
  category,
}: {
  title: string;
  category?: string;
}) {
  return (
    <div
      style={{
        width: "1200px",
        height: "630px",
        padding: "30px 64px 26px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: GRADIENT,
        position: "relative",
        overflow: "hidden",
        fontFamily: FONT_STACK,
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

      {/* Spreadsheet window */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          height: "270px",
          borderRadius: "14px",
          background: "#ffffff",
          border: `1px solid ${WINDOW_BORDER}`,
          boxShadow: "0 24px 48px rgba(2, 44, 34, 0.45)",
          overflow: "hidden",
        }}
      >
        {/* Window chrome bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "46px",
            padding: "0 16px",
            background: WINDOW_HEAD_BG,
            borderBottom: `1px solid ${WINDOW_BORDER}`,
            position: "relative",
          }}
        >
          {/* Absolutely centered label; dots and fx badge paint above it */}
          <div
            style={{
              position: "absolute",
              top: "0",
              bottom: "0",
              left: "0",
              right: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: GRID_HEAD_TEXT,
              fontSize: "15px",
              fontWeight: 600,
            }}
          >
            SheetHub — Excel &amp; Google Sheets
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ff5f57" }}
            />
            <div
              style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#febc2e" }}
            />
            <div
              style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#28c840" }}
            />
          </div>
          <div style={{ flex: 1 }} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "24px",
              borderRadius: "6px",
              background: HIGHLIGHT_BG,
              color: "#047857",
              fontSize: "14px",
              fontWeight: 700,
              fontStyle: "italic",
            }}
          >
            fx
          </div>
        </div>

        {/* Formula bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            height: "44px",
            padding: "0 14px",
            borderBottom: `1px solid ${GRID_LINE}`,
          }}
        >
          <span
            style={{ fontStyle: "italic", color: "#94a3b8", fontSize: "15px", fontWeight: 600 }}
          >
            fx
          </span>
          <div style={{ width: "1px", height: "22px", background: GRID_LINE }} />
          <span style={{ color: "#0f172a", fontSize: "17px" }}>=ROUND(A2, 2)</span>
          <div style={{ flex: 1 }} />
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#059669"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Decorative grid */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          {/* Column header row */}
          <div
            style={{
              display: "flex",
              height: "36px",
              background: WINDOW_HEAD_BG,
              borderBottom: `1px solid ${GRID_LINE}`,
            }}
          >
            <div
              style={{
                width: "48px",
                borderRight: `1px solid ${GRID_LINE}`,
              }}
            />
            {COLUMNS.map((col, i) => (
              <div
                key={col}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: GRID_HEAD_TEXT,
                  fontSize: "14px",
                  fontWeight: 600,
                  borderRight: i < COLUMNS.length - 1 ? `1px solid ${GRID_LINE}` : "none",
                }}
              >
                {col}
              </div>
            ))}
          </div>
          {/* Data rows */}
          {ROWS.map((row, rowIdx) => (
            <div
              key={row}
              style={{
                display: "flex",
                flex: 1,
                borderBottom: rowIdx < ROWS.length - 1 ? `1px solid ${GRID_LINE}` : "none",
              }}
            >
              <div
                style={{
                  width: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: WINDOW_HEAD_BG,
                  color: GRID_HEAD_TEXT,
                  fontSize: "14px",
                  fontWeight: 600,
                  borderRight: `1px solid ${GRID_LINE}`,
                }}
              >
                {row}
              </div>
              {COLUMNS.map((col, colIdx) => (
                <div
                  key={col}
                  style={{
                    flex: 1,
                    borderRight: colIdx < COLUMNS.length - 1 ? `1px solid ${GRID_LINE}` : "none",
                    background: row === 2 && col === "B" ? HIGHLIGHT_BG : "#ffffff",
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Article title + footer row */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div
          style={{
            color: "#ffffff",
            fontSize: "50px",
            fontWeight: 800,
            letterSpacing: "-1px",
            lineHeight: 1.16,
            lineClamp: 3,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {category ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 16px",
                borderRadius: "999px",
                border: PILL_BORDER,
                background: PILL_BG,
                color: ACCENT_SOFT,
                fontSize: "15px",
                fontWeight: 700,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}
            >
              {category}
            </div>
          ) : (
            <div />
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "999px",
              border: PILL_BORDER,
              background: PILL_BG,
            }}
          >
            <div
              style={{ width: "8px", height: "8px", borderRadius: "50%", background: ACCENT }}
            />
            <span style={{ color: ACCENT_SOFT, fontSize: "18px", fontWeight: 500 }}>
              sheethub.web.id
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
