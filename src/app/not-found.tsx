import type { Metadata } from "next";
import SiteNav from "@/components/site-nav";
import BackToTop from "@/components/back-to-top";
import {
  GhostNotFound,
  NotFoundMarquee,
} from "@/components/ui/ghost-404-page";

export const metadata: Metadata = {
  title: "404 — Page Not Found — Carles",
  description:
    "This page took an unscheduled break. Head back home or go back.",
};

export default function NotFound() {
  return (
    <div
      id="top"
      className="bg-bg text-ink font-body min-h-screen flex flex-col"
    >
      <SiteNav />
      <main className="flex flex-1 flex-col">
        <GhostNotFound />
        <NotFoundMarquee />
      </main>
      <BackToTop />
    </div>
  );
}
