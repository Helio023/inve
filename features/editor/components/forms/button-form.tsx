"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const ButtonForm = ({ content, onUpdate }: any) => (
  <div className="space-y-4 animate-in fade-in">
    <div className="space-y-1">
      <Label className="text-[10px] font-bold text-slate-500 uppercase">Texto do Botão</Label>
      <Input value={content.text || ""} onChange={(e) => onUpdate({ text: e.target.value })} placeholder="Ex: Ver Localização" />
    </div>
    <div className="space-y-1">
      <Label className="text-[10px] font-bold text-slate-500 uppercase">Link (URL)</Label>
      <Input value={content.url || ""} onChange={(e) => onUpdate({ url: e.target.value })} placeholder="https://..." />
    </div>
  </div>
);