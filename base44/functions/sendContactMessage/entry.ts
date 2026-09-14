import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const SUPPORT_EMAIL = "mail4kubelynx@gmail.com";

export default async function(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = String(body.name || "").trim().slice(0, 100);
    const email = String(body.email || "").trim().slice(0, 200);
    const message = String(body.message || "").trim();

    if (!message) {
      return Response.json({ error: "Message is required." }, { status: 400 });
    }
    if (message.length > 5000) {
      return Response.json({ error: "Message is too long." }, { status: 400 });
    }
    // Basic email shape check when provided.
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);

    const subject = `Weatherskies contact from ${name || "a visitor"}`;
    const textBody = [
      `Name: ${name || "—"}`,
      `Email: ${email || "—"}`,
      "",
      message,
      "",
      `— Sent from the Weatherskies contact form`
    ].join("\n");

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: SUPPORT_EMAIL,
      subject,
      text: textBody,
      from_name: "Weatherskies Contact"
    });

    return Response.json({ status: "success" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}