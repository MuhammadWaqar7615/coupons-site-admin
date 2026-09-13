import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";
import { backendFetch } from "@/lib/backendFetch";
import BadgeForm from "@/components/admin/badges/BadgeForm";

export const metadata = { title: "Edit Badge | CodiceSconto Admin" };

export default async function EditBadgePage({ params }) {
  await requireRole([ROLES.ADMIN, ROLES.ADMINISTRATION]);
  const { id } = await params;

  const res = await backendFetch(`/api/badges/${id}`);
  if (!res.ok) notFound();

  const data = await res.json();
  const badge = data.badge;
  if (!badge) notFound();

  return <BadgeForm badge={{ ...badge, _id: badge._id || badge.id, id: badge.id || badge._id }} />;
}
