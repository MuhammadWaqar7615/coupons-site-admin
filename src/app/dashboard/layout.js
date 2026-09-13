import Sidebar from "@/components/admin/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 lg:flex">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-x-hidden pb-10 pt-16 lg:pt-0">
        <div className="mx-auto w-full max-w-[1600px]">{children}</div>
      </main>
    </div>
  );
}