import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { POSTS } from "@/lib/posts";
import { PROJECT_DETAILS } from "@/lib/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  // Only posts carry a real date. Stamping `new Date()` everywhere tells
  // crawlers the whole site changed on every build, so statics and
  // projects omit lastModified instead of faking it.
  const statics: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/` },
    { url: `${SITE_URL}/works` },
    { url: `${SITE_URL}/about` },
    { url: `${SITE_URL}/contact` },
    { url: `${SITE_URL}/blog` },
  ];
  const posts: MetadataRoute.Sitemap = POSTS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }));
  const projects: MetadataRoute.Sitemap = PROJECT_DETAILS.map((project) => ({
    url: `${SITE_URL}/works/${project.slug}`,
  }));
  return [...statics, ...posts, ...projects];
}
