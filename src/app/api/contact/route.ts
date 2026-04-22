import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_WE2B2WLY_D1NVPHgjUSD48hDPsyn8WE4w");

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { firstName, lastName, email, phone, stayDuration, message } = data;


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
            <p style="margin-bottom:24px;">If you have any urgent questions, please contact us at <a href="mailto:tsresidence@townsquare.co.id" style="color:#c5a572; text-decoration:underline;">tsresidence@townsquare.co.id</a> or via WhatsApp at <a href="https://wa.me/6281119028111" style="color:#c5a572; text-decoration:underline;">+62 811 1902 8111</a>.</p>
            <div style="margin-top:24px;font-size:13px;color:#888;">Warm regards,<br>TS Residence Team<br><a href="https://www.tsresidence.id" style="color:#c5a572; text-decoration:none;">www.tsresidence.id</a></div>
          </div>
        </div>
      </body>
    `;

    // Send admin notification
    const adminResult = await resend.emails.send({
      from: "TS Residence <noreply@tsresidence.id>",
      to: ["tsresidence@townsquare.co.id", "wellnessbrotherjay@gmail.com"],
      subject: "New Apartment Application from Website",
      html: adminHtml,
      replyTo: "tsresidence@townsquare.co.id",
    });

    // Send client confirmation
    const clientResult = await resend.emails.send({
      from: "TS Residence <noreply@tsresidence.id>",
      to: [email],
      subject: "Thank you for your application to TS Residence",
      html: clientHtml,
    });

    if (adminResult.error) {
      return NextResponse.json({ error: adminResult.error }, { status: 500 });
    }
    if (clientResult.error) {
      return NextResponse.json({ error: clientResult.error }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

