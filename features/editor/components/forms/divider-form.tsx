"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const DividerForm = ({ content, onUpdate }: any) => {
  const widths = ["20%", "40%", "60%", "80%", "100%"];
  const currentWidth = content.width || "60%";
  const currentAlign = content.align || "center";

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* CONTROLE DE LARGURA */}
      <div className="space-y-3">
        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Comprimento da Linha
        </Label>
        <div className="flex bg-slate-100/50 p-1 rounded-lg border border-slate-200">
          {widths.map((w) => (
            <button
              key={w}
              onClick={() => onUpdate({ width: w })}
              className={cn(
                "flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all",
                currentWidth === w 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* CONTROLE DE ALINHAMENTO */}
      <div className="space-y-3">
        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Alinhamento
        </Label>
        <div className="flex gap-2">
          {[
            { id: "left", icon: AlignLeft },
            { id: "center", icon: AlignCenter },
            { id: "right", icon: AlignRight },
          ].map((opt) => (
            <Button
              key={opt.id}
              variant={currentAlign === opt.id ? "default" : "outline"}
              size="sm"
              className="flex-1 h-9"
              onClick={() => onUpdate({ align: opt.id })}
            >
              <opt.icon className="w-4 h-4" />
            </Button>
          ))}
        </div>
      </div>

      {/* DICA DE ESTILO */}
      <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl">
        <p className="text-[9px] text-amber-700 leading-relaxed font-medium">
          <strong>Dica do Editor:</strong> Para mudar a cor ou a espessura da linha, utilize a aba <strong>Design</strong> logo acima.
        </p>
      </div>
    </div>
  );
};