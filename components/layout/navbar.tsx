"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, LayoutDashboard, ArrowRight, ChevronRight } from "lucide-react";
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
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsOpen(false);
    const element = document.getElementById(id.replace("#", ""));
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const NavItems = [
    { label: "Funcionalidades", href: "#features" },
    { label: "Preços", href: "#pricing" },
  ];

  return (
    <nav className={cn(
      "fixed top-0 w-full transition-all duration-500 border-b z-[40]", 
      scrolled 
        ? "bg-white/95 backdrop-blur-md border-slate-200 py-3 shadow-sm" 
        : "bg-transparent border-transparent py-6"
    )}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        
        {/* LOGO PRINCIPAL */}
        <Link href="/" className="transition-transform active:scale-95">
          <Logo />
        </Link>

        {/* DESKTOP NAV (CENTRO) */}
        <div className="hidden md:flex items-center gap-2 bg-slate-100/50 p-1 rounded-full border border-slate-200/50 backdrop-blur-sm">
          {NavItems.map((item) => (
            <a 
              key={item.href} href={item.href} 
              onClick={(e) => scrollToSection(e, item.href)}
              className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-600 transition-all rounded-full hover:bg-white"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* ACTIONS (DESKTOP) */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <Link href="/dashboard">
              <Button className="bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest px-6 h-11 shadow-xl transition-all active:scale-95">
                <LayoutDashboard className="w-4 h-4 mr-2" /> Meu Painel
              </Button>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-600 px-4">Entrar</Link>
              <Link href="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest px-8 h-11 shadow-lg shadow-blue-200 active:scale-95 transition-all">
                  Criar Conta
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* MOBILE MENU */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100">
                <Menu className="w-6 h-6 text-slate-900" />
              </Button>
            </SheetTrigger>
            
            <SheetContent 
              side="right" 
              className="w-full p-0 border-none bg-white z-[200] outline-none"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>Menu Qonvip</SheetTitle>
                <SheetDescription>Navegação mobile</SheetDescription>
              </SheetHeader>

              {/* Removido o AnimatePresence e a condição condicional de renderização */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: "circOut" }}
                className="flex flex-col h-full bg-white"
              >
                <div className="flex items-center justify-between p-6 border-b border-slate-50">
                  <Logo /> 
                </div>
                
                {/* Links Mobile */}
                <div className="flex-1 p-8 space-y-10">
                  <div className="flex flex-col gap-6">
                    {NavItems.map((item, idx) => (
                      <motion.a 
                        key={item.href} 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + idx * 0.05 }}
                        href={item.href} 
                        onClick={(e) => scrollToSection(e, item.href)}
                        className="text-4xl font-black text-slate-900 hover:text-blue-600 transition-colors flex items-center justify-between group"
                      >
                        {item.label} 
                        <ChevronRight className="w-8 h-8 text-slate-100 group-hover:text-blue-200 transition-all" />
                      </motion.a>
                    ))}
                  </div>
                </div>

                {/* Footer Actions Mobile */}
                <div className="p-8 border-t border-slate-50 bg-slate-50/50 space-y-4">
                  {session ? (
                    <Link href="/dashboard" className="w-full" onClick={() => setIsOpen(false)}>
                      <Button size="lg" className="w-full h-16 rounded-3xl bg-slate-900 text-white font-black uppercase tracking-widest text-xs shadow-2xl">
                        Aceder ao Painel <ArrowRight className="ml-3 w-5 h-5" />
                      </Button>
                    </Link>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <Link href="/register" className="w-full" onClick={() => setIsOpen(false)}>
                        <Button size="lg" className="w-full h-16 rounded-3xl bg-blue-600 text-white font-black uppercase tracking-widest text-xs shadow-2xl">
                          Começar Agora Grátis
                        </Button>
                      </Link>
                      <Link href="/login" className="w-full text-center py-2" onClick={() => setIsOpen(false)}>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                          Já tenho conta • Entrar
                        </span>
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}