"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  UserPlus,
  Loader2,
  CalendarIcon,
  Armchair,
  CalendarClock,
} from "lucide-react";
import { toast } from "sonner";
import { addGuestAction } from "@/features/guests/actions";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { cn } from "@/lib/utils";

export function AddGuestForm({ eventId }: { eventId: string }) {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("eventId", eventId);

    // Adicionar data se existir
    if (date) {
      formData.append("validUntil", date.toISOString());
    }

    const res = await addGuestAction(formData);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Convidado adicionado!");
      (e.target as HTMLFormElement).reset();
      setDate(undefined); // Resetar data
    }
    setLoading(false);
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="bg-slate-50/50 border-b pb-4">
        <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
          <UserPlus className="w-5 h-5 text-blue-600" />
          Novo Convidado
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome (ou Família)</Label>
            <Input
              id="name"
              name="name"
              placeholder="Ex: Tio João e Família"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">WhatsApp</Label>
              <Input id="phone" name="phone" placeholder="Ex: 84..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxAdults">Máx. Adultos</Label>
              <Input
                id="maxAdults"
                name="maxAdults"
                type="number"
                min="1"
                defaultValue="1"
                required
              />

              <div className="space-y-2">
                <Label htmlFor="maxKids">Máx. Crianças</Label>
                <Input
                  id="maxKids"
                  name="maxKids"
                  type="number"
                  min="0"
                  defaultValue="0"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-xs text-slate-500">
                <Armchair className="w-3 h-3" /> Mesa (Opcional)
              </Label>
              <Input
                name="tableName"
                placeholder="Ex: Mesa 5"
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-xs text-slate-500">
                <CalendarClock className="w-3 h-3" /> Dia/Sessão
              </Label>
              <Input
                name="sessionLabel"
                placeholder="Ex: Sábado (Jantar)"
                className="h-9 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2 flex flex-col">
            <Label>Válido até (Opcional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !date && "text-muted-foreground",
                  )}
                >
                  {date ? (
                    format(date, "PPP", { locale: pt })
                  ) : (
                    <span>Sem validade</span>
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

          <Button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Adicionar à Lista"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
