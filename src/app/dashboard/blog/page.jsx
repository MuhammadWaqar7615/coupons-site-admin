import Link from "next/link";
import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";
import { backendFetch } from "@/lib/backendFetch";
import BlogPostTable from "@/components/admin/blog/BlogPostTable";

export const metadata = { title: "Blog | CodiceSconto Admin" };

export default async function BlogPostsPage() {
  await requireRole([ROLES.ADMIN, ROLES.ADMINISTRATION]);
  const res = await backendFetch("/api/blog");
  const data = res.ok ? await res.json() : { posts: [] };
  const rawPosts = data.posts || [];

  const posts = rawPosts.map((post) => ({
    ...post,
    _id: post._id || post.id,
    id: post.id || post._id,
    status: post.status ? post.status.toLowerCase() : "enabled",
    createdAt: post.createdAt ? new Date(post.createdAt).toISOString() : null,
    updatedAt: post.updatedAt ? new Date(post.updatedAt).toISOString() : null,
  }));

  return (
    <main className="min-h-screen bg-white">
      <header className="flex flex-col gap-4 border-b border-gray-200 bg-accent-light px-4 py-6 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Blog Posts</h1>
          <p className="mt-1 text-sm text-gray-600">Manage article titles, descriptions, images, and status.</p>
        </div>
        <Link
          href="/dashboard/blog/new"
          className="rounded-lg bg-accent px-4 py-2 text-center text-sm font-medium text-white hover:bg-accent-hover"
        >
          Add Blog Post
        </Link>
      </header>
      <section className="px-4 py-8 md:px-8">
        <BlogPostTable posts={posts} />
      </section>
    </main>
  );
}
