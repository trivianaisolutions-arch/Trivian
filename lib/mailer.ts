import "server-only";
import nodemailer from "nodemailer";
import { briefText } from "./brief";
import { SITE_URL, siteConfig } from "./config";
import { EMAIL_LOGO_JPEG_BASE64 } from "./email-logo";
import type { Lead } from "./leads";

const env = process.env;
const LEAD_NOTIFY_TO = env.LEAD_NOTIFY_TO ?? "";
const MAIL_FROM_NAME = env.MAIL_FROM_NAME || "Trivian AI Solutions";
// Sending account: any SMTP provider on your own domain if SMTP_HOST is set (best inbox placement),
// otherwise the Gmail account. Switching providers is a .env.local change only.
const SMTP_PORT = Number(env.SMTP_PORT || 465);
const smtp = env.SMTP_HOST
  ? { host: env.SMTP_HOST, port: SMTP_PORT, secure: SMTP_PORT === 465, auth: { user: env.SMTP_USER ?? "", pass: env.SMTP_PASS ?? "" } }
  : { service: "gmail", auth: { user: env.GMAIL_USER ?? "", pass: env.GMAIL_APP_PASSWORD ?? "" } };
const FROM_ADDRESS = env.MAIL_FROM_ADDRESS || env.GMAIL_USER || "";
const INBOX = env.MAIL_REPLY_TO || env.GMAIL_USER || FROM_ADDRESS; // where replies should land
// Links to the website only once it's live — links to a domain that doesn't resolve are a strong spam signal.
const LIVE = process.env.SITE_LIVE_URL ? SITE_URL : "";

const transport = nodemailer.createTransport(smtp);

const LOGO = { filename: "trivian.jpg", content: EMAIL_LOGO_JPEG_BASE64, encoding: "base64", contentType: "image/jpeg", cid: "trivian-logo" };
// A plain business name: a domain-looking display name on a gmail.com address reads as spoofing.
const FROM = `"${MAIL_FROM_NAME.replace(/"/g, "")}" <${FROM_ADDRESS}>`;

// Everything a visitor typed is escaped before it goes into HTML; subjects lose line breaks.
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").slice(0, 120);
const firstName = (n: string) => n.trim().split(/\s+/)[0] || "there";

const ROWS = (l: Lead): [string, string][] => [
  ["Project", l.projectType],
  ["Budget", l.budget || "Not specified"],
  ["Timeline", l.timeline || "Not specified"],
  ["Current website", l.website || "—"],
  ["Company", l.company || "—"],
  ["Phone", l.phone || "—"],
];

