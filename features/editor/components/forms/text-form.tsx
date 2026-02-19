"use client";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const TextForm = ({ content, onUpdate }: any) => (
  <div className="space-y-1 animate-in fade-in">
    <Label className="text-[10px] font-bold text-slate-500 uppercase">Mensagem de Texto</Label>
    <Textarea 
      rows={12} 
      value={content.text || ""} 
      onChange={(e) => onUpdate({ text: e.target.value })} 
      placeholder="Escreva a sua mensagem..."
    />
  </div>
);