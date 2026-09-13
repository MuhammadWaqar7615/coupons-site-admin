import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";
import GlobalSeoForm from "@/components/admin/seo/GlobalSeoForm";

export const metadata = { title: "Global SEO | CodiceSconto Admin" };

export default async function GlobalSeoPage() {
  await requireRole([ROLES.ADMIN, ROLES.ADMINISTRATION]);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Global SEO</h1>
          <p className="mt-2 text-sm text-slate-600">
            Configure default website metadata, social sharing fields, and branding values used across public pages.
          </p>
        </header>

        <GlobalSeoForm />
      </div>
    </main>
  );
}
