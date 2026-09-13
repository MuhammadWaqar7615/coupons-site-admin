import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";
import SeoPageForm from "@/components/admin/seo/SeoPageForm";

export const metadata = { title: "Create Page SEO | CodiceSconto Admin" };

export default async function NewSeoPagePage() {
  await requireRole([ROLES.ADMIN, ROLES.ADMINISTRATION]);
  return <SeoPageForm />;
}
