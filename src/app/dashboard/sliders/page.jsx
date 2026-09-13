import Link from "next/link";
import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";
import { backendFetch } from "@/lib/backendFetch";
import SliderTable from "@/components/admin/sliders/SliderTable";

export const metadata = { title: "Sliders | CodiceSconto Admin" };

export default async function SlidersPage() {
  await requireRole([ROLES.ADMIN, ROLES.ADMINISTRATION]);
  const res = await backendFetch("/api/sliders");
  const data = res.ok ? await res.json() : { sliders: [] };
  const rawSliders = data.sliders || [];

  const sliders = rawSliders.map((slider) => ({
    ...slider,
    _id: slider._id || slider.id,
    id: slider.id || slider._id,
    status: slider.status ? slider.status.toLowerCase() : "enabled",
  }));

  return (
    <main className="min-h-screen bg-white">
      <header className="flex flex-col gap-4 border-b border-gray-200 bg-accent-light px-4 py-6 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Sliders</h1>
          <p className="mt-1 text-sm text-gray-600">Manage homepage slider content.</p>
        </div>
        <Link
          href="/dashboard/sliders/new"
          className="rounded-lg bg-accent px-4 py-2 text-center text-sm font-medium text-white hover:bg-accent-hover"
        >
          Add Slider
        </Link>
      </header>
      <section className="px-4 py-8 md:px-8">
        <SliderTable sliders={sliders} />
      </section>
    </main>
  );
}
