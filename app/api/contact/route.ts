import { NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/constants";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, visa, message } = body;

    if (!name || !email || !message || !visa) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Send notification to business
    await resend.emails.send({
      from: `${SITE_NAME} <noreply@digitalnomadrespain.com>`,
      to: CONTACT_EMAIL,
      subject: `New enquiry from ${name} — ${visa}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Visa Interest:</strong> ${visa}</p>
        <p><strong>Message:</strong></p>
        <blockquote>${message.replace(/\n/g, "<br>")}</blockquote>
        <hr>
        <p style="color:#666;font-size:12px;">Sent from ${SITE_NAME} contact form</p>
      `,
    });

    // Send auto-reply to user
    await resend.emails.send({
      from: `${SITE_NAME} <noreply@digitalnomadrespain.com>`,
      to: email,
      subject: `We received your message — ${SITE_NAME}`,
      html: `
        <h2>Thanks for reaching out, ${name}!</h2>
        <p>We've received your message and will get back to you within 24 hours (on weekdays).</p>
        <p>In the meantime, you might find answers in our <a href="https://digitalnomadrespain.com/faq">FAQ</a>.</p>
        <p>
          Want to speak with us sooner?
          <a href="https://book.lakbyte.com/widget/booking/MRAtDGOOso1sUiM2MKix?am_id=joshua9606">
            Book a free consultation here.
          </a>
        </p>
        <br>
        <p>The ${SITE_NAME} team 🇪🇸</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
