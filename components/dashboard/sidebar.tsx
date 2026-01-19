'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react"; // <--- Importar hook de sessão
import { 
  LayoutDashboard, 
  CalendarDays, 
  CreditCard, 
  Settings, 
  Palette,
  Users,
  ShieldCheck // <--- Ícone para o Admin
} from "lucide-react";

// Itens comuns a todos
const sidebarItems = [
  { title: "Visão Geral", href: "/dashboard", icon: LayoutDashboard },
  { title: "Meus Eventos", href: "/dashboard/events", icon: CalendarDays },
  { title: "Meus Convidados", href: "/dashboard/guests", icon: Users },
  { title: "Templates", href: "/dashboard/templates", icon: Palette },
  { title: "Financeiro", href: "/dashboard/billing", icon: CreditCard },
  { title: "Configurações", href: "/dashboard/settings", icon: Settings },
];

interface SidebarProps {
  className?: string;
  setOpen?: (open: boolean) => void;
}

export function Sidebar({ className, setOpen }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession(); // <--- Pegar dados do usuário

  // @ts-ignore (Se o TS reclamar do role)
  const isSuperAdmin = session?.user?.role === 'SUPER_ADMIN';

  return (
    <nav className={cn("flex flex-col gap-2 h-full bg-white", className)}>
      <div className="flex items-center gap-2 px-4 mb-6 mt-6 md:mt-2">
        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
          I
        </div>
        <span className="font-bold text-xl text-slate-800 tracking-tight">
          Invite SaaS
        </span>
      </div>

      <div className="flex flex-col gap-1 px-2 flex-1">
        {/* --- ÁREA EXCLUSIVA SUPER ADMIN --- */}
        {isSuperAdmin && (
          <div className="mb-4 pb-4 border-b border-slate-100">
             <p className="px-3 text-[10px] uppercase font-bold text-slate-400 mb-1">Administração</p>
             <Link
              href="/admin"
              onClick={() => setOpen && setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all duration-200",
                pathname.startsWith('/admin')
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-100"
              )}
            >
              <ShieldCheck className="h-4 w-4" />
              Painel Super Admin
            </Link>
          </div>
        )}

        {/* ITENS NORMAIS */}
        <p className="px-3 text-[10px] uppercase font-bold text-slate-400 mb-1">Agência</p>
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen && setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className={cn("h-4 w-4", isActive ? "text-blue-600" : "text-slate-500")} />
              {item.title}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto px-4 pb-6">
        {/* Footer do Plano (Pode esconder pro admin se quiser, ou mostrar "Plano Infinito") */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
           {isSuperAdmin ? (
             <>
               <p className="text-xs text-slate-500 font-medium">Status</p>
               <p className="text-sm font-bold text-blue-700">Modo Deus ⚡</p>
             </>
           ) : (
             <>
               <div className="flex justify-between items-center mb-2">
                 <p className="text-xs text-slate-500 font-medium">Plano Atual</p>
                 <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">FREE</span>
               </div>
               <p className="text-sm font-bold text-slate-800">Freelancer</p>
               <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-green-500 h-full w-[40%]"></div>
               </div>
               <p className="text-[10px] text-slate-400 mt-1">2/5 Eventos usados</p>
             </>
           )}
        </div>
      </div>
    </nav>
  );
}