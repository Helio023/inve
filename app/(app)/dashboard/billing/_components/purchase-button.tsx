"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, MessageCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { createPurchaseAction } from "@/features/finance/actions";
import { cn } from "@/lib/utils";

interface PurchaseButtonProps {
  packageId: string;
  packageName: string;
  price: number;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
}

export function PurchaseButton({
  packageId,
  packageName,
  price,
  variant = "default",
}: PurchaseButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);

    try {
      const res = await createPurchaseAction(packageId);

      if (res.error) {
        toast.error(res.error);
        setLoading(false);
        return;
      }

      if (res.redirectUrl) {
        toast.success("Redirecionando para o WhatsApp...");
        

        window.location.href = res.redirectUrl;
      }
    } catch (err) {
      toast.error("Falha na conexão. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      className={cn(
        "w-full h-11 rounded-xl font-bold transition-all active:scale-95 shadow-sm",
        variant === "default" && "bg-blue-600 hover:bg-blue-700 text-white border-none",
        variant === "outline" && "border-slate-200 hover:bg-slate-50 text-slate-700"
      )}
      onClick={handlePurchase}
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processando...
        </>
      ) : (
        <>
          {variant === "default" ? "Confirmar Pedido" : "Comprar via WhatsApp"}
          {variant === "default" ? (
            <ArrowRight className="ml-2 h-4 w-4" />
          ) : (
            <MessageCircle className="ml-2 h-4 w-4 text-green-500" />
          )}
        </>
      )}
    </Button>
  );
}