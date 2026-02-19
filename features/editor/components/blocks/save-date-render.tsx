"use client";

import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";
import { getTypographyStyle, getContainerStyle } from "@/features/editor/utils";

export function SaveTheDateRenderer({ 
  content, 
  styles, 
  isPreview 
}: { 
  content: any; 
  styles: any; 
  isPreview?: boolean 
}) {
  const s = styles;
  
  // --- CAPTURA DE ESTILOS POR CAMADA ---
  const titleStyle = getTypographyStyle(s, "title");
  const dateStyle = getTypographyStyle(s, "desc");
  const btnStyle = getTypographyStyle(s, "btn");

  const eventTitle = content.title || "Guarde esta Data";
  const eventDate = content.date || "2026-05-20";
  const dateDisplay = content.dateDisplay || "20 de Maio de 2026";
  
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${eventDate.replace(/-/g, '')}T100000Z/${eventDate.replace(/-/g, '')}T220000Z`;

  return (
    <div 
      className="w-full flex flex-col items-center text-center py-10 px-6 gap-8"
      style={getContainerStyle(s)}
    >
      {/* Linha Decorativa Superior */}
      <div 
        className="h-[1px] w-16 opacity-20" 
        style={{ backgroundColor: titleStyle.color || s.color || "currentColor" }} 
      />

      {/* TÍTULO */}
      <div className="w-full">
        <h2 style={titleStyle} className="leading-tight">
          {eventTitle}
        </h2>
      </div>

      {/* BOX DA DATA */}
      <div 
        className="py-6 px-10 border-y w-full max-w-[280px]"
        style={{ borderColor: dateStyle.color ? `${dateStyle.color}20` : "rgba(0,0,0,0.1)" }}
      >
         <p style={dateStyle}>
           {dateDisplay}
         </p>
      </div>

      <div className="w-full flex justify-center items-center">
        <a 
          href={isPreview ? googleCalendarUrl : "#"}
          target={isPreview ? "_blank" : "_self"}
          rel="noopener noreferrer"
          onClick={(e) => { if (!isPreview) e.preventDefault(); }}
          style={{
            ...btnStyle,
            backgroundColor: (s as any).btnBackgroundColor || "#000",
            color: (s as any).btnColor || "#fff",
            borderRadius: (s as any).btnBorderRadius || 99,
            padding: `${(s as any).btnPaddingTop || 12}px ${(s as any).btnPaddingRight || 32}px ${(s as any).btnPaddingBottom || 12}px ${(s as any).btnPaddingLeft || 32}px`,
          
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center", 
            textAlign: "center",
            gap: "10px",
            width: s.width === "100%" ? "100%" : "auto",
            minWidth: "180px" 
          }}
          className={cn(
            "transition-all shadow-md active:scale-95 group overflow-hidden",
            !isPreview ? "cursor-default" : "cursor-pointer"
          )}
        >
          <Calendar className="w-4 h-4 shrink-0 transition-transform group-hover:rotate-12" />
          <span className="truncate">
            {content.buttonText || "Adicionar ao Calendário"}
          </span>
        </a>
      </div>

  
     
    </div>
  );
}