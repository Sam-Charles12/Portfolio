// Shared site constants — single source of truth for links used in
// more than one place (hero, about, footer).

/** Direct PDF export of the CV — 1-click download. */
export const CV_URL =
  "https://docs.google.com/document/d/1F5Wwtfk3tith4xuirGR-RDJoenlqu0k2/export?format=pdf";

/** Public contact details — one source of truth for the footer and the
 *  closing CTA. */
export const EMAIL = "oladiposamcharles@gmail.com";
export const EMAIL_HREF = `mailto:${EMAIL}`;

export const PHONE_DISPLAY = "+234 704 543 8563";
export const PHONE_TEL = "+2347045438563";

/** WhatsApp shares the phone number. */
const WHATSAPP_NUMBER = PHONE_TEL.replace(/\D/g, "");
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi Carles — I found your portfolio and wanted to say hello.",
)}`;

export const GITHUB_URL = "https://github.com/Sam-Charles12";
export const X_URL = "https://x.com/carles_devlog";

/** Closing CTA destination — opens the visitor's mail client. */
export const CONTACT_HREF = EMAIL_HREF;
