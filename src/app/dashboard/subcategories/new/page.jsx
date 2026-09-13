import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";
import { backendFetch } from "@/lib/backendFetch";
import SubcategoryForm from "@/components/admin/subcategories/SubcategoryForm";

export const metadata = { title: "Add Subcategory | CodiceSconto Admin" };

export default async function NewSubcategoryPage() {
  await requireRole([ROLES.ADMIN, ROLES.ADMINISTRATION]);
  const res = await backendFetch("/api/categories");
  const data = res.ok ? await res.json() : { categories: [] };
  const rawCategories = data.categories || [];

  const categories = rawCategories.map((category) => ({
    _id: category._id || category.id,
    id: category.id || category._id,
    title: category.title,
  }));

  return <SubcategoryForm categories={categories} />;
}
