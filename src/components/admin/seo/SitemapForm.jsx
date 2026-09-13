"use client";

import { useEffect, useState } from "react";

const emptyConfig = {
  siteUrl: "https://www.codicesconto.com",
  includeHome: true,
  includeStores: true,
  includeCategories: true,
  includeSubcategories: true,
  includeBlog: true,
  includeSeoPages: true,
  isActive: true,
};

export default function SitemapForm() {
  const [formData, setFormData] = useState(emptyConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch("/api/seo/sitemap", { method: "GET" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load sitemap settings.");
        }

        if (data.config) {
          setFormData({
            ...emptyConfig,
            ...data.config,
          });
        }
      } catch (error) {
        setMessage({ type: "error", text: error.message });
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("/api/seo/sitemap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to save sitemap settings.");

      setMessage({ type: "success", text: data.message || "Sitemap configuration saved successfully." });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">Loading sitemap settings...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {message.text && (
        <div className={`rounded-lg border px-4 py-3 text-sm ${message.type === "success" ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}>
          {message.text}
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold text-slate-900">Sitemap</h2>
        <p className="mt-1 text-sm text-slate-500">Generate and configure the XML sitemap for public indexed pages.</p>
      </div>

      <div>
        <label htmlFor="siteUrl" className="mb-1 block text-sm font-medium text-slate-700">Site URL</label>
        <input id="siteUrl" name="siteUrl" value={formData.siteUrl} onChange={handleChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex items-center gap-3 text-sm font-medium text-slate-700"><input type="checkbox" name="includeHome" checked={formData.includeHome} onChange={handleChange} className="h-4 w-4 accent-accent" />Include homepage</label>
        <label className="flex items-center gap-3 text-sm font-medium text-slate-700"><input type="checkbox" name="includeStores" checked={formData.includeStores} onChange={handleChange} className="h-4 w-4 accent-accent" />Include stores</label>
        <label className="flex items-center gap-3 text-sm font-medium text-slate-700"><input type="checkbox" name="includeCategories" checked={formData.includeCategories} onChange={handleChange} className="h-4 w-4 accent-accent" />Include categories</label>
        <label className="flex items-center gap-3 text-sm font-medium text-slate-700"><input type="checkbox" name="includeSubcategories" checked={formData.includeSubcategories} onChange={handleChange} className="h-4 w-4 accent-accent" />Include subcategories</label>
        <label className="flex items-center gap-3 text-sm font-medium text-slate-700"><input type="checkbox" name="includeBlog" checked={formData.includeBlog} onChange={handleChange} className="h-4 w-4 accent-accent" />Include blog posts</label>
        <label className="flex items-center gap-3 text-sm font-medium text-slate-700"><input type="checkbox" name="includeSeoPages" checked={formData.includeSeoPages} onChange={handleChange} className="h-4 w-4 accent-accent" />Include SEO pages</label>
        <label className="flex items-center gap-3 text-sm font-medium text-slate-700"><input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="h-4 w-4 accent-accent" />Enable sitemap generation</label>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        Sitemap URL: <span className="font-medium text-slate-900">/api/seo/sitemap</span>
      </div>

      <div className="flex justify-end border-t border-slate-200 pt-5">
        <button type="submit" disabled={saving} className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white transition hover:bg-accent-hover disabled:opacity-60">
          {saving ? "Saving..." : "Save Sitemap Settings"}
        </button>
      </div>
    </form>
  );
}
