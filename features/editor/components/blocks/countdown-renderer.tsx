"use client";
import { useState, useEffect } from "react";
import { getTypographyStyle, getContainerStyle } from "@/features/editor/utils";

export function CountdownRenderer({
  content,
  styles,
}: {
  content: any;
  styles: any;
}) {
  // BLINDAGEM DE CONTEÚDO
  const safeContent = content || {
    label: "Faltam apenas",
    date: new Date().toISOString(),
  };

  const [timeLeft, setTimeLeft] = useState<any>(null);

  useEffect(() => {
    if (!safeContent.date) return;
    const calculate = () => {
      const diff = new Date(safeContent.date).getTime() - new Date().getTime();
      if (isNaN(diff) || diff <= 0) {
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
  }, [safeContent.date]);

  // ESTILOS
  const headerLabelStyle = getTypographyStyle(styles, "label"); // LÊ A CAMADA 'label'
  const itemBoxStyle = getContainerStyle(styles, "item");
  const numberStyle = getTypographyStyle(styles, "title");

  const displayData = timeLeft || {
    Dias: "00",
    Horas: "00",
    Min: "00",
    Seg: "00",
  };

  return (
    <div className="w-full flex flex-col items-center py-6 gap-4">
      {/* 1. FORCEI A RENDERIZAÇÃO AQUI - Removi o if condicional agressivo */}
      <span style={headerLabelStyle} className="block w-full text-center">
        {safeContent.label || "Contagem Regressiva"}
      </span>

      <div className="flex justify-center gap-3 w-full mt-2">
        {Object.entries(displayData).map(([unit, value]) => (
          <div
            key={unit}
            style={itemBoxStyle}
            className="flex flex-col items-center justify-center min-w-[65px] p-3 shadow-sm transition-all"
          >
            <span style={{ ...numberStyle, lineHeight: 1 }}>
              {value as number}
            </span>
            <span className="text-[9px] font-bold uppercase opacity-50 mt-1">
              {unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