/** Shared branded frame: dark header with the logo, bone body, quiet footer. */
function frame(inner: string, preheader: string) {
  return `<!doctype html><html><body style="margin:0;padding:0;background:#e9e5dc;">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#e9e5dc;padding:32px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#f3f0ea;border:1px solid #d8d3c8;font-family:Helvetica,Arial,sans-serif;color:#141518;">
<tr><td style="background:#0d0e10;padding:22px 32px;">
  <table role="presentation" cellpadding="0" cellspacing="0"><tr>
    <td><img src="cid:trivian-logo" width="40" height="40" alt="Trivian AI Solutions" style="display:block;border:0;"></td>
    <td style="padding-left:12px;color:#f3f0ea;font-size:15px;font-weight:800;letter-spacing:1px;text-transform:uppercase;">Trivian AI Solutions</td>
  </tr></table>
</td></tr>
<tr><td style="height:4px;background:#ff5a1f;line-height:4px;font-size:0;">&nbsp;</td></tr>
${inner}
<tr><td style="padding:22px 32px;border-top:1px solid #d8d3c8;font-size:12px;line-height:18px;color:#5c5b57;">
  Trivian AI Solutions — AI engineering, automation, websites, 3D and search.<br>
  <a href="mailto:${INBOX}" style="color:#a8360a;">${INBOX}</a>${LIVE ? ` · <a href="${LIVE}" style="color:#a8360a;">${LIVE.replace(/^https?:\/\//, "")}</a>` : ""}
</td></tr>
</table></td></tr></table></body></html>`;
}

function table(rows: [string, string][]) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;">${rows
    .map(
      ([k, v]) => `<tr>
  <td style="padding:10px 0;border-bottom:1px solid #d8d3c8;width:38%;color:#5c5b57;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;vertical-align:top;">${esc(k)}</td>
  <td style="padding:10px 0;border-bottom:1px solid #d8d3c8;color:#141518;">${esc(v)}</td></tr>`,
    )
    .join("")}</table>`;
}

const quote = (text: string) =>
  `<div style="margin:18px 0 0;padding:16px 18px;background:#e9e5dc;border-left:3px solid #ff5a1f;font-size:14px;line-height:22px;white-space:pre-wrap;">${esc(text)}</div>`;

/**
 * The visitor's confirmation, written as a short personal note: plain paragraphs, no images,
 * no buttons. Designed newsletters get sorted into Gmail's Promotions tab; a note lands in Primary.
 */
const SIGNER = "Ansh";
const CLIENT_FROM = `"${SIGNER} at ${MAIL_FROM_NAME.replace(/"/g, "")}" <${FROM_ADDRESS}>`;
// Only what the visitor actually filled in.
const given = (l: Lead) => ROWS(l).filter(([, v]) => v && v !== "—" && v !== "Not specified");

function thankYouText(l: Lead) {
  return `Hi ${firstName(l.name)},

Thanks for sending over your project brief. It's with our team now: we read every brief ourselves and will reply within 24 hours with an honest take on the approach, timeline and any questions we have.

Here's what you sent, for your records:

${given(l).map(([k, v]) => `${k}: ${v}`).join("\n")}

${l.whatToBuild}

If you think of anything else, just reply to this email. It comes straight to us.

${SIGNER}
${MAIL_FROM_NAME}
${siteConfig.phone}${LIVE ? `\n${LIVE.replace(/^https?:\/\//, "")}` : ""}`;
}

function thankYouHtml(l: Lead) {
  const p = (html: string) => `<p style="margin:0 0 16px;">${html}</p>`;
  return `<!doctype html><html><body style="margin:0;padding:24px 16px;background:#ffffff;">
<div style="max-width:560px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:23px;color:#202124;">
${p(`Hi ${esc(firstName(l.name))},`)}
${p("Thanks for sending over your project brief. It's with our team now: we read every brief ourselves and will reply within 24 hours with an honest take on the approach, timeline and any questions we have.")}
${p("Here's what you sent, for your records:")}
${p(given(l).map(([k, v]) => `${esc(k)}: ${esc(v)}`).join("<br>"))}
<div style="margin:0 0 16px;padding:2px 0 2px 14px;border-left:3px solid #dadce0;color:#3c4043;white-space:pre-wrap;">${esc(l.whatToBuild)}</div>
${p("If you think of anything else, just reply to this email. It comes straight to us.")}
<p style="margin:0;">${SIGNER}<br>${esc(MAIL_FROM_NAME)}<br><a href="${siteConfig.phoneHref}" style="color:#1a73e8;">${siteConfig.phone}</a>${LIVE ? `<br><a href="${LIVE}" style="color:#1a73e8;">${LIVE.replace(/^https?:\/\//, "")}</a>` : ""}</p>
</div></body></html>`;
}

function ownerHtml(l: Lead) {
  return frame(
    `<tr><td style="padding:32px 32px 8px;">
  <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#a8360a;">New lead · ${esc(new Date(l.createdAt).toUTCString())}</p>
  <h1 style="margin:10px 0 0;font-size:26px;line-height:30px;font-weight:800;color:#141518;">${esc(l.name)}</h1>
  <p style="margin:6px 0 0;font-size:15px;"><a href="mailto:${esc(l.email)}" style="color:#a8360a;">${esc(l.email)}</a></p>
</td></tr>
<tr><td style="padding:16px 32px 8px;">${table(ROWS(l))}${quote(l.whatToBuild)}</td></tr>
<tr><td style="padding:20px 32px 36px;">
  <a href="mailto:${esc(l.email)}?subject=${encodeURIComponent("Re: your project brief")}" style="display:inline-block;background:#141518;color:#f3f0ea;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:13px 20px;">Reply to ${esc(firstName(l.name))}</a>
  ${LIVE ? `<a href="${LIVE}/leads-owner" style="display:inline-block;margin-left:8px;color:#a8360a;font-size:12px;letter-spacing:2px;text-transform:uppercase;padding:13px 4px;">All leads &rarr;</a>` : ""}
</td></tr>`,
    `${l.name} · ${l.projectType} · ${l.budget || "budget not specified"}`,
  );
}

export const mailConfigured = () => Boolean(smtp.auth.user && smtp.auth.pass && FROM_ADDRESS && LEAD_NOTIFY_TO);

export async function notifyOwners(l: Lead) {
  await transport.sendMail({
    from: FROM,
    to: LEAD_NOTIFY_TO,
    replyTo: l.email,
    subject: oneLine(`New lead: ${l.projectType} — ${l.name}`),
    text: `New lead (${l.createdAt})\n\n${briefText(l)}`,
    html: ownerHtml(l),
    attachments: [LOGO],
  });
}

export async function thankClient(l: Lead) {
  await transport.sendMail({
    from: CLIENT_FROM,
    to: l.email,
    replyTo: INBOX,
    subject: oneLine(`Thanks, ${firstName(l.name)} — we've got your project brief`),
    text: thankYouText(l),
    html: thankYouHtml(l),
  });
}
