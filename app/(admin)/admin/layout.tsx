import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { UserNav } from "@/components/dashboard/user-nav";
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50/50">
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 border-r border-slate-200 bg-white">
        <Sidebar />
      </aside>

      <main className="flex-1 flex flex-col md:pl-64 h-full transition-all">
        
        <header className="h-16 border-b bg-white/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-4 md:px-6 shadow-sm">
          
          <div className="flex items-center gap-3">
            <MobileSidebar />

            <div className="font-semibold text-slate-700 md:hidden">
              Invite SaaS
            </div>
            
            <div className="hidden md:block font-medium text-slate-600">
              Painel de Controle
            </div>
          </div>

          <div className="flex items-center gap-4">
            <UserNav user={session.user} />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}