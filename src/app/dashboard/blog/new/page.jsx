import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";
import BlogPostForm from "@/components/admin/blog/BlogPostForm";

export const metadata = { title: "Add Blog Post | CodiceSconto Admin" };

export default async function NewBlogPostPage() {
  await requireRole([ROLES.ADMIN, ROLES.ADMINISTRATION]);
  return <BlogPostForm />;
}
