"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

export const FaqForm = ({ content, onUpdate }: any) => {
  const items = content.items || [];

  const updateItem = (idx: number, field: string, value: string) => {
    const newList = [...items];
    newList[idx] = { ...newList[idx], [field]: value };
    onUpdate({ ...content, items: newList });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="space-y-1">
        <Label className="text-[10px] font-bold text-slate-500 uppercase">Título do Bloco</Label>
        <Input value={content.title || ""} onChange={(e) => onUpdate({ title: e.target.value })} placeholder="Ex: Dúvidas Frequentes" />
      </div>
      <div className="space-y-4">
        <Label className="text-[10px] font-bold text-slate-500 uppercase">Perguntas e Respostas</Label>
        <div className="max-h-[350px] overflow-y-auto no-scrollbar space-y-3">
          {items.map((item: any, idx: number) => (
            <div key={idx} className="p-3 bg-slate-50 border rounded-xl space-y-2 relative group shadow-sm">
              <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6 text-red-400" onClick={() => onUpdate({ ...content, items: items.filter((_:any, i:number) => i !== idx) })}>
                <Trash2 className="w-3 h-3" />
              </Button>
              <Input className="bg-white h-8 text-xs font-bold" value={item.q || ""} placeholder="Pergunta" onChange={(e) => updateItem(idx, "q", e.target.value)} />
              <Textarea className="bg-white text-[10px]" value={item.a || ""} placeholder="Resposta" onChange={(e) => updateItem(idx, "a", e.target.value)} />
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full border-dashed h-10 text-[10px] font-bold uppercase" onClick={() => onUpdate({ ...content, items: [...items, { q: "", a: "" }] })}>
          <Plus className="w-3 h-3 mr-2" /> Adicionar Pergunta
        </Button>
      </div>
    </div>
  );
};