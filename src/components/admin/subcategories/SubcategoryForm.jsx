"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const emptySubcategory = {
  title: "",
  slug: "",
  description: "",
  parentCategory: "",
  seoTitle: "",
  seoDescription: "",
  status: "enabled",
};

export default function SubcategoryForm({ subcategory, categories }) {
  const router = useRouter();
  const isEditing = Boolean(subcategory?._id);
  const [formData, setFormData] = useState(
    subcategory
      ? { ...emptySubcategory, ...subcategory, parentCategory: subcategory.parentCategory?._id || subcategory.parentCategory || "" }
      : emptySubcategory
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(isEditing ? `/api/subcategories/${subcategory._id}` : "/api/subcategories", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to save subcategory.");
      router.push("/dashboard/subcategories");
      router.refresh();
    } catch (submitError) {
      setError(submitError.message);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800">{isEditing ? "Edit Subcategory" : "Add Subcategory"}</h1>
          <Link href="/dashboard/subcategories" className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 rounded-xl border border-gray-100 bg-white p-6 shadow-lg sm:p-8">
          {error && <div className="border-l-4 border-red-500 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

          <section className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">Title *</label>
              <input id="title" name="title" required value={formData.title} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label htmlFor="slug" className="mb-1 block text-sm font-medium text-gray-700">Slug * (lowercase, unique)</label>
              <input id="slug" name="slug" required value={formData.slug} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent" />
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="parentCategory" className="mb-1 block text-sm font-medium text-gray-700">Parent Category *</label>
              <select id="parentCategory" name="parentCategory" required value={formData.parentCategory} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent">
                <option value="">Select parent category</option>
                {categories.map((category) => <option key={category._id} value={category._id}>{category.title}</option>)}
              </select>
              {categories.length === 0 && <p className="mt-1 text-xs text-red-600">Create a category before adding a subcategory.</p>}
            </div>
          </section>

          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" name="description" rows="4" value={formData.description} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent" />
          </div>

          <section className="grid gap-6 border-t border-gray-100 pt-6 md:grid-cols-2">
            <div>
              <label htmlFor="seoTitle" className="mb-1 block text-sm font-medium text-gray-700">SEO title</label>
              <input id="seoTitle" name="seoTitle" value={formData.seoTitle} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700">Status</label>
              <select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent"><option value="enabled">Enabled</option><option value="disabled">Disabled</option></select>
            </div>
          </section>

          <div>
            <label htmlFor="seoDescription" className="mb-1 block text-sm font-medium text-gray-700">SEO description</label>
            <textarea id="seoDescription" name="seoDescription" rows="3" value={formData.seoDescription} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent" />
          </div>

          <div className="flex justify-end border-t border-gray-100 pt-6"><button type="submit" disabled={loading || categories.length === 0} className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-accent-hover disabled:opacity-50">{loading ? "Saving..." : "Save Subcategory"}</button></div>
        </form>
      </div>
    </main>
  );
}
