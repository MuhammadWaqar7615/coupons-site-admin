import Link from "next/link";
import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";
import { backendFetch } from "@/lib/backendFetch";
import SubcategoryTable from "@/components/admin/subcategories/SubcategoryTable";

export const metadata = { title: "Subcategories | CodiceSconto Admin" };

export default async function SubcategoriesPage() {
  await requireRole([ROLES.ADMIN, ROLES.ADMINISTRATION]);
  const res = await backendFetch("/api/subcategories");
  const data = res.ok ? await res.json() : { subcategories: [] };
  const rawSubcategories = data.subcategories || [];

  const subcategories = rawSubcategories.map((subcategory) => ({
    ...subcategory,
    _id: subcategory._id || subcategory.id,
    id: subcategory.id || subcategory._id,
    status: subcategory.status ? subcategory.status.toLowerCase() : "enabled",
    parentCategory: subcategory.parentCategory
      ? {
          ...subcategory.parentCategory,
          _id: subcategory.parentCategory._id || subcategory.parentCategory.id,
          id: subcategory.parentCategory.id || subcategory.parentCategory._id,
        }
      : null,
  }));

  return (
    <main className="min-h-screen bg-white">
      <header className="flex flex-col gap-4 border-b border-gray-200 bg-accent-light px-4 py-6 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Subcategories</h1>
          <p className="mt-1 text-sm text-gray-600">Manage subcategories and their parent categories.</p>
        </div>
        <Link
          href="/dashboard/subcategories/new"
          className="rounded-lg bg-accent px-4 py-2 text-center text-sm font-medium text-white hover:bg-accent-hover"
        >
          Add Subcategory
        </Link>
      </header>
      <section className="px-4 py-8 md:px-8">
        <SubcategoryTable subcategories={subcategories} />
      </section>
    </main>
  );
}
