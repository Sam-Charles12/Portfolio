import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { existsSync } from "node:fs";
import path from "node:path";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import BackToTop from "@/components/back-to-top";
import BlogArticle from "@/components/blog-article";
import { POSTS, getNeighbours, getPost } from "@/lib/posts";

type BlogPostPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) return { title: "Post not found — Carles" };

  return {
    title: `${post.title} — Carles`,
    description: post.dek,
    openGraph: {
      title: post.title,
      description: post.dek,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  const { previous, next } = getNeighbours(slug);
  const hasPortrait = existsSync(
    path.join(process.cwd(), "public", "me.jpg"),
  );

  return (
    <div
      id="top"
      className="bg-bg text-ink font-body min-h-screen flex flex-col"
    >
      <SiteNav />
      <BlogArticle post={post} previous={previous} next={next} />
      <SiteFooter hasPortrait={hasPortrait} />
      <BackToTop />
    </div>
  );
}
