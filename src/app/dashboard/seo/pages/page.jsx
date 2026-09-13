import Link from "next/link";
import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";
import { backendFetch } from "@/lib/backendFetch";

export const metadata = { title: "Page SEO | CodiceSconto Admin" };

export default async function SeoPagesPage() {
  await requireRole([ROLES.ADMIN, ROLES.ADMINISTRATION]);

  const res = await backendFetch("/api/seo/pages");
  const data = res.ok ? await res.json() : { pages: [] };
  const rawPages = data.pages || [];

  const pages = rawPages.map((page) => ({
    ...page,
    _id: page._id || page.id,
    id: page.id || page._id,
  }));

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Page SEO</h1>
            <p className="mt-1 text-sm text-slate-600">Manage SEO metadata for public static pages.</p>
          </div>
          <Link href="/dashboard/seo/pages/new" className="rounded-lg bg-accent px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-accent-hover">
            Add SEO Page
          </Link>
        </header>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Page Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Path</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">SEO Title</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Index</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {pages.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-12 text-center text-sm text-slate-500">
                      No SEO pages found.
                    </td>
                  </tr>
                ) : (
                  pages.map((page) => (
                    <tr key={page._id} className="hover:bg-slate-50">
                      <td className="px-4 py-4 text-sm font-medium text-slate-900">{page.pageName}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{page.path}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{page.title || "—"}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{page.robots?.index ? "Yes" : "No"}</td>
                      <td className="px-4 py-4 text-sm">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${page.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"}`}>
                          {page.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <div className="flex flex-wrap items-center gap-3">
                          <Link href={`/dashboard/seo/pages/${page._id}`} className="font-medium text-slate-700 hover:text-slate-900">
                            View
                          </Link>
                          <Link href={`/dashboard/seo/pages/${page._id}/edit`} className="font-medium text-accent hover:text-accent-hover">
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
