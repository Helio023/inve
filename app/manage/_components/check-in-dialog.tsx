"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCheck, Loader2, Users, Baby, Trash2, Plus, Minus } from "lucide-react";
import { processCheckInAction } from "@/features/guests/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function CheckInDialog({ guest, eventId }: any) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [adults, setAdults] = useState<number>(0);
  const [kids, setKids] = useState<number>(0);

  useEffect(() => {
    if (open) {
      setAdults((guest.checkedIn ? guest.arrivedAdults : guest.confirmedAdults) || 0);
      setKids((guest.checkedIn ? guest.arrivedKids : guest.confirmedKids) || 0);
    }
  }, [open, guest]);

  const handleAction = async (isCheckingIn: boolean) => {
    setLoading(true);
    try {
      const res = await processCheckInAction(guest._id, eventId, { 
        adults: isCheckingIn ? adults : 0, 
        kids: isCheckingIn ? kids : 0, 
        isCheckingIn 
      });

      if (res.success) {
        toast.success(isCheckingIn ? "Entrada confirmada!" : "Check-in removido.");
        setOpen(false);
      } else {
        toast.error("Erro ao processar.");
      }
    } catch (error) {
      toast.error("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  // Helper para incrementar/decrementar
  const adjust = (type: 'adults' | 'kids', delta: number) => {
    if (type === 'adults') {
      const max = guest.confirmedAdults || 0;
      setAdults(prev => Math.min(max, Math.max(0, prev + delta)));
    } else {
      const max = guest.confirmedKids || 0;
      setKids(prev => Math.min(max, Math.max(0, prev + delta)));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant={guest.checkedIn ? "default" : "outline"}
          className={cn(
            "h-8 font-bold",
            guest.checkedIn 
              ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
              : "border-slate-300 text-slate-600"
          )}
        >
          <UserCheck className="w-3.5 h-3.5 mr-1.5" />
          {guest.checkedIn ? `${guest.arrivedAdults + guest.arrivedKids} Presentes` : "Check-in"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none shadow-2xl">
        {/* HEADER ESTILIZADO */}
        <div className="bg-slate-900 p-6 text-white text-center">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex justify-center items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-400" />
              Confirmar Entrada
            </DialogTitle>
            <p className="text-slate-400 text-sm mt-1">{guest.name}</p>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-8 bg-white">
          {/* CONTROLES DE QUANTIDADE */}
          <div className="space-y-6">
            {/* ADULTOS */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" /> Adultos
                </Label>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Máximo: {guest.confirmedAdults}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" size="icon" className="h-10 w-10 rounded-full border-slate-200"
                  onClick={() => adjust('adults', -1)} disabled={adults <= 0}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center text-xl font-black text-slate-900 tabular-nums">{adults}</span>
                <Button 
                  variant="outline" size="icon" className="h-10 w-10 rounded-full border-emerald-200 bg-emerald-50 text-emerald-600"
                  onClick={() => adjust('adults', 1)} disabled={adults >= (guest.confirmedAdults || 0)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* CRIANÇAS */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Baby className="w-4 h-4 text-slate-400" /> Crianças
                </Label>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Máximo: {guest.confirmedKids}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" size="icon" className="h-10 w-10 rounded-full border-slate-200"
                  onClick={() => adjust('kids', -1)} disabled={kids <= 0}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center text-xl font-black text-slate-900 tabular-nums">{kids}</span>
                <Button 
                  variant="outline" size="icon" className="h-10 w-10 rounded-full border-emerald-200 bg-emerald-50 text-emerald-600"
                  onClick={() => adjust('kids', 1)} disabled={kids >= (guest.confirmedKids || 0)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase">Total Entrando:</span>
            <span className="text-xl font-black text-emerald-900">{adults + kids}</span>
          </div>
        </div>

        <DialogFooter className="p-6 bg-slate-50 border-t flex flex-col gap-3 sm:flex-col">
          <Button 
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest shadow-lg active:scale-95" 
            onClick={() => handleAction(true)}
            disabled={loading || (adults === 0 && kids === 0)}
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Confirmar Entrada"}
          </Button>
          
          {guest.checkedIn && (
            <Button 
              variant="ghost" 
              className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 text-[10px] font-bold uppercase" 
              onClick={() => handleAction(false)}
              disabled={loading}
            >
              <Trash2 className="w-3 h-3 mr-1" /> Limpar Check-in
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
      
      {/* CSS para esconder setas padrão do navegador */}
      <style jsx global>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
    </Dialog>
  );
}