// Shared site constants — single source of truth for links used in
// more than one place (hero, about, footer).

/** Direct PDF export of the CV — 1-click download. */
export const CV_URL =
  "https://docs.google.com/document/d/1F5Wwtfk3tith4xuirGR-RDJoenlqu0k2/export?format=pdf";

/** Public contact details — replace the TODO placeholders with the real
 *  values. Everything below derives from these, so one edit updates the
 *  closing CTA and the footer together. */
export const EMAIL = "hello@example.com"; // TODO: real email
export const EMAIL_HREF = `mailto:${EMAIL}`;

export const PHONE_DISPLAY = "+34 600 000 000"; // TODO: real phone
export const PHONE_TEL = "+34600000000"; // TODO: real phone, no spaces

/** Same number as the phone until a separate WhatsApp number is supplied. */
export const WHATSAPP_URL = `https://wa.me/34600000000?text=${encodeURIComponent(
  "Hi Carles — I found your portfolio and wanted to say hello.",
)}`;

export const GITHUB_URL = "https://github.com/Sam-Charles12";
export const X_URL = "https://x.com/yourhandle"; // TODO: real X handle

/** Closing CTA destination — opens the visitor's mail client. */
export const CONTACT_HREF = EMAIL_HREF;
