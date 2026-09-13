import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";
import SitemapForm from "@/components/admin/seo/SitemapForm";

export const metadata = { title: "Sitemap | CodiceSconto Admin" };

export default async function SitemapPage() {
  await requireRole([ROLES.ADMIN, ROLES.ADMINISTRATION]);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Sitemap</h1>
          <p className="mt-2 text-sm text-slate-600">Configure the XML sitemap generation and include the public pages you want to expose to search engines.</p>
        </header>

        <SitemapForm />
      </div>
    </main>
  );
}
