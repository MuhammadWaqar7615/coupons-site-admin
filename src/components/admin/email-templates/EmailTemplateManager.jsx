"use client";

import { useEffect, useMemo, useState } from "react";

const emptyTemplate = { templateKey: "", title: "", fromName: "CodiceSconto", sendAsPlainText: false, status: "enabled", subject: "", message: "" };

export default function EmailTemplateManager() {
  const [templates, setTemplates] = useState([]);
  const [selected, setSelected] = useState(emptyTemplate);
  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState("10");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetch("/api/email-templates")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to load email templates.");
        setTemplates(data.templates);
        setSelected(data.templates[0] || emptyTemplate);
      })
      .catch((error) => setMessage({ type: " error", text: error.message }))
      .finally(() => setLoading(false));
  }, []);

  const matchingTemplates = useMemo(() => {
    const search = query.trim().toLowerCase();
    return search ? templates.filter((template) => template.title.toLowerCase().includes(search) || template.status.includes(search)) : templates;
  }, [query, templates]);

  const filtered = matchingTemplates.slice(0, Number(pageSize));
  const visibleTemplates = filtered;
  const updateSelected = (event) => {
    const { name, value, type, checked } = event.target;
    setSelected((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const saveTemplate = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const response = await fetch(`/api/email-templates/${selected.templateKey}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(selected) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to save email template.");
      setTemplates((current) => current.map((template) => template.templateKey === selected.templateKey ? { ...template, ...selected } : template));
      setMessage({ type: "success", text: data.message });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm text-slate-600">Loading email templates...</p></div>;

  return <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(420px,1.2fr)]">
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between"><label className="flex items-center gap-2 text-sm text-slate-600">Show <select value={pageSize} onChange={(event) => setPageSize(event.target.value)} className="rounded-md border border-slate-300 bg-white px-2 py-1"><option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="100">100</option></select> entries</label><label className="flex items-center gap-2 text-sm text-slate-600">Search:<input value={query} onChange={(event) => setQuery(event.target.value)} className="w-32 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900" /></label></div><div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-200"><thead className="bg-slate-50"><tr>{["Id", "Title", "Status", "Actions"].map((heading) => <th key={heading} className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{visibleTemplates.map((template, index) => <tr key={template.templateKey} className="hover:bg-slate-50"><td className="px-5 py-4 text-sm text-slate-500">{index + 1}</td><td className="px-5 py-4 text-sm font-semibold text-slate-900">{template.title}</td><td className="px-5 py-4"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${template.status === "enabled" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>{template.status === "enabled" ? "Enabled" : "Disabled"}</span></td><td className="px-5 py-4"><button type="button" onClick={() => { setSelected(template); setMessage({ type: "", text: "" }); }} className="font-medium text-accent hover:underline">Edit</button></td></tr>)}{visibleTemplates.length === 0 && <tr><td colSpan="4" className="px-5 py-10 text-center text-sm text-slate-500">Nothing found!</td></tr>}</tbody></table></div><div className="border-t border-slate-200 px-5 py-4 text-sm text-slate-500">Showing {visibleTemplates.length ? 1 : 0} to {visibleTemplates.length} of {filtered.length} entries</div></section>
    <form onSubmit={saveTemplate} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-5 flex items-center justify-between gap-3"><h2 className="text-xl font-semibold text-slate-900">Edit</h2>{message.text && <p className={`text-sm ${message.type === "success" ? "text-green-700" : "text-red-700"}`}>{message.text}</p>}</div><h3 className="mb-5 text-base font-semibold text-slate-800">{selected.title}</h3><div className="space-y-5"><div><label htmlFor="fromName" className="mb-1 block text-sm font-medium text-slate-700">From Name</label><input id="fromName" name="fromName" value={selected.fromName} onChange={updateSelected} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" /></div><div className="flex flex-wrap gap-6 border-y border-slate-200 py-4"><label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" name="sendAsPlainText" checked={selected.sendAsPlainText} onChange={updateSelected} />Send as plain text</label><span className="text-sm text-slate-500">HTML email: {selected.sendAsPlainText ? "No" : "Yes"}</span></div><div><label htmlFor="status" className="mb-1 block text-sm font-medium text-slate-700">Status</label><select id="status" name="status" value={selected.status} onChange={updateSelected} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"><option value="enabled">Enabled</option><option value="disabled">Disabled</option></select></div><div><label htmlFor="subject" className="mb-1 block text-sm font-medium text-slate-700">Subject</label><input id="subject" name="subject" required value={selected.subject} onChange={updateSelected} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" /></div><div><label htmlFor="message" className="mb-1 block text-sm font-medium text-slate-700">Message</label><textarea id="message" name="message" required rows="12" value={selected.message} onChange={updateSelected} className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900" /><p className="mt-2 text-xs text-slate-500">Placeholders: {"{{name}}"}, {"{{email}}"}, {"{{resetLink}}"}</p></div></div><div className="mt-6 flex justify-end border-t border-slate-200 pt-5"><button type="submit" disabled={saving || !selected.templateKey} className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-50">{saving ? "Saving..." : "Save Template"}</button></div></form>
  </div>;
}
