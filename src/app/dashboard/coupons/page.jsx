import { requireAuth, requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";
import Link from "next/link";
import { backendFetch } from "@/lib/backendFetch";
import CouponTable from "./CouponTable";

export const metadata = {
  title: "Manage Coupons | CodiceSconto Admin",
};

export default async function CouponsPage() {
  const user = await requireAuth();
  await requireRole([ROLES.ADMIN, ROLES.ADMINISTRATION]);

  const res = await backendFetch("/api/coupons");
  const data = res.ok ? await res.json() : { data: [] };
  const rawCoupons = data.data || data.coupons || [];

  // Serialize for Client Component
  const coupons = rawCoupons.map((c) => ({
    _id: c._id || c.id,
    id: c.id || c._id,
    store: c.store
      ? {
          _id: c.store._id || c.store.id,
          id: c.store.id || c.store._id,
          name: c.store.name,
          slug: c.store.slug,
        }
      : null,
    type: c.type ? c.type.toLowerCase() : "code",
    title: c.title,
    description: c.description,
    discount: c.discount,
    code: c.code,
    couponUrl: c.couponUrl,
    terms: c.terms,
    isActive: c.isActive,
    isFeatured: c.isFeatured,
    homepageSection: c.homepageSection ? c.homepageSection.toLowerCase() : "featured",
    image: c.image || "/images/placeholder.png",
    labelTop: c.labelTop || "",
    labelBottom: c.labelBottom || "",
    startsAt: c.startsAt ? new Date(c.startsAt).toISOString() : null,
    expiresAt: c.expiresAt ? new Date(c.expiresAt).toISOString() : null,
    createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : null,
  }));

  return (
    <main className="min-h-screen bg-white">
      <div className="w-full">
        <div className="px-4 md:px-8 py-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-accent-light">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manage Coupons</h1>
            <p className="text-sm text-gray-600 mt-1">Admin Dashboard / Coupons</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <Link
              href="/dashboard/coupons/new"
              className="w-full md:w-auto px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors shadow-sm text-center"
            >
              Add Coupon
            </Link>
            <Link
              href="/dashboard"
              className="w-full md:w-auto px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm text-center"
            >
              Back to Stores
            </Link>
          </div>
        </div>

        <div className="px-4 md:px-8 py-8 w-full">
          <div className="mb-6 w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">All Coupons</h2>
            <CouponTable coupons={coupons} />
          </div>
        </div>
      </div>
    </main>
  );
}
