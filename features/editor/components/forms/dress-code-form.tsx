"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/image-upload";

export const DressCodeForm = ({ content, onUpdate }: any) => (
  <div className="space-y-4 animate-in fade-in">
    <div className="space-y-1">
      <Label className="text-[10px] font-bold text-slate-500 uppercase">Título do Traje</Label>
      <Input value={content.title || ""} onChange={(e) => onUpdate({ title: e.target.value })} placeholder="Ex: Passeio Completo" />
    </div>
    <div className="space-y-1">
      <Label className="text-[10px] font-bold text-slate-500 uppercase">Descrição</Label>
      <Textarea rows={4} value={content.description || ""} onChange={(e) => onUpdate({ description: e.target.value })} />
    </div>
    <div className="space-y-1">
      <Label className="text-[10px] font-bold text-slate-500 uppercase">Foto Exemplo</Label>
      <ImageUpload value={content.image} onChange={(url) => onUpdate({ image: url })} />
    </div>
  </div>
);