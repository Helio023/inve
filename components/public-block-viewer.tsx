'use client';

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { MapPin, ExternalLink, CheckSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RsvpBlock } from "./rsvp-block";

export function PublicBlockRenderer({ block }: { block: any }) {
  const { type, content, styles: s } = block;

  // --- LÓGICA DO CRONÓMETRO ---
  const [timeLeft, setTimeLeft] = useState({ d: "00", h: "00", m: "00", s: "00" });

  const calculateTime = useCallback(() => {
    if (type !== 'COUNTDOWN' || !content?.date) return;
    const target = new Date(content.date).getTime();
    const now = new Date().getTime();
    const diff = target - now;

    if (diff > 0) {
      setTimeLeft({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, '0'),
        h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0'),
        m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0'),
        s: Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0')
      });
    }
  }, [content?.date, type]);

  useEffect(() => {
    if (type === "COUNTDOWN") {
      calculateTime();
      const timer = setInterval(calculateTime, 1000);
      return () => clearInterval(timer);
    }
  }, [calculateTime, type]);

  // --- APLICAÇÃO DE ESTILOS (IGUAL AO EDITOR) ---
  const dynamicStyles: React.CSSProperties = {
    backgroundColor: s?.backgroundColor || "transparent",
    color: s?.color || "inherit",
    textAlign: s?.textAlign || "left",
    fontFamily: s?.fontFamily || "inherit",
    fontSize: s?.fontSize ? `${s.fontSize}px` : undefined,
    fontWeight: s?.fontWeight || "normal",
    fontStyle: s?.fontStyle || "normal",
    paddingTop: `${s?.paddingTop || 0}px`,
    paddingBottom: `${s?.paddingBottom || 0}px`,
    paddingLeft: `${s?.paddingLeft || 0}px`,
    paddingRight: `${s?.paddingRight || 0}px`,
    marginTop: `${s?.marginTop || 0}px`,
    marginBottom: `${s?.marginBottom || 0}px`,
    borderRadius: `${s?.borderRadius || 0}px`,
    borderWidth: `${s?.borderWidth || 0}px`,
    borderColor: s?.borderColor || "transparent",
    borderStyle: "solid",
    boxShadow: s?.shadow === 'none' ? "none" : 
               s?.shadow === 'sm' ? "0 2px 4px rgba(0,0,0,0.05)" : 
               s?.shadow === 'md' ? "0 10px 25px rgba(0,0,0,0.1)" : "0 20px 40px rgba(0,0,0,0.15)",
  };

  switch (type) {
    case "HERO":
      const hasBgImage = !!content.image;
      return (
        <div
          style={{
            ...dynamicStyles,
            backgroundImage: hasBgImage ? `url(${content.image})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className={cn(
            "flex flex-col items-center justify-center py-20 relative overflow-hidden min-h-[50vh]",
            hasBgImage ? "text-white" : ""
          )}
        >
          {hasBgImage && <div className="absolute inset-0 bg-black/40 z-0" />}
          <div className="relative z-10 w-full px-6 flex flex-col items-center">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-center drop-shadow-md">
              {content.title || "Título"}
            </h1>
            <div className="text-lg opacity-90 uppercase tracking-widest border-t border-b py-2 border-current mt-4 inline-block">
              {content.subtitle}
            </div>
          </div>
        </div>
      );

    case "TEXT":
      return (
        <div style={dynamicStyles}>
          <p className="whitespace-pre-wrap leading-relaxed">{content.text}</p>
        </div>
      );

    case "IMAGE":
      if (!content.url) return null;
      return (
        <div style={dynamicStyles} className="overflow-hidden">
          <img src={content.url} className="w-full h-auto block" alt="Imagem" />
        </div>
      );

    case "VIDEO":
      if (!content.url) return null;
      // Converte link do Youtube para Embed se necessário
      const getEmbedUrl = (url: string) => {
        if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
        if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/');
        return url;
      };
      return (
        <div style={dynamicStyles} className="overflow-hidden aspect-video">
          <iframe 
            src={getEmbedUrl(content.url)} 
            className="w-full h-full" 
            allowFullScreen 
          />
        </div>
      );

    case "MAP":
      return (
        <div style={dynamicStyles}>
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl flex flex-col items-center text-center gap-3 border border-white/20">
            <div className="p-3 bg-red-50 rounded-full text-red-500 shadow-sm">
              <MapPin className="w-6 h-6" />
            </div>
            <p className="font-bold text-slate-800 leading-tight">{content.address || "Localização"}</p>
            {content.link && (
              <Button asChild variant="outline" size="sm" className="rounded-full border-slate-200 text-blue-600 font-bold text-[10px] uppercase">
                <a href={content.link} target="_blank">Abrir GPS</a>
              </Button>
            )}
          </div>
        </div>
      );

    case "COUNTDOWN":
      return (
        <div style={dynamicStyles}>
          <div className="flex justify-center gap-3">
            {[ {l: 'Dias', v: timeLeft.d}, {l: 'Hrs', v: timeLeft.h}, {l: 'Min', v: timeLeft.m}, {l: 'Seg', v: timeLeft.s} ].map((t, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="bg-slate-900 text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-xl font-mono text-xl md:text-2xl font-bold shadow-xl">
                  {t.v}
                </div>
                <span className="text-[9px] uppercase font-bold mt-2 opacity-50 tracking-tighter">{t.l}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case "RSVP":
      return <RsvpBlock content={content} styles={s} />;

    // --- CORREÇÃO: ADICIONADO O CASO COLUMNS RECURSIVO ---
    case "COLUMNS":
      return (
        <div 
          style={dynamicStyles}
          className={cn(
            "grid gap-4 w-full",
            content.cols === 3 ? "grid-cols-3" : content.cols === 2 ? "grid-cols-2" : "grid-cols-1"
          )}
        >
          {[...Array(content.cols || 1)].map((_, i) => {
            const colBlocks = content.children?.[`col${i}`] || [];
            return (
              <div key={i} className="flex flex-col gap-4">
                {colBlocks.map((subBlock: any) => (
                  <PublicBlockRenderer key={subBlock.id} block={subBlock} />
                ))}
              </div>
            );
          })}
        </div>
      );

    default:
      return null;
  }
}