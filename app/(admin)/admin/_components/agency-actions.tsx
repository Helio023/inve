"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toggleAgencyAccess } from "@/features/admin/admin.actions"; 
import { toast } from "sonner";

export function AgencyStatusToggle({ agencyId, isActive, name }: any) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    const action = isActive ? "BLOCK" : "UNBLOCK";
    const res = await toggleAgencyAccess(agencyId, action);
    
    if (res.success) {
      toast.success(`Agência ${isActive ? 'suspensa' : 'reativada'} com sucesso.`);
    } else {
      toast.error("Erro ao alterar status.");
    }
    setLoading(false);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant={isActive ? "destructive" : "default"} 
          size="sm" 
          disabled={loading}
          className="h-8 text-[10px] font-bold uppercase"
        >
          {loading ? <Loader2 className="animate-spin w-3 h-3" /> : (
            isActive ? <><Lock className="w-3 h-3 mr-1" /> Suspender</> : <><Unlock className="w-3 h-3 mr-1" /> Reativar</>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            {isActive 
              ? `A agência "${name}" será SUSPENSA. Eles não poderão criar novos convites ou acessar o painel.`
              : `A agência "${name}" será REATIVADA e terá acesso total novamente.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleToggle} className={isActive ? "bg-red-600" : "bg-blue-600"}>
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}