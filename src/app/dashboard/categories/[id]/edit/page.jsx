import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";
import { backendFetch } from "@/lib/backendFetch";
import CategoryForm from "@/components/admin/categories/CategoryForm";

export const metadata = { title: "Edit Category | CodiceSconto Admin" };

export default async function EditCategoryPage({ params }) {
  await requireRole([ROLES.ADMIN, ROLES.ADMINISTRATION]);
  const { id } = await params;

  const res = await backendFetch(`/api/categories/${id}`);
  if (!res.ok) notFound();

  const data = await res.json();
  const category = data.category;
  if (!category) notFound();

  return (
    <CategoryForm
      category={{
        ...category,
        _id: category._id || category.id,
        id: category.id || category._id,
        status: category.status ? category.status.toLowerCase() : "enabled",
      }}
    />
  );
}
