import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";
import UserForm from "@/components/admin/users/UserForm";

export const metadata = { title: "Add User | CodiceSconto Admin" };

export default async function NewUserPage() {
  await requireRole([ROLES.ADMIN, ROLES.ADMINISTRATION]);
  return <UserForm />;
}
