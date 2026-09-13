import Link from "next/link";
import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";
import { backendFetch } from "@/lib/backendFetch";
import UserTable from "@/components/admin/users/UserTable";

export const metadata = { title: "Users | CodiceSconto Admin" };

export default async function UsersPage() {
  await requireRole([ROLES.ADMIN, ROLES.ADMINISTRATION]);
  const res = await backendFetch("/api/users");
  const data = res.ok ? await res.json() : { users: [] };
  const rawUsers = data.users || [];

  const users = rawUsers.map((u) => {
    let role = "subscribor";
    if (u.role === "ADMIN" || u.role === "administration") role = "administration";
    else if (u.role === "EDITOR" || u.role === "editor") role = "editor";
    else if (u.role === "SUBSCRIBER" || u.role === "subscribor") role = "subscribor";

    return {
      ...u,
      _id: u._id || u.id,
      id: u.id || u._id,
      role,
      status: u.status ? u.status.toLowerCase() : "enabled",
      createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : null,
      updatedAt: u.updatedAt ? new Date(u.updatedAt).toISOString() : null,
    };
  });

  return (
    <main className="min-h-screen bg-white">
      <header className="flex flex-col gap-4 border-b border-gray-200 bg-accent-light px-4 py-6 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Users</h1>
          <p className="mt-1 text-sm text-gray-600">Manage user access, roles, verification, and status.</p>
        </div>
        <Link
          href="/dashboard/users/new"
          className="rounded-lg bg-accent px-4 py-2 text-center text-sm font-medium text-white hover:bg-accent-hover"
        >
          Add New
        </Link>
      </header>
      <section className="px-4 py-8 md:px-8">
        <UserTable users={users} />
      </section>
    </main>
  );
}
