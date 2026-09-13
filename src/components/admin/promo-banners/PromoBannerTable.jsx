"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PromoBannerTable({ promoBanners }) {
  const router = useRouter();
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this promo banner?")) return;
    const response = await fetch(`/api/promo-banners/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json();
      window.alert(data.message || "Unable to delete promo banner.");
      return;
    }
    router.refresh();
  };

  return <div className="overflow-hidden rounded-lg border border-gray-200 bg-white"><div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr>{["Image", "Heading", "Description", "Status", "Actions"].map((heading) => <th key={heading} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{heading}</th>)}</tr></thead><tbody className="divide-y divide-gray-200 bg-white">{promoBanners.map((banner) => <tr key={banner._id} className="hover:bg-gray-50"><td className="px-6 py-4"><div className="flex h-14 w-24 items-center justify-center rounded bg-gray-50 p-1"><img src={banner.image} alt={banner.heading} className="max-h-full max-w-full object-contain" /></div></td><td className="px-6 py-4 font-medium text-gray-900">{banner.heading}</td><td className="max-w-sm px-6 py-4 text-sm text-gray-600"><div className="truncate">{banner.description}</div></td><td className="px-6 py-4"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${banner.status === "enabled" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}`}>{banner.status}</span></td><td className="whitespace-nowrap px-6 py-4 text-sm"><Link href={`/dashboard/promo-banners/${banner._id}/edit`} className="mr-4 text-indigo-600 hover:text-indigo-900">Edit</Link><button type="button" onClick={() => handleDelete(banner._id)} className="text-red-600 hover:text-red-900">Delete</button></td></tr>)}{promoBanners.length === 0 && <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">No promo banners found.</td></tr>}</tbody></table></div></div>;
}
