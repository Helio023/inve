"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/image-upload";

export const HeroForm = ({ content, onUpdate }: any) => (
  <div className="space-y-4 animate-in fade-in">
    <div className="space-y-1">
      <Label className="text-[10px] font-bold text-slate-500 uppercase">Título Principal</Label>
      <Input value={content.title || ""} onChange={(e) => onUpdate({ title: e.target.value })} placeholder="Ex: Ana & João" />
    </div>
    <div className="space-y-1">
      <Label className="text-[10px] font-bold text-slate-400 uppercase">Subtítulo</Label>
      <Input value={content.subtitle || ""} onChange={(e) => onUpdate({ subtitle: e.target.value })} placeholder="Ex: 24.05.2026" />
    </div>
    <div className="space-y-1">
      <Label className="text-[10px] font-bold text-slate-400 uppercase">Imagem de Fundo</Label>
      <ImageUpload value={content.image} onChange={(url) => onUpdate({ image: url })} />
    </div>
  </div>
);