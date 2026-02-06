"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  Sparkles, 
  ChevronRight, 
  LayoutDashboard, 
  UserCircle,
  X,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetHeader, 
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Logo } from "../logo";

export function Navbar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Monitoriza o scroll para mudar o estilo da navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";

  const NavItems = [
    { label: "Funcionalidades", href: "#features" },
    { label: "Preços", href: "#pricing" },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    e.preventDefault();
    setIsOpen(false);

    const targetId = href.replace("#", "");
    const elem = document.getElementById(targetId);
    
    if (elem) {
      const offset = 80; // Altura da navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = elem.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav 
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300 border-b",
        scrolled 
          ? "bg-white/80 backdrop-blur-md border-slate-200 py-3" 
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        
     
        <Link href="/">
          <Logo />
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-1">
          {NavItems.map((item) => (
            <a 
              key={item.href} 
              href={item.href} 
              onClick={(e) => handleScroll(e, item.href)}
              className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-all rounded-full hover:bg-blue-50/50"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* DESKTOP ACTIONS (AUTH AWARE) */}
        <div className="hidden md:flex items-center gap-3">
          {status === "loading" ? (
            <div className="h-9 w-20 bg-slate-100 animate-pulse rounded-lg" />
          ) : session ? (
            <Link href={isSuperAdmin ? "/admin" : "/dashboard"}>
              <Button className="bg-slate-900 hover:bg-slate-800 rounded-xl font-bold gap-2 px-6">
                <LayoutDashboard className="w-4 h-4" />
                Painel {isSuperAdmin && "(Admin)"}
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="font-bold text-slate-600">Entrar</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 rounded-xl font-bold px-6">
                  Começar Grátis
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU TRIGGER */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100">
                <Menu className="w-6 h-6 text-slate-900" />
              </Button>
            </SheetTrigger>
            
            <SheetContent side="right" className="w-full sm:w-[400px] p-0 border-l border-slate-100 flex flex-col">
              
              <SheetHeader className="px-6 py-8 border-b border-slate-100 text-left bg-slate-50/50">
                <SheetTitle className="flex items-center gap-2 text-2xl font-black">
                   <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                      <Sparkles className="w-5 h-5 fill-current" />
                   </div>
                   Qonvip
                </SheetTitle>
                <SheetDescription className="text-sm font-medium text-slate-500">
                  SaaS de Convites Digitais Interativos.
                </SheetDescription>
              </SheetHeader>

              <div className="flex-1 flex flex-col overflow-y-auto p-6 space-y-6">
                
                {/* LINKS DE NAVEGAÇÃO MOBILE */}
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4">Menu</p>
                  {NavItems.map((item) => (
                    <a 
                      key={item.href} 
                      href={item.href} 
                      onClick={(e) => handleScroll(e, item.href)}
                      className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 text-slate-700 font-bold hover:border-blue-200 hover:text-blue-600 transition-all active:scale-[0.98]"
                    >
                      {item.label}
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                    </a>
                  ))}
                </div>

                {/* BOTÕES DE ACÇÃO MOBILE */}
                <div className="pt-6 border-t border-slate-100">
                  {session ? (
                    <Link href={isSuperAdmin ? "/admin" : "/dashboard"} onClick={() => setIsOpen(false)}>
                       <Button size="lg" className="w-full bg-slate-900 h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl">
                         Ir para o Painel
                         <ArrowRight className="ml-2 w-5 h-5" />
                       </Button>
                    </Link>
                  ) : (
                    <div className="grid gap-4">
                       <Link href="/register" onClick={() => setIsOpen(false)}>
                          <Button size="lg" className="w-full bg-blue-600 h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl">
                            Criar Conta Grátis
                          </Button>
                       </Link>
                       <Link href="/login" onClick={() => setIsOpen(false)}>
                          <Button variant="outline" size="lg" className="w-full h-14 rounded-2xl font-bold border-slate-200">
                            Fazer Login
                          </Button>
                       </Link>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-8 text-center bg-slate-50 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  © 2026 Qonvip • Feito em Moçambique
                </p>
              </div>

            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}