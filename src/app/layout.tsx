import type { Metadata } from "next";
import Script from "next/script";
import { Funnel_Display, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import SmoothScroll from "@/components/smooth-scroll";

// Single source for Funnel Display — one @font-face set. body/logo/mono
// alias to it in globals.css. (Loading the same family 4x with 4 variables
// duplicates the CSS and fights the token overrides.)
const display = Funnel_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const hero = Space_Grotesk({
  variable: "--font-hero",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Carles — Software Engineer",
  description: "I build web apps and care about how they feel to use. Frontend-leaning, full-stack capable.",
  openGraph: {
    title: "Carles — Software Engineer",
    description: "I build web apps and care about how they feel to use.",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${hero.variable} h-full antialiased`}
    >
      <body className="bg-bg text-ink font-body min-h-screen flex flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {`try{var t=localStorage.getItem("carles-theme");if(!t){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}document.documentElement.dataset.theme=t}catch(e){}`}
        </Script>
        <SmoothCursor />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
