"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, Sparkles, ChevronRight } from "lucide-react";
import { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetHeader, 
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { motion } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const NavItems = [
    { label: "Funcionalidades", href: "#features" },
   
    { label: "Preços", href: "#pricing" },
  ];

 
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    e.preventDefault(); 
    setIsOpen(false);   

    setTimeout(() => {
      const targetId = href.replace("#", "");
      const elem = document.getElementById(targetId);
      
      if (elem) {
        elem.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100); 
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    show: { x: 0, opacity: 1 },
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md transition-all">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 group">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white transition-transform group-hover:scale-110 group-hover:rotate-3">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="tracking-tight">Invite SaaS</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NavItems.map((item) => (
            <a 
              key={item.href} 
              href={item.href} 
              onClick={(e) => handleScroll(e, item.href)}
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors relative group cursor-pointer"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full rounded-full" />
            </a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-slate-600 hover:bg-slate-100">Entrar</Button>
          </Link>
          <Link href="/register">
            <Button className="bg-slate-900 hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
              Começar Grátis
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-slate-900">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0 border-l border-slate-100 flex flex-col">
              
              <SheetHeader className="px-6 py-6 border-b border-slate-100 text-left">
                <SheetTitle className="flex items-center gap-2 text-xl font-bold">
                   <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                      <Sparkles className="w-4 h-4" />
                   </div>
                   Invite SaaS
                </SheetTitle>
                <SheetDescription className="text-xs text-slate-400">
                  Navegue pela plataforma.
                </SheetDescription>
              </SheetHeader>

              <div className="flex-1 flex flex-col bg-slate-50/30 overflow-y-auto">
                {/* Lista de Links Animada */}
                <motion.div 
                  className="flex flex-col gap-2 p-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                >
                  {NavItems.map((item) => (
                    <motion.div key={item.href} variants={itemVariants}>
                      <a 
                        href={item.href} 
                        onClick={(e) => handleScroll(e, item.href)}
                        className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-100 shadow-sm text-slate-700 font-medium hover:border-blue-200 hover:text-blue-600 transition-all active:scale-95 cursor-pointer"
                      >
                        {item.label}
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      </a>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Rodapé do Menu */}
                <div className="mt-auto p-6 border-t border-slate-200 bg-white">
                  <div className="flex flex-col gap-3">
                    <Link href="/register" onClick={() => setIsOpen(false)} className="w-full">
                      <Button size="lg" className="w-full bg-slate-900 shadow-lg text-base h-12 font-bold">
                        Criar Conta Grátis
                      </Button>
                    </Link>
                    <Link href="/login" onClick={() => setIsOpen(false)} className="w-full">
                      <Button variant="outline" size="lg" className="w-full text-base h-12">
                        Já tenho conta
                      </Button>
                    </Link>
                  </div>
                  <p className="text-center text-[10px] text-slate-400 mt-4">
                    © 2026 Invite SaaS. Feito em Moçambique.
                  </p>
                </div>
              </div>

            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}