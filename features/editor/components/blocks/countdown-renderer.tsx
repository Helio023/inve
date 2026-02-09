"use client";

import { useState, useEffect, useCallback } from "react";
import { DEFAULT_STYLES } from "../../types";
import { getBackgroundStyle, getTypographyStyle } from "@/features/editor/utils";

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

  // 1. Box Style
  const boxStyle = {
    ...getBackgroundStyle(s.itemBackgroundColor),
    borderRadius: `${s.itemBorderRadius ?? 8}px`,
    borderWidth: `${s.itemBorderWidth ?? 0}px`,
    borderColor: s.itemBorderColor || "transparent",
    borderStyle: s.itemBorderStyle || "solid",
    boxShadow: s.itemShadow === "none" ? "none" : "0 2px 4px rgba(0,0,0,0.1)",
    color: s.itemColor || s.color, // Cor do texto herda global se não houver específica
  };


  const numberStyle = {
      ...getTypographyStyle(s, "title"), // Herda fontFamily, letterSpacing, etc
      fontSize: s.titleFontSize ? `${s.titleFontSize}px` : "1.5em",
      color: s.titleColor || s.itemColor || s.color, // Cascata de cor
      marginBottom: 0
  };

  const labelStyle = {
      ...getTypographyStyle(s, "label"),
      marginTop: "4px",
      opacity: 0.8
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
            className="flex aspect-square min-w-14 items-center justify-center leading-none transition-all px-2"
            style={boxStyle}
          >
            <span style={numberStyle}>{t.v}</span>
          </div>
          <span style={labelStyle}>
            {t.l}
          </span>
        </div>
      ))}
    </div>
  );
}