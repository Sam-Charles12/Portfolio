import SiteNav from "@/components/site-nav";
import Hero from "@/components/hero";
import FeaturedWorks from "@/components/featured-works";
import AboutMarquee from "@/components/about-marquee";
import About from "@/components/about";
import BackToTop from "@/components/back-to-top";

export default function Home() {
  return (
    <div className="bg-bg text-ink font-body min-h-screen flex flex-col">
      <SiteNav />
      <main
        id="top"
        className="flex flex-1 flex-col"
      >
        <Hero />
        <FeaturedWorks />
        <AboutMarquee />
        <About />
      </main>
      <BackToTop />
    </div>
  );
}
