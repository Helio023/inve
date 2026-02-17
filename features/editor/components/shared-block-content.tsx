"use client";
import React from "react";
import {
  MapPin,
  Video,
  Music,
  Star,
  Clock,
  Utensils,
  Heart,
  Plus,
  PlayCircle,
  ImageIcon,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { IBlock, IBlockStyles } from "../types";
import {
  getTypographyStyle,
  extractMapUrl,
  formatVideoUrl,
  getContainerStyle,
  getBackgroundStyle,
} from "../utils";
import { RsvpBlock } from "@/components/rsvp-block";

// Importe seus renderizadores específicos
import { CountdownRenderer } from "./blocks/countdown-renderer";
import { ScheduleRenderer } from "./blocks/schedule-render";
import { MenuRenderer } from "./blocks/menu-render";
import { CarouselRenderer } from "./blocks/carousel-render";
import { cn } from "@/lib/utils";

interface SharedProps {
  block: IBlock;
  styles: Partial<IBlockStyles>;
  isPreview: boolean;
  guest?: any;
  renderChild?: (colIdx: number) => React.ReactNode;
}

export const SharedBlockContent = ({
  block,
  styles: s,
  isPreview,
  guest,
  renderChild,
}: SharedProps) => {
  const blockType = block.type as string;

  switch (block.type) {
    case "HERO":
      return (
        <div
          className="w-full flex-1 flex flex-col relative"
          style={{
            ...getContainerStyle(s),
            ...getBackgroundStyle(s),
            justifyContent: (s as any).justifyContent || "center",
            alignItems: (s as any).alignItems || "center",
            minHeight: s.height === "auto" ? "400px" : s.height,
          }}
        >
          {block.content.image && (
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute inset-0 bg-black/30 z-10" />
              <img
                src={block.content.image}
                className="w-full h-full object-cover"
                style={{ objectFit: s.objectFit || "cover" }}
                alt=""
              />
            </div>
          )}
          <div className="relative z-20 w-full px-6 py-8">
            <h1 style={getTypographyStyle(s, "title")}>
              {block.content.title || "Título"}
            </h1>
            {block.content.subtitle && (
              <p style={getTypographyStyle(s, "desc")}>
                {block.content.subtitle}
              </p>
            )}
          </div>
        </div>
      );
    case "TEXT":
      return (
        <p
          className="whitespace-pre-wrap w-full"
          style={getTypographyStyle(s, "text")}
        >
          {block.content.text || "Escreva algo..."}
        </p>
      );

    case "IMAGE":
      return (
        <div
          style={getContainerStyle(s)}
          className="overflow-hidden group/img relative w-full"
        >
          {block.content.url ? (
            <img
              src={block.content.url}
              className="w-full h-full"
              style={{
                objectFit: s.objectFit || "cover",
                minHeight: s.height === "auto" ? "150px" : "100%",
              }}
              alt={block.content.alt || ""}
            />
          ) : (
            <div className="w-full h-full min-h-[200px] bg-slate-50 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-200 text-slate-400 p-8 transition-colors group-hover/img:bg-slate-100 group-hover/img:border-blue-200">
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 transition-transform group-hover/img:scale-110">
                <ImageIcon className="w-8 h-8 text-blue-500 opacity-40" />
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                  Espaço de Imagem
                </p>
                <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">
                  Carregue no painel lateral
                </p>
              </div>
            </div>
          )}
        </div>
      );

    case "VIDEO":
      const videoSrc = formatVideoUrl(block.content.url);
      return (
        <div
          style={getContainerStyle(s)}
          className="w-full h-full min-h-[250px] bg-black relative overflow-hidden group/video"
        >
          {videoSrc ? (
            <iframe
              src={videoSrc}
              className="w-full h-full absolute inset-0"
              frameBorder="0"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full min-h-[250px] bg-slate-900 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-white/10 text-slate-400 p-8 transition-colors group-hover/video:bg-slate-800">
              <div className="p-4 bg-white/5 rounded-2xl shadow-sm border border-white/10 transition-transform group-hover/video:scale-110 duration-300">
                <PlayCircle className="w-8 h-8 text-red-500 opacity-60" />
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/60">
                  Player de Vídeo
                </p>
                <p className="text-[9px] text-white/40 font-bold uppercase mt-1">
                  Insira o link do YouTube no painel lateral
                </p>
              </div>
            </div>
          )}
        </div>
      );

    case "MAP":
      const mapSrc = extractMapUrl(block.content.link);
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${block.content.venueName || ""} ${block.content.address || ""}`)}`;

      return (
        <div
          className="w-full flex-1 flex flex-col relative"
          style={{
            minHeight: s.height === "auto" ? "350px" : "100%",
            height: "100%",
            flex: 1,
          }}
        >
          <div className="absolute inset-0 z-0 bg-slate-100">
            {mapSrc ? (
              <iframe
                width="100%"
                height="100%"
                src={mapSrc}
                style={{ border: 0 }}
                className={cn(!isPreview && "pointer-events-none")}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-300">
                <MapPin className="w-10 h-10" />
              </div>
            )}
          </div>
          <div className="relative z-10 mt-auto p-4 w-full">
            <div
              className="p-5 rounded-xl shadow-lg backdrop-blur-sm"
              style={{
                backgroundColor: s.backgroundColor || "#fff",
                borderRadius: s.borderRadius || 16,
              }}
            >
              <h3 style={getTypographyStyle(s, "title")}>
                {block.content.venueName || "Local"}
              </h3>
              <p style={getTypographyStyle(s, "desc")}>
                {block.content.address}
              </p>
              <a
                href={isPreview ? googleMapsUrl : "#"}
                target={isPreview ? "_blank" : "_self"}
                className={cn(
                  "mt-4 py-2 px-4 text-center font-bold flex items-center justify-center gap-2 transition-all block",
                  !isPreview && "cursor-default",
                )}
                style={{
                  ...getTypographyStyle(s, "btn"),
                  backgroundColor: (s as any).btnBackgroundColor || "#000",
                  color: (s as any).btnColor || "#fff",
                  borderRadius: (s as any).btnBorderRadius || 8,
                }}
              >
                <MapPin className="w-4 h-4" />{" "}
                {block.content.buttonText || "Abrir GPS"}
              </a>
            </div>
          </div>
        </div>
      );

    case "RSVP":
      return (
        <RsvpBlock
          content={block.content}
          styles={s}
          isEditorPreview={!isPreview}
          guest={guest}
        />
      );

    case "COUNTDOWN":
      return <CountdownRenderer date={block.content.date} styles={s} />;

    case "SCHEDULE":
      return (
        <ScheduleRenderer
          content={{
            title: block.content.title,
            items: (block.content.items || []).map((it: any) => ({
              ...it,
              activity: it.title,
            })),
          }}
          styles={s}
        />
      );

    case "MENU":
      return (
        <MenuRenderer
          content={block.content}
          styles={s}
          isPreview={isPreview}
        />
      );

    case "CAROUSEL":
      return (
        <div
          style={{
            ...getContainerStyle(s),
            height: s.height && s.height !== "auto" ? s.height : "400px",
          }}
          className="overflow-hidden relative w-full"
        >
          <CarouselRenderer
            content={block.content || { images: [] }}
            styles={s}
          />
        </div>
      );

    case "ICON":
      const IconTag =
        (LucideIcons as any)[block.content.name || "Heart"] || Heart;
      return (
        <div
          className="w-full flex items-center justify-center gap-4 py-4"
          style={getContainerStyle(s)}
        >
          {[...Array(block.content.repeat || 1)].map((_, i) => (
            <IconTag
              key={i}
              size={block.content.size || 32}
              style={{ color: s.color }}
            />
          ))}
        </div>
      );

    case "DIVIDER":
      return (
        <div
          className="w-full flex items-center py-4"
          style={{
            justifyContent:
              block.content.align === "left"
                ? "flex-start"
                : block.content.align === "right"
                  ? "flex-end"
                  : "center",
          }}
        >
          <div
            style={{
              width: block.content.width || "50%",
              height: (s as any).height || "2px",
              backgroundColor: s.color || s.borderColor || "#e2e8f0",
              borderRadius: "2px",
            }}
          />
        </div>
      );

    case "COLUMNS":
      return (
        <div
          className={cn(
            "grid gap-4 w-full transition-all",
            !isPreview &&
              !s.backgroundColor &&
              "bg-slate-50/30 p-2 rounded-xl border border-slate-100",
          )}
          style={{
            gridTemplateColumns: `repeat(${block.content.cols || 1}, minmax(0, 1fr))`,
          }}
        >
          {[...Array(block.content.cols || 1)].map((_, i) => (
            <div key={i} className="flex flex-col gap-4">
              {renderChild && renderChild(i)}
            </div>
          ))}
        </div>
      );

    case "DRESS_CODE":
      return (
        <div
          className="p-8 text-center flex flex-col items-center gap-4"
          style={getContainerStyle(s)}
        >
          <h2 style={getTypographyStyle(s, "title")}>
            {block.content.title || "Dress Code"}
          </h2>
          {block.content.image && (
            <img
              src={block.content.image}
              className="my-4 max-w-[200px] rounded-xl shadow-md"
              alt=""
            />
          )}
          <p style={getTypographyStyle(s, "desc")}>
            {block.content.description}
          </p>
        </div>
      );

    case "FAQ":
      return (
        <div className="w-full space-y-6 p-6" style={getContainerStyle(s)}>
          <h3 style={getTypographyStyle(s, "title")} className="mb-4">
            Dúvidas Frequentes
          </h3>
          {block.content.items?.map((item: any, idx: number) => (
            <div
              key={idx}
              className="text-left border-b border-black/5 pb-4 last:border-0"
            >
              <h4
                style={getTypographyStyle(s, "title")}
                className="text-sm mb-1"
              >
                {item.q}
              </h4>
              <p
                style={getTypographyStyle(s, "desc")}
                className="text-xs opacity-70"
              >
                {item.a}
              </p>
            </div>
          ))}
        </div>
      );

    case "SONG_REQUEST":
      return (
        <div className="p-6 w-full" style={getContainerStyle(s)}>
          <h3 style={getTypographyStyle(s, "title")}>
            {block.content.title || "Peça uma música"}
          </h3>
          <div className="mt-4 flex gap-2">
            <div
              className="flex-1 p-3 border rounded-xl"
              style={{
                ...getTypographyStyle(s, "input"),
                backgroundColor: (s as any).inputBackgroundColor || "#fff",
              }}
            >
              <span className="opacity-40">
                {block.content.placeholder || "Música..."}
              </span>
            </div>

            <div
              className="p-3 text-white rounded-xl flex items-center gap-2"
              style={{
                ...getTypographyStyle(s, "btn"),
                backgroundColor: (s as any).btnBackgroundColor || "#000",
                color: (s as any).btnColor || "#fff",
              }}
            >
              {block.content.buttonText || "Pedir"}{" "}
              <Music className="w-4 h-4" />
            </div>
          </div>
        </div>
      );
    case "BUTTON":
      return (
        <div
          className="w-full flex"
          style={{ justifyContent: (s as any).alignSelf || "center" }}
        >
          <div
            className="px-8 py-3 font-bold transition-all text-center"
            style={{
              backgroundColor: (s as any).btnBackgroundColor || "#000",
              color: (s as any).btnColor || "#fff",
              borderRadius: (s as any).btnBorderRadius || 8,
              fontSize: (s as any).btnFontSize,
              width: s.width === "100%" ? "100%" : "auto",
            }}
          >
            {block.content.text || "Botão"}
          </div>
        </div>
      );

    case "SAVE_THE_DATE":
      const eventTitle = block.content.title || "Guarde esta Data";
      const eventDate = block.content.date || "2026-05-20";
      const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${eventDate.replace(/-/g, "")}T100000Z/${eventDate.replace(/-/g, "")}T220000Z`;

      return (
        <div
          className="py-12 px-6 text-center flex flex-col items-center gap-6"
          style={getContainerStyle(s)}
        >
          <div className="h-px w-16 bg-current opacity-30" />
          <h2
            style={getTypographyStyle(s, "title")}
            className="leading-tight text-3xl"
          >
            {eventTitle}
          </h2>
          <div className="py-4 px-10 border-y border-current/10 my-2">
            <p
              style={getTypographyStyle(s, "desc")}
              className="tracking-[0.2em] font-black text-xl"
            >
              {block.content.dateDisplay || "20 de Maio de 2026"}
            </p>
          </div>

          <a
            href={isPreview ? calUrl : "#"}
            onClick={(e) => {
              if (!isPreview) e.preventDefault();
            }}
            style={{
              ...getTypographyStyle(s, "btn"),
              backgroundColor: (s as any).btnBackgroundColor || "#000",
              color: (s as any).btnColor || "#fff",
              borderRadius: (s as any).btnBorderRadius || 99,
              padding: "10px 24px",
            }}
            className={cn(
              "flex items-center gap-2 transition-all shadow-md active:scale-95",
              !isPreview && "cursor-default",
            )}
          >
            <LucideIcons.Calendar className="w-4 h-4" />
            {block.content.buttonText || "Adicionar ao Calendário"}
          </a>
          <div className="h-px w-16 bg-current opacity-30" />
        </div>
      );

    default:
      return (
        <div className="p-10 text-center opacity-30 border border-dashed rounded-xl">
          Elemento {blockType}
        </div>
      );
  }
};
