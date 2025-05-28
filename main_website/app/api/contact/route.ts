import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { name, email, phone, subject, message } = await req.json();

  // Use your webmail SMTP settings
  const transporter = nodemailer.createTransport({
    host: "mail.ourtopclinic.com",
    port: 465,
    secure: true,
    auth: {
      user: "tech@ourtopclinic.com",
      pass: "Welcome@2060@!@",
    },
  });

  try {
    await transporter.sendMail({
      from: `"${name} via OurTopClinic Website" <tech@ourtopclinic.com>`,
      to: "tech@ourtopclinic.com",
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nSubject: ${subject}\nMessage: ${message}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; border-radius: 8px; border: 1px solid #e5e7eb; box-shadow: 0 2px 8px rgba(0,0,0,0.04); overflow: hidden;">
          <div style="background: linear-gradient(90deg, #10b981 0%, #14b8a6 100%); padding: 24px 32px;">
            <h2 style="color: #fff; margin: 0; font-size: 1.5rem;">New Contact Form Submission</h2>
          </div>
          <div style="padding: 24px 32px; background: #fff;">
            <p style="font-size: 1.1rem; color: #111; margin-bottom: 16px;">
              You have received a new message from the <b>OurTopClinic</b> website contact form.
            </p>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="padding: 8px 0; color: #555; width: 120px;">Name:</td>
                <td style="padding: 8px 0; color: #222;"><b>${name}</b></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555;">Email:</td>
                <td style="padding: 8px 0; color: #222;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555;">Phone:</td>
                <td style="padding: 8px 0; color: #222;">${phone || '<i>Not provided</i>'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555;">Subject:</td>
                <td style="padding: 8px 0; color: #222;">${subject}</td>
              </tr>
            </table>
            <div style="margin-bottom: 24px;">
              <div style="color: #555; margin-bottom: 6px;">Message:</div>
              <div style="background: #f3f4f6; border-radius: 6px; padding: 16px; color: #222; font-size: 1rem; white-space: pre-line;">
                ${message}
              </div>
            </div>
            <div style="font-size: 0.95rem; color: #888; border-top: 1px solid #e5e7eb; padding-top: 16px;">
              <b>OurTopClinic Website</b> &mdash; This message was sent via the contact form.
            </div>
          </div>
        </div>
      `,
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Nodemailer error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 