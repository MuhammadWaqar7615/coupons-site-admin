import Link from "next/link";
import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";
import { backendFetch } from "@/lib/backendFetch";
import CategoryTable from "@/components/admin/categories/CategoryTable";

export const metadata = { title: "Categories | CodiceSconto Admin" };

export default async function CategoriesPage() {
  await requireRole([ROLES.ADMIN, ROLES.ADMINISTRATION]);
  const res = await backendFetch("/api/categories");
  const data = res.ok ? await res.json() : { categories: [] };
  const rawCategories = data.categories || [];

  const categories = rawCategories.map((category) => ({
    ...category,
    _id: category._id || category.id,
    id: category.id || category._id,
    status: category.status ? category.status.toLowerCase() : "enabled",
    createdAt: category.createdAt ? new Date(category.createdAt).toISOString() : null,
    updatedAt: category.updatedAt ? new Date(category.updatedAt).toISOString() : null,
  }));

  return (
    <main className="min-h-screen bg-white">
      <header className="flex flex-col gap-4 border-b border-gray-200 bg-accent-light px-4 py-6 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
          <p className="mt-1 text-sm text-gray-600">Manage menu and featured categories.</p>
        </div>
        <Link
          href="/dashboard/categories/new"
          className="rounded-lg bg-accent px-4 py-2 text-center text-sm font-medium text-white hover:bg-accent-hover"
        >
          Add Category
        </Link>
      </header>
      <section className="px-4 py-8 md:px-8">
        <CategoryTable categories={categories} />
      </section>
    </main>
  );
}
