import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";
import { backendFetch } from "@/lib/backendFetch";
import UserForm from "@/components/admin/users/UserForm";

export const metadata = { title: "Edit User | CodiceSconto Admin" };

function serializeUser(u) {
  let role = "subscribor";
  if (u.role === "ADMIN" || u.role === "administration") role = "administration";
  else if (u.role === "EDITOR" || u.role === "editor") role = "editor";
  else if (u.role === "SUBSCRIBER" || u.role === "subscribor") role = "subscribor";

  const { passwordHash, ...safeUser } = u;
  return {
    ...safeUser,
    _id: u._id || u.id,
    id: u.id || u._id,
    role,
    status: u.status ? u.status.toLowerCase() : "enabled",
  };
}

export default async function EditUserPage({ params }) {
  await requireRole([ROLES.ADMIN, ROLES.ADMINISTRATION]);
  const { id } = await params;

  const res = await backendFetch(`/api/users/${id}`);
  if (!res.ok) notFound();

  const data = await res.json();
  const user = data.user;
  if (!user) notFound();

  return <UserForm user={serializeUser(user)} />;
}
