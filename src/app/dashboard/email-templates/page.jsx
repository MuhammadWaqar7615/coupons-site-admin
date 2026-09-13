import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";
import EmailTemplateManager from "@/components/admin/email-templates/EmailTemplateManager";

export const metadata = { title: "Email Templates | CodiceSconto Admin" };

export default async function EmailTemplatesPage() {
  await requireRole([ROLES.ADMIN, ROLES.ADMINISTRATION]);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Email Templates</h1>
          <p className="mt-2 text-sm text-slate-600">Manage the messages sent for registration and password recovery.</p>
        </header>
        <EmailTemplateManager />
      </div>
    </main>
  );
}
