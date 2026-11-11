import type { Metadata } from "next";
import { existsSync } from "node:fs";
import path from "node:path";
import SiteNav from "@/components/site-nav";
import ContactPage from "@/components/contact-page";
import SiteFooter from "@/components/site-footer";
import BackToTop from "@/components/back-to-top";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Have something in mind? Reach out to Carles — projects, questions, or just to say hi.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | Carles",
    description:
      "Have something in mind? Reach out to Carles — projects, questions, or just to say hi.",
    type: "website",
    url: "/contact",
    images: [
      {
        url: "/og-cover.png",
        width: 1200,
        height: 630,
        alt: "Carles — Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Carles",
    description:
      "Have something in mind? Reach out to Carles — projects, questions, or just to say hi.",
    images: ["/og-cover.png"],
  },
};

export default function ContactRoute() {
  const hasPortrait = existsSync(
    path.join(process.cwd(), "public", "me.jpg"),
  );

  return (
    <div
      id="top"
      className="bg-bg text-ink font-body min-h-screen flex flex-col"
    >
      <SiteNav />
      <ContactPage />
      <SiteFooter hasPortrait={hasPortrait} />
      <BackToTop />
    </div>
  );
}
