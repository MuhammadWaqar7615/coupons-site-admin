import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";
import RedirectForm from "@/components/admin/seo/RedirectForm";

export const metadata = { title: "Create Redirect | CodiceSconto Admin" };

export default async function NewRedirectPage() {
  await requireRole([ROLES.ADMIN, ROLES.ADMINISTRATION]);
  return <RedirectForm />;
}
