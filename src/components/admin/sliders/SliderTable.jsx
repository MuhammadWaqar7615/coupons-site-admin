"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SliderTable({ sliders }) {
  const router = useRouter();
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this slider?")) return;
    const response = await fetch(`/api/sliders/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json();
      window.alert(data.message || "Unable to delete slider.");
      return;
    }
    router.refresh();
  };

  return <div className="overflow-hidden rounded-lg border border-gray-200 bg-white"><div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr>{["Desktop image", "Mobile image", "Status", "Actions"].map((heading) => <th key={heading} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{heading}</th>)}</tr></thead><tbody className="divide-y divide-gray-200 bg-white">{sliders.map((slider) => <tr key={slider._id} className="hover:bg-gray-50"><td className="px-6 py-4"><div className="flex aspect-video w-32 items-center justify-center overflow-hidden rounded bg-gray-50 p-1"><img src={slider.image || "/images/placeholder.png"} alt="Desktop slider" className="h-full w-full object-contain" /></div></td><td className="px-6 py-4"><div className="flex h-24 w-14 items-center justify-center overflow-hidden rounded bg-gray-50 p-1"><img src={slider.mobileImage || slider.image || "/images/placeholder.png"} alt="Mobile slider" className="h-full w-full object-contain" /></div></td><td className="px-6 py-4"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${slider.status === "enabled" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}`}>{slider.status}</span></td><td className="whitespace-nowrap px-6 py-4 text-sm"><Link href={`/dashboard/sliders/${slider._id}/edit`} className="mr-4 text-indigo-600 hover:text-indigo-900">Edit</Link><button type="button" onClick={() => handleDelete(slider._id)} className="text-red-600 hover:text-red-900">Delete</button></td></tr>)}{sliders.length === 0 && <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500">No sliders found.</td></tr>}</tbody></table></div></div>;
}
