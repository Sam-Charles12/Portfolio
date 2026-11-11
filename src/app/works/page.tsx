import type { Metadata } from "next";
import { existsSync } from "node:fs";
import path from "node:path";
import SiteNav from "@/components/site-nav";
import AllWorks from "@/components/all-works";
import SiteFooter from "@/components/site-footer";
import BackToTop from "@/components/back-to-top";

export const metadata: Metadata = {
  title: "Works",
  description:
    "A collection of projects, tools, and experiments built by Carles.",
  alternates: { canonical: "/works" },
  openGraph: {
    title: "Works | Carles",
    description:
      "A collection of projects, tools, and experiments built by Carles.",
    type: "website",
    url: "/works",
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
    title: "Works | Carles",
    description:
      "A collection of projects, tools, and experiments built by Carles.",
    images: ["/og-cover.png"],
  },
};

export default function WorksPage() {
  const hasPortrait = existsSync(
    path.join(process.cwd(), "public", "me.jpg"),
  );

  return (
    <div
      id="top"
      className="bg-bg text-ink font-body min-h-screen flex flex-col"
    >
      <SiteNav />
      <AllWorks />
      <SiteFooter hasPortrait={hasPortrait} />
      <BackToTop />
    </div>
  );
}
