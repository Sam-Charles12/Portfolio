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
import BackToTop from "@/components/back-to-top";

export default function Home() {
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
      <BackToTop />
    </div>
  );
}
