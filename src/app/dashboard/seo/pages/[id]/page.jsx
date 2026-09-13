import Link from "next/link";
import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";
import { backendFetch } from "@/lib/backendFetch";

export const metadata = { title: "View Page SEO | CodiceSconto Admin" };

export default async function ViewSeoPagePage({ params }) {
  await requireRole([ROLES.ADMIN, ROLES.ADMINISTRATION]);
  const { id } = await params;

  const res = await backendFetch(`/api/seo/pages/${id}`);
  const data = res.ok ? await res.json() : null;
  const seoPage = data?.page;

  if (!seoPage) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          SEO page not found.
        </div>
      </main>
    );
  }

  const page = { ...seoPage, _id: seoPage._id || seoPage.id, id: seoPage.id || seoPage._id };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{page.pageName}</h1>
            <p className="mt-1 text-sm text-slate-600">{page.path}</p>
          </div>
          <div className="flex gap-3">
            <Link href={`/dashboard/seo/pages/${page._id}/edit`} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
              Edit
            </Link>
            <Link href="/dashboard/seo/pages" className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-hover">
              Back to list
            </Link>
          </div>
        </header>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">SEO Title</p>
              <p className="mt-2 text-base text-slate-900">{page.title || "—"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Status</p>
              <p className="mt-2 text-base text-slate-900">{page.isActive ? "Active" : "Inactive"}</p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Meta Description</p>
            <p className="mt-2 text-base text-slate-700">{page.description || "—"}</p>
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Keywords</p>
            <p className="mt-2 text-base text-slate-700">
              {Array.isArray(page.keywords) && page.keywords.length ? page.keywords.join(", ") : "—"}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
