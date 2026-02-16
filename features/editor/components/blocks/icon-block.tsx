"use client";

import * as LucideIcons from "lucide-react";
import { getContainerStyle } from "@/features/editor/utils";
import { DEFAULT_STYLES } from "@/features/editor/types";

export function IconBlock({ content, styles }: any) {
  const iconName = content.iconName || "Heart";
  // @ts-ignore
  const IconComponent = LucideIcons[iconName] || LucideIcons.Heart;
  const repeatCount = Math.max(1, content.repeat || 1); // Garante pelo menos 1

  const s = { ...DEFAULT_STYLES, ...styles };
  
  // Container: Controla fundo, margem e alinhamento
  const containerStyle = {
      ...getContainerStyle(s, ""),
      display: "flex",
      justifyContent: s.textAlign === "left" ? "flex-start" : s.textAlign === "right" ? "flex-end" : "center",
      alignItems: "center",
      gap: "0.5rem",
      backgroundColor: s.backgroundColor || "transparent", // Permite cor de fundo
      minHeight: "auto"
  };

  
  const iconSize = s.fontSize || 32; 
  const iconColor = s.color || "#000";

  return (
    <div style={containerStyle}>
      {Array.from({ length: repeatCount }).map((_, index) => (
        <IconComponent 
          key={index}
          size={iconSize}
          color={iconColor}
          strokeWidth={s.fontWeight === "bold" ? 3 : s.fontWeight === "light" ? 1 : 2}
          style={{
           
             opacity: repeatCount > 2 && (index === 0 || index === repeatCount - 1) ? 0.7 : 1,
          }}
        />
      ))}
    </div>
  );
}