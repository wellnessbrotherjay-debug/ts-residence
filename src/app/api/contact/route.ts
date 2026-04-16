import { NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const EMAIL_LOGO_URL =
  "https://imagedelivery.net/Ysk_B7ELLCDostxgfBMH8A/cce3ff72-a0c2-4b10-826e-c47befe5db00/public";

function adminEmailHtml(d: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  stayDuration: string;
  message?: string;
}) {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:12px 16px;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#8c6d3f;width:130px;vertical-align:top;border-bottom:1px solid #ede8df;">${label}</td>
      <td style="padding:12px 16px;font-size:15px;color:#1c1917;border-bottom:1px solid #ede8df;">${value}</td>
    </tr>`;
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0ebe3;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ebe3;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#1c1917;padding:36px 40px;text-align:center;">
            <img src="${EMAIL_LOGO_URL}" alt="TS Residence" width="120" style="display:block;margin:0 auto 18px;width:120px;max-width:120px;height:auto;" />
            <p style="margin:0 0 6px;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:#b8965a;">TS Residence · Seminyak, Bali</p>
            <h1 style="margin:0;font-size:22px;font-weight:300;letter-spacing:0.12em;text-transform:uppercase;color:#faf8f5;">New Apartment Inquiry</h1>
            <div style="margin:16px auto 0;width:40px;height:1px;background:#b8965a;"></div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#faf8f5;padding:0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${row("Name", `${d.firstName} ${d.lastName}`)}
              ${row("Email", `<a href="mailto:${d.email}" style="color:#b8965a;text-decoration:none;">${d.email}</a>`)}
              ${row("Phone", d.phone || "—")}
              ${row("Stay Duration", d.stayDuration)}
              ${row("Message", d.message || "—")}
            </table>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="background:#faf8f5;padding:28px 40px 36px;text-align:center;">
            <a href="mailto:${d.email}" style="display:inline-block;background:#b8965a;color:#fff;font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;padding:14px 32px;">Reply to Inquiry</a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#1c1917;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#57534e;letter-spacing:0.06em;">tsresidence.id &nbsp;·&nbsp; Jl. Nakula No.18, Seminyak, Bali</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function clientEmailHtml(firstName: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0ebe3;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ebe3;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Hero Header -->
        <tr>
          <td style="background:#1c1917;padding:52px 40px 44px;text-align:center;">
            <img src="${EMAIL_LOGO_URL}" alt="TS Residence" width="140" style="display:block;margin:0 auto 18px;width:140px;max-width:140px;height:auto;" />
            <p style="margin:0 0 10px;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#b8965a;">Seminyak, Bali</p>
            <div style="margin:18px auto 20px;width:50px;height:1px;background:#b8965a;"></div>
            <p style="margin:0;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#b8965a;">Five-Star Long-Stay Living</p>
          </td>
        </tr>

        <!-- Divider line -->
        <tr><td style="height:3px;background:linear-gradient(90deg,#8c6d3f,#d4b97c,#8c6d3f);"></td></tr>

        <!-- Main message -->
        <tr>
          <td style="background:#faf8f5;padding:48px 48px 40px;text-align:center;">
            <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#b8965a;">Dear ${firstName},</p>
            <h2 style="margin:12px 0 20px;font-size:24px;font-weight:300;letter-spacing:0.06em;color:#1c1917;line-height:1.4;">Thank you for your inquiry.</h2>
            <p style="margin:0 auto;font-size:15px;line-height:1.8;color:#44403c;max-width:440px;">We have received your enquiry and our team will be in touch with you shortly. In the meantime, please feel free to reach out to us directly — we are always happy to assist.</p>
          </td>
        </tr>

        <!-- Divider -->
        <tr><td style="padding:0 48px;"><div style="height:1px;background:#ede8df;"></div></td></tr>

        <!-- Contact details -->
        <tr>
          <td style="background:#faf8f5;padding:36px 48px;">

            <!-- WhatsApp -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td style="width:44px;vertical-align:top;padding-top:2px;">
                  <div style="width:36px;height:36px;border:1px solid #d4b97c;text-align:center;line-height:36px;font-size:18px;">💬</div>
                </td>
                <td style="padding-left:16px;vertical-align:top;">
                  <p style="margin:0 0 3px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#b8965a;">WhatsApp</p>
                  <a href="https://wa.me/6281119028111" style="font-size:16px;color:#1c1917;text-decoration:none;letter-spacing:0.04em;">+62 811 1902 8111</a>
                  <p style="margin:4px 0 0;font-size:12px;color:#57534e;">Tap to open a conversation</p>
                </td>
              </tr>
            </table>

            <!-- Email -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td style="width:44px;vertical-align:top;padding-top:2px;">
                  <div style="width:36px;height:36px;border:1px solid #d4b97c;text-align:center;line-height:36px;font-size:18px;">✉️</div>
                </td>
                <td style="padding-left:16px;vertical-align:top;">
                  <p style="margin:0 0 3px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#b8965a;">Email</p>
                  <a href="mailto:tsresidence@townsquare.co.id" style="font-size:15px;color:#1c1917;text-decoration:none;">tsresidence@townsquare.co.id</a>
                </td>
              </tr>
            </table>

            <!-- Address -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="width:44px;vertical-align:top;padding-top:2px;">
                  <div style="width:36px;height:36px;border:1px solid #d4b97c;text-align:center;line-height:36px;font-size:18px;">📍</div>
                </td>
                <td style="padding-left:16px;vertical-align:top;">
                  <p style="margin:0 0 3px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#b8965a;">Address</p>
                  <p style="margin:0;font-size:15px;color:#1c1917;line-height:1.6;">Jl. Nakula No.18, Legian<br>Seminyak, Bali 80361<br>Indonesia</p>
                  <a href="https://maps.google.com/?q=TS+Residence+Seminyak" style="display:inline-block;margin-top:8px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#b8965a;text-decoration:none;border-bottom:1px solid #d4b97c;padding-bottom:1px;">View on Map →</a>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- WhatsApp CTA Button -->
        <tr>
          <td style="background:#faf8f5;padding:8px 48px 44px;text-align:center;">
            <a href="https://wa.me/6281119028111" style="display:inline-block;background:#1c1917;color:#b8965a;font-size:11px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none;padding:15px 36px;border:1px solid #b8965a;">Chat on WhatsApp</a>
          </td>
        </tr>

        <!-- Gold divider -->
        <tr><td style="height:3px;background:linear-gradient(90deg,#8c6d3f,#d4b97c,#8c6d3f);"></td></tr>

        <!-- Footer -->
        <tr>
          <td style="background:#1c1917;padding:28px 40px;text-align:center;">
            <p style="margin:0 0 12px;font-size:11px;color:#57534e;line-height:1.7;">Jl. Nakula No.18, Seminyak, Bali &nbsp;·&nbsp; <a href="https://www.tsresidence.id" style="color:#57534e;text-decoration:none;">tsresidence.id</a></p>
            <p style="margin:0;font-size:11px;color:#57534e;letter-spacing:0.06em;">@tsresidences &nbsp;·&nbsp; @tssuitesseminyak</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(req: Request) {
  try {
    if (!resend) {
      return NextResponse.json(
        { error: "RESEND_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const data = await req.json();
    const { firstName, lastName, email, phone, stayDuration, message } = data;

    const [adminResult] = await Promise.all([
      resend.emails.send({
        from: "TS Residence <noreply@tsresidence.id>",
        to: ["wellnessbrotherjay@gmail.com"],
        subject: `New Inquiry — ${firstName} ${lastName} (${stayDuration})`,
        html: adminEmailHtml({ firstName, lastName, email, phone, stayDuration, message }),
        replyTo: email,
      }),
      resend.emails.send({
        from: "TS Residence <noreply@tsresidence.id>",
        to: [email],
        subject: "We've received your enquiry — TS Residence",
        html: clientEmailHtml(firstName),
      }),
    ]);

    if (adminResult.error) {
      return NextResponse.json({ error: adminResult.error }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error?.toString() || "Unknown error" }, { status: 500 });
  }
}
