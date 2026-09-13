import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";
import { backendFetch } from "@/lib/backendFetch";
import SeoPageForm from "@/components/admin/seo/SeoPageForm";

export const metadata = { title: "Edit Page SEO | CodiceSconto Admin" };

export default async function EditSeoPagePage({ params }) {
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

  return <SeoPageForm seoPage={{ ...seoPage, _id: seoPage._id || seoPage.id, id: seoPage.id || seoPage._id }} />;
}
