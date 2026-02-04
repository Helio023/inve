"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ImageUpload } from "@/components/image-upload"; // Certifique-se que o caminho está correto
import { AdvancedColorPicker } from "../../components/inputs/advanced-color-picker";
import { SpacingControl } from "../../components/inputs/spacing-control";
import { Separator } from "@/components/ui/separator";
import { 
  LayoutTemplate, 
  Image as ImageIcon, 
  Maximize, 
  Layers 
} from "lucide-react";

export const PageSettingsPanel = ({ activePage, onUpdate }: any) => {
  const styles = activePage?.styles || {};

  // Helper para atualizar estilos mantendo os anteriores
  const handleStyleUpdate = (newStyles: any) => {
    onUpdate({
      styles: {
        ...styles,
        ...newStyles,
      },
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* 1. TÍTULO DA PÁGINA */}
      <div className="space-y-3">
        <Label className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-2">
           <LayoutTemplate className="w-4 h-4 text-blue-500" /> Identificação
        </Label>
        <div className="space-y-1">
           <Label className="text-[10px] font-bold uppercase text-slate-400">Nome da Página (Interno)</Label>
           <Input
             value={activePage.title}
             onChange={(e) => onUpdate({ title: e.target.value })}
             className="bg-slate-50 border-slate-200 focus:bg-white transition-all"
             placeholder="Ex: Capa, Cerimónia..."
           />
        </div>
      </div>

      <Separator />

      {/* 2. FUNDO (COR E IMAGEM) */}
      <div className="space-y-6">
        <Label className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-2">
           <ImageIcon className="w-4 h-4 text-purple-500" /> Fundo & Imagem
        </Label>
        
        {/* Cor de Fundo */}
        <AdvancedColorPicker
          label="Cor de Fundo Base"
          value={styles.backgroundColor || "#ffffff"}
          onChange={(val) => handleStyleUpdate({ backgroundColor: val })}
        />

        {/* Imagem de Fundo */}
        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase text-slate-400">Imagem de Fundo (Wallpaper)</Label>
          <div className="border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
             <ImageUpload
               value={styles.backgroundImage}
               onChange={(url) => handleStyleUpdate({ backgroundImage: url })}
             />
          </div>
        </div>

        {/* Overlay (Película Escura) - Só aparece se tiver imagem */}
        {styles.backgroundImage && (
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-3">
             <div className="flex justify-between items-center">
                <Label className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                   <Layers className="w-3 h-3" /> Película Escura (Overlay)
                </Label>
                <span className="text-[10px] font-mono bg-white px-1.5 rounded border">
                  {(styles.backgroundOpacity || 0) * 100}%
                </span>
             </div>
             <Slider
               value={[styles.backgroundOpacity || 0]}
               min={0}
               max={0.9}
               step={0.1}
               onValueChange={([val]) => handleStyleUpdate({ backgroundOpacity: val })}
               className="cursor-pointer"
             />
             <p className="text-[9px] text-slate-400 leading-tight">
               Aumente para escurecer a imagem e facilitar a leitura do texto.
             </p>
          </div>
        )}
      </div>

      <Separator />

      {/* 3. ESPAÇAMENTO (PADDING) */}
      <div className="space-y-4">
        <Label className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-2">
           <Maximize className="w-4 h-4 text-emerald-500" /> Espaçamento da Página
        </Label>
        
        <SpacingControl
          label="Padding (Margem Interna)"
          values={{
            top: styles.paddingTop || 0,
            right: styles.paddingRight || 0,
            bottom: styles.paddingBottom || 0,
            left: styles.paddingLeft || 0,
          }}
          onChange={(newVals) => {
            const updateObj: any = {};
            if (newVals.top !== undefined) updateObj.paddingTop = newVals.top;
            if (newVals.right !== undefined) updateObj.paddingRight = newVals.right;
            if (newVals.bottom !== undefined) updateObj.paddingBottom = newVals.bottom;
            if (newVals.left !== undefined) updateObj.paddingLeft = newVals.left;
            handleStyleUpdate(updateObj);
          }}
        />
        <p className="text-[10px] text-slate-400 italic">
           Dica: Use padding lateral (Esq/Dir) para evitar que o conteúdo cole nas bordas em telemóveis.
        </p>
      </div>

    </div>
  );
};