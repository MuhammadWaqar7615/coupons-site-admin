import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";
import { backendFetch } from "@/lib/backendFetch";
import MainBannerForm from "@/components/admin/main-banners/MainBannerForm";

export const metadata = { title: "Edit Main Banner | CodiceSconto Admin" };

export default async function EditMainBannerPage({ params }) {
  await requireRole([ROLES.ADMIN, ROLES.ADMINISTRATION]);
  const { id } = await params;
  const res = await backendFetch(`/api/main-banners/${id}`);
  if (!res.ok) notFound();

  const data = await res.json();
  const mainBanner = data.mainBanner;
  if (!mainBanner) notFound();

  return (
    <MainBannerForm
      mainBanner={{
        ...mainBanner,
        _id: mainBanner._id || mainBanner.id,
        id: mainBanner.id || mainBanner._id,
        status: mainBanner.status ? mainBanner.status.toLowerCase() : "enabled",
      }}
    />
  );
}
