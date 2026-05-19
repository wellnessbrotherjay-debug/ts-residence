import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import crypto from "crypto";

function buildUnsubscribeToken(leadId: string, email: string) {
  const secret = process.env.LEAD_UNSUBSCRIBE_SECRET || process.env.CRON_SECRET || "ts-default-unsubscribe-secret";
  return crypto
    .createHmac("sha256", secret)
    .update(`${leadId}:${email.toLowerCase()}`)
    .digest("hex");
}

function htmlPage(title: string, message: string) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
</head>
<body style="margin:0;background:#f5f1eb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#1a1a1a;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #ece5db;">
    <div style="height:4px;background:linear-gradient(90deg,#c5a572,#e2c992,#c5a572);"></div>
    <div style="padding:28px 30px;">
      <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#8b7658;font-weight:700;margin:0 0 10px;">TS Residence</p>
      <h1 style="font-size:22px;line-height:1.25;margin:0 0 12px;">${title}</h1>
      <p style="font-size:15px;line-height:1.7;color:#555;margin:0;">${message}</p>
      <p style="font-size:13px;line-height:1.6;color:#888;margin-top:20px;">You can still contact us anytime at <a href="mailto:reservations@tsresidence.id" style="color:#8b7658;">reservations@tsresidence.id</a> or WhatsApp <a href="https://wa.me/6281119028111" style="color:#8b7658;">+62 811-1902-8111</a>.</p>
    </div>
  </div>
</body>
</html>`;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const leadId = url.searchParams.get("leadId");
  const email = url.searchParams.get("email");
  const token = url.searchParams.get("token");

  if (!leadId || !email || !token) {
    return new NextResponse(
      htmlPage("Invalid Unsubscribe Link", "This link is incomplete or invalid."),
      { status: 400, headers: { "content-type": "text/html; charset=utf-8" } }
    );
  }

  const expected = buildUnsubscribeToken(leadId, email);
  if (expected !== token) {
    return new NextResponse(
      htmlPage("Invalid Unsubscribe Link", "This link could not be verified. If needed, contact our team to remove your email manually."),
      { status: 403, headers: { "content-type": "text/html; charset=utf-8" } }
    );
  }

  const { data: lead, error } = await supabaseAdmin
    .from("leads")
    .select("id, email, metadata")
    .eq("id", leadId)
    .eq("email", email)
    .single();

  if (error || !lead) {
    return new NextResponse(
      htmlPage("Lead Not Found", "We could not find this contact record. If this keeps happening, please contact our team."),
      { status: 404, headers: { "content-type": "text/html; charset=utf-8" } }
    );
  }

  const currentMeta = (lead.metadata as Record<string, unknown>) || {};
  const { error: updateError } = await supabaseAdmin
    .from("leads")
    .update({
      metadata: {
        ...currentMeta,
        wa_followup_opt_out: true,
        wa_followup_opt_out_at: new Date().toISOString(),
      },
    })
    .eq("id", lead.id);

  if (updateError) {
    return new NextResponse(
      htmlPage("Could Not Unsubscribe", "We hit a system error while processing your request. Please try again later."),
      { status: 500, headers: { "content-type": "text/html; charset=utf-8" } }
    );
  }

  return new NextResponse(
    htmlPage("You're Unsubscribed", "Done. You will no longer receive automated follow-up emails from TS Residence."),
    { status: 200, headers: { "content-type": "text/html; charset=utf-8" } }
  );
}
