import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";
import RobotsForm from "@/components/admin/seo/RobotsForm";

export const metadata = { title: "Robots.txt | CodiceSconto Admin" };

export default async function RobotsPage() {
  await requireRole([ROLES.ADMIN, ROLES.ADMINISTRATION]);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Robots.txt</h1>
          <p className="mt-2 text-sm text-slate-600">Manage crawler access and the robots.txt output used by search engines.</p>
        </header>

        <RobotsForm />
      </div>
    </main>
  );
}
