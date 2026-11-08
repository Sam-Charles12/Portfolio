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
  },
  twitter: {
    card: "summary_large_image",
    title: "Works | Carles",
    description:
      "A collection of projects, tools, and experiments built by Carles.",
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
