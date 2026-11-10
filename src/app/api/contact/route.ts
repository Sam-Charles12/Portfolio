import { NextResponse } from "next/server";
import { Resend } from "resend";
import { EMAIL } from "@/lib/site";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LEN = { name: 100, email: 254, subject: 150, message: 5000 };

type ContactBody = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  /** Honeypot — bots fill it, humans never see it. */
  company?: unknown;
};

export async function POST(req: Request) {
  let body: ContactBody;
  try {
    body = (await req.json()) as ContactBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot hit — pretend success so bots learn nothing.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Please fill in your name, email, and message." },
      { status: 400 },
    );
  }
  if (name.length > MAX_LEN.name || email.length > MAX_LEN.email) {
    return NextResponse.json({ error: "Name or email is too long." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "That email address doesn't look right." },
      { status: 400 },
    );
  }
  if (subject.length > MAX_LEN.subject) {
    return NextResponse.json({ error: "Subject is too long." }, { status: 400 });
  }
  if (message.length > MAX_LEN.message) {
    return NextResponse.json(
      { error: "Message is too long — please keep it under 5000 characters." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Messaging isn't configured yet (missing RESEND_API_KEY). Please email me directly instead.",
      },
      { status: 503 },
    );
  }

  const to = process.env.CONTACT_TO || EMAIL;
  const from = process.env.CONTACT_FROM || "Portfolio Contact <onboarding@resend.dev>";
  const finalSubject = subject || `New portfolio message from ${name}`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: finalSubject,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `<p><strong>Name:</strong> ${escapeHtml(name)}<br/><strong>Email:</strong> ${escapeHtml(email)}</p><p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>`,
    });
    if (error) {
      return NextResponse.json(
        { error: "Couldn't send right now — please try again or email me directly." },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Couldn't send right now — please try again or email me directly." },
      { status: 502 },
    );
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
