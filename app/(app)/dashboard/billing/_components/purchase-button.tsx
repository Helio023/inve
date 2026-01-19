'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { createPurchaseAction } from "@/features/finance/actions";

interface PurchaseButtonProps {
  packageId: string;
  packageName: string;
  price: number;
}

export function PurchaseButton({ packageId, packageName, price }: PurchaseButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    
    const res = await createPurchaseAction(packageId);

    if (res.error) {
      toast.error(res.error);
      setLoading(false);
    } else if (res.redirectUrl) {
      toast.success("Pedido criado! Redirecionando para o WhatsApp...");
      
      // Abre o WhatsApp em nova aba
      window.open(res.redirectUrl, '_blank');
      
      // Opcional: Recarregar a página para mostrar o pedido na tabela de histórico
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <Button 
      className="w-full bg-blue-600 hover:bg-blue-700 font-bold shadow-md" 
      onClick={handlePurchase}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          Comprar via WhatsApp <MessageCircle className="ml-2 w-4 h-4" />
        </>
      )}
    </Button>
  );
}