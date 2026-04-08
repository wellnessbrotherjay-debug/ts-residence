import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_WE2B2WLY_D1NVPHgjUSD48hDPsyn8WE4w");

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { firstName, lastName, email, phone, stayDuration, message } = data;

    const html = `
      <h2>New Apartment Inquiry</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "-"}</p>
      <p><strong>Stay Duration:</strong> ${stayDuration}</p>
      <p><strong>Message:</strong><br/>${message || "-"}</p>
    `;

    const result = await resend.emails.send({
      from: "TS Residence <noreply@tsresidence.id>",
      to: ["wellnessbrotherjay@gmail.com"],
      subject: "New Apartment Inquiry from Website",
      html,
      replyTo: email,
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error?.toString() || "Unknown error" }, { status: 500 });
  }
}
