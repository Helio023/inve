"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Clock, MapPin, User, AlignLeft } from "lucide-react";
import { Label } from "@/components/ui/label";

export function ScheduleForm({ content, onUpdate }: any) {
  const items = content.items || [];

  const addItem = () => {
    const newItems = [
      ...items,
      {
        time: "00:00",
        endTime: "",
        activity: "Nova Atividade",
        location: "",
        speaker: "",
        description: "",
      },
    ];
    onUpdate({ ...content, items: newItems });
  };

  const updateItem = (index: number, field: string, value: string) => {
   
    const newItems = [...items];
   
    newItems[index] = { ...newItems[index], [field]: value };
    onUpdate({ ...content, items: newItems });
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_: any, i: number) => i !== index);
    onUpdate({ ...content, items: newItems });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Label className="text-xs font-bold text-slate-500">
          Título do Programa
        </Label>
        <Input
          value={content.title || ""}
          onChange={(e) => onUpdate({ ...content, title: e.target.value })}
          placeholder="Ex: Agenda do Dia"
          className="font-bold"
        />
      </div>

      <div className="space-y-4">
        {items.map((item: any, idx: number) => (
          <div
            key={idx}
            className="bg-white border rounded-lg p-3 relative group shadow-sm space-y-3"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeItem(idx)}
              className="absolute top-1 right-1 h-6 w-6 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <Trash2 className="w-3 h-3" />
            </Button>

            {/* Linha 1: Horários */}
            <div className="flex items-end gap-2">
              <div className="w-1/2 space-y-1">
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase">
                  <Clock className="w-3 h-3" /> Início
                </div>
                <Input
                  // CORREÇÃO: || "" garante que nunca é undefined
                  value={item.time || ""}
                  onChange={(e) => updateItem(idx, "time", e.target.value)}
                  className="h-8 text-xs font-mono bg-slate-50 text-center"
                  placeholder="09:00"
                />
              </div>
              <div className="w-1/2 space-y-1">
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase">
                  Fim (Opcional)
                </div>
                <Input
             
                  value={item.endTime || ""}
                  onChange={(e) => updateItem(idx, "endTime", e.target.value)}
                  className="h-8 text-xs font-mono bg-slate-50 text-center"
                  placeholder="10:00"
                />
              </div>
            </div>

  
            <div className="space-y-1">
              <div className="text-[10px] text-slate-400 font-bold uppercase">
                Nome da Atividade
              </div>
              <Input
                value={item.activity || ""}
                onChange={(e) => updateItem(idx, "activity", e.target.value)}
                className="h-8 text-xs font-bold border-slate-200"
                placeholder="Ex: Workshop de Vendas"
              />
            </div>

            {/* Linha 3: Local e Orador */}
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <MapPin className="absolute left-2 top-2 w-3 h-3 text-slate-400" />
                <Input
                  value={item.location || ""}
                  onChange={(e) => updateItem(idx, "location", e.target.value)}
                  className="h-8 text-xs pl-7 border-slate-100"
                  placeholder="Local / Sala"
                />
              </div>
              <div className="relative">
                <User className="absolute left-2 top-2 w-3 h-3 text-slate-400" />
                <Input
                  value={item.speaker || ""}
                  onChange={(e) => updateItem(idx, "speaker", e.target.value)}
                  className="h-8 text-xs pl-7 border-slate-100"
                  placeholder="Orador / Resp."
                />
              </div>
            </div>

            {/* Linha 4: Descrição */}
            <div className="relative">
              <AlignLeft className="absolute left-2 top-2.5 w-3 h-3 text-slate-400" />
              <Textarea
                value={item.description || ""}
                onChange={(e) => updateItem(idx, "description", e.target.value)}
                className="text-[10px] min-h-[40px] pl-7 bg-slate-50 border-0 resize-none text-slate-600 focus-visible:ring-0"
                placeholder="Detalhes adicionais..."
              />
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={addItem}
        variant="outline"
        className="w-full border-dashed border-slate-300 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
      >
        <Plus className="w-4 h-4 mr-2" /> Adicionar Horário
      </Button>
    </div>
  );
}