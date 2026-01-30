'use client';

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetTitle,
  SheetDescription 
} from "@/components/ui/sheet";
import { Sidebar } from "@/components/dashboard/sidebar";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Fecha o menu automaticamente quando a rota muda (navegação)
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-slate-600 hover:text-slate-900">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className="p-0 w-72 bg-white border-r-slate-200">
        {/* Elementos de Acessibilidade Obrigatórios do Radix UI */}
        <div className="sr-only">
          <SheetTitle>Menu de Navegação</SheetTitle>
          <SheetDescription>
            Acesse as funcionalidades do Invite SaaS
          </SheetDescription>
        </div>

      
        <Sidebar setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  );
}