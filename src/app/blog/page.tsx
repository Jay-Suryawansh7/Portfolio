import { getAllPosts } from "@/lib/mdx";
import Link from "next/link";
import { MoveRight } from "lucide-react";

export const metadata = {
  title: "Blog | Jay.dev",
  description: "Writing about code, design, and building the future.",
};

export default function BlogListingPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen pt-24 px-4 md:px-12 max-w-5xl mx-auto">
      <div className="mb-16">
        <h1 className="text-4xl md:text-6xl font-bold font-mono text-cyan-400 mb-6">Blog</h1>
        <p className="text-xl text-gray-400 max-w-2xl">
          Thoughts on software engineering, creative coding, and the intersection of AI & Design.
        </p>
      </div>

      <div className="grid gap-8">
        {posts.map((post: { slug: string; meta: any }) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
          <Link 
            key={post.slug} 
            href={`/blog/${post.slug}`}
            className="group block p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-4 mb-4">
              <h2 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                {post.meta.title}
              </h2>
              <span className="font-mono text-sm text-gray-500">{post.meta.date} • {post.meta.readTime}</span>
            </div>
            
            <p className="text-gray-400 mb-6 text-lg leading-relaxed">{post.meta.description}</p>
            
            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    {post.meta.tags?.map((tag: string) => (
                        <span key={tag} className="text-xs px-3 py-1 bg-black/50 rounded-full text-cyan-500/80 border border-cyan-500/20">
                            #{tag}
                        </span>
                    ))}
                </div>
                <div className="text-cyan-400 flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                    Read Article <MoveRight size={16} />
                </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
