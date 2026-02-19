"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const RsvpForm = ({ content, onUpdate }: any) => (
  <div className="space-y-4 animate-in fade-in">
    <div className="space-y-1">
      <Label className="text-[10px] font-bold text-slate-500 uppercase">Título Principal</Label>
      <Input value={content.title || ""} onChange={(e) => onUpdate({ title: e.target.value })} />
    </div>
    <div className="space-y-1">
      <Label className="text-[10px] font-bold text-slate-500 uppercase">Descrição</Label>
      <Textarea rows={3} value={content.description || ""} onChange={(e) => onUpdate({ description: e.target.value })} />
    </div>
    <div className="space-y-1">
      <Label className="text-[10px] font-bold text-slate-500 uppercase">Texto do Botão</Label>
      <Input value={content.buttonText || ""} onChange={(e) => onUpdate({ buttonText: e.target.value })} />
    </div>
  </div>
);