import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

function buildUnsubscribeToken(leadId: number | string, email: string) {
  const secret = process.env.LEAD_UNSUBSCRIBE_SECRET || process.env.CRON_SECRET || "ts-default-unsubscribe-secret";
  return crypto
    .createHmac("sha256", secret)
    .update(`${leadId}:${email.toLowerCase()}`)
    .digest("hex");
}

// Runs daily at 9am Bali time (1am UTC via vercel.json cron).
// Finds WhatsApp capture leads from 44–52 hours ago that haven't
// received a follow-up yet, and sends each one a warm re-engagement email.
// Uses metadata->>'wa_followup_sent' to prevent double-sends.
export async function GET(req: Request) {
  // Only callable by Vercel cron (or admin in local dev)
  const authHeader = req.headers.get("authorization");
  if (
    process.env.NODE_ENV === "production" &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const upperBound = new Date(now.getTime() - 44 * 60 * 60 * 1000).toISOString();
  const lowerBound = new Date(now.getTime() - 52 * 60 * 60 * 1000).toISOString();

  // Find WA capture leads in the 44–52h window, not yet followed up
  const { data: leads, error } = await supabaseAdmin
    .from("leads")
    .select("id, first_name, email, metadata")
    .eq("cta_clicked", "whatsapp_button")
    .gte("created_at", lowerBound)
    .lte("created_at", upperBound)
    .not("email", "is", null);

  if (error) {
    console.error("[wa-followup] query error", error);
    return NextResponse.json({ error: "DB query failed" }, { status: 500 });
  }

  const eligible = (leads || []).filter((lead) => {
    const meta = lead.metadata as Record<string, unknown> | null;
    return !meta?.wa_followup_sent && !meta?.wa_followup_opt_out;
  });

  if (eligible.length === 0) {
    return NextResponse.json({ sent: 0, message: "No eligible leads" });
  }

  let sent = 0;
  const errors: string[] = [];

  for (const lead of eligible) {
    const firstName = lead.first_name || "there";
    const email = lead.email as string;
    const unsubToken = buildUnsubscribeToken(lead.id, email);
    const unsubUrl = `https://www.tsresidence.id/api/leads/unsubscribe?leadId=${lead.id}&email=${encodeURIComponent(email)}&token=${unsubToken}`;

    try {
      await resend.emails.send({
        from: "TS Residence <reservations@tsresidence.id>",
        to: email,
        subject: "Still thinking about Bali? We're here to help 🌴",
        html: `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f5f1eb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;margin-top:24px;margin-bottom:24px;">

  <!-- Top gold bar -->
  <div style="height:4px;background:linear-gradient(90deg,#c5a572,#e2c992,#c5a572);"></div>

  <!-- Header -->
  <div style="background:#1a1a1a;padding:32px 36px 28px;">
    <p style="color:#c5a572;font-size:10px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 8px;">TS Residence · Seminyak, Bali</p>
    <h1 style="color:#fff;font-size:22px;font-weight:700;margin:0;line-height:1.3;">Hi ${firstName}, are you still planning your Bali stay?</h1>
  </div>

  <!-- Body -->
  <div style="padding:32px 36px;">
    <p style="color:#444;font-size:15px;line-height:1.7;margin:0 0 18px;">
      We noticed you were checking out TS Residence recently — and we'd love to help make your Bali stay exceptional.
    </p>
    <p style="color:#444;font-size:15px;line-height:1.7;margin:0 0 24px;">
      Whether you're looking for a short getaway or a longer stay, our team is ready to share current availability, pricing, and any active offers — no pressure.
    </p>

    <!-- Highlight box -->
    <div style="background:#faf7f2;border-left:3px solid #c5a572;border-radius:6px;padding:18px 20px;margin-bottom:28px;">
      <p style="margin:0;font-size:13px;color:#8b7658;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">Why residents choose TS Residence</p>
      <ul style="margin:0;padding-left:18px;color:#555;font-size:14px;line-height:1.8;">
        <li>Five-star hotel facilities — pool, gym, spa — all included</li>
        <li>Exclusive access to TS Suites hotel next door</li>
        <li>Flexible stays from 1 month to long-term</li>
        <li>Prime Seminyak location, steps from the beach</li>
      </ul>
    </div>

    <!-- CTA buttons -->
    <div style="margin-bottom:24px;">
      <a href="https://wa.me/6281119028111?text=Hi+TS+Residence%2C+I%27d+like+to+know+more+about+availability+and+pricing." style="display:inline-block;padding:14px 24px;background:#25D366;color:#fff;text-decoration:none;border-radius:8px;font-weight:700;font-size:14px;margin-right:12px;margin-bottom:10px;">Chat on WhatsApp →</a>
      <a href="https://www.tsresidence.id/apartments" style="display:inline-block;padding:14px 24px;background:#1a1a1a;color:#fff;text-decoration:none;border-radius:8px;font-weight:700;font-size:14px;margin-bottom:10px;">View Apartments →</a>
    </div>

    <p style="color:#999;font-size:13px;line-height:1.6;margin:0;">
      Or simply reply to this email — our team reads every message and will get back to you within a few hours.
    </p>
  </div>

  <!-- Footer -->
  <div style="border-top:1px solid #f0ebe3;padding:20px 36px;background:#faf9f7;">
    <p style="margin:0;font-size:11px;color:#bbb;text-align:center;line-height:1.6;">
      TS Residence · Jl. Nakula No.18, Legian, Seminyak, Bali<br>
      You received this service follow-up because you visited <a href="https://www.tsresidence.id" style="color:#c5a572;text-decoration:none;">tsresidence.id</a> and requested booking information.<br>
      Prefer no more follow-up emails? <a href="${unsubUrl}" style="color:#8b7658;text-decoration:underline;">Unsubscribe from follow-up emails</a>.
    </p>
  </div>

</div>
</body>
</html>`,
      });

      // Mark as followed up in metadata so we never send twice
      const currentMeta = (lead.metadata as Record<string, unknown>) || {};
      await supabaseAdmin
        .from("leads")
        .update({
          metadata: { ...currentMeta, wa_followup_sent: true, wa_followup_sent_at: new Date().toISOString() },
        })
        .eq("id", lead.id);

      sent++;
    } catch (err) {
      console.error(`[wa-followup] failed to send to lead ${lead.id}`, err);
      errors.push(String(lead.id));
    }
  }

  return NextResponse.json({
    sent,
    eligible: eligible.length,
    errors: errors.length > 0 ? errors : undefined,
  });
}
