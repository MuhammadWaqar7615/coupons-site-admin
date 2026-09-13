import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";
import { backendFetch } from "@/lib/backendFetch";
import BlogPostForm from "@/components/admin/blog/BlogPostForm";

export const metadata = { title: "Edit Blog Post | CodiceSconto Admin" };

export default async function EditBlogPostPage({ params }) {
  await requireRole([ROLES.ADMIN, ROLES.ADMINISTRATION]);
  const { id } = await params;

  const res = await backendFetch(`/api/blog/${id}`);
  if (!res.ok) notFound();

  const data = await res.json();
  const post = data.post;
  if (!post) notFound();

  return (
    <BlogPostForm
      post={{
        ...post,
        _id: post._id || post.id,
        id: post.id || post._id,
        status: post.status ? post.status.toLowerCase() : "enabled",
      }}
    />
  );
}
