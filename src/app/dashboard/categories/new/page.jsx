import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";
import CategoryForm from "@/components/admin/categories/CategoryForm";

export const metadata = { title: "Add Category | CodiceSconto Admin" };

export default async function NewCategoryPage() {
  await requireRole([ROLES.ADMIN, ROLES.ADMINISTRATION]);
  return <CategoryForm />;
}
