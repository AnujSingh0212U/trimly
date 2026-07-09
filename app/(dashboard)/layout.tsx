import { DashboardSidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <DashboardSidebar />
      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-8 pt-16 lg:pt-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
