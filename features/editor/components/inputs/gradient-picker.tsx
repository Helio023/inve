"use client";

import React, { useState, useEffect } from "react";
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
  // 1. Função de Segurança: Garante que a cor é sempre válida
  const ensureValidColor = (c: string | undefined | null) => {
    if (!c || typeof c !== "string" || c.trim() === "") {
      return "rgba(255, 255, 255, 1)"; // Fallback seguro (Branco)
    }
    // A biblioteca por vezes falha com "transparent" nomeado, preferindo RGBA
    if (c === "transparent") {
      return "rgba(255, 255, 255, 0)";
    }
    return c;
  };

  // Inicializa com valor seguro
  const [color, setColor] = useState(ensureValidColor(value));

  // 2. Sincroniza estado interno apenas se o valor externo mudar E for válido
  useEffect(() => {
    const validColor = ensureValidColor(value);
    if (validColor !== color) {
      setColor(validColor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = (newColor: string) => {
    // 3. Sanitização do output
    let cleanValue = newColor
      ?.replace(/;/g, "")
      ?.replace(/background(-image)?:\s*/g, "")
      ?.trim();

    if (!cleanValue) return;

    // Proteção contra loops de arredondamento
    if (cleanValue === value) return;

    setColor(cleanValue);
    onChange(cleanValue);
  };

  return (
    <div className="space-y-2">
      {label && <span className="text-[10px] font-bold uppercase text-slate-400">{label}</span>}
      
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal px-2 h-9 bg-white hover:bg-slate-50 border-slate-200 shadow-sm",
              !value && "text-muted-foreground"
            )}
          >
            {/* Preview Visual */}
            <div className="w-5 h-5 rounded-md mr-2 border border-slate-200 shadow-sm shrink-0 bg-[url('https://checkerboard.cool/img/checkerboard.png')] bg-[length:6px_6px] overflow-hidden">
              <div 
                className="w-full h-full" 
                style={{ background: ensureValidColor(value) }} 
              />
            </div>
            <span className="text-xs truncate flex-1 font-mono text-slate-600">
              {value?.includes("gradient") ? "Gradiente" : value || "Selecione..."}
            </span>
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-auto p-0 border-none shadow-2xl z-50 rounded-xl overflow-hidden" align="start">
          <div className="p-3 bg-white border border-slate-100">
             <ColorPicker 
               value={color} 
               onChange={handleChange} 
               hidePresets={false}
               hideEyeDrop={false}
               hideAdvancedSliders={false} 
               hideColorGuide={false} 
               hideInputType={false} 
               width={290} 
               height={200}
             />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}