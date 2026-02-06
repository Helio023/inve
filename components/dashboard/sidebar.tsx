"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  CalendarDays,
  CreditCard,
  Settings,
  Users,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "../logo";

const sidebarItems = [
  { title: "Visão Geral", href: "/dashboard", icon: LayoutDashboard },
  { title: "Meus Eventos", href: "/dashboard/events", icon: CalendarDays },
  { title: "Meus Convidados", href: "/dashboard/guests", icon: Users },
  { title: "Financeiro", href: "/dashboard/billing", icon: CreditCard },
  { title: "Configurações", href: "/dashboard/settings", icon: Settings },
];

interface SidebarProps {
  className?: string;
  setOpen?: (open: boolean) => void;
}

export function Sidebar({ className, setOpen }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  // @ts-ignore
  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";

  return (
    <nav className={cn("flex flex-col gap-2 h-full bg-white", className)}>
      {/* --- LOGO --- */}
      <div className="flex items-center gap-2 px-4 mb-6 mt-6 md:mt-2">
        <Link href="/" className="cursor-pointer flex items-center gap-2 mt-4">
          <Logo/>
        </Link>
      </div>

      {/* --- NAVEGAÇÃO PRINCIPAL --- */}
      <div className="flex flex-col gap-1 px-2 flex-1">
        {/* Bloco Administrativo (Apenas para Super Admin) */}
        {isSuperAdmin && (
          <div className="mb-4 pb-4 border-b border-slate-100">
            <p className="px-3 text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-widest">
              Administração
            </p>
            <Link
              href="/admin"
              onClick={() => setOpen && setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all duration-200",
                pathname.startsWith("/admin")
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-100",
              )}
            >
              <ShieldCheck className="h-4 w-4" />
              Painel de Controle
            </Link>
          </div>
        )}

        {/* Bloco da Agência */}
        <p className="px-3 text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-widest">
          Agência
        </p>
        
        <div className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen && setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                )}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4",
                    isActive ? "text-blue-600" : "text-slate-400",
                  )}
                />
                {item.title}
              </Link>
            );
          })}
        </div>
      </div>

     
      <div className="px-6 py-8 mt-auto border-t border-slate-50">
        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest text-center">
          v0.1.0 • QVite
        </p>
      </div>
    </nav>
  );
}