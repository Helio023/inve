"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LayoutIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const ColumnsForm = ({ content, onUpdate }: any) => {
  const currentCols = content.cols || 2;

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="space-y-3">
        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <LayoutIcon className="w-3.5 h-3.5" /> Disposição das Colunas
        </Label>
        
        <div className="grid grid-cols-4 gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              onClick={() => onUpdate({ cols: num })}
              className={cn(
                "py-2 text-[11px] font-black rounded-lg transition-all",
                currentCols === num 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              {num}
            </button>
          ))}
        </div>
        <p className="text-[9px] text-slate-400 italic px-1">
          Atenção: Reduzir colunas pode esconder elementos já adicionados.
        </p>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
        <p className="text-[10px] text-blue-700 leading-relaxed font-medium">
          <strong>Como usar:</strong> No canvas, aparecerão botões de <strong>"+"</strong> dentro de cada coluna. Clique neles para inserir blocos dentro deste layout.
        </p>
      </div>
    </div>
  );
};