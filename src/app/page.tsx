import { existsSync } from "node:fs";
import path from "node:path";
import SiteNav from "@/components/site-nav";
import Hero from "@/components/hero";
import FeaturedWorks from "@/components/featured-works";
import AboutMarquee from "@/components/about-marquee";
import About from "@/components/about";
import Tools from "@/components/tools";
import Stats from "@/components/stats";
import ClosingImage from "@/components/closing-image";
import Writing from "@/components/writing";
import Contact from "@/components/contact";
import SiteFooter from "@/components/site-footer";
import BackToTop from "@/components/back-to-top";

export default function Home() {
  // The portrait is optional: render a designed monogram until the file
  // exists, so the card never shows a broken image.
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
        <Hero />
        <FeaturedWorks />
        <AboutMarquee />
        <About />
        <Stats />
        <Tools />
        <ClosingImage />
        <Writing />
        <Contact />
      </main>
      <SiteFooter hasPortrait={hasPortrait} />
      <BackToTop />
    </div>
  );
}
