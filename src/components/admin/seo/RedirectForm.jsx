"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const emptyRedirect = {
  source: "/",
  target: "/",
  statusCode: 301,
  isActive: true,
  notes: "",
};

export default function RedirectForm({ redirect }) {
  const router = useRouter();
  const isEditing = Boolean(redirect?._id);
  const [formData, setFormData] = useState(redirect ? { ...emptyRedirect, ...redirect } : emptyRedirect);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(isEditing ? `/api/seo/redirects/${redirect._id}` : "/api/seo/redirects", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          statusCode: Number(formData.statusCode),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to save redirect.");

      router.push("/dashboard/seo/redirects");
      router.refresh();
    } catch (submitError) {
      setError(submitError.message);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{isEditing ? "Edit Redirect" : "Add Redirect"}</h1>
            <p className="mt-1 text-sm text-slate-600">Create permanent or temporary URL redirects for SEO cleanup and page moves.</p>
          </div>
          <Link href="/dashboard/seo/redirects" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50">
            Cancel
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="source" className="mb-1 block text-sm font-medium text-slate-700">Source Path *</label>
              <input id="source" name="source" required value={formData.source} onChange={handleChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" />
            </div>
            <div>
              <label htmlFor="statusCode" className="mb-1 block text-sm font-medium text-slate-700">Status Code</label>
              <select id="statusCode" name="statusCode" value={formData.statusCode} onChange={handleChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20">
                <option value={301}>301 Permanent Redirect</option>
                <option value={302}>302 Temporary Redirect</option>
                <option value={307}>307 Temporary Redirect</option>
                <option value={308}>308 Permanent Redirect</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="target" className="mb-1 block text-sm font-medium text-slate-700">Target URL or Path *</label>
            <input id="target" name="target" required value={formData.target} onChange={handleChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" />
          </div>

          <div>
            <label htmlFor="notes" className="mb-1 block text-sm font-medium text-slate-700">Notes</label>
            <textarea id="notes" name="notes" rows="3" value={formData.notes} onChange={handleChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" />
          </div>

          <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="h-4 w-4 accent-accent" />
            Active redirect
          </label>

          <div className="flex justify-end border-t border-slate-200 pt-5">
            <button type="submit" disabled={loading} className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-accent-hover disabled:opacity-60">
              {loading ? "Saving..." : isEditing ? "Update Redirect" : "Save Redirect"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
