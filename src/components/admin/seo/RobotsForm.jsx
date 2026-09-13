"use client";

import { useEffect, useState } from "react";

const emptyConfig = {
  allowCrawlers: true,
  sitemapUrl: "https://www.codicesconto.com/sitemap.xml",
  disallowPaths: "/api/, /dashboard/, /account/",
  additionalRules: "",
  isActive: true,
};

export default function RobotsForm() {
  const [formData, setFormData] = useState(emptyConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch("/api/seo/robots", { method: "GET" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load robots settings.");
        }

        if (data.config) {
          setFormData({
            ...emptyConfig,
            ...data.config,
            disallowPaths: Array.isArray(data.config.disallowPaths) ? data.config.disallowPaths.join(", ") : emptyConfig.disallowPaths,
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
      const payload = {
        ...formData,
        disallowPaths: formData.disallowPaths
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      const response = await fetch("/api/seo/robots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to save robots settings.");

      setMessage({ type: "success", text: data.message || "Robots configuration saved successfully." });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">Loading robots settings...</p>
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
        <h2 className="text-xl font-semibold text-slate-900">Robots.txt</h2>
        <p className="mt-1 text-sm text-slate-500">Control crawler access and the robots.txt output for the public site.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="flex items-center gap-3 text-sm font-medium text-slate-700"><input type="checkbox" name="allowCrawlers" checked={formData.allowCrawlers} onChange={handleChange} className="h-4 w-4 accent-accent" />Allow search engine crawlers</label>
        <label className="flex items-center gap-3 text-sm font-medium text-slate-700"><input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="h-4 w-4 accent-accent" />Enable robots.txt output</label>
      </div>

      <div>
        <label htmlFor="sitemapUrl" className="mb-1 block text-sm font-medium text-slate-700">Sitemap URL</label>
        <input id="sitemapUrl" name="sitemapUrl" value={formData.sitemapUrl} onChange={handleChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" />
      </div>

      <div>
        <label htmlFor="disallowPaths" className="mb-1 block text-sm font-medium text-slate-700">Disallow Paths (comma separated)</label>
        <textarea id="disallowPaths" name="disallowPaths" rows="3" value={formData.disallowPaths} onChange={handleChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" />
      </div>

      <div>
        <label htmlFor="additionalRules" className="mb-1 block text-sm font-medium text-slate-700">Additional Rules</label>
        <textarea id="additionalRules" name="additionalRules" rows="3" value={formData.additionalRules} onChange={handleChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" />
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        Robots URL: <span className="font-medium text-slate-900">/api/seo/robots</span>
      </div>

      <div className="flex justify-end border-t border-slate-200 pt-5">
        <button type="submit" disabled={saving} className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white transition hover:bg-accent-hover disabled:opacity-60">
          {saving ? "Saving..." : "Save Robots Settings"}
        </button>
      </div>
    </form>
  );
}
