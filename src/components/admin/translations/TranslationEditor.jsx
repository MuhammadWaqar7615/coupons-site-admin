"use client";

import { useEffect, useMemo, useState } from "react";

export default function TranslationEditor() {
  const [translations, setTranslations] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetch("/api/translations")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to load translations.");
        setTranslations(data.translations);
      })
      .catch((error) => setMessage({ type: "error", text: error.message }))
      .finally(() => setLoading(false));
  }, []);

  const filteredTranslations = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return translations;
    return translations.filter((item) => item.key.toLowerCase().includes(search) || item.source.toLowerCase().includes(search) || item.value.toLowerCase().includes(search));
  }, [query, translations]);

  const updateValue = (key, value) => {
    setTranslations((current) => current.map((item) => (item.key === key ? { ...item, value } : item)));
  };

  const saveTranslations = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const response = await fetch("/api/translations", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ translations }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to save translations.");
      setMessage({ type: "success", text: data.message });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm text-slate-600">Loading translations...</p></div>;

  return (
    <form onSubmit={saveTranslations} className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="text-lg font-semibold text-slate-900">English to Italian</h2><p className="mt-1 text-sm text-slate-500">Add Italian text for the phrases used across the website.</p></div>
        <button type="submit" disabled={saving} className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-50">{saving ? "Saving..." : "Save Translations"}</button>
      </div>
      {message.text && <div className={`mx-5 mt-5 rounded-lg border px-4 py-3 text-sm ${message.type === "success" ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}>{message.text}</div>}
      <div className="border-b border-slate-200 p-5"><label htmlFor="translation-search" className="sr-only">Search translations</label><input id="translation-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search translations..." className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" /></div>
      <div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-200"><thead className="bg-slate-50"><tr><th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Key</th><th className="min-w-[280px] px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">English source</th><th className="min-w-[320px] px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Italian translation</th></tr></thead><tbody className="divide-y divide-slate-100">{filteredTranslations.map((item) => <tr key={item.key} className="align-top hover:bg-slate-50"><td className="whitespace-nowrap px-5 py-4 text-xs font-medium text-slate-500">{item.key}</td><td className="px-5 py-4 text-sm text-slate-700">{item.source}</td><td className="px-5 py-3"><input aria-label={`Italian translation for ${item.key}`} value={item.value} onChange={(event) => updateValue(item.key, event.target.value)} placeholder={item.source} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" /></td></tr>)}{filteredTranslations.length === 0 && <tr><td colSpan="3" className="px-5 py-10 text-center text-sm text-slate-500">No translations found.</td></tr>}</tbody></table></div>
    </form>
  );
}
