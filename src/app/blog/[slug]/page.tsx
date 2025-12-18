import { getPostBySlug, getPostSlugs } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
  const posts = getPostSlugs();
  return posts.map((post) => ({
    slug: post.replace(/\.mdx$/, ''),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { meta } = getPostBySlug(slug);
  return {
    title: `${meta.title} | Jay.dev`,
    description: meta.description,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { content, meta } = getPostBySlug(slug);

  return (
    <article className="min-h-screen pt-24 px-4 md:px-12 max-w-4xl mx-auto pb-20">
      <Link 
        href="/blog"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-cyan-400 mb-8 transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/>
        Back to Blog
      </Link>

      <header className="mb-12 border-b border-white/10 pb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-6 leading-tight">
            {meta.title}
        </h1>
        <div className="flex flex-wrap gap-4 items-center text-sm font-mono text-gray-500">
            <span>{meta.date}</span>
            <span>•</span>
            <span>{meta.readTime}</span>
            <div className="flex gap-2 ml-auto">
                {meta.tags?.map((tag: string) => (
                    <span key={tag} className="text-xs px-2 py-1 bg-white/5 rounded border border-white/5 text-gray-300">
                        {tag}
                    </span>
                ))}
            </div>
        </div>
      </header>

      <div className="prose prose-invert prose-lg max-w-none prose-headings:text-cyan-50 prose-a:text-cyan-400 prose-code:text-purple-300 prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10">
        <MDXRemote source={content} />
      </div>
    </article>
  );
}
