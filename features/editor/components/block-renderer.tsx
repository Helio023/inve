"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  MapPin,
  ImageIcon,
  CheckSquare,
  Clock,
  Plus,
  Video,
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { DEFAULT_STYLES } from "../types";

export const BlockRenderer = ({
  block,
  isSelected,
  onClick,
  isPreview,
  onAddChild,
  onMove,
  onDuplicate,
  onDelete,
}: any) => {
  // MESCLAGEM CIRÚRGICA: Usa o estilo do bloco ou o padrão global
  const s = { ...DEFAULT_STYLES, ...block.styles };

  const [timeLeft, setTimeLeft] = useState({
    d: "00",
    h: "00",
    m: "00",
    s: "00",
  });

  const calculateTime = useCallback(() => {
    if (block.type !== "COUNTDOWN" || !block.content?.date) return;
    const target = new Date(block.content.date).getTime();
    const now = new Date().getTime();
    const diff = target - now;
    if (diff > 0) {
      setTimeLeft({
        d: Math.floor(diff / (1000 * 60 * 60 * 24))
          .toString()
          .padStart(2, "0"),
        h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          .toString()
          .padStart(2, "0"),
        m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          .toString()
          .padStart(2, "0"),
        s: Math.floor((diff % (1000 * 60)) / 1000)
          .toString()
          .padStart(2, "0"),
      });
    }
  }, [block.content?.date, block.type]);

  useEffect(() => {
    if (block.type === "COUNTDOWN") {
      calculateTime();
      const timer = setInterval(calculateTime, 1000);
      return () => clearInterval(timer);
    }
  }, [calculateTime, block.type]);

  const dynamicStyles: React.CSSProperties = {
    backgroundColor: s.backgroundColor,
    color: s.color,
    textAlign: s.textAlign as any,
    fontFamily: s.fontFamily,
    fontSize: `${s.fontSize}px`,
    fontWeight: s.fontWeight as any,
    fontStyle: s.fontStyle as any,
    paddingTop: `${s.paddingTop}px`,
    paddingBottom: `${s.paddingBottom}px`,
    paddingLeft: `${s.paddingLeft}px`,
    paddingRight: `${s.paddingRight}px`,
    marginTop: `${s.marginTop}px`,
    marginBottom: `${s.marginBottom}px`,
    borderRadius: `${s.borderRadius}px`,
    borderWidth: `${s.borderWidth}px`,
    borderColor: s.borderColor,
    borderStyle: "solid",
    boxShadow:
      s.shadow === "none"
        ? "none"
        : s.shadow === "sm"
        ? "0 1px 3px rgba(0,0,0,0.1)"
        : s.shadow === "md"
        ? "0 4px 12px rgba(0,0,0,0.12)"
        : "0 12px 24px rgba(0,0,0,0.15)",
  };

  const labelMap: Record<string, string> = {
    HERO: "Capa",
    TEXT: "Texto",
    IMAGE: "Imagem",
    VIDEO: "Vídeo",
    MAP: "Mapa",
    COUNTDOWN: "Tempo",
    RSVP: "RSVP",
    COLUMNS: "Colunas",
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (!isPreview) onClick(block.id);
      }}
      style={dynamicStyles}
      className={cn(
        "relative transition-all duration-300 group overflow-hidden",
        !isPreview &&
          "hover:outline hover:outline-1 hover:outline-blue-400 cursor-pointer",
        !isPreview &&
          isSelected &&
          "outline outline-2 outline-blue-600 z-10 shadow-xl"
      )}
    >
      {/* TOOLBAR RÁPIDA */}
      {isSelected && !isPreview && (
        <div className="absolute top-0 right-0 flex bg-blue-600 rounded-bl-lg shadow-lg z-30 animate-in fade-in zoom-in duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMove(block.id, "UP");
            }}
            className="p-1.5 text-white hover:bg-white/20"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMove(block.id, "DOWN");
            }}
            className="p-1.5 text-white hover:bg-white/20"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(block.id);
            }}
            className="p-1.5 text-white hover:bg-white/20 border-l border-white/10"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(block.id);
            }}
            className="p-1.5 text-white hover:bg-red-500 border-l border-white/10"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {block.type === "HERO" && (
        <div
          className="py-12 px-6 text-center"
          style={{
            backgroundImage: block.content.image
              ? `url(${block.content.image})`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h1 className="text-3xl font-bold leading-tight">
            {block.content.title || "Título"}
          </h1>
          <p className="opacity-80 mt-2">{block.content.subtitle}</p>
        </div>
      )}
      {block.type === "TEXT" && (
        <p className="whitespace-pre-wrap leading-relaxed">
          {block.content.text || "Escreva aqui..."}
        </p>
      )}
      {block.type === "IMAGE" && (
        <div className="w-full">
          {block.content.url ? (
            <img
              src={block.content.url}
              className="w-full h-auto block"
              alt=""
            />
          ) : (
            <div className="h-40 bg-slate-100 flex items-center justify-center text-slate-300 font-bold text-[10px]">
              SEM IMAGEM
            </div>
          )}
        </div>
      )}
      {block.type === "VIDEO" && (
        <div className="aspect-video bg-slate-950 flex items-center justify-center">
          <Video className="text-white/20 w-10 h-10" />
        </div>
      )}
      {block.type === "COUNTDOWN" && (
        <div className="py-4 flex justify-center gap-2 sm:gap-4">
          {[
            { l: "Dias", v: timeLeft.d },
            { l: "Hrs", v: timeLeft.h },
            { l: "Min", v: timeLeft.m },
            { l: "Seg", v: timeLeft.s },
          ].map((t, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="bg-slate-900 text-white w-12 h-12 rounded-lg flex items-center justify-center font-mono text-xl font-bold shadow-lg border-b-4 border-black/30">
                {t.v}
              </div>
              <span className="text-[8px] uppercase font-bold mt-2 opacity-50 tracking-tighter">
                {t.l}
              </span>
            </div>
          ))}
        </div>
      )}
      {block.type === "MAP" && (
        <div className="bg-white border border-slate-100 p-6 rounded-xl flex flex-col items-center text-center gap-2">
          <MapPin className="text-red-500 w-6 h-6 mb-1" />
          <p className="font-bold text-slate-800 text-sm">
            {block.content.address || "Localização"}
          </p>
          <div className="text-[10px] text-blue-600 flex items-center gap-1 font-bold uppercase tracking-widest text-center">
            Ver no Mapa <ExternalLink className="w-3 h-3" />
          </div>
        </div>
      )}
      {block.type === "COLUMNS" && (
        <div
          className={cn(
            "grid gap-4 w-full p-2",
            block.content.cols === 3
              ? "grid-cols-3"
              : block.content.cols === 2
              ? "grid-cols-2"
              : "grid-cols-1"
          )}
        >
          {[...Array(block.content.cols || 1)].map((_, i) => {
            const colBlocks = block.content.children?.[`col${i}`] || [];
            return (
              <div
                key={i}
                className={cn(
                  "min-h-[80px] flex flex-col gap-2 rounded-lg",
                  !isPreview &&
                    "border border-dashed border-slate-200 bg-slate-50/50 p-2"
                )}
              >
                {colBlocks.map((sub: any) => (
                  <BlockRenderer
                    key={sub.id}
                    block={sub}
                    isSelected={isSelected && sub.id === block.id}
                    onClick={onClick}
                    isPreview={isPreview}
                    onAddChild={onAddChild}
                    onMove={onMove}
                    onDuplicate={onDuplicate}
                    onDelete={onDelete}
                  />
                ))}
                {!isPreview && colBlocks.length === 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddChild(block.id, i);
                    }}
                    className="flex-1 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-white rounded transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
      {block.type === "RSVP" && (
        <div className="p-8 bg-slate-900 text-white rounded-2xl text-center shadow-xl">
          <CheckSquare className="w-8 h-8 mx-auto text-blue-400 mb-2" />
          <h3 className="font-bold uppercase tracking-widest text-[10px]">
            {block.content.title || "Confirmar Presença"}
          </h3>
        </div>
      )}
    </div>
  );
};
