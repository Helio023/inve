"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit, Loader2, Armchair, CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { editGuestAction } from "@/features/guests/actions"; // Ajuste o caminho se necessário

export function EditGuestDialog({ guest, eventId, open, onOpenChange }: any) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("guestId", guest._id);
    formData.append("eventId", eventId);

    const res = await editGuestAction(formData);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Dados atualizados!");
      onOpenChange(false);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-4 h-4 text-blue-600" /> Editar Convidado
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome / Família</Label>
            <Input id="name" name="name" defaultValue={guest.name} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>WhatsApp</Label>
              <Input name="phone" defaultValue={guest.phone} placeholder="Ex: 84..." />
            </div>
            <div className="space-y-2">
              <Label>Válido até</Label>
              <Input 
                type="date" 
                name="validUntil" 
                defaultValue={guest.validUntil ? guest.validUntil.split('T')[0] : ""} 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Máx Adultos</Label>
              <Input type="number" name="maxAdults" defaultValue={guest.maxAllowedGuests} min="1" />
            </div>
            <div className="space-y-2">
              <Label>Máx Crianças</Label>
              <Input type="number" name="maxKids" defaultValue={guest.maxAllowedChildren} min="0" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1 text-[10px] uppercase text-slate-400 font-bold">
                <Armchair className="w-3 h-3" /> Mesa
              </Label>
              <Input name="tableName" defaultValue={guest.tableName} className="h-8 text-xs" />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1 text-[10px] uppercase text-slate-400 font-bold">
                <CalendarClock className="w-3 h-3" /> Sessão
              </Label>
              <Input name="sessionLabel" defaultValue={guest.sessionLabel} className="h-8 text-xs" />
            </div>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Guardar Alterações"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}