import Link from "next/link";
import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";
import { backendFetch } from "@/lib/backendFetch";
import MainBannerTable from "@/components/admin/main-banners/MainBannerTable";

export const metadata = { title: "Main Banner | CodiceSconto Admin" };

export default async function MainBannersPage() {
  await requireRole([ROLES.ADMIN, ROLES.ADMINISTRATION]);
  const res = await backendFetch("/api/main-banners");
  const data = res.ok ? await res.json() : { mainBanners: [] };
  const mainBanners = (data.mainBanners || []).map((banner) => ({
    ...banner,
    _id: banner._id || banner.id,
    id: banner.id || banner._id,
    status: banner.status ? banner.status.toLowerCase() : "enabled",
  }));

  return (
    <main className="min-h-screen bg-white">
      <header className="flex flex-col gap-4 border-b border-gray-200 bg-accent-light px-4 py-6 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Main Banner</h1>
          <p className="mt-1 text-sm text-gray-600">Manage the banner displayed below the homepage categories.</p>
        </div>
        <Link href="/dashboard/main-banners/new" className="rounded-lg bg-accent px-4 py-2 text-center text-sm font-medium text-white hover:bg-accent-hover">
          Add Main Banner
        </Link>
      </header>
      <section className="px-4 py-8 md:px-8">
        <MainBannerTable mainBanners={mainBanners} />
      </section>
    </main>
  );
}
