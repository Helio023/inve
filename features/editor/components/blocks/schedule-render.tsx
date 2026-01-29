"use client";

import { cn } from "@/lib/utils";
import { MapPin, User } from "lucide-react";

export function ScheduleRenderer({
  content,
  styles,
}: {
  content: any;
  styles: any;
}) {
  const items = content.items || [];

  return (
    <div className="w-full py-6 px-2">
      {content.title && (
        <h3
          className="text-2xl font-bold uppercase tracking-widest mb-10 text-center"
          style={{ color: styles.color, fontFamily: styles.fontFamily }}
        >
          {content.title}
        </h3>
      )}

      <div className="flex flex-col relative pl-2">
        {/* LINHA VERTICAL */}
        <div
          className="absolute left-[85px] top-2 bottom-4 w-px opacity-30"
          style={{ backgroundColor: styles.color }}
        />

        {items.map((item: any, idx: number) => (
          <div key={idx} className="flex gap-5 relative pb-8 group last:pb-0">
            {/* Coluna da Hora */}
            <div
              className="w-[75px] shrink-0 text-right pt-0.5 flex flex-col items-end"
              style={{ fontFamily: styles.fontFamily, color: styles.color }}
            >
              <span className="text-sm font-bold opacity-100">{item.time}</span>
              {item.endTime && (
                <span className="text-[10px] opacity-60 leading-none mt-0.5">
                  {item.endTime}
                </span>
              )}
            </div>

            {/* Ponto na Linha */}
            <div className="relative shrink-0">
              <div
                className="w-3 h-3 rounded-full border-2 bg-white z-10 relative mt-1.5"
                style={{ borderColor: styles.color }}
              />
            </div>

            {/* Conteúdo */}
            <div className="flex-1 -mt-1">
              <h4
                className="text-lg font-bold leading-tight mb-1"
                style={{ fontFamily: styles.fontFamily, color: styles.color }}
              >
                {item.activity}
              </h4>

              {/* Metadados: Local e Orador */}
              {(item.location || item.speaker) && (
                <div className="flex flex-wrap gap-3 mb-2 mt-1.5">
                  {item.location && (
                    <div
                      className="flex items-center gap-1 opacity-80"
                      style={{ color: styles.color }}
                    >
                      <MapPin className="w-3 h-3" />
                      <span
                        className="text-xs font-medium"
                        style={{ fontFamily: styles.fontFamily }}
                      >
                        {item.location}
                      </span>
                    </div>
                  )}
                  {item.speaker && (
                    <div
                      className="flex items-center gap-1 opacity-80"
                      style={{ color: styles.color }}
                    >
                      <User className="w-3 h-3" />
                      <span
                        className="text-xs font-medium"
                        style={{ fontFamily: styles.fontFamily }}
                      >
                        {item.speaker}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {item.description && (
                <p
                  className="text-xs opacity-60 whitespace-pre-line leading-relaxed"
                  style={{ fontFamily: styles.fontFamily, color: styles.color }}
                >
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center p-6 border border-dashed border-slate-300 rounded-xl text-slate-400 text-sm">
          Adicione atividades ao programa
        </div>
      )}
    </div>
  );
}
