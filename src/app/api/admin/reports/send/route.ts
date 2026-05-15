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
      const rawError = result.error as
        | { message?: string; name?: string; statusCode?: number; [key: string]: unknown }
        | undefined;
      const detailMessage =
        rawError?.message ||
        (typeof result.error === "string" ? result.error : null) ||
        "Unknown email provider error";

      console.error(`[reports/send] Send failed for ${validPeriod}:`, {
        statusCode: 502,
        error: result.error,
        detailMessage,
        from: result.from,
        recipients: result.recipients,
      });

      return NextResponse.json(
        {
          error: "Failed to send report email",
          detail: detailMessage,
          providerError: rawError || result.error || null,
          from: result.from,
          recipients: result.recipients,
        },
        { status: 502 },
      );
    }
    return NextResponse.json({ success: true, subject: result.subject, from: result.from, recipients: result.recipients });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED_ADMIN_REQUEST") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("reports/send error", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
