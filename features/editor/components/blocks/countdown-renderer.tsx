"use client";

import { useState, useEffect, useCallback } from "react";
import { DEFAULT_STYLES } from "../../types";

export function CountdownRenderer({
  date,
  styles,
}: {
  date: string;
  styles?: any;
}) {
  const [timeLeft, setTimeLeft] = useState({
    d: "00",
    h: "00",
    m: "00",
    s: "00",
  });

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

  const getShadow = (shadowType: string) => {
    if (shadowType === "sm") return "0 1px 2px rgba(0,0,0,0.05)";
    if (shadowType === "md") return "0 4px 6px -1px rgba(0,0,0,0.1)";
    if (shadowType === "lg") return "0 10px 15px -3px rgba(0,0,0,0.1)";
    return "none";
  };

  const boxStyle = {
    backgroundColor: s.itemBackgroundColor || "transparent",
    color: s.itemColor || s.color, 
    borderRadius: `${s.itemBorderRadius || 0}px`,
    borderWidth: `${s.itemBorderWidth || 0}px`,
    // --- CORREÇÃO: Prioriza a cor da borda específica do item ---
    borderColor: s.itemBorderColor || s.itemColor || "currentColor", 
    // --- CORREÇÃO: Usa o estilo da borda específico do item ---
    borderStyle: s.itemBorderStyle || "solid",
    // ----------------------------------------------------------
    boxShadow: getShadow(s.itemShadow),
  };

  const numberStyle = {
    fontSize: `${s.fontSize}px`,
    fontWeight: s.fontWeight,
    fontFamily: s.fontFamily,
    fontStyle: s.fontStyle,
    color: s.itemColor || s.color,
  };

  const labelStyle = {
    fontSize: `${s.fontSize * 0.4}px`,
    fontWeight: s.fontWeight,
    fontFamily: s.fontFamily,
    color: s.color,
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
            className="flex aspect-square min-w-[3.5rem] items-center justify-center font-bold leading-none shadow-sm transition-all"
            style={{ ...boxStyle, ...numberStyle }}
          >
            {t.v}
          </div>
          <span
            className="mt-1 font-bold uppercase tracking-wider opacity-80"
            style={labelStyle}
          >
            {t.l}
          </span>
        </div>
      ))}
    </div>
  );
}