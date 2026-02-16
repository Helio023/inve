"use client";

import { cn } from "@/lib/utils";
import { MapPin, User } from "lucide-react";
import { getTypographyStyle } from "@/features/editor/utils";

export function ScheduleRenderer({
  content,
  styles,
}: {
  content: any;
  styles: any;
}) {
  const items = content.items || [];
  const s = styles;

  // --- ESTILOS COM HERANÇA COMPLETA ---
  const mainTitleStyle = {
    ...getTypographyStyle(s, "title"),
    marginBottom: "2rem",
    width: "100%",
  };

  // Título da Atividade (Herda global, mas negrito)
  const activityTitleStyle = {
    ...getTypographyStyle(s, ""),
    fontWeight: "bold",
    fontSize: "1.1em", // Um pouco maior que o corpo
    marginBottom: "0.25rem",
    lineHeight: 1.3,
  };

  const descStyle = {
    ...getTypographyStyle(s, "desc"),
    opacity: s.descColor ? 1 : 0.8,
    marginTop: "0.25rem",
  };

  const timeStyle = {
    ...getTypographyStyle(s, ""),
    fontSize: "0.9em",
    fontWeight: "bold",
    lineHeight: 1.2,
  };

  const metaStyle = {
    ...getTypographyStyle(s, ""),
    fontSize: "0.8em",
    opacity: 0.8,
  };

  const accentColor = s.borderColor || s.color || "#000";

  return (
    <div className="w-full py-4 px-2">
      {content.title && <h3 style={mainTitleStyle}>{content.title}</h3>}

      <div className="flex flex-col relative pl-2">
        {/* Linha do tempo */}
        <div
          className="absolute left-21.25 top-2 bottom-6 w-px opacity-20"
          style={{ backgroundColor: accentColor }}
        />

        {items.map((item: any, idx: number) => (
  <div key={idx} className="flex gap-5 relative pb-8 group last:pb-0">
    <div className="w-18.75 shrink-0 text-right pt-0.5 flex flex-col items-end">
      <span style={timeStyle}>{item.time}</span>
    </div>

    <div className="relative shrink-0 z-10">
      <div className="w-3 h-3 rounded-full border-2 bg-white mt-1.5" style={{ borderColor: accentColor }} />
    </div>

    <div className="flex-1 -mt-1">
      <h4 style={activityTitleStyle}>{item.title}</h4>

      {item.description && (
        <p style={descStyle}>{item.description}</p>
      )}
    </div>
  </div>
))}
      </div>
    </div>
  );
}
