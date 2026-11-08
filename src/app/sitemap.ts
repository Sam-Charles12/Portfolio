import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { POSTS } from "@/lib/posts";
import { PROJECT_DETAILS } from "@/lib/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const statics: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: new Date() },
    { url: `${SITE_URL}/works`, lastModified: new Date() },
    { url: `${SITE_URL}/blog`, lastModified: new Date() },
  ];
  const posts: MetadataRoute.Sitemap = POSTS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }));
  const projects: MetadataRoute.Sitemap = PROJECT_DETAILS.map((project) => ({
    url: `${SITE_URL}/works/${project.slug}`,
    lastModified: new Date(),
  }));
  return [...statics, ...posts, ...projects];
}
