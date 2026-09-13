import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";
import { backendFetch } from "@/lib/backendFetch";
import SliderForm from "@/components/admin/sliders/SliderForm";

export const metadata = { title: "Edit Slider | CodiceSconto Admin" };

export default async function EditSliderPage({ params }) {
  await requireRole([ROLES.ADMIN, ROLES.ADMINISTRATION]);
  const { id } = await params;

  const res = await backendFetch(`/api/sliders/${id}`);
  if (!res.ok) notFound();

  const data = await res.json();
  const slider = data.slider;
  if (!slider) notFound();

  return (
    <SliderForm
      slider={{
        ...slider,
        _id: slider._id || slider.id,
        id: slider.id || slider._id,
        status: slider.status ? slider.status.toLowerCase() : "enabled",
      }}
    />
  );
}
