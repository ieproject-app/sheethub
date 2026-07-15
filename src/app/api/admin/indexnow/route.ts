import { NextRequest, NextResponse } from "next/server";

/**
 * IndexNow API endpoint for notifying search engines of content changes.
 *
 * Protected by a shared secret key (INDEXNOW_API_KEY) sent via the
 * `Authorization: Bearer <key>` header. Set this key in your environment
 * variables or server configuration.
 *
 * Usage (from a build script or admin panel):
 *   POST /api/admin/indexnow
 *   Authorization: Bearer <INDEXNOW_API_KEY>
 *   Body: { "urlList": ["https://sheethub.web.id/blog/some-post"] }
 */

const INDEXNOW_KEY = process.env.INDEXNOW_KEY;
const INDEXNOW_API_KEY = process.env.INDEXNOW_API_KEY;
const HOST = "sheethub.web.id";

function isValidAbsoluteUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === HOST;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!INDEXNOW_KEY || !INDEXNOW_API_KEY) {
    console.error("[indexnow POST] Missing INDEXNOW_KEY or INDEXNOW_API_KEY environment variable.");
    return NextResponse.json({ error: "IndexNow is not configured." }, { status: 503 });
  }

  const authHeader = req.headers.get("authorization");
  const apiKey = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";

  if (!apiKey || apiKey !== INDEXNOW_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const urlList = Array.isArray(body.urlList)
      ? body.urlList.filter((url: unknown): url is string => typeof url === "string")
      : [];

    if (urlList.length === 0) {
      return NextResponse.json(
        { error: "urlList must be a non-empty array of strings." },
        { status: 400 },
      );
    }

    if (!urlList.every(isValidAbsoluteUrl)) {
      return NextResponse.json(
        { error: "All URLs must be absolute HTTPS URLs on sheethub.web.id." },
        { status: 400 },
      );
    }

    const payload = {
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
      urlList,
    };

    const res = await fetch("https://api.indexnow.org/IndexNow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // IndexNow API returns 200 OK or 202 Accepted on success
    if (res.status === 200 || res.status === 202) {
      return NextResponse.json({ ok: true, submitted: urlList.length });
    }

    const text = await res.text();
    console.error("[indexnow POST] API Error:", res.status, text);

    return NextResponse.json(
      { error: `IndexNow API Error: ${res.status} ${text}` },
      { status: res.status },
    );
  } catch (error) {
    console.error("[indexnow POST]", error);
    const message =
      error instanceof Error ? error.message : "Failed to submit to IndexNow.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
