import type { Metadata } from "next";
import { existsSync } from "node:fs";
import path from "node:path";
import SiteNav from "@/components/site-nav";
import AllBlogs from "@/components/all-blogs";
import SiteFooter from "@/components/site-footer";
import BackToTop from "@/components/back-to-top";

export const metadata: Metadata = {
  title: "Blog | Carles",
  description:
    "Thoughts and notes by Carles — ideas, experiments, and lessons from building software.",
};

export default function BlogPage() {
  const hasPortrait = existsSync(
    path.join(process.cwd(), "public", "me.jpg"),
  );

  return (
    <div
      id="top"
      className="bg-bg text-ink font-body min-h-screen flex flex-col"
    >
      <SiteNav />
      <AllBlogs />
      <SiteFooter hasPortrait={hasPortrait} />
      <BackToTop />
    </div>
  );
}
