"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
// Adicionados Armchair e CalendarClock
import { UserPlus, Loader2, CalendarIcon, Armchair, CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { addGuestAction } from "@/features/guests/actions";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface GlobalAddGuestProps {
  events: { id: string; title: string }[];
}

export function GlobalAddGuest({ events }: GlobalAddGuestProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Estado para a data de validade
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Adicionar a data ao FormData se ela tiver sido selecionada
    if (date) {
      formData.append("validUntil", date.toISOString());
    }

    const res = await addGuestAction(formData);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Convidado adicionado!");
      setOpen(false);
      setDate(undefined); // Resetar data
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 shadow-md">
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Convidado
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Convidado</DialogTitle>
          <DialogDescription>
            Preencha os detalhes e logística do convidado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* SELEÇÃO DO EVENTO */}
          <div className="space-y-2">
            <Label>Evento</Label>
            <Select name="eventId" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {events.length === 0 ? (
                  <SelectItem value="none" disabled>
                    Sem eventos criados
                  </SelectItem>
                ) : (
                  events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* DADOS PESSOAIS */}
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2 col-span-2">
                <Label>Nome do Convidado</Label>
                <Input name="name" placeholder="Ex: Família Silva" required />
             </div>

             <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label>WhatsApp</Label>
                <Input name="phone" placeholder="Ex: 841234567" />
             </div>

             <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label>Máx. Pessoas</Label>
                <Input 
                  name="maxAdults" 
                  type="number" 
                  min="1" 
                  defaultValue="1" 
                  required 
                />
             </div>
          </div>

          {/* --- NOVOS CAMPOS: LOGÍSTICA --- */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div className="space-y-2">
               <Label className="flex items-center gap-1.5 text-xs text-slate-500 uppercase font-bold">
                 <Armchair className="w-3 h-3" /> Mesa
               </Label>
               <Input name="tableName" placeholder="Ex: Mesa 5" className="h-9 text-sm" />
            </div>
            <div className="space-y-2">
               <Label className="flex items-center gap-1.5 text-xs text-slate-500 uppercase font-bold">
                 <CalendarClock className="w-3 h-3" /> Sessão
               </Label>
               <Input name="sessionLabel" placeholder="Ex: Jantar" className="h-9 text-sm" />
            </div>
          </div>
          {/* ------------------------------- */}

          {/* DATA DE VALIDADE */}
          <div className="space-y-2 flex flex-col">
            <Label>Válido até (Opcional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  {date ? (
                    format(date, "PPP", { locale: pt })
                  ) : (
                    <span>Sem validade (Sempre ativo)</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <DialogFooter className="pt-4">
            <Button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800">
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Criar Convite"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}