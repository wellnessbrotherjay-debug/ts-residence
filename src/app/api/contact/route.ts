import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import {
  checkRateLimit,
  getClientIp,
  tooManyRequestsResponse,
} from "@/lib/api-security";

const resendApiKey = process.env.RESEND_API_KEY;

const contactSchema = z.object({
  firstName: z.string().trim().min(1).max(120),
  lastName: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  countryCode: z.string().trim().max(16).optional(),
  phone: z.string().trim().max(32).optional(),
  stayDuration: z.string().trim().max(120).optional(),
  message: z.string().trim().max(4000).optional(),
});

function normalizeEmailError(error: unknown) {
  if (!error) {
    return null;
  }

  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object" && error && "message" in error) {
    return String((error as { message?: unknown }).message || "Email send failed");
  }

  return "Email send failed";
}

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(`contact:${clientIp}`, 10, 10 * 60 * 1000);
    if (!rateLimit.allowed) {
      return tooManyRequestsResponse(rateLimit.retryAfterMs);
    }

    if (!resendApiKey) {
      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 503 },
      );
    }

    const payload = await req.json();
    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { firstName, lastName, email, countryCode, phone, stayDuration, message } = parsed.data;
    const resend = new Resend(resendApiKey);


    // Branded admin notification
    const adminHtml = `
      <body style="background: #f7f3ed; margin:0; padding:0; min-width:100vw; min-height:100vh;">
        <div style="font-family: 'Inter', Arial, sans-serif; min-height:100vh; background: #f7f3ed; padding: 48px 0;">
          <div style="background: #fff; color: #181818; max-width: 520px; margin: 32px auto; border-radius: 18px; box-shadow: 0 6px 32px 0 rgba(197,165,114,0.10); padding: 40px 36px 36px 36px;">
            <img src="https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/cce3ff72-a0c2-4b10-826e-c47befe5db00/public" alt="TS Residence" style="height:48px;margin-bottom:24px;display:block;" />
            <h2 style="color:#c5a572; margin-bottom: 18px; font-size:1.5rem;">New Apartment Application</h2>
            <table style="width:100%;margin-bottom:18px;">
              <tr><td style="color:#c5a572;">Name:</td><td>${firstName} ${lastName}</td></tr>
                <tr><td style="color:#c5a572;">Email:</td><td>${email}</td></tr>
                <tr><td style="color:#c5a572;">Country Code:</td><td>${countryCode || "-"}</td></tr>
                <tr><td style="color:#c5a572;">Phone:</td><td>${phone || "-"}</td></tr>
                <tr><td style="color:#c5a572;">Stay Duration:</td><td>${stayDuration}</td></tr>
            </table>
            <div style="margin-bottom:18px;"><span style="color:#c5a572;">Message:</span><br/>${message || "-"}</div>
            <div style="font-size:13px;color:#888;">This application was submitted via the TS Residence website.<br>If you need to contact the applicant, email <a href="mailto:${email}" style="color:#c5a572;">${email}</a> or reach out via WhatsApp/phone as provided above.</div>
          </div>
        </div>
      </body>
    `;

    // Branded client confirmation
    const clientHtml = `
      <body style="background: #f7f3ed; margin:0; padding:0; min-width:100vw; min-height:100vh;">
        <div style="font-family: 'Inter', Arial, sans-serif; min-height:100vh; background: #f7f3ed; padding: 48px 0;">
          <div style="background: #fff; color: #181818; max-width: 520px; margin: 32px auto; border-radius: 18px; box-shadow: 0 6px 32px 0 rgba(197,165,114,0.10); padding: 40px 36px 36px 36px;">
            <img src="https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/cce3ff72-a0c2-4b10-826e-c47befe5db00/public" alt="TS Residence" style="height:48px;margin-bottom:24px;display:block;" />
            <h2 style="color:#c5a572; margin-bottom: 18px; font-size:1.5rem;">Thank you for your application!</h2>
            <p style="margin-bottom:18px;">Dear ${firstName},</p>
            <p style="margin-bottom:18px;">Thank you for your interest in TS Residence. Our team has received your application and will be in touch soon to assist you further.</p>
            <table style="width:100%;margin-bottom:18px;">
              <tr><td style="color:#c5a572;">Email:</td><td>${email}</td></tr>
              <tr><td style="color:#c5a572;">Country Code:</td><td>${countryCode || "-"}</td></tr>
              <tr><td style="color:#c5a572;">Phone:</td><td>${phone || "-"}</td></tr>
            </table>
            <p style="margin-bottom:24px;">If you have any urgent questions, please contact us at <a href="mailto:tsresidence@townsquare.co.id" style="color:#c5a572; text-decoration:underline;">tsresidence@townsquare.co.id</a> or via WhatsApp at <a href="https://wa.me/6281119028111" style="color:#c5a572; text-decoration:underline;">+62 811 1902 8111</a>.</p>
            <div style="margin-top:24px;font-size:13px;color:#888;">Warm regards,<br>TS Residence Team<br><a href="https://www.tsresidence.id" style="color:#c5a572; text-decoration:none;">www.tsresidence.id</a></div>
          </div>
        </div>
      </body>
    `;

    const [adminResult, clientResult] = await Promise.allSettled([
      resend.emails.send({
        from: "TS Residence <noreply@tsresidence.id>",
        to: ["tsresidence@townsquare.co.id", "wellnessbrotherjay@gmail.com"],
        subject: "New Apartment Application from Website",
        html: adminHtml,
        replyTo: "tsresidence@townsquare.co.id",
      }),
      resend.emails.send({
        from: "TS Residence <noreply@tsresidence.id>",
        to: [email],
        subject: "Thank you for your application to TS Residence",
        html: clientHtml,
      }),
    ]);

    const adminError =
      adminResult.status === "fulfilled"
        ? normalizeEmailError(adminResult.value.error)
        : normalizeEmailError(adminResult.reason);
    const clientError =
      clientResult.status === "fulfilled"
        ? normalizeEmailError(clientResult.value.error)
        : normalizeEmailError(clientResult.reason);

    if (adminError && clientError) {
      return NextResponse.json(
        {
          error: "Unable to send confirmation emails right now.",
          emailWarnings: [adminError, clientError],
        },
        { status: 503 },
      );
    }

    return NextResponse.json({
      success: true,
      emailWarnings: [adminError, clientError].filter(Boolean),
    });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

