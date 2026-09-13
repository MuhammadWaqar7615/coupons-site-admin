import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";
import TranslationEditor from "@/components/admin/translations/TranslationEditor";

export const metadata = { title: "Translations | CodiceSconto Admin" };

export default async function TranslationsPage() {
  await requireRole([ROLES.ADMIN, ROLES.ADMINISTRATION]);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Translations</h1>
          <p className="mt-2 text-sm text-slate-600">Manage the website text shown to customers. Empty translations continue to display the English source text.</p>
        </header>
        <TranslationEditor />
      </div>
    </main>
  );
}
