import { requireAuth, requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";
import Link from "next/link";
import { backendFetch } from "@/lib/backendFetch";
import StoreTable from "./StoreTable";
import DashboardSearch from "./DashboardSearch";
import LogoutButton from "@/components/admin/LogoutButton";

export const metadata = {
  title: "Admin Dashboard | CodiceSconto",
  description: "Secure admin dashboard.",
};

export default async function DashboardPage({ searchParams }) {
  // This will redirect to /login if unauthenticated
  const user = await requireAuth();

  // This will redirect to /dashboard (or show error) if wrong role
  await requireRole([ROLES.ADMIN, ROLES.ADMINISTRATION]);

  const sp = await Promise.resolve(searchParams);
  const search = sp?.search || "";
  const letter = sp?.letter || "";

  const query = new URLSearchParams();
  if (search) query.set("search", search);
  if (letter) query.set("letter", letter);
  const qs = query.toString() ? `?${query.toString()}` : "";

  const res = await backendFetch(`/api/stores${qs}`);
  const data = res.ok ? await res.json() : { stores: [] };
  const rawStores = data.stores || [];

  // Serialize stores for Client Component
  const stores = rawStores.map((s) => ({
    _id: s._id || s.id,
    id: s.id || s._id,
    name: s.name,
    slug: s.slug,
    logoPath: s.logoPath,
    isActive: s.isActive,
  }));

  return (
    <main className="min-h-screen bg-white">
      <div className="w-full">
        <div className="px-4 md:px-8 py-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-accent-light">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Welcome, {user.role}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <Link
              href="/dashboard/coupons"
              className="px-4 py-2 bg-white border border-accent text-accent rounded-lg text-sm font-medium hover:bg-accent-light transition-colors shadow-sm text-center flex-1 md:flex-none"
            >
              Manage Coupons
            </Link>
            <Link
              href="/dashboard/stores/new"
              className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors shadow-sm text-center flex-1 md:flex-none"
            >
              Add Store
            </Link>
            <div className="flex-1 md:flex-none">
              <LogoutButton />
            </div>
          </div>
        </div>

        <div className="px-4 md:px-8 py-8 w-full">
          <div className="mb-6 w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Store Management</h2>
            <DashboardSearch />
            <StoreTable stores={stores} />
          </div>
        </div>
      </div>
    </main>
  );
}
