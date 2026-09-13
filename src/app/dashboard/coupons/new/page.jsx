import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";
import { backendFetch } from "@/lib/backendFetch";
import CouponForm from "@/components/admin/coupons/CouponForm";

export const metadata = { title: "Add Coupon | CodiceSconto Admin" };

export default async function NewCouponPage() {
  await requireRole([ROLES.ADMIN, ROLES.ADMINISTRATION]);
  const res = await backendFetch("/api/stores?active=true");
  const data = res.ok ? await res.json() : { stores: [] };
  const rawStores = data.stores || [];

  const stores = rawStores.map((store) => ({
    _id: store._id || store.id,
    id: store.id || store._id,
    name: store.name,
  }));

  return <CouponForm stores={stores} />;
}
