import { NextResponse } from "next/server";
import { buildAndSendReport } from "@/lib/report-email";

// Called by Vercel Cron — protected by CRON_SECRET header
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "daily"; // "daily" or "weekly"

  const period = type === "weekly" ? "weekly" : "daily";

  try {
    const result = await buildAndSendReport(period);
    if (!result.ok) {
      console.error("Cron report failed:", result.error);
      return NextResponse.json({ error: "Email send failed", detail: String(result.error) }, { status: 502 });
    }
    return NextResponse.json({ success: true, period, subject: result.subject });
  } catch (err) {
    console.error("Cron report error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
