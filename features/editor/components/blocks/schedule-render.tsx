"use client";

import { cn } from "@/lib/utils";
import { MapPin, User, Clock } from "lucide-react";
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

  // --- CAPTURA DE ESTILOS PUROS POR CAMADA ---
  const mainTitleStyle = getTypographyStyle(s, "title");
  const timeStyle = getTypographyStyle(s, "time");
  const activityTitleStyle = getTypographyStyle(s, "itemTitle");
  const descStyle = getTypographyStyle(s, "desc");

  // Cor de destaque para a linha e os pontos (vem da cor da borda ou cor principal)
  const accentColor = s.color || s.borderColor || "#000";

  return (
    <div className="w-full py-6 px-4">
      {/* Título Principal Dinâmico */}
      {content.title && (
        <div className="mb-10 w-full">
          <h3 style={mainTitleStyle}>{content.title}</h3>
          {/* Linha decorativa sob o título que herda a cor do texto */}
          <div
            className="h-[1px] w-12 mt-2 mx-auto opacity-20"
            style={{
              backgroundColor: mainTitleStyle.color || accentColor,
              margin:
                mainTitleStyle.textAlign === "center"
                  ? "0.5rem auto"
                  : "0.5rem 0",
            }}
          />
        </div>
      )}

      <div className="flex flex-col relative">
        {/* LINHA DO TEMPO: Agora ela é elegante e dinâmica */}
        <div
          className="absolute left-[39px] top-2 bottom-2 w-[1px] opacity-10"
          style={{ backgroundColor: accentColor }}
        />

        <div className="space-y-10">
          {items.map((item: any, idx: number) => (
            <div key={idx} className="flex gap-6 relative group">
              {/* COLUNA DA ESQUERDA: Hora e Ponto */}
              <div className="flex flex-col items-center shrink-0 w-20">
                <span
                  style={{
                    ...timeStyle,
                    // Forçamos o tempo a ser centralizado na sua pequena coluna
                    textAlign: "center",
                  }}
                  className="mb-2"
                >
                  {item.time || "00:00"}
                </span>

                {/* PONTO DA TIMELINE: Estilizado */}
                <div
                  className="w-2.5 h-2.5 rounded-full border-2 bg-white z-10 transition-transform group-hover:scale-125"
                  style={{ borderColor: accentColor }}
                />
              </div>

              {/* COLUNA DA DIREITA: Conteúdo */}
              <div className="flex-1 pt-0.5">
                <div className="flex flex-col gap-1">
                  <h4 style={activityTitleStyle}>
                    {item.title || "Atividade"}
                  </h4>

                  {item.description && (
                    <p
                      style={{
                        ...descStyle,
                        lineHeight: "1.6",
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

      {/* Caso esteja vazio no editor */}
      {items.length === 0 && (
        <div className="text-center p-12 border-2 border-dashed border-slate-100 rounded-3xl text-slate-300">
          <Clock className="w-10 h-10 mx-auto mb-3 opacity-10" />
          <p className="text-[10px] font-bold uppercase tracking-widest">
            Cronograma Vazio
          </p>
        </div>
      )}
    </div>
  );
}
