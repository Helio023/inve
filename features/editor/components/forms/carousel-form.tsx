"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, Image as ImageIcon, Clock } from "lucide-react";
import { ImageUpload } from "@/components/image-upload"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CarouselForm({ content, onUpdate }: any) {
  const images = content.images || [];

  const addImage = (url: string) => {
    if (!url) return;
    const newImages = [...images, url];
    onUpdate({ ...content, images: newImages });
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_: any, i: number) => i !== index);
    onUpdate({ ...content, images: newImages });
  };

  return (
    <div className="space-y-6">
      
      {/* Configurações do Slider */}
      <div className="space-y-4 border p-3 rounded-lg bg-slate-50">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Configuração</h4>
        
        <div className="flex items-center justify-between">
          <Label className="text-xs">Autoplay</Label>
          <Switch 
            checked={content.autoplay}
            onCheckedChange={(c) => onUpdate({ ...content, autoplay: c })}
          />
        </div>

        {content.autoplay && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <div className="flex-1">
               <Label className="text-[10px] text-slate-400">Segundos por slide</Label>
               <Input 
                 type="number" 
                 min={1} 
                 max={20}
                 value={content.interval || 3}
                 onChange={(e) => onUpdate({ ...content, interval: Number(e.target.value) })}
                 className="h-8 bg-white"
               />
            </div>
          </div>
        )}

        <div className="space-y-1">
           <Label className="text-[10px] text-slate-400">Efeito de Transição</Label>
           <Select 
             value={content.effect || "slide"} 
             onValueChange={(val) => onUpdate({ ...content, effect: val })}
           >
            <SelectTrigger className="h-8 bg-white"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="slide">Deslizar</SelectItem>
              <SelectItem value="fade">Desvanecer (Fade)</SelectItem>
            </SelectContent>
           </Select>
        </div>
      </div>

      {/* Lista de Imagens */}
      <div className="space-y-3">
        <Label className="text-xs font-bold">Galeria de Imagens</Label>
        
        <div className="grid grid-cols-2 gap-3">
          {images.map((img: string, idx: number) => (
            <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200">
              <img src={img} alt={`Slide ${idx}`} className="w-full h-full object-cover" />
              <button
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm"
              >
                <Trash2 className="w-3 h-3" />
              </button>
              <div className="absolute bottom-1 left-2 text-[10px] font-bold text-white bg-black/50 px-1.5 rounded">
                {idx + 1}
              </div>
            </div>
          ))}
          
          {/* Botão de Upload "Falso" que abre o seletor */}
          <div className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors p-2">
            <ImageUpload 
              value="" 
              onChange={(url) => addImage(url)} 
            />
            <span className="text-[10px] text-slate-400 mt-2 text-center pointer-events-none">Adicionar Foto</span>
          </div>
        </div>
      </div>
    </div>
  );
}