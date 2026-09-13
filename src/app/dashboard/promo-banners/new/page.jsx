import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";
import PromoBannerForm from "@/components/admin/promo-banners/PromoBannerForm";

export const metadata = { title: "Add Promo Banner | CodiceSconto Admin" };

export default async function NewPromoBannerPage() {
  await requireRole([ROLES.ADMIN, ROLES.ADMINISTRATION]);
  return <PromoBannerForm />;
}
