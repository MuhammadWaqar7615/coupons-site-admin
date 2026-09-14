import Sidebar from "@/components/admin/Sidebar";
import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";

export default async function DashboardLayout({ children }) {
  await requireRole([ROLES.ADMIN, ROLES.ADMINISTRATION]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 lg:flex">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-x-hidden pb-10 pt-16 lg:pt-0">
        <div className="mx-auto w-full max-w-[1600px]">{children}</div>
      </main>
    </div>
  );
}