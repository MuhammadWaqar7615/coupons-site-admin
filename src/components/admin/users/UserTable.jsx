"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserTable({ users }) {
  const router = useRouter();
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    const response = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json();
      window.alert(data.message || "Unable to delete user.");
      return;
    }
    router.refresh();
  };

  return <div className="overflow-hidden rounded-lg border border-gray-200 bg-white"><div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr>{["Id", "Name", "Email", "Role", "Verified", "Status", "Actions"].map((heading) => <th key={heading} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{heading}</th>)}</tr></thead><tbody className="divide-y divide-gray-200 bg-white">{users.map((user) => <tr key={user._id} className="hover:bg-gray-50"><td className="whitespace-nowrap px-6 py-4 text-xs text-gray-500">{user._id}</td><td className="px-6 py-4 font-medium text-gray-900">{user.name}</td><td className="px-6 py-4 text-sm text-gray-700">{user.email}</td><td className="px-6 py-4 text-sm capitalize text-gray-700">{user.role}</td><td className="px-6 py-4 text-sm text-gray-600">{user.verified ? "Yes" : "No"}</td><td className="px-6 py-4"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${user.status === "enabled" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}`}>{user.status}</span></td><td className="whitespace-nowrap px-6 py-4 text-sm"><Link href={`/dashboard/users/${user._id}/edit`} className="mr-4 text-indigo-600 hover:text-indigo-900">Edit</Link><button type="button" onClick={() => handleDelete(user._id)} className="text-red-600 hover:text-red-900">Delete</button></td></tr>)}{users.length === 0 && <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-500">No users found.</td></tr>}</tbody></table></div></div>;
}
