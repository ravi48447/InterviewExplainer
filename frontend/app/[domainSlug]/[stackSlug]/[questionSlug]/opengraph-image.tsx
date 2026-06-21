import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "InterviewExplainer question";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Cache OG images for a day — they only depend on the URL slugs, not on
// content edits, so there is no reason to regenerate them per request.
export const revalidate = 86400;

// Title-case a slug into a display name, e.g. "design-elevator-system"
// → "Design Elevator System". Avoids pulling content-reader (and the whole
// sync-FS content graph) into the OG-image route's compile graph, which was
// adding 10–20 s to every dev navigation that touched a new question.
function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default async function OGImage({
  params,
}: {
  params: { domainSlug: string; stackSlug: string; questionSlug: string };
}) {
  const { domainSlug, stackSlug, questionSlug } = params;

  const title = slugToTitle(questionSlug);
  const difficulty = "";

  const diffColor = "#6366f1";
  const domainLabel = slugToTitle(domainSlug);
  const stackLabel = slugToTitle(stackSlug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #f0f4ff 0%, #e8eeff 50%, #f5f0ff 100%)",
          padding: "60px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: 44,
              height: 44,
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" width="26" height="26">
              <path
                d="M8 4L2 12L8 20M16 4L22 12L16 20M14 2L10 22"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, color: "#1e293b" }}>
            InterviewExplainer
          </span>
        </div>

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Tags */}
          <div style={{ display: "flex", gap: "10px" }}>
            <span
              style={{
                background: "#e0e7ff",
                color: "#3730a3",
                padding: "6px 14px",
                borderRadius: 20,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {domainLabel}
            </span>
            <span
              style={{
                background: "#ede9fe",
                color: "#5b21b6",
                padding: "6px 14px",
                borderRadius: 20,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {stackLabel}
            </span>
            {difficulty && (
              <span
                style={{
                  background: `${diffColor}22`,
                  color: diffColor,
                  padding: "6px 14px",
                  borderRadius: 20,
                  fontSize: 14,
                  fontWeight: 700,
                  textTransform: "capitalize",
                }}
              >
                {difficulty}
              </span>
            )}
          </div>

          {/* Question title */}
          <div
            style={{
              fontSize: title.length > 70 ? 36 : 44,
              fontWeight: 900,
              color: "#0f172a",
              lineHeight: 1.2,
              maxWidth: 900,
            }}
          >
            {title}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          <span style={{ fontSize: 16, color: "#64748b" }}>interviewexplainer.com</span>
          <span
            style={{
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              color: "white",
              padding: "10px 24px",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            Free to read →
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
