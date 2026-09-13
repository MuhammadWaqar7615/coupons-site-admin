"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const emptyPage = {
  pageName: "",
  path: "/",
  title: "",
  description: "",
  keywords: "",
  canonicalUrl: "",
  robots: {
    index: true,
    follow: true,
    noarchive: false,
    nosnippet: false,
    noimageindex: false,
  },
  openGraph: {
    title: "",
    description: "",
    image: "",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "",
    description: "",
    image: "",
  },
  schema: {},
  isActive: true,
};

export default function SeoPageForm({ seoPage }) {
  const router = useRouter();
  const isEditing = Boolean(seoPage?._id);
  const [formData, setFormData] = useState(seoPage ? {
    ...emptyPage,
    ...seoPage,
    keywords: Array.isArray(seoPage.keywords) ? seoPage.keywords.join(", ") : "",
    schema: seoPage.schema ? JSON.stringify(seoPage.schema, null, 2) : "{}",
    robots: {
      ...emptyPage.robots,
      ...seoPage.robots,
    },
    openGraph: {
      ...emptyPage.openGraph,
      ...seoPage.openGraph,
    },
    twitter: {
      ...emptyPage.twitter,
      ...seoPage.twitter,
    },
  } : { ...emptyPage, schema: "{}" });
  const [loading, setLoading] = useState(false);
  const [loadedSeoPageId, setLoadedSeoPageId] = useState(null);
  const [error, setError] = useState("");
  const fetching = isEditing && loadedSeoPageId !== seoPage._id;

  useEffect(() => {
    if (!seoPage?._id) return;
    fetch(`/api/seo/pages/${seoPage._id}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to load SEO page.");
        setFormData({
          ...emptyPage,
          ...data.page,
          keywords: Array.isArray(data.page.keywords) ? data.page.keywords.join(", ") : "",
          schema: data.page.schema ? JSON.stringify(data.page.schema, null, 2) : "{}",
          robots: { ...emptyPage.robots, ...(data.page.robots || {}) },
          openGraph: { ...emptyPage.openGraph, ...(data.page.openGraph || {}) },
          twitter: { ...emptyPage.twitter, ...(data.page.twitter || {}) },
        });
      })
      .catch((loadError) => setError(loadError.message))
        .finally(() => setLoadedSeoPageId(seoPage._id));
  }, [seoPage?._id]);

  const titleCharCount = formData.title.length;
  const descriptionCharCount = formData.description.length;

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (name.startsWith("robots.")) {
      const key = name.split(".")[1];
      setFormData((current) => ({
        ...current,
        robots: {
          ...current.robots,
          [key]: checked,
        },
      }));
      return;
    }

    if (name.startsWith("openGraph.")) {
      const key = name.split(".")[1];
      setFormData((current) => ({
        ...current,
        openGraph: {
          ...current.openGraph,
          [key]: value,
        },
      }));
      return;
    }

    if (name.startsWith("twitter.")) {
      const key = name.split(".")[1];
      setFormData((current) => ({
        ...current,
        twitter: {
          ...current.twitter,
          [key]: value,
        },
      }));
      return;
    }

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
      let parsedSchema = {};
      if (formData.schema && String(formData.schema).trim()) {
        try {
          parsedSchema = JSON.parse(formData.schema);
        } catch {
          throw new Error("Structured data must be valid JSON.");
        }
      }

      const payload = {
        ...formData,
        schema: parsedSchema,
        keywords: formData.keywords
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      const response = await fetch(isEditing ? `/api/seo/pages/${seoPage._id}` : "/api/seo/pages", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to save SEO page.");

      router.push("/dashboard/seo/pages");
      router.refresh();
    } catch (submitError) {
      setError(submitError.message);
      setLoading(false);
    }
  };

  const statusBadge = useMemo(() => {
    if (!formData.isActive) return "Inactive";
    return "Active";
  }, [formData.isActive]);

  if (fetching && isEditing) {
    return <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Loading SEO page...</div>;
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{isEditing ? "Edit Page SEO" : "Create Page SEO"}</h1>
            <p className="mt-1 text-sm text-slate-600">Manage metadata for a static public frontend page.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${formData.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"}`}>
              {statusBadge}
            </span>
            <Link href="/dashboard/seo/pages" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50">
              Cancel
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          <section className="space-y-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Basic SEO</h2>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="pageName" className="mb-1 block text-sm font-medium text-slate-700">Page Name *</label>
                <input id="pageName" name="pageName" required value={formData.pageName} onChange={handleChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" />
              </div>
              <div>
                <label htmlFor="path" className="mb-1 block text-sm font-medium text-slate-700">Frontend URL / Path *</label>
                <input id="path" name="path" required value={formData.path} onChange={handleChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" />
              </div>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between gap-3">
                <label htmlFor="title" className="block text-sm font-medium text-slate-700">SEO Title</label>
                <span className="text-xs text-slate-500">{titleCharCount} / 60</span>
              </div>
              <input id="title" name="title" value={formData.title} onChange={handleChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between gap-3">
                <label htmlFor="description" className="block text-sm font-medium text-slate-700">Meta Description</label>
                <span className="text-xs text-slate-500">{descriptionCharCount} / 160</span>
              </div>
              <textarea id="description" name="description" rows="3" value={formData.description} onChange={handleChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" />
            </div>

            <div>
              <label htmlFor="keywords" className="mb-1 block text-sm font-medium text-slate-700">Keywords</label>
              <input id="keywords" name="keywords" value={formData.keywords} onChange={handleChange} placeholder="keyword 1, keyword 2" className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" />
            </div>
          </section>

          <section className="space-y-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Canonical</h2>
            <div>
              <label htmlFor="canonicalUrl" className="mb-1 block text-sm font-medium text-slate-700">Canonical URL</label>
              <input id="canonicalUrl" name="canonicalUrl" value={formData.canonicalUrl} onChange={handleChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" />
            </div>
          </section>

          <section className="space-y-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Robots</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" name="robots.index" checked={formData.robots.index} onChange={handleChange} className="h-4 w-4 accent-accent" />Allow Indexing</label>
              <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" name="robots.follow" checked={formData.robots.follow} onChange={handleChange} className="h-4 w-4 accent-accent" />Allow Following Links</label>
              <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" name="robots.noarchive" checked={formData.robots.noarchive} onChange={handleChange} className="h-4 w-4 accent-accent" />No Archive</label>
              <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" name="robots.nosnippet" checked={formData.robots.nosnippet} onChange={handleChange} className="h-4 w-4 accent-accent" />No Snippet</label>
              <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" name="robots.noimageindex" checked={formData.robots.noimageindex} onChange={handleChange} className="h-4 w-4 accent-accent" />No Image Index</label>
            </div>
          </section>

          <section className="space-y-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Open Graph</h2>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="openGraph.title" className="mb-1 block text-sm font-medium text-slate-700">OG Title</label>
                <input id="openGraph.title" name="openGraph.title" value={formData.openGraph.title} onChange={handleChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" />
              </div>
              <div>
                <label htmlFor="openGraph.type" className="mb-1 block text-sm font-medium text-slate-700">OG Type</label>
                <select id="openGraph.type" name="openGraph.type" value={formData.openGraph.type} onChange={handleChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20">
                  <option value="website">Website</option>
                  <option value="article">Article</option>
                  <option value="product">Product</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="openGraph.description" className="mb-1 block text-sm font-medium text-slate-700">OG Description</label>
              <textarea id="openGraph.description" name="openGraph.description" rows="3" value={formData.openGraph.description} onChange={handleChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" />
            </div>
            <div>
              <label htmlFor="openGraph.image" className="mb-1 block text-sm font-medium text-slate-700">OG Image</label>
              <input id="openGraph.image" name="openGraph.image" value={formData.openGraph.image} onChange={handleChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" />
            </div>
          </section>

          <section className="space-y-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Twitter / X</h2>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="twitter.card" className="mb-1 block text-sm font-medium text-slate-700">Twitter Card</label>
                <select id="twitter.card" name="twitter.card" value={formData.twitter.card} onChange={handleChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20">
                  <option value="summary_large_image">Summary Large Image</option>
                  <option value="summary">Summary</option>
                </select>
              </div>
              <div>
                <label htmlFor="twitter.title" className="mb-1 block text-sm font-medium text-slate-700">Twitter Title</label>
                <input id="twitter.title" name="twitter.title" value={formData.twitter.title} onChange={handleChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" />
              </div>
            </div>
            <div>
              <label htmlFor="twitter.description" className="mb-1 block text-sm font-medium text-slate-700">Twitter Description</label>
              <textarea id="twitter.description" name="twitter.description" rows="3" value={formData.twitter.description} onChange={handleChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" />
            </div>
            <div>
              <label htmlFor="twitter.image" className="mb-1 block text-sm font-medium text-slate-700">Twitter Image</label>
              <input id="twitter.image" name="twitter.image" value={formData.twitter.image} onChange={handleChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" />
            </div>
          </section>

          <section className="space-y-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Structured Data / Schema</h2>
            <div>
              <label htmlFor="schema" className="mb-1 block text-sm font-medium text-slate-700">JSON-LD object</label>
              <textarea id="schema" name="schema" rows="8" value={formData.schema} onChange={handleChange} placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "WebPage"\n}'} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 font-mono" />
            </div>
            <p className="text-xs text-slate-500">Use valid JSON. This value is stored as the page schema and can be used for JSON-LD output.</p>
          </section>

          <section className="space-y-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Status</h2>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="h-4 w-4 accent-accent" />
              Active
            </label>
          </section>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">
            <Link href="/dashboard/seo/pages" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
              Cancel
            </Link>
            <button type="submit" disabled={loading} className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Saving..." : "Save SEO"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
