/**
 * Closing panel artwork — drop the final image at /public/contact-bg.png
 * (or point this at any other file in /public).
 *
 * This is a purely visual close to the page. It intentionally carries no
 * copy or CTA; the `contact` anchor stays here so the nav's "Say Hello"
 * link has a destination until a dedicated contact section lands.
 */
const BACKGROUND_IMAGE = "/contact-bg.png";

export default function Contact() {
  return (
    <section
      id="contact"
      aria-label="Closing image"
      className="w-full"
      style={{
        paddingTop: "clamp(72px, 9vw, 128px)",
        paddingBottom: "var(--stack-lg)",
      }}
    >
      <div className="container-shell">
        <div
          className="relative overflow-hidden"
          style={{
            borderRadius: "clamp(24px, 3vw, 40px)",
            height: "clamp(560px, 88vh, 920px)",
            backgroundColor: "var(--surface-raised)",
            border: "var(--border-width) solid var(--border-20)",
          }}
        >
          <img
            src={BACKGROUND_IMAGE}
            alt=""
            aria-hidden="true"
            decoding="async"
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
