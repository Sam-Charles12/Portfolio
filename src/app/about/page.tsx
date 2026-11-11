import type { Metadata } from "next";
import { existsSync } from "node:fs";
import path from "node:path";
import SiteNav from "@/components/site-nav";
import AboutHero from "@/components/about-hero";
import AboutPrinciples from "@/components/about-principles";
import AboutStory from "@/components/about-story";
import Stats from "@/components/stats";
import ToolsMarquee from "@/components/tools-marquee";
import ClosingImage from "@/components/closing-image";
import Contact from "@/components/contact";
import SiteFooter from "@/components/site-footer";
import BackToTop from "@/components/back-to-top";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Carles — how I work, where I started, where I am, and where I'm headed.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About | Carles",
    description:
      "About Carles — how I work, where I started, where I am, and where I'm headed.",
    type: "website",
    url: "/about",
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
    title: "About | Carles",
    description:
      "About Carles — how I work, where I started, where I am, and where I'm headed.",
    images: ["/og-cover.png"],
  },
};

export default function AboutPage() {
  const hasPortrait = existsSync(
    path.join(process.cwd(), "public", "me.jpg"),
  );

  return (
    <div
      id="top"
      className="bg-bg text-ink font-body min-h-screen flex flex-col"
    >
      <SiteNav />
      <main className="flex flex-1 flex-col">
        <AboutHero />
        <AboutPrinciples />
        <AboutStory />
        <Stats />
        <ToolsMarquee />
        <ClosingImage />
        <Contact />
      </main>
      <SiteFooter hasPortrait={hasPortrait} />
      <BackToTop />
    </div>
  );
}
