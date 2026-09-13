"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BadgeTable({ badges }) {
  const router = useRouter();
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this badge?")) return;
    const response = await fetch(`/api/badges/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json();
      window.alert(data.message || "Unable to delete badge.");
      return;
    }
    router.refresh();
  };

  return <div className="overflow-hidden rounded-lg border border-gray-200 bg-white"><div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr>{["Id", "Image", "Name", "Actions"].map((heading) => <th key={heading} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{heading}</th>)}</tr></thead><tbody className="divide-y divide-gray-200 bg-white">{badges.map((badge) => <tr key={badge._id} className="hover:bg-gray-50"><td className="whitespace-nowrap px-6 py-4 text-xs text-gray-500">{badge._id}</td><td className="px-6 py-4"><div className="flex h-14 w-14 items-center justify-center rounded bg-gray-50 p-1"><img src={badge.image} alt={badge.name} className="max-h-full max-w-full object-contain" /></div></td><td className="px-6 py-4 font-medium text-gray-900">{badge.name}</td><td className="whitespace-nowrap px-6 py-4 text-sm"><Link href={`/dashboard/badges/${badge._id}/edit`} className="mr-4 text-indigo-600 hover:text-indigo-900">Edit</Link><button type="button" onClick={() => handleDelete(badge._id)} className="text-red-600 hover:text-red-900">Delete</button></td></tr>)}{badges.length === 0 && <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500">No badges found.</td></tr>}</tbody></table></div></div>;
}
