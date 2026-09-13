import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";
import BadgeForm from "@/components/admin/badges/BadgeForm";

export const metadata = { title: "Add Badge | CodiceSconto Admin" };

export default async function NewBadgePage() {
  await requireRole([ROLES.ADMIN, ROLES.ADMINISTRATION]);
  return <BadgeForm />;
}
