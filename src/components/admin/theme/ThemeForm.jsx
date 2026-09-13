"use client";

import { useEffect, useState } from "react";

const emptyTheme = { primaryColor: "#1B2A4A", secondaryColor: "#243B6A", layoutHeader: "style-1", mobileHeader: "style-1", headerStyle: "style-1", homeStyle: "home-1", logo: "", transparentLogo: "", favicon: "", homeBackgroundImage: "" };

function ImageField({ name, label, size, value, onChange }) {
  return <div><label htmlFor={name} className="mb-1 block text-sm font-medium text-slate-700">{label}</label><p className="mb-2 text-xs text-slate-500">Recommended size: {size}</p><input id={name} name={name} value={value} onChange={onChange} placeholder="https://..." className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" />{value && <img src={value} alt={`${label} preview`} className="mt-3 max-h-24 max-w-full object-contain" />}</div>;
}

export default function ThemeForm() {
  const [theme, setTheme] = useState(emptyTheme);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => { fetch("/api/theme").then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.message || "Unable to load theme settings."); setTheme({ ...emptyTheme, ...data.theme }); }).catch((error) => setMessage({ type: "error", text: error.message })).finally(() => setLoading(false)); }, []);

  const handleChange = (event) => setTheme((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault(); setSaving(true); setMessage({ type: "", text: "" });
    try { const response = await fetch("/api/theme", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(theme) }); const data = await response.json(); if (!response.ok) throw new Error(data.message || "Unable to save theme settings."); setMessage({ type: "success", text: data.message }); } catch (error) { setMessage({ type: "error", text: error.message }); } finally { setSaving(false); }
  };

  if (loading) return <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm text-slate-600">Loading theme settings...</p></div>;

  return <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
    {message.text && <div className={`rounded-lg border px-4 py-3 text-sm ${message.type === "success" ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}>{message.text}</div>}
    <section className="space-y-5"><h2 className="text-lg font-semibold text-slate-900">Colors</h2><div className="grid gap-5 sm:grid-cols-2"><div><label htmlFor="primaryColor" className="mb-1 block text-sm font-medium text-slate-700">Primary</label><div className="flex gap-2"><input type="color" id="primaryColor" name="primaryColor" value={theme.primaryColor} onChange={handleChange} className="h-10 w-12 rounded border border-slate-300 p-1" /><input value={theme.primaryColor} onChange={handleChange} name="primaryColor" className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 text-sm" /></div></div><div><label htmlFor="secondaryColor" className="mb-1 block text-sm font-medium text-slate-700">Secondary</label><div className="flex gap-2"><input type="color" id="secondaryColor" name="secondaryColor" value={theme.secondaryColor} onChange={handleChange} className="h-10 w-12 rounded border border-slate-300 p-1" /><input value={theme.secondaryColor} onChange={handleChange} name="secondaryColor" className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 text-sm" /></div></div></div></section>
    <section className="grid gap-5 border-t border-slate-200 pt-6 md:grid-cols-4"><div><label htmlFor="layoutHeader" className="mb-1 block text-sm font-medium text-slate-700">Layout Header</label><select id="layoutHeader" name="layoutHeader" value={theme.layoutHeader} onChange={handleChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"><option value="style-1">Style 1</option><option value="style-2">Style 2</option></select></div><div><label htmlFor="mobileHeader" className="mb-1 block text-sm font-medium text-slate-700">Mobile</label><select id="mobileHeader" name="mobileHeader" value={theme.mobileHeader} onChange={handleChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"><option value="style-1">Style 1</option><option value="style-2">Style 2</option></select></div><div><label htmlFor="headerStyle" className="mb-1 block text-sm font-medium text-slate-700">Header</label><select id="headerStyle" name="headerStyle" value={theme.headerStyle} onChange={handleChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"><option value="style-1">Style 1</option><option value="style-2">Style 2</option><option value="style-3">Style 3</option></select></div><div><label htmlFor="homeStyle" className="mb-1 block text-sm font-medium text-slate-700">Home</label><select id="homeStyle" name="homeStyle" value={theme.homeStyle} onChange={handleChange} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"><option value="home-1">Home 1</option><option value="home-2">Home 2</option><option value="home-3">Home 3</option></select></div></section>
    <section className="space-y-5 border-t border-slate-200 pt-6"><h2 className="text-lg font-semibold text-slate-900">Logos</h2><div className="grid gap-5 md:grid-cols-2"><ImageField name="logo" label="Logo" size="270 x 110 px" value={theme.logo} onChange={handleChange} /><ImageField name="transparentLogo" label="Transparent Logo" size="270 x 110 px" value={theme.transparentLogo} onChange={handleChange} /><ImageField name="favicon" label="Favicon" size="64 x 64 px" value={theme.favicon} onChange={handleChange} /></div></section>
    <section className="space-y-5 border-t border-slate-200 pt-6"><h2 className="text-lg font-semibold text-slate-900">Images</h2><ImageField name="homeBackgroundImage" label="Home Background Image" size="1920 x 700 px" value={theme.homeBackgroundImage} onChange={handleChange} /></section>
    <div className="flex justify-end border-t border-slate-200 pt-6"><button type="submit" disabled={saving} className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-50">{saving ? "Saving..." : "Save Theme"}</button></div>
  </form>;
}
