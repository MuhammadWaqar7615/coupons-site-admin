import { getSession } from "./session";
import { redirect } from "next/navigation";
import { ROLES } from "./roles";

export function normalizeRole(role) {
  if (!role) return "editor";
  const roleMap = {
    admin: "administration",
    administration: "administration",
    editor: "editor",
    subscriber: "subscribor",
    subscribor: "subscribor",
  };
  return roleMap[String(role).toLowerCase()] || "editor";
}

export async function requireAuth() {
  const session = await getSession();

  if (!session || !session.user) {
    redirect("/account/login");
  }

  return session.user;
}

export async function requireRole(allowedRoles) {
  const user = await requireAuth();

  const normalizedAllowed = (Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]).map((r) =>
    normalizeRole(r)
  );
  const currentRole = normalizeRole(user.role);

  const hasAccess = normalizedAllowed.includes(currentRole);

  if (!hasAccess) {
    redirect("/account/login?error=forbidden");
  }

  return user;
}
