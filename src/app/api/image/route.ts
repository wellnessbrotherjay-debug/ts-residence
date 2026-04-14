import { NextResponse } from "next/server";

const ALLOWED_HOSTS = new Set([
  "tsresidence.id",
  "www.tsresidence.id",
  "imagedelivery.net",
  "picsum.photos",
  "tssuites.com",
  "www.tssuites.com",
]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("url");

  if (!source) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(source);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  if (!ALLOWED_HOSTS.has(parsed.hostname)) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 403 });
  }

  try {
    const upstream = await fetch(parsed.toString(), {
      headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        referer: "https://www.google.com/",
      },
      cache: "force-cache",
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Upstream ${upstream.status}` },
        { status: 502 },
      );
    }

    const contentType = upstream.headers.get("content-type") || "image/webp";

    return new NextResponse(upstream.body, {
      headers: {
        "content-type": contentType,
        "cache-control":
          "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 502 },
    );
  }
}
