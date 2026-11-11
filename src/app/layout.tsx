import type { Metadata } from "next";
import { Funnel_Display, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import SmoothScroll from "@/components/smooth-scroll";
import { SITE_URL, SITE_NAME, SITE_HANDLE } from "@/lib/site";

// Single source for Funnel Display — one @font-face set. body/logo/mono
// alias to it in globals.css. (Loading the same family 4x with 4 variables
// duplicates the CSS and fights the token overrides.)
const display = Funnel_Display({
  variable: "--font-funnel",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const hero = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Carles | Software Engineer",
    template: "%s | Carles",
  },
  description:
    "Carles is a full-stack software engineer building scalable systems and clean, production-ready web apps — from APIs to frontends.",
  keywords: [
    "Carles",
    "Software Engineer",
    "Full-stack Developer",
    "Next.js",
    "TypeScript",
    "React",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: SITE_NAME,
    title: "Carles | Software Engineer",
    description:
      "Carles is a full-stack software engineer building scalable systems and clean, production-ready web apps — from APIs to frontends.",
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
    site: SITE_HANDLE,
    creator: SITE_HANDLE,
    title: "Carles | Software Engineer",
    description:
      "Carles is a full-stack software engineer building scalable systems and clean, production-ready web apps — from APIs to frontends.",
    images: ["/og-cover.png"],
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

// Applies the saved (or OS-preferred) theme synchronously before paint, so
// there's no theme flash. A plain blocking script, not next/script:
// beforeInteractive neither blocks paint nor survives React client renders.
const themeInit = `try{var t=localStorage.getItem("carles-theme");if(!t){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_NAME,
    url: SITE_URL,
    jobTitle: "Software Engineer",
    sameAs: [
      "https://github.com/Sam-Charles12",
      "https://x.com/carles_devlog",
    ],
  };
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
  };
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${hero.variable} h-full antialiased`}
    >
      <body className="bg-bg text-ink font-body min-h-screen flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <SmoothCursor />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
