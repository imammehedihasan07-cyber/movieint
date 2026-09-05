import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "Cinematic Intelligence";
  const rating = searchParams.get("rating") || "8.5";
  const year = searchParams.get("year") || "2026";
  const poster = searchParams.get("poster") || "";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          backgroundColor: "#05070b",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, #161c28 2%, transparent 0%)",
          backgroundSize: "50px 50px",
          color: "#fff",
          padding: "60px",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
          }}
        >
          {/* Left Column Text */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              maxWidth: "650px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#6366f1",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: "bold",
                  padding: "6px 14px",
                  borderRadius: "9999px",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                }}
              >
                Movieint Archival
              </div>
              <div
                style={{
                  color: "#94a3b8",
                  fontSize: "16px",
                  fontFamily: "monospace",
                }}
              >
                Verified Cinema DNA
              </div>
            </div>

            <div
              style={{
                fontSize: "56px",
                fontWeight: "900",
                lineHeight: "1.1",
                marginBottom: "20px",
                color: "#ffffff",
              }}
            >
              {title}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#fbbf24",
                }}
              >
                ★ {rating} / 10
              </div>
              <div style={{ color: "#64748b", fontSize: "22px" }}>•</div>
              <div style={{ color: "#94a3b8", fontSize: "22px" }}>{year}</div>
            </div>
          </div>

          {/* Right Column Poster Frame */}
          {poster && (
            <div
              style={{
                display: "flex",
                width: "260px",
                height: "390px",
                borderRadius: "24px",
                overflow: "hidden",
                border: "2px solid rgba(255,255,255,0.15)",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={poster}
                alt={title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}