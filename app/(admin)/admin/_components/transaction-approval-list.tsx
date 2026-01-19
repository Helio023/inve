'use client';

import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle, XCircle, Loader2, Wallet, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { updateTransactionStatus } from "@/features/admin/actions";

interface PendingTransaction {
  _id: string;
  packageName: string;
  amount: number;
  paymentMethod: string;
  agencyName: string; // Vamos popular isso no servidor
  createdAt: string;
}

export function TransactionApprovalList({ transactions }: { transactions: PendingTransaction[] }) {
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAction = async (id: string, action: 'APPROVED' | 'REJECTED') => {
    setProcessingId(id);
    const toastId = toast.loading("Processando...");

    try {
      const result = await updateTransactionStatus(id, action);
      if (result.error) {
        toast.error(result.error, { id: toastId });
      } else {
        toast.success(action === 'APPROVED' ? "Pagamento Aprovado!" : "Rejeitado", { id: toastId });
      }
    } catch {
      toast.error("Erro inesperado", { id: toastId });
    } finally {
      setProcessingId(null);
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
        <p className="text-slate-500 font-medium">Nenhum pagamento pendente.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {transactions.map((tx) => (
        <Card key={tx._id} className="overflow-hidden border-slate-200 shadow-sm">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between p-5 gap-4">
              
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-3">
                  <Badge className="bg-blue-600 hover:bg-blue-700">
                    {tx.packageName}
                  </Badge>
                  <span className="font-mono font-bold text-slate-700">
                    {tx.amount.toLocaleString()} MT
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  Agência: <span className="font-semibold text-slate-700">{tx.agencyName}</span>
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center"><Wallet className="w-3 h-3 mr-1"/> {tx.paymentMethod}</span>
                  <span className="flex items-center"><Calendar className="w-3 h-3 mr-1"/> {new Date(tx.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0">
                <Button 
                  size="sm" variant="outline" 
                  className="text-red-600 border-red-100 hover:bg-red-50"
                  onClick={() => handleAction(tx._id, 'REJECTED')}
                  disabled={!!processingId}
                >
                  <XCircle className="w-4 h-4 mr-2" /> Rejeitar
                </Button>
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleAction(tx._id, 'APPROVED')}
                  disabled={!!processingId}
                >
                  {processingId === tx._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                  Confirmar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}