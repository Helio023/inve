'use client';

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ImageUpload } from "@/components/image-upload";
import { Palette, ImageIcon, Type } from "lucide-react";

export function PageSettingsPanel({ activePage, onUpdate }: any) {
  const styles = activePage.styles || {};

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300 pb-10">
      <div className="space-y-2">
        <Label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-2">
          <Type className="w-3 h-3" /> Nome da Página
        </Label>
        <Input 
          value={activePage.title} 
          onChange={(e) => onUpdate({ title: e.target.value })} 
          placeholder="Ex: Localização, Nossa História..."
          className="h-9"
        />
      </div>

      <div className="space-y-3 pt-4 border-t">
        <Label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-2">
          <Palette className="w-3 h-3" /> Cor de Fundo
        </Label>
        <div className="flex items-center gap-3">
          <input 
            type="color" 
            value={styles.backgroundColor || "#ffffff"} 
            className="w-10 h-10 rounded-md border cursor-pointer overflow-hidden"
            onChange={(e) => onUpdate({ styles: { backgroundColor: e.target.value } })}
          />
          <span className="text-xs font-mono uppercase text-slate-500">{styles.backgroundColor}</span>
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t">
        <Label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-2">
          <ImageIcon className="w-3 h-3" /> Papel de Parede (Fundo)
        </Label>
        <ImageUpload 
          value={styles.backgroundImage} 
          onChange={(url: string) => onUpdate({ styles: { backgroundImage: url } })} 
        />
        
        {styles.backgroundImage && (
          <div className="space-y-4 pt-2 animate-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center">
                <Label className="text-[10px] font-bold uppercase text-slate-400">Escurecer Imagem</Label>
                <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                  {Math.round((styles.backgroundOpacity || 0) * 100)}%
                </span>
             </div>
             <Slider 
                value={[styles.backgroundOpacity || 0]} 
                min={0} max={0.9} step={0.1}
                onValueChange={([v]) => onUpdate({ styles: { backgroundOpacity: v } })}
             />
          </div>
        )}
      </div>
    </div>
  );
}