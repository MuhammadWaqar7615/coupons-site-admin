import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";
import { backendFetch } from "@/lib/backendFetch";
import SubcategoryForm from "@/components/admin/subcategories/SubcategoryForm";

export const metadata = { title: "Edit Subcategory | CodiceSconto Admin" };

export default async function EditSubcategoryPage({ params }) {
  await requireRole([ROLES.ADMIN, ROLES.ADMINISTRATION]);
  const { id } = await params;

  const [subRes, catRes] = await Promise.all([
    backendFetch(`/api/subcategories/${id}`),
    backendFetch("/api/categories"),
  ]);

  if (!subRes.ok) notFound();

  const subData = await subRes.json();
  const subcategory = subData.subcategory;
  if (!subcategory) notFound();

  const catData = catRes.ok ? await catRes.json() : { categories: [] };
  const categories = (catData.categories || []).map((category) => ({
    _id: category._id || category.id,
    id: category.id || category._id,
    title: category.title,
  }));

  const parentId = subcategory.parentCategoryId || subcategory.parentCategory?._id || subcategory.parentCategory?.id || subcategory.parentCategory;

  return (
    <SubcategoryForm
      subcategory={{
        ...subcategory,
        _id: subcategory._id || subcategory.id,
        id: subcategory.id || subcategory._id,
        status: subcategory.status ? subcategory.status.toLowerCase() : "enabled",
        parentCategory: parentId,
      }}
      categories={categories}
    />
  );
}
