"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
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
import { RsvpBlock } from "@/components/rsvp-block";
import { CountdownRenderer } from "./blocks/countdown-renderer";
import { MenuRenderer } from "./blocks/menu-render";
import { ScheduleRenderer } from "./blocks/schedule-render";
import { CarouselRenderer } from "./blocks/carousel-render";

export const BlockRenderer = ({
  block,
  isSelected,
  selectedBlockId,
  onClick,
  isPreview,
  onAddChild,
  onMove,
  onDuplicate,
  onDelete,
}: any) => {
  const s = { ...DEFAULT_STYLES, ...block.styles };

  const dynamicStyles: React.CSSProperties = {
    backgroundColor: s.backgroundColor,
    color: s.color,
    fontFamily: s.fontFamily,
    fontSize: `${s.fontSize}px`,
    fontWeight: s.fontWeight as any,
    fontStyle: s.fontStyle as any,
    textAlign: s.textAlign as any,

    // Box Model
    paddingTop: `${s.paddingTop}px`,
    paddingBottom: `${s.paddingBottom}px`,
    paddingLeft: `${s.paddingLeft}px`,
    paddingRight: `${s.paddingRight}px`,
    marginTop: `${s.marginTop}px`,
    marginBottom: `${s.marginBottom}px`,
    marginLeft: `${s.marginLeft || 0}px`,
    marginRight: `${s.marginRight || 0}px`,
    width: s.width || "100%",
    height: s.height || "auto",

    // Bordas
    borderRadius: `${s.borderRadius}px`,
    borderWidth: `${s.borderWidth}px`,
    borderColor: s.borderColor,

    borderStyle: s.borderStyle as any,

    // Sombra
    boxShadow:
      s.shadow === "none"
        ? "none"
        : s.shadow === "sm"
          ? "0 1px 3px rgba(0,0,0,0.1)"
          : s.shadow === "md"
            ? "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)"
            : s.shadow === "lg"
              ? "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)"
              : "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
  };

  const animVariants = {
    none: { initial: false, animate: {} },
    fade: { initial: { opacity: 0 }, animate: { opacity: 1 } },
    "slide-up": {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
    },
    "slide-down": {
      initial: { opacity: 0, y: -30 },
      animate: { opacity: 1, y: 0 },
    },
    "slide-left": {
      initial: { opacity: 0, x: 30 },
      animate: { opacity: 1, x: 0 },
    },
    "slide-right": {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 },
    },
    "zoom-in": {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
    },
    "zoom-out": {
      initial: { opacity: 0, scale: 1.2 },
      animate: { opacity: 1, scale: 1 },
    },
    bounce: {
      initial: { opacity: 0, y: 50 },
      animate: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 260, damping: 20 },
      },
    },
    flip: {
      initial: { opacity: 0, rotateX: 90 },
      animate: { opacity: 1, rotateX: 0 },
    },
  };
  const selectedAnim = (animVariants as any)[s.animation || "none"];

  return (
    <motion.div
      onClick={(e) => {
        e.stopPropagation();
        if (!isPreview) onClick(block.id);
      }}
      style={dynamicStyles}
      className={cn(
        "relative overflow-hidden",
        !isPreview && "cursor-pointer group",
        !isPreview && isSelected && "outline-2 outline-blue-600 z-10",
        "shrink-0",
      )}
      key={block.id + JSON.stringify(s.animation)}
      initial={selectedAnim.initial}
      animate={selectedAnim.animate}
      transition={{
        duration: s.animationDuration || 0.5,
        delay: s.animationDelay || 0,
        ...selectedAnim.transition,
      }}
    >
      {isSelected && !isPreview && (
        <div className="absolute top-0 right-0 flex bg-blue-600 rounded-bl-lg shadow-lg z-30">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMove(block.id, "UP");
            }}
            className="p-1.5 text-white hover:bg-white/20"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMove(block.id, "DOWN");
            }}
            className="p-1.5 text-white hover:bg-white/20"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(block.id);
            }}
            className="p-1.5 text-white hover:bg-white/20"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(block.id);
            }}
            className="p-1.5 text-white hover:bg-red-500"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {block.type === "HERO" && (
        <div
          style={{
            backgroundImage: block.content.image
              ? `url(${block.content.image})`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100%",
            height: "100%",
            minHeight: s.height === "auto" ? "200px" : undefined,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h1 style={{ margin: 0, lineHeight: 1.2 }}>
            {block.content.title || "Título"}
          </h1>
          <p style={{ margin: 0, opacity: 0.8 }}>{block.content.subtitle}</p>
        </div>
      )}

      {/* TEXT: Mantemos apenas whitespace para quebras de linha */}
      {block.type === "TEXT" && (
        <p
          className="whitespace-pre-wrap leading-relaxed w-full"
          style={{ margin: 0 }}
        >
          {block.content.text || "Escreva aqui..."}
        </p>
      )}

     
      {block.type === "IMAGE" &&
        (block.content.url ? (
          <img
            src={block.content.url}
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              objectFit: s.objectFit as any,
            }}
            alt=""
          />
        ) : (
          <div className="h-40 bg-slate-100 flex items-center justify-center text-slate-400 text-[10px] uppercase font-bold">
            SEM IMAGEM
          </div>
        ))}
      {block.type === "CAROUSEL" && (
        <CarouselRenderer content={block.content} styles={s} />
      )}
  
      {block.type === "VIDEO" && (
        <div className="w-full h-full bg-slate-950 flex items-center justify-center text-white">
          <Video className="w-10 h-10 opacity-50" />
        </div>
      )}

      {block.type === "MAP" && (
        <div
          style={{
            width: "100%",
            height: "100%",
            minHeight: s.height === "auto" ? "200px" : undefined,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* MOLDURA DO MAPA */}
          <div
            className="relative w-full flex-1 overflow-hidden"
            style={{
              backgroundColor: "transparent",

              borderRadius: s.borderRadius ? `${s.borderRadius}px` : undefined,
              borderWidth: s.borderWidth ? `${s.borderWidth}px` : undefined,
              borderColor: s.borderColor,
              borderStyle: s.borderStyle as any,
            }}
          >
            {!isPreview && (
              <div className="absolute inset-0 z-10 cursor-move" />
            )}

            {block.content.link ? (
              <iframe
                width="100%"
                height="100%"
                loading="lazy"
                style={{ border: 0 }}
                src={
                  block.content.link.includes("embed")
                    ? block.content.link
                    : `https://www.google.com/maps/embed/v1/place?key=SUA_API_KEY&q=${encodeURIComponent(block.content.address)}`
                }
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <MapPin className="w-8 h-8 opacity-50" />
                <p className="text-[10px] uppercase font-bold mt-1">Mapa</p>
              </div>
            )}
          </div>

          {/* TEXTO DO ENDEREÇO (Mantendo estilos consistentes) */}
          {block.content.address && (
            <p
              style={{
                marginTop: "0.75rem", // mt-3 equivalente
                fontSize: `${s.fontSize}px`,
                fontWeight: s.fontWeight as any,
                fontStyle: s.fontStyle as any,
                fontFamily: s.fontFamily,
                color: s.color, // <--- Garante que a cor funciona
                textAlign: s.textAlign as any,
              }}
            >
              {block.content.address}
            </p>
          )}
        </div>
      )}
      {/* COUNTDOWN: Usa o componente isolado que criamos antes */}
      {block.type === "COUNTDOWN" && (
        <CountdownRenderer date={block.content?.date} styles={block.styles} />
      )}

      {/* RSVP: Renderiza o componente real */}
      {block.type === "RSVP" && (
        <div
          className={cn(
            isPreview
              ? "pointer-events-auto"
              : "pointer-events-none opacity-80",
          )}
        >
          <RsvpBlock
            content={block.content}
            styles={s}
            isEditorPreview={!isPreview}
          />
        </div>
      )}

      {/* COLUNAS */}
      {block.type === "COLUMNS" && (
        <div
          className={cn(
            "grid gap-4 w-full",
            `grid-cols-${block.content.cols || 1}`,
          )}
        >
          {[...Array(block.content.cols || 1)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "flex flex-col gap-4 min-h-[50px]",
                !isPreview &&
                  "border border-dashed border-slate-200 rounded p-2",
              )}
            >
              {(block.content.children?.[`col${i}`] || []).map((sub: any) => (
                <BlockRenderer
                  key={sub.id}
                  block={sub}
                  selectedBlockId={selectedBlockId}
                  onClick={onClick}
                  isPreview={isPreview}
                  onAddChild={onAddChild}
                  onMove={onMove}
                  onDuplicate={onDuplicate}
                  onDelete={onDelete}
                />
              ))}
              {!isPreview &&
                (block.content.children?.[`col${i}`] || []).length === 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddChild(block.id, i);
                    }}
                    className="flex-1 flex items-center justify-center text-slate-400 hover:text-blue-600 rounded transition-all py-4"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                )}
            </div>
          ))}
        </div>
      )}
      {block.type === "MENU" && (
        <MenuRenderer
          content={block.content}
          styles={s}
          isPreview={isPreview}
        />
      )}
      {block.type === "SCHEDULE" && (
        <ScheduleRenderer content={block.content} styles={s} />
      )}
    </motion.div>
  );
};
