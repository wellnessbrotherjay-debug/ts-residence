import { NextResponse } from "next/server";
import { buildAndSendReport } from "@/lib/report-email";

export const dynamic = "force-dynamic";

// Returns the composed report (subject/html/recipients) WITHOUT sending, so an
// external sender (LOKI Postfix, authenticated @safetykat.com) can deliver it
// instead of Resend. Token-gated with CRON_SECRET (header or ?token=).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // Accept the existing CRON_SECRET or a dedicated REPORT_BUILD_TOKEN.
  const secrets = [process.env.CRON_SECRET, process.env.REPORT_BUILD_TOKEN].filter(Boolean) as string[];
  const authHeader = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  const token = searchParams.get("token") || "";
  if (secrets.length === 0 || (!secrets.includes(authHeader) && !secrets.includes(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const type = searchParams.get("type") || "daily";
  const period = (type === "weekly" ? "weekly" : type === "mtd" ? "mtd" : "daily") as "daily" | "weekly" | "mtd";

  try {
    const result = (await buildAndSendReport(period, undefined, { buildOnly: true })) as {
      ok: boolean; subject?: string; html?: string; recipients?: string[];
    };
    return NextResponse.json({ ok: true, period, subject: result.subject, html: result.html, recipients: result.recipients });
  } catch (err) {
    console.error("[reports/build] error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
