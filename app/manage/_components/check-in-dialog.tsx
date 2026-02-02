"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCheck, Loader2 } from "lucide-react";
import { processCheckInAction } from "@/features/guests/actions";
import { toast } from "sonner";

export function CheckInDialog({ guest, eventId }: any) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- CORREÇÃO 1: Fallback para 0 evita o erro de "uncontrolled input" ---
  // Se guest.arrivedAdults for undefined, o estado começa em 0 em vez de undefined.
  const [adults, setAdults] = useState<number>(
    (guest.checkedIn ? guest.arrivedAdults : guest.confirmedAdults) || 0
  );
  const [kids, setKids] = useState<number>(
    (guest.checkedIn ? guest.arrivedKids : guest.confirmedKids) || 0
  );

  const handleAction = async (isCheckingIn: boolean) => {
    setLoading(true);
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
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant={guest.checkedIn ? "default" : "outline"}
          className={guest.checkedIn ? "bg-green-600 hover:bg-green-700" : "border-slate-300"}
        >
          <UserCheck className="w-4 h-4 mr-1.5" />
          {guest.checkedIn ? `${guest.arrivedAdults + guest.arrivedKids} Presentes` : "Check-in"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[350px]">
        <DialogHeader>
          <DialogTitle>Confirmar Entrada</DialogTitle>
          <p className="text-sm text-slate-500 font-medium">{guest.name}</p>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            {/* INPUT ADULTOS */}
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold text-slate-400">Adultos</Label>
              <Input 
                type="number" 
                value={adults} 
                // --- CORREÇÃO 2: Trava para não passar o número confirmado ---
                onChange={(e) => {
                    const val = Number(e.target.value);
                    const max = guest.confirmedAdults || 0;
                    setAdults(val > max ? max : val);
                }}
                min={0}
              />
              <p className="text-[10px] text-slate-400 italic">Máx: {guest.confirmedAdults}</p>
            </div>

            {/* INPUT CRIANÇAS */}
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold text-slate-400">Crianças</Label>
              <Input 
                type="number" 
                value={kids} 
                // --- CORREÇÃO 2: Trava para não passar o número confirmado ---
                onChange={(e) => {
                    const val = Number(e.target.value);
                    const max = guest.confirmedKids || 0;
                    setKids(val > max ? max : val);
                }}
                min={0}
              />
              <p className="text-[10px] text-slate-400 italic">Máx: {guest.confirmedKids}</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2">
          <Button 
            className="w-full bg-green-600 hover:bg-green-700 font-bold" 
            onClick={() => handleAction(true)}
            disabled={loading || (adults === 0 && kids === 0)}
          >
            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Confirmar Entrada"}
          </Button>
          
          {guest.checkedIn && (
            <Button 
              variant="ghost" 
              className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 text-xs" 
              onClick={() => handleAction(false)}
              disabled={loading}
            >
              Remover Check-in (Limpar)
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}