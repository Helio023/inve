

"use client";

import { useState, useEffect, useCallback } from "react";
import { DEFAULT_STYLES } from "../../types";
import { getBackgroundStyle } from "@/features/editor/utils";

export function CountdownRenderer({ date, styles }: { date: string; styles?: any }) {
  const [timeLeft, setTimeLeft] = useState({ d: "00", h: "00", m: "00", s: "00" });

  const calculateTime = useCallback(() => {
    if (!date) return;
    const target = new Date(date).getTime();
    const now = new Date().getTime();
    const diff = target - now;
    if (diff > 0) {
      setTimeLeft({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, "0"),
        h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, "0"),
        m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, "0"),
        s: Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, "0"),
      });
    } else {
      setTimeLeft({ d: "00", h: "00", m: "00", s: "00" });
    }
  }, [date]);

  useEffect(() => {
    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [calculateTime]);

  const s = { ...DEFAULT_STYLES, ...styles };

  // --- ESTILOS DE CAMADAS ---
  
  // 1. Box do Número (Item)
  const itemBg = getBackgroundStyle(s.itemBackgroundColor);
  const boxStyle = {
    ...itemBg, // Suporta gradiente no item
    color: s.itemColor || s.color, 
    borderRadius: `${s.itemBorderRadius ?? 8}px`,
    borderWidth: `${s.itemBorderWidth ?? 0}px`,
    borderColor: s.itemBorderColor || s.itemColor || "currentColor",
    borderStyle: s.itemBorderStyle || "solid",
    boxShadow: s.itemShadow === "none" ? "none" : "0 2px 4px rgba(0,0,0,0.1)",
  };

  // 2. O Número em si (Usa estilos de 'title' se definidos, senão herda)
  const numberStyle = {
    fontSize: s.titleFontSize ? `${s.titleFontSize}px` : `${s.fontSize * 1.5}px`,
    fontWeight: s.titleFontWeight || "bold",
    fontFamily: s.titleFontFamily || s.fontFamily,
    color: s.titleColor || s.itemColor || s.color,
  };

  // 3. A Legenda (Dias, Horas) - Usa estilos de 'label'
  const labelStyle = {
    fontSize: s.labelFontSize ? `${s.labelFontSize}px` : `${s.fontSize * 0.5}px`,
    fontWeight: s.labelFontWeight || "normal",
    fontFamily: s.fontFamily, // Geralmente herda a fonte global
    color: s.labelColor || s.color, // Cor global se não houver específica
    textTransform: (s.labelTextTransform || "uppercase") as any,
    marginTop: "4px"
  };

  return (
    <div className="flex w-full justify-center gap-3 sm:gap-4" style={{ textAlign: s.textAlign as any }}>
      {[
        { l: "Dias", v: timeLeft.d },
        { l: "Hrs", v: timeLeft.h },
        { l: "Min", v: timeLeft.m },
        { l: "Seg", v: timeLeft.s },
      ].map((t, i) => (
        <div key={i} className="flex flex-col items-center">
          <div
            className="flex aspect-square min-w-[3.5rem] items-center justify-center leading-none transition-all px-2"
            style={{ ...boxStyle, ...numberStyle }}
          >
            {t.v}
          </div>
          <span style={labelStyle}>
            {t.l}
          </span>
        </div>
      ))}
    </div>
  );
}