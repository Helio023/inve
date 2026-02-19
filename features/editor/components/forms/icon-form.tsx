"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Heart, Star, Music, PartyPopper, Cake, 
  Camera, MapPin, Calendar, Users, MessageSquare,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";

export const IconForm = ({ content, onUpdate }: any) => {
  const val = (v: any) => v || "";

  // Lista de ícones sugeridos para facilitar a vida do usuário
  const popularIcons = [
    { name: "Heart", icon: Heart },
    { name: "Star", icon: Star },
    { name: "Music", icon: Music },
    { name: "PartyPopper", icon: PartyPopper },
    { name: "Cake", icon: Cake },
    { name: "Camera", icon: Camera },
    { name: "MapPin", icon: MapPin },
    { name: "Calendar", icon: Calendar },
    { name: "Users", icon: Users },
    { name: "MessageSquare", icon: MessageSquare },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* SELETOR VISUAL DE ÍCONES */}
      <div className="space-y-3">
        <Label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">
          Ícones Sugeridos
        </Label>
        <div className="grid grid-cols-5 gap-2">
          {popularIcons.map((item) => (
            <button
              key={item.name}
              onClick={() => onUpdate({ name: item.name })}
              className={cn(
                "p-2 rounded-lg border transition-all flex items-center justify-center hover:bg-slate-50",
                content.name === item.name 
                  ? "bg-blue-50 border-blue-200 text-blue-600 shadow-sm" 
                  : "bg-white border-slate-100 text-slate-400"
              )}
              title={item.name}
            >
              <item.icon className="w-5 h-5" />
            </button>
          ))}
        </div>
      </div>

      {/* BUSCA/NOME PERSONALIZADO */}
      <div className="space-y-1">
        <Label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">
          Nome do Ícone (Lucide)
        </Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <Input 
            value={val(content.name)} 
            onChange={(e) => onUpdate({ name: e.target.value })} 
            placeholder="Ex: Sparkles, Gift, GlassWater..."
            className="pl-9 h-9 text-xs"
          />
        </div>
        <p className="text-[9px] text-slate-400 mt-1 px-1">
          Consulte todos os nomes em <a href="https://lucide.dev/icons" target="_blank" className="underline hover:text-blue-500">lucide.dev</a>
        </p>
      </div>

      {/* AJUSTES DE DIMENSÃO E REPETIÇÃO */}
      <div className="grid grid-cols-2 gap-4 pt-2 border-t">
        <div className="space-y-1">
          <Label className="text-[10px] font-bold uppercase text-slate-500">Tamanho (px)</Label>
          <Input 
            type="number" 
            min={12}
            max={200}
            value={content.size || 32} 
            onChange={(e) => onUpdate({ size: Number(e.target.value) })}
            className="h-9 bg-slate-50/50"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px] font-bold uppercase text-slate-500">Repetir</Label>
          <Input 
            type="number" 
            min={1} 
            max={10} 
            value={content.repeat || 1} 
            onChange={(e) => onUpdate({ repeat: Number(e.target.value) })}
            className="h-9 bg-slate-50/50"
          />
        </div>
      </div>
    </div>
  );
};