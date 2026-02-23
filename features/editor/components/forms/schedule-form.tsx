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
      { time: "00:00", title: "", location: "", speaker: "", description: "" },
    ];
    onUpdate({ ...content, items: newItems });
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onUpdate({ ...content, items: newItems });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Label className="text-[10px] font-bold text-slate-400 uppercase">Título da Agenda</Label>
        <Input
          value={content.title || ""}
          onChange={(e) => onUpdate({ ...content, title: e.target.value })}
          placeholder="Ex: Agenda do Dia"
          className="font-bold bg-slate-50/50"
        />
      </div>

      <div className="space-y-4">
        {items.map((item: any, idx: number) => (
          <div key={idx} className="bg-white border rounded-xl p-4 relative group shadow-sm space-y-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onUpdate({ ...content, items: items.filter((_:any, i:number) => i !== idx) })}
              className="absolute top-2 right-2 h-6 w-6 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Início
                </Label>
                <Input
                  value={item.time || ""}
                  onChange={(e) => updateItem(idx, "time", e.target.value)}
                  className="h-8 text-xs font-mono bg-slate-50"
                  placeholder="09:00"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[9px] font-bold text-slate-400 uppercase">Atividade</Label>
                <Input
                  value={item.title || ""}
                  onChange={(e) => updateItem(idx, "title", e.target.value)}
                  className="h-8 text-xs font-bold"
                  placeholder="Ex: Cerimónia"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <MapPin className="absolute left-2 top-2.5 w-3 h-3 text-slate-400" />
                <Input
                  value={item.location || ""}
                  onChange={(e) => updateItem(idx, "location", e.target.value)}
                  className="h-8 text-[10px] pl-7"
                  placeholder="Local"
                />
              </div>
              <div className="relative">
                <User className="absolute left-2 top-2.5 w-3 h-3 text-slate-400" />
                <Input
                  value={item.speaker || ""}
                  onChange={(e) => updateItem(idx, "speaker", e.target.value)}
                  className="h-8 text-[10px] pl-7"
                  placeholder="Responsável"
                />
              </div>
            </div>

            <Textarea
              value={item.description || ""}
              onChange={(e) => updateItem(idx, "description", e.target.value)}
              className="text-[10px] min-h-[50px] bg-slate-50 border-0 resize-none"
              placeholder="Notas adicionais..."
            />
          </div>
        ))}
      </div>

      <Button onClick={addItem} variant="outline" className="w-full border-dashed border-slate-300 text-slate-500 h-12">
        <Plus className="w-4 h-4 mr-2" /> Adicionar Horário
      </Button>
    </div>
  );
}