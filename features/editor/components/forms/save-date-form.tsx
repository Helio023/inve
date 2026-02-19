"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const SaveDateForm = ({ content, onUpdate }: any) => (
  <div className="space-y-4">
    <div className="space-y-1">
      <Label className="text-[10px] font-bold text-slate-500 uppercase">Título Evento</Label>
      <Input value={content.title || ""} onChange={(e) => onUpdate({ title: e.target.value })} />
    </div>
    <div className="grid grid-cols-2 gap-2">
      <div className="space-y-1">
        <Label className="text-[10px] font-bold text-slate-500 uppercase">Data (Calendário)</Label>
        <Input type="date" value={content.date || ""} onChange={(e) => onUpdate({ date: e.target.value })} />
      </div>
      <div className="space-y-1">
        <Label className="text-[10px] font-bold text-slate-500 uppercase">Texto Botão</Label>
        <Input value={content.buttonText || ""} onChange={(e) => onUpdate({ buttonText: e.target.value })} />
      </div>
    </div>
    <div className="space-y-1">
      <Label className="text-[10px] font-bold text-slate-500 uppercase">Data Visível (Texto)</Label>
      <Input value={content.dateDisplay || ""} onChange={(e) => onUpdate({ dateDisplay: e.target.value })} />
    </div>
  </div>
);