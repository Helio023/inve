"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import { getContainerStyle } from "@/features/editor/utils";
import { DEFAULT_STYLES } from "@/features/editor/types";

export function IconBlock({ content, styles }: any) {
  // 1. BLINDAGEM: Fallback total para evitar o erro de 'undefined'
  const iconName = content?.name || content?.iconName || "Heart";
  const repeatCount = Math.max(1, Number(content?.repeat) || 1);
  
  const s = { ...DEFAULT_STYLES, ...styles };


  // @ts-ignore
  const IconComponent = LucideIcons[iconName] || LucideIcons.Heart;


  const containerStyle: React.CSSProperties = {
    ...getContainerStyle(s),
    display: "flex",

    justifyContent: s.textAlign === "left" ? "flex-start" : s.textAlign === "right" ? "flex-end" : "center",
    alignItems: "center",
    gap: "1rem", 
    flexWrap: "wrap",
    height: "auto",
    minHeight: "1px",
  };

  const iconSize = Number(s.fontSize) || 32;
  const iconColor = s.color || "currentColor";
  

  const strokeWidth = s.fontWeight === "bold" ? 3 : s.fontWeight === "light" ? 1 : 2;

  return (
    <div style={containerStyle} className="w-full">
      {Array.from({ length: repeatCount }).map((_, index) => (
        <IconComponent
          key={index}
          size={iconSize}
          color={iconColor}
          strokeWidth={strokeWidth}
          style={{
            
            opacity: repeatCount > 2 && (index === 0 || index === repeatCount - 1) ? 0.6 : 1,
            transition: "all 0.3s ease"
          }}
          className="shrink-0"
        />
      ))}
    </div>
  );
}