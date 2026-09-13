import { requireRole } from "@/lib/auth/auth";
import { ROLES } from "@/lib/auth/roles";
import SliderForm from "@/components/admin/sliders/SliderForm";

export const metadata = { title: "Add Slider | CodiceSconto Admin" };

export default async function NewSliderPage() {
  await requireRole([ROLES.ADMIN, ROLES.ADMINISTRATION]);
  return <SliderForm />;
}
