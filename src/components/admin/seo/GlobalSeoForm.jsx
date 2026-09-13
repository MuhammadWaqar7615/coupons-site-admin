"use client";

import { useEffect, useState } from "react";

const emptySettings = {
  siteName: "",
  siteUrl: "",
  defaultTitle: "",
  titleTemplate: "%s",
  defaultDescription: "",
  defaultKeywords: "",
  defaultOgImage: "",
  twitterHandle: "",
  favicon: "",
  socialLinks: {
    facebook: "",
    instagram: "",
    linkedin: "",
    youtube: "",
    twitter: "",
  },
};

export default function GlobalSeoForm() {
  const [formData, setFormData] = useState(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch("/api/seo/global", { method: "GET" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load SEO settings.");
        }

        if (data.settings) {
          setFormData({
            siteName: data.settings.siteName || "",
            siteUrl: data.settings.siteUrl || "",
            defaultTitle: data.settings.defaultTitle || "",
            titleTemplate: data.settings.titleTemplate || "%s",
            defaultDescription: data.settings.defaultDescription || "",
            defaultKeywords: Array.isArray(data.settings.defaultKeywords) ? data.settings.defaultKeywords.join(", ") : "",
            defaultOgImage: data.settings.defaultOgImage || "",
            twitterHandle: data.settings.twitterHandle || "",
            favicon: data.settings.favicon || "",
            socialLinks: {
              facebook: data.settings.socialLinks?.facebook || "",
              instagram: data.settings.socialLinks?.instagram || "",
              linkedin: data.settings.socialLinks?.linkedin || "",
              youtube: data.settings.socialLinks?.youtube || "",
              twitter: data.settings.socialLinks?.twitter || "",
            },
          });
        }
      } catch (error) {
        setMessage({ type: "error", text: error.message });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name.startsWith("socialLinks.")) {
      const key = name.split(".")[1];
      setFormData((current) => ({
        ...current,
        socialLinks: {
          ...current.socialLinks,
          [key]: value,
        },
      }));
      return;
    }

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const payload = {
        ...formData,
        defaultKeywords: formData.defaultKeywords
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      const response = await fetch("/api/seo/global", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save SEO settings.");
      }

      setMessage({ type: "success", text: data.message || "Global SEO settings saved successfully." });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">Loading global SEO settings...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {message.text && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            message.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold text-slate-900">SEO Settings</h2>
        <p className="mt-1 text-sm text-slate-500">Manage the default website SEO information for all public pages.</p>
      </div>

      <section className="space-y-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Website Information</h3>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="siteName" className="mb-1 block text-sm font-medium text-slate-700">Site Name</label>
            <input
              id="siteName"
              name="siteName"
              value={formData.siteName}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>

          <div>
            <label htmlFor="siteUrl" className="mb-1 block text-sm font-medium text-slate-700">Site URL</label>
            <input
              id="siteUrl"
              name="siteUrl"
              value={formData.siteUrl}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>
        </div>
      </section>

      <section className="space-y-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Default SEO</h3>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="defaultTitle" className="mb-1 block text-sm font-medium text-slate-700">Default SEO Title</label>
            <input
              id="defaultTitle"
              name="defaultTitle"
              value={formData.defaultTitle}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>

          <div>
            <label htmlFor="titleTemplate" className="mb-1 block text-sm font-medium text-slate-700">Title Template</label>
            <input
              id="titleTemplate"
              name="titleTemplate"
              value={formData.titleTemplate}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>
        </div>

        <div>
          <label htmlFor="defaultDescription" className="mb-1 block text-sm font-medium text-slate-700">Default Description</label>
          <textarea
            id="defaultDescription"
            name="defaultDescription"
            rows="3"
            value={formData.defaultDescription}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>

        <div>
          <label htmlFor="defaultKeywords" className="mb-1 block text-sm font-medium text-slate-700">Default Keywords</label>
          <input
            id="defaultKeywords"
            name="defaultKeywords"
            value={formData.defaultKeywords}
            onChange={handleChange}
            placeholder="keyword 1, keyword 2, keyword 3"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>
      </section>

      <section className="space-y-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Social / Sharing</h3>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="defaultOgImage" className="mb-1 block text-sm font-medium text-slate-700">Default OG Image</label>
            <input
              id="defaultOgImage"
              name="defaultOgImage"
              value={formData.defaultOgImage}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>

          <div>
            <label htmlFor="twitterHandle" className="mb-1 block text-sm font-medium text-slate-700">Twitter Handle</label>
            <input
              id="twitterHandle"
              name="twitterHandle"
              value={formData.twitterHandle}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>
        </div>
      </section>

      <section className="space-y-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Social Links</h3>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="socialLinks.facebook" className="mb-1 block text-sm font-medium text-slate-700">Facebook</label>
            <input id="socialLinks.facebook" name="socialLinks.facebook" value={formData.socialLinks.facebook} onChange={handleChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" />
          </div>
          <div>
            <label htmlFor="socialLinks.instagram" className="mb-1 block text-sm font-medium text-slate-700">Instagram</label>
            <input id="socialLinks.instagram" name="socialLinks.instagram" value={formData.socialLinks.instagram} onChange={handleChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" />
          </div>
          <div>
            <label htmlFor="socialLinks.linkedin" className="mb-1 block text-sm font-medium text-slate-700">LinkedIn</label>
            <input id="socialLinks.linkedin" name="socialLinks.linkedin" value={formData.socialLinks.linkedin} onChange={handleChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" />
          </div>
          <div>
            <label htmlFor="socialLinks.youtube" className="mb-1 block text-sm font-medium text-slate-700">YouTube</label>
            <input id="socialLinks.youtube" name="socialLinks.youtube" value={formData.socialLinks.youtube} onChange={handleChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="socialLinks.twitter" className="mb-1 block text-sm font-medium text-slate-700">Twitter</label>
            <input id="socialLinks.twitter" name="socialLinks.twitter" value={formData.socialLinks.twitter} onChange={handleChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" />
          </div>
        </div>
      </section>

      <section className="space-y-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Brand Assets</h3>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="favicon" className="mb-1 block text-sm font-medium text-slate-700">Favicon</label>
            <input
              id="favicon"
              name="favicon"
              value={formData.favicon}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
