"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SubcategoryTable({ subcategories }) {
  const router = useRouter();

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this subcategory?")) return;
    const response = await fetch(`/api/subcategories/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json();
      window.alert(data.message || "Unable to delete subcategory.");
      return;
    }
    router.refresh();
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Id", "Title", "Parent Category", "Status", "Actions"].map((heading) => <th key={heading} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{heading}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {subcategories.map((subcategory) => (
              <tr key={subcategory._id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 text-xs text-gray-500">{subcategory._id}</td>
                <td className="px-6 py-4"><div className="font-medium text-gray-900">{subcategory.title}</div><div className="max-w-xs truncate text-xs text-gray-500">{subcategory.description}</div></td>
                <td className="px-6 py-4 text-sm text-gray-700">{subcategory.parentCategory?.title || "Unknown category"}</td>
                <td className="px-6 py-4"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${subcategory.status === "enabled" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}`}>{subcategory.status}</span></td>
                <td className="whitespace-nowrap px-6 py-4 text-sm"><Link href={`/dashboard/subcategories/${subcategory._id}/edit`} className="mr-4 text-indigo-600 hover:text-indigo-900">Edit</Link><button type="button" onClick={() => handleDelete(subcategory._id)} className="text-red-600 hover:text-red-900">Delete</button></td>
              </tr>
            ))}
            {subcategories.length === 0 && <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">No subcategories found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
