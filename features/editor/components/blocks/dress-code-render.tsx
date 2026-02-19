"use client";

import { Shirt, ImageIcon } from "lucide-react";
import { getTypographyStyle, getContainerStyle } from "@/features/editor/utils";
import { cn } from "@/lib/utils";

export function DressCodeRenderer({ content, styles }: { content: any; styles: any }) {
  const s = styles;
  
  const titleStyle = getTypographyStyle(s, "title");
  const descStyle = getTypographyStyle(s, "desc");

  const align = s.textAlign || "center";
  const alignmentClass = 
    align === "left" ? "items-start text-left" : 
    align === "right" ? "items-end text-right" : 
    "items-center text-center";

  return (
    <div 
      className={cn("w-full flex flex-col p-8 gap-8", alignmentClass)}
      style={getContainerStyle(s)}
    >
      {/* Ícone sutil de vestuário */}
      <div className="opacity-20">
        <Shirt className="w-8 h-8" />
      </div>

      <div className={cn("flex flex-col gap-3 w-full", alignmentClass)}>
        <h2 style={titleStyle} className="leading-tight">
          {content.title || "Dress Code"}
        </h2>
        <div 
          className="h-[1px] w-12 opacity-20" 
          style={{ backgroundColor: titleStyle.color || s.color || "currentColor" }} 
        />
        <p style={descStyle} className="max-w-md leading-relaxed">
          {content.description || "Descrição do traje sugerido para o evento."}
        </p>
      </div>

      {/* ÁREA DA IMAGEM / PLACEHOLDER */}
      <div className="w-full max-w-sm overflow-hidden rounded-2xl">
        {content.image ? (
          <img 
            src={content.image} 
            alt="Sugestão de Traje" 
            className="w-full h-auto object-cover shadow-lg"
          />
        ) : (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 aspect-[3/4] flex flex-col items-center justify-center gap-3 text-slate-400 p-8">
            <ImageIcon className="w-8 h-8 opacity-20" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-center">
              Adicione uma foto de sugestão
            </p>
          </div>
        )}
      </div>
    </div>
  );
}