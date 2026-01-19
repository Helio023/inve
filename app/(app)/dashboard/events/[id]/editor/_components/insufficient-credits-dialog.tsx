'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Wallet, ArrowRight } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requiredType: string; // 'wedding', 'birthday'...
}

export function InsufficientCreditsDialog({ open, onOpenChange, requiredType }: Props) {
  
  // Traduz o tipo técnico para português
  const typeLabel = {
    wedding: "Casamento",
    birthday: "Aniversário",
    corporate: "Corporativo",
    baby_shower: "Chá de Bebê",
    other: "Eventos Gerais"
  }[requiredType] || "Evento";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto bg-orange-100 p-3 rounded-full w-fit mb-2">
            <Wallet className="w-6 h-6 text-orange-600" />
          </div>
          <AlertDialogTitle className="text-center">
            Saldo Insuficiente
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Para publicar este convite de <strong>{typeLabel}</strong>, você precisa de pelo menos <strong>1 crédito</strong> desta categoria.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600 text-center border border-slate-100">
          Você pode continuar editando e salvar como rascunho, mas o link público não funcionará para os convidados até a publicação.
        </div>

        <AlertDialogFooter className="sm:justify-center gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Continuar Editando
          </Button>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/dashboard/billing">
              Recarregar Carteira <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}