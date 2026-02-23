"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import ColorPicker from "react-best-gradient-color-picker";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface GradientPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function GradientPicker({ value, onChange, label }: GradientPickerProps) {
  // 1. Normalização de Mestre: Remove espaços e padroniza para comparação cega
  const normalize = (val: string) => 
    val?.toLowerCase().replace(/\s+/g, "").replace(/;+$/g, "") || "";

  // 2. Fallback de cor segura
  const safeValue = useMemo(() => {
    if (!value || value === "transparent") return "rgba(255, 255, 255, 0)";
    return value;
  }, [value]);

  const [color, setColor] = useState(safeValue);
  
  // 3. Refs de Controle de Fluxo (O "Semáforo")
  const lastSentColor = useRef(normalize(safeValue));
  const isDragging = useRef(false);

  // 4. Sincronização de fora para dentro (Prop -> State)
  // Só atualiza o seletor se a cor vinda de fora for REALMENTE diferente da que enviamos por último
  useEffect(() => {
    const incomingNormalized = normalize(value);
    if (incomingNormalized !== lastSentColor.current) {
      lastSentColor.current = incomingNormalized;
      setColor(safeValue);
    }
  }, [value, safeValue]);

  const handleChange = (newColor: string) => {
    const normalizedNew = normalize(newColor);
    
    // Bloqueio 1: Se a cor for idêntica à última que processamos, ignora para poupar CPU
    if (normalizedNew === lastSentColor.current) return;

    // Bloqueio 2: Limpeza de lixo de string que a lib às vezes gera
    const cleanColor = newColor.replace(/background(-image)?:\s*/g, "").replace(/;/g, "");

    // Atualiza as referências antes de disparar o evento para o pai
    lastSentColor.current = normalizedNew;
    setColor(cleanColor);
    
    // Dispara a mudança para o editor global
    onChange(cleanColor);
  };

  return (
    <div className="space-y-2">
      {label && <span className="text-[10px] font-bold uppercase text-slate-400 tracking-tight">{label}</span>}
      
      <Popover>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "w-full flex items-center gap-2 px-3 h-10 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-all outline-none focus:ring-2 focus:ring-blue-500/20",
              !value && "text-muted-foreground"
            )}
          >
            {/* Preview da Cor com fundo quadriculado para transparência */}
            <div className="w-6 h-6 rounded-lg border border-slate-200 shadow-inner shrink-0 bg-[url('https://checkerboard.cool/img/checkerboard.png')] bg-[length:8px_8px] overflow-hidden">
              <div 
                className="w-full h-full" 
                style={{ background: safeValue }} 
              />
            </div>
            <span className="text-[11px] truncate flex-1 font-mono text-slate-500 text-left">
              {value?.includes("gradient") ? "Gradiente Ativo" : value || "Selecionar cor..."}
            </span>
          </button>
        </PopoverTrigger>
        
        <PopoverContent 
          className="w-auto p-0 border-none shadow-2xl z-[100] rounded-2xl overflow-hidden" 
          align="start"
          onPointerDownOutside={(e) => {
            // Evita que o popover feche enquanto arrastamos o seletor
            if ((e.target as HTMLElement).closest('.react-best-gradient-color-picker')) {
              e.preventDefault();
            }
          }}
        >
          <div className="p-4 bg-white border border-slate-100 flex flex-col items-center">
             <ColorPicker 
               value={color} 
               onChange={handleChange} 
               hidePresets={false}
               hideEyeDrop={false}
               width={280} 
               height={180}
             />
             
             {/* Rodapé informativo para o usuário */}
             <div className="w-full mt-4 pt-3 border-t border-slate-50 flex justify-between items-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Ajuste de Cor</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 text-[9px] font-black text-blue-600 hover:bg-blue-50"
                  onClick={() => handleChange("rgba(255,255,255,1)")}
                >
                  RESET
                </Button>
             </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}