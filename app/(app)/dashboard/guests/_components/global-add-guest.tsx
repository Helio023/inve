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
// Importação de ícones atualizada
import { 
  UserPlus, 
  Loader2, 
  CalendarIcon, 
  Armchair, 
  CalendarClock, 
  Users2, 
  Baby 
} from "lucide-react";
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
  
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    if (date) {
      formData.append("validUntil", date.toISOString());
    }

    const res = await addGuestAction(formData);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Convidado adicionado com sucesso!");
      setOpen(false);
      setDate(undefined); 
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
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Adicionar Convidado</DialogTitle>
          <DialogDescription>
            Configure os limites e a logística para este convite.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          {/* SELEÇÃO DO EVENTO */}
          <div className="space-y-2">
            <Label className="text-xs uppercase font-bold text-slate-500">Evento Alvo</Label>
            <Select name="eventId" required>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Selecione o evento..." />
              </SelectTrigger>
              <SelectContent>
                {events.length === 0 ? (
                  <SelectItem value="none" disabled>Sem eventos criados</SelectItem>
                ) : (
                  events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>{event.title}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* DADOS BÁSICOS */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="space-y-2">
                <Label className="text-xs uppercase font-bold text-slate-500">Nome do Convidado</Label>
                <Input name="name" placeholder="Ex: Família Silva" required className="h-10" />
            </div>

            <div className="space-y-2">
                <Label className="text-xs uppercase font-bold text-slate-500">WhatsApp (Opcional)</Label>
                <Input name="phone" placeholder="Ex: 841234567" className="h-10" />
            </div>
          </div>

          {/* LIMITES DE PESSOAS (Lado a Lado) */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
             <div className="space-y-2">
                <Label className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400">
                  <Users2 className="w-3 h-3" /> Máx. Adultos
                </Label>
                <Input 
                  name="maxAdults" 
                  type="number" 
                  min="1" 
                  defaultValue="1" 
                  required 
                  className="h-10"
                />
             </div>
             <div className="space-y-2">
                <Label className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400">
                  <Baby className="w-3 h-3" /> Máx. Crianças
                </Label>
                <Input 
                  name="maxKids" 
                  type="number" 
                  min="0" 
                  defaultValue="0" 
                  required 
                  className="h-10"
                />
             </div>
          </div>

          {/* LOGÍSTICA (Mesa e Sessão) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
               <Label className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-400">
                 <Armchair className="w-3 h-3" /> Mesa
               </Label>
               <Input name="tableName" placeholder="Ex: Mesa 10" className="h-10 text-sm" />
            </div>
            <div className="space-y-2">
               <Label className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-400">
                 <CalendarClock className="w-3 h-3" /> Sessão/Dia
               </Label>
               <Input name="sessionLabel" placeholder="Ex: Jantar" className="h-10 text-sm" />
            </div>
          </div>

          {/* DATA DE VALIDADE */}
          <div className="space-y-2 flex flex-col pt-2 border-t border-slate-100">
            <Label className="text-xs uppercase font-bold text-slate-500">Validade do Convite</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full h-10 pl-3 text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  {date ? (
                    format(date, "PPP", { locale: pt })
                  ) : (
                    <span>Sempre ativo</span>
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
            <Button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800 h-11 font-bold">
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Gerar Convite"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}