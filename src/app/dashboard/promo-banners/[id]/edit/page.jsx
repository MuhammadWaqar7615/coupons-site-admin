import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";
import { backendFetch } from "@/lib/backendFetch";
import PromoBannerForm from "@/components/admin/promo-banners/PromoBannerForm";

export const metadata = { title: "Edit Promo Banner | CodiceSconto Admin" };

export default async function EditPromoBannerPage({ params }) {
  await requireRole([ROLES.ADMIN, ROLES.ADMINISTRATION]);
  const { id } = await params;

  const res = await backendFetch(`/api/promo-banners/${id}`);
  if (!res.ok) notFound();

  const data = await res.json();
  const promoBanner = data.promoBanner;
  if (!promoBanner) notFound();

  return (
    <PromoBannerForm
      promoBanner={{
        ...promoBanner,
        _id: promoBanner._id || promoBanner.id,
        id: promoBanner.id || promoBanner._id,
        status: promoBanner.status ? promoBanner.status.toLowerCase() : "enabled",
      }}
    />
  );
}
