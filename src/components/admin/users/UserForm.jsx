"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const roles = [
  { value: "administration", label: "Administrator" },
  { value: "editor", label: "Editor" },
  { value: "subscribor", label: "Subscriber" },
];

const emptyUser = { name: "", email: "", description: "", password: "", role: "subscribor", verified: false, status: "enabled" };

export default function UserForm({ user }) {
  const router = useRouter();
  const isEditing = Boolean(user?._id);
  const [formData, setFormData] = useState(user ? { ...emptyUser, ...user, password: "" } : emptyUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = { ...formData };
      if (isEditing && !payload.password) delete payload.password;
      const response = await fetch(isEditing ? `/api/users/${user._id}` : "/api/users", { method: isEditing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to save user.");
      router.push("/dashboard/users");
      router.refresh();
    } catch (submitError) {
      setError(submitError.message);
      setLoading(false);
    }
  };

  return <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8"><div className="mx-auto max-w-4xl"><div className="mb-6 flex items-center justify-between gap-4"><h1 className="text-2xl font-bold text-gray-800">{isEditing ? "Edit User" : "Add User"}</h1><Link href="/dashboard/users" className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</Link></div><form onSubmit={handleSubmit} className="space-y-8 rounded-xl border border-gray-100 bg-white p-6 shadow-lg sm:p-8">{error && <div className="border-l-4 border-red-500 bg-red-50 p-4 text-sm text-red-700">{error}</div>}<section className="grid gap-6 md:grid-cols-2"><div><label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">Name *</label><input id="name" name="name" required value={formData.name} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent" /></div><div><label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">Email *</label><input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent" /></div></section><div><label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">Description</label><textarea id="description" name="description" rows="4" value={formData.description} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent" /></div><section className="grid gap-6 border-t border-gray-100 pt-6 md:grid-cols-2"><div><label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">Password {isEditing ? "(leave blank to keep current)" : "*"}</label><input id="password" name="password" type="password" required={!isEditing} minLength="8" value={formData.password} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent" /></div><div><label htmlFor="role" className="mb-1 block text-sm font-medium text-gray-700">Role</label><select id="role" name="role" value={formData.role} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent">{roles.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}</select></div></section><section className="grid gap-4 border-t border-gray-100 pt-6 sm:grid-cols-2"><label className="flex items-center gap-3 text-sm text-gray-700"><input type="checkbox" name="verified" checked={formData.verified} onChange={handleChange} className="h-4 w-4 accent-accent" />Verified</label><div><label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700">Status</label><select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent"><option value="enabled">Enabled</option><option value="disabled">Disabled</option></select></div></section><div className="flex justify-end border-t border-gray-100 pt-6"><button type="submit" disabled={loading} className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-accent-hover disabled:opacity-50">{loading ? "Saving..." : "Save User"}</button></div></form></div></main>;
}
