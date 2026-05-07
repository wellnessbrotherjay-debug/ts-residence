import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin-auth";
import { buildAndSendReport } from "@/lib/report-email";

export async function POST(request: Request) {
  try {
    await requireAdminRequest();

    const { period, to } = await request.json().catch(() => ({}));
    const validPeriod = ["daily", "weekly", "mtd", "alltime"].includes(period) ? period : "mtd";

    const result = await buildAndSendReport(validPeriod, to || undefined);

    if (!result.ok) {
      return NextResponse.json(
        { error: "Failed to send report email", detail: String(result.error) },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true, subject: result.subject });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED_ADMIN_REQUEST") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("reports/send error", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
