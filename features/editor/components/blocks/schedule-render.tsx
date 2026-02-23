"use client";

import { cn } from "@/lib/utils";
import { MapPin, User, Clock } from "lucide-react";
import { getTypographyStyle } from "@/features/editor/utils";

interface ScheduleItem {
  time: string;
  title: string;
  location?: string;
  speaker?: string;
  description?: string;
}

export function ScheduleRenderer({ 
  content, 
  styles 
}: { 
  content: any; 
  styles: any;
}) {
  const items: ScheduleItem[] = content.items || [];
  const s = styles;

  // --- EXTRAÇÃO DE ESTILOS POR CAMADA (Sincronizado com Definitions.ts) ---
  const mainTitleStyle = getTypographyStyle(s, "title");
  const timeStyle = getTypographyStyle(s, "time");
  const activityTitleStyle = getTypographyStyle(s, "itemTitle");
  const locationStyle = getTypographyStyle(s, "location");
  const speakerStyle = getTypographyStyle(s, "speaker");
  const descStyle = getTypographyStyle(s, "desc");

  // Cor de destaque para a linha da timeline e os pontos decorativos
  const accentColor = s.color || s.borderColor || "#000";

  // Alinhamento do Título (Baseado no TextAlign da camada container ou title)
  const isCentered = mainTitleStyle.textAlign === "center";

  return (
    <div className="w-full py-6 px-4">
      {/* 1. TÍTULO PRINCIPAL DO CRONOGRAMA */}
      {content.title && (
        <div className={cn(
          "mb-12 w-full flex flex-col",
          isCentered ? "items-center text-center" : "items-start text-left"
        )}>
          <h3 style={mainTitleStyle}>{content.title}</h3>
          {/* Linha decorativa sob o título principal */}
          <div
            className="h-[1px] w-12 mt-2 opacity-20"
            style={{ backgroundColor: mainTitleStyle.color || accentColor }}
          />
        </div>
      )}

      <div className="flex flex-col relative">
        {/* 2. A LINHA DA TIMELINE (Dinamizada) */}
        <div
          className="absolute left-[39px] top-2 bottom-2 w-[1px] opacity-10"
          style={{ backgroundColor: accentColor }}
        />

        <div className="space-y-12">
          {items.map((item, idx) => (
            <div key={idx} className="flex gap-6 relative group">
              
              {/* COLUNA ESQUERDA: HORA E PONTO */}
              <div className="flex flex-col items-center shrink-0 w-20">
                <span 
                  style={{ 
                    ...timeStyle, 
                    textAlign: "center",
                    lineHeight: 1 
                  }} 
                  className="mb-3 block"
                >
                  {item.time || "00:00"}
                </span>
                
                {/* PONTO DE CONEXÃO: Animado e estilizado */}
                <div 
                  className="w-2.5 h-2.5 rounded-full border-2 bg-white z-10 transition-all duration-300 group-hover:scale-125" 
                  style={{ borderColor: accentColor }} 
                />
              </div>

              {/* COLUNA DIREITA: CONTEÚDO DA ATIVIDADE */}
              <div className="flex-1 pt-0.5">
                <div className="flex flex-col gap-1">
                  
                  {/* NOME DA ATIVIDADE (itemTitle) */}
                  <h4 style={activityTitleStyle}>
                    {item.title || "Atividade"}
                  </h4>

                  {/* METADADOS: LOCAL E RESPONSÁVEL (Layers independentes) */}
                  {(item.location || item.speaker) && (
                    <div className="flex flex-wrap gap-4 mt-1 mb-2">
                      {item.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 opacity-40 shrink-0" />
                          <span style={locationStyle}>
                            {item.location}
                          </span>
                        </div>
                      )}
                      {item.speaker && (
                        <div className="flex items-center gap-1.5">
                          <User className="w-3 h-3 opacity-40 shrink-0" />
                          <span style={speakerStyle}>
                            {item.speaker}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                 
                  {item.description && (
                    <p 
                      style={{ 
                        ...descStyle, 
                        lineHeight: "1.6" 
                      }} 
                      className="opacity-70"
                    >
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FALLBACK: ESTADO VAZIO */}
      {items.length === 0 && (
        <div className="text-center p-12 border-2 border-dashed border-slate-100 rounded-[2rem] text-slate-300">
          <Clock className="w-10 h-10 mx-auto mb-3 opacity-10" />
          <p className="text-[10px] font-bold uppercase tracking-widest leading-none">
            Aguardando Atividades
          </p>
        </div>
      )}
    </div>
  );
}