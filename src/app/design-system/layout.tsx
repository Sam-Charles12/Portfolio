import type { Metadata } from "next";

// Internal style guide — keep it out of search results. A layout is used
// because page.tsx is a client component and cannot export metadata.
// (robots.txt disallow alone does not prevent indexing.)
export const metadata: Metadata = {
  title: "Design System",
  robots: { index: false, follow: false },
};

export default function DesignSystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
