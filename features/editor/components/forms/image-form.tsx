"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/image-upload";
import { ImageIcon, Info } from "lucide-react";

export const ImageForm = ({ content, onUpdate }: any) => {
  const val = (v: any) => v || "";

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* SELETOR DE IMAGEM */}
      <div className="space-y-3">
        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <ImageIcon className="w-3 h-3" /> Foto do Bloco
        </Label>
        <div className="border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/30 p-1 hover:bg-slate-50 transition-colors">
          <ImageUpload 
            value={content.url} 
            onChange={(url) => onUpdate({ url })} 
          />
        </div>
      </div>

      {/* TEXTO ALTERNATIVO */}
      <div className="space-y-1">
        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Texto Alternativo (Acessibilidade)
        </Label>
        <Input 
          value={val(content.alt)} 
          onChange={(e) => onUpdate({ alt: e.target.value })} 
          placeholder="Ex: Noivos a caminhar na praia"
        />
        <p className="text-[9px] text-slate-400 leading-tight mt-1 px-1">
          Descreva a imagem para convidados que utilizam leitores de ecrã.
        </p>
      </div>

      {/* DICA DE DESIGN */}
      <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
        <p className="text-[9px] text-slate-500 leading-relaxed">
          Para ajustar o arredondamento das bordas ou aplicar sombras a esta imagem, utilize a aba <strong>Design</strong>.
        </p>
      </div>
    </div>
  );
};