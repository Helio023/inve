"use client";

import { useState, useEffect } from "react";
import { getTypographyStyle, getContainerStyle } from "@/features/editor/utils";
import { Clock } from "lucide-react";

export function CountdownRenderer({ date, styles }: { date: string; styles: any }) {
  const [timeLeft, setTimeLeft] = useState<any>(null);

  useEffect(() => {
    if (!date) return;

    const calculate = () => {
      const target = new Date(date).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (isNaN(target) || diff <= 0) {
        setTimeLeft(null);
        return;
      }

      setTimeLeft({
        Dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
        Horas: Math.floor((diff / (1000 * 60 * 60)) % 24),
        Min: Math.floor((diff / 1000 / 60) % 60),
        Seg: Math.floor((diff / 1000) % 60),
      });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [date]);

  // Estilos extraídos com segurança
  const itemBoxStyle = getContainerStyle(styles, "item");
  const numberStyle = getTypographyStyle(styles, "title"); // Camada dos Números
  const labelStyle = getTypographyStyle(styles, "label"); // Camada das Legendas

  // Dados para o Placeholder se timeLeft for nulo
  const displayData = timeLeft || {
    Dias: "00",
    Horas: "00",
    Min: "00",
    Seg: "00"
  };

  return (
    <div className="w-full flex flex-col items-center py-6">
      {/* Ícone opcional ou legenda fixa se desejar */}
      {!timeLeft && (
        <div className="flex items-center gap-2 mb-4 opacity-40">
          <Clock className="w-3 h-3" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Aguardando Data</span>
        </div>
      )}

      <div className="flex justify-center gap-2 sm:gap-4 w-full">
        {Object.entries(displayData).map(([label, value]) => (
          <div 
            key={label} 
            style={{
              ...itemBoxStyle,
              minWidth: "65px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px 8px"
            }}
            className={!timeLeft ? "opacity-40 grayscale" : ""}
          >
            <span style={{ 
              ...numberStyle, 
              lineHeight: 1,
              fontSize: numberStyle.fontSize || "24px" 
            }}>
              {value as string | number}
            </span>
            <span style={{ 
              ...labelStyle, 
              fontSize: labelStyle.fontSize || "9px",
              marginTop: "4px",
              opacity: 0.7
            }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}