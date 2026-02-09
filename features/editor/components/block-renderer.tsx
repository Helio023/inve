"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2,
  Video,
  MapPin,
  ArrowRightCircle,
  Plus,
  Clock,
} from "lucide-react";
import { DEFAULT_STYLES } from "../types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Renderizadores Específicos
import { RsvpBlock } from "@/components/rsvp-block";
import { CountdownRenderer } from "./blocks/countdown-renderer";
import { MenuRenderer } from "./blocks/menu-render";
import { ScheduleRenderer } from "./blocks/schedule-render";
import { CarouselRenderer } from "./blocks/carousel-render";

// UTILS
import {
  getBackgroundStyle,
  getContainerStyle,
  getTypographyStyle,
} from "@/features/editor/utils";

export const BlockRenderer = ({
  block,
  isSelected,
  onClick,
  isPreview,
  onMove,
  onDuplicate,
  onDelete,
  pages,
  onCopyToPage,
  isFirst,
  onAddChild,
}: any) => {
  const s = { ...DEFAULT_STYLES, ...block.styles };
  const content = block.content || {};

  // --- ANIMAÇÃO ---
  const animVariants = {
    none: { initial: { opacity: 1 }, animate: { opacity: 1 } },
    fade: { initial: { opacity: 0 }, animate: { opacity: 1 } },
    "slide-up": { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } },
    "slide-down": { initial: { opacity: 0, y: -30 }, animate: { opacity: 1, y: 0 } },
    "slide-left": { initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 } },
    "slide-right": { initial: { opacity: 0, x: -50 }, animate: { opacity: 1, x: 0 } },
    "zoom-in": { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 } },
    "zoom-out": { initial: { opacity: 0, scale: 1.2 }, animate: { opacity: 1, scale: 1 } },
    flip: { initial: { opacity: 0, rotateX: 90 }, animate: { opacity: 1, rotateX: 0 } },
    bounce: { initial: { opacity: 0, y: 50, scale: 0.9 }, animate: { opacity: 1, y: 0, scale: 1 } },
  };

  // CORREÇÃO AQUI: Adicionado '|| animVariants.none' para evitar crash se a animação não existir
  const selectedAnim = (animVariants as any)[s.animation] || animVariants.none;

  const motionProps = isPreview
    ? {
        initial: selectedAnim.initial,
        whileInView: selectedAnim.animate,
        viewport: { once: true, amount: 0.1 },
      }
    : {
        initial: selectedAnim.initial,
        animate: selectedAnim.animate,
      };

  // --- ESTILOS ---
  const containerBase = getContainerStyle(s, "");
  const backgroundBase = getBackgroundStyle(s);

  // --- CÁLCULO DE ALTURA UNIFICADO ---
  const finalMinHeight = s.minHeight || (block.type === "HERO" && s.height === "auto" ? 350 : s.height);

  const contentStyles: React.CSSProperties = {
    ...containerBase,
    ...backgroundBase,
    display: "flex",
    flexDirection: "column",
    width: s.width || "100%",
    minHeight: finalMinHeight,
    position: "relative",
    overflow: "hidden",
    // Alinhamentos dinâmicos
    justifyContent: s.justifyContent || "center",
    alignItems: s.alignItems || "stretch",
    textAlign: s.textAlign as any,
  };

  const wrapperStyles: React.CSSProperties = {
    marginTop: `${s.marginTop}px`,
    marginBottom: `${s.marginBottom}px`,
    marginLeft: `${s.marginLeft}px`,
    marginRight: `${s.marginRight}px`,
    position: "relative",
    zIndex: isSelected ? 20 : 1,
    display: "flex", // Garante estrutura flex para o filho expandir
    flexDirection: "column",
    width: s.width || "100%",
    minHeight: finalMinHeight, // Aplica altura aqui também
  };

  return (
    <motion.div
      onClick={(e) => {
        e.stopPropagation();
        if (!isPreview) onClick(block.id);
      }}
      style={wrapperStyles}
      className={cn("group shrink-0", !isPreview && "cursor-pointer")}
      {...motionProps}
      transition={{ duration: 0.5 }}
      key={`${block.id}-${isPreview}-${s.animation}`}
    >
      {/* UI DE SELEÇÃO */}
      {!isPreview && isSelected && (
        <div key="selection-ui-wrapper">
          <div className="absolute inset-0 border-2 border-blue-600 pointer-events-none z-50 rounded-[inherit]" />
          <div
            className={cn(
              "absolute flex bg-slate-900 text-white rounded-md shadow-xl z-[60] items-center h-8 border border-white/20 transition-all",
              isFirst ? "top-2 right-2" : "-top-9 right-0",
            )}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMove(block.id, "UP");
              }}
              disabled={isFirst}
              className={cn(
                "px-2 h-full hover:bg-white/20 rounded-l-md border-r border-white/10",
                isFirst && "opacity-50 cursor-not-allowed",
              )}
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMove(block.id, "DOWN");
              }}
              className="px-2 h-full hover:bg-white/20 border-r border-white/10"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="px-2 h-full hover:bg-white/20 border-r border-white/10 outline-none">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 z-[70]">
                <DropdownMenuLabel className="text-[10px] uppercase text-slate-400">
                  Ações
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => onDuplicate(block.id)}
                  className="cursor-pointer"
                >
                  <Copy className="w-3 h-3 mr-2" /> Duplicar aqui
                </DropdownMenuItem>
                {pages && pages.length > 1 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-[10px] uppercase text-slate-400">
                      Copiar para...
                    </DropdownMenuLabel>
                    {pages.map((p: any) => (
                      <DropdownMenuItem
                        key={p.id}
                        onClick={() => onCopyToPage(block.id, p.id)}
                        className="cursor-pointer text-xs"
                      >
                        <ArrowRightCircle className="w-3 h-3 mr-2 text-slate-400" />
                        {p.title}
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(block.id);
              }}
              className="px-2 h-full hover:bg-red-600 rounded-r-md text-red-100 hover:text-white transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* --- CONTEÚDO REAL --- */}
      <div key="block-content-wrapper" style={{ ...contentStyles, flex: 1 }}>
        
        {/* HERO */}
        {block.type === "HERO" && (
          <div
            className="w-full flex-1 flex flex-col relative"
            style={{
              justifyContent: s.justifyContent || "center",
              alignItems: s.alignItems || "center",
              textAlign: s.textAlign as any,
            }}
          >
            {content.image && (
              <>
                <div
                  className="absolute inset-0 z-0"
                  style={{
                    backgroundImage: `url(${content.image})`,
                    backgroundSize: s.objectFit || "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="absolute inset-0 z-0 bg-black/30" />
              </>
            )}

            <div className="relative z-10 w-full px-6 py-8">
              <h1 style={getTypographyStyle(s, "title")}>
                {content.title || "Título"}
              </h1>
              {content.subtitle && (
                <p
                  style={{
                    ...getTypographyStyle(s, "desc"),
                    marginTop: s.descMarginTop ? `${s.descMarginTop}px` : "0.5em",
                    display: s.descBorderTopWidth || s.descWidth ? "inline-block" : "block"
                  }}
                >
                  {content.subtitle}
                </p>
              )}
            </div>
          </div>
        )}

        {/* TEXTO */}
        {block.type === "TEXT" && (
          <div style={{ width: "100%" }}>
            <p
              className="whitespace-pre-wrap w-full"
              style={getTypographyStyle(s, "")}
            >
              {content.text || "Escreva aqui..."}
            </p>
          </div>
        )}

        {/* IMAGEM */}
        {block.type === "IMAGE" && content.url ? (
          <img
            src={content.url}
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              objectFit: (s.objectFit as any) || "cover",
            }}
            alt=""
          />
        ) : block.type === "IMAGE" ? (
          <div className="h-full min-h-[150px] bg-slate-50 flex items-center justify-center text-slate-400 text-[10px] uppercase font-bold border-2 border-dashed border-slate-200">
            SEM IMAGEM
          </div>
        ) : null}

        {/* VÍDEO */}
        {block.type === "VIDEO" && (
          <div className="w-full h-full bg-slate-950 flex items-center justify-center text-white min-h-[200px] relative">
            {content.url ? (
              <iframe
                src={content.url.replace("watch?v=", "embed/").split("&")[0]}
                className="w-full h-full absolute inset-0 pointer-events-none"
                title="Video Preview"
                frameBorder="0"
              />
            ) : (
              <Video className="w-10 h-10 opacity-50" />
            )}
          </div>
        )}

        {/* MAPA */}
        {block.type === "MAP" && (
          <div className="w-full h-full flex flex-col relative" style={{ flex: 1 }}>
            <div className="absolute inset-0 w-full h-full z-0">
              {content.link ? (
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: s.backgroundColor === "#000000" ? "invert(90%) hue-rotate(180deg)" : "none" }}
                  src={content.link.includes("embed") ? content.link : ""}
                  loading="lazy"
                  className="block pointer-events-none"
                />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <MapPin className="w-10 h-10 opacity-20" />
                </div>
              )}
              <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(to bottom, transparent 70%, ${s.backgroundColor || "#ffffff"} 100%)` }} />
            </div>
            <div className="relative z-10 mt-auto p-4 w-full">
              <div
                className="p-5 rounded-xl shadow-lg backdrop-blur-sm"
                style={{
                  backgroundColor: s.backgroundColor || "#ffffff",
                  borderRadius: s.borderRadius ? `${s.borderRadius}px` : "16px",
                  border: s.borderWidth
                    ? `${s.borderWidth}px solid ${s.borderColor}`
                    : "none",
                  boxShadow:
                    s.shadow === "none"
                      ? "none"
                      : "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              >
                {content.venueName && (
                  <h3
                    style={{
                      ...getTypographyStyle(s, "title"),
                      marginBottom: "0.25rem",
                      textAlign: "center",
                    }}
                  >
                    {content.venueName}
                  </h3>
                )}
                {content.address && (
                  <p
                    style={{
                      ...getTypographyStyle(s, "desc"),
                      marginBottom: "1rem",
                      textAlign: "center",
                      opacity: 0.8,
                    }}
                  >
                    {content.address}
                  </p>
                )}
                <div className="flex items-center gap-3">
                  {content.time && (
                    <div
                      className="px-3 py-2 rounded-lg font-bold text-sm text-center min-w-[80px]"
                      style={{
                        backgroundColor: s.borderColor
                          ? `${s.borderColor}20`
                          : "#f1f5f9",
                        color: s.color,
                      }}
                    >
                      {content.time}
                    </div>
                  )}
                  <div
                    className="flex-1 flex items-center justify-center py-2 px-4 rounded-lg font-bold"
                    style={{
                      backgroundColor: s.btnBackgroundColor || "#000",
                      color: s.btnColor || "#fff",
                      borderRadius: s.btnBorderRadius
                        ? `${s.btnBorderRadius}px`
                        : "8px",
                      border: s.btnBorderWidth
                        ? `${s.btnBorderWidth}px solid ${s.btnBorderColor}`
                        : "none",
                      fontSize: s.btnFontSize ? `${s.btnFontSize}px` : "14px",
                      fontFamily: s.btnFontFamily,
                    }}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    {content.buttonText || "Abrir GPS"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DIVISOR */}
        {block.type === "DIVIDER" && (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: content.align || "center",
              padding: "10px 0",
            }}
          >
            <div
              style={{
                width: s.width && s.width !== "100%" ? s.width : "50%",
                height: s.height || "2px",
                backgroundColor: s.borderColor || s.color || "#000",
                borderRadius: "2px",
              }}
            />
          </div>
        )}

        {/* BLOCOS COMPLEXOS */}
        {block.type === "RSVP" && (
          <div
            className={cn(
              isPreview ? "pointer-events-auto" : "pointer-events-none",
            )}
          >
            <RsvpBlock
              content={content}
              styles={s}
              isEditorPreview={!isPreview}
            />
          </div>
        )}
        {block.type === "COUNTDOWN" && (
          <CountdownRenderer date={content?.date} styles={s} />
        )}
        {block.type === "MENU" && (
          <MenuRenderer content={content} styles={s} isPreview={isPreview} />
        )}
        {block.type === "SCHEDULE" && (
          <ScheduleRenderer content={content} styles={s} />
        )}
        {block.type === "CAROUSEL" && (
          <CarouselRenderer content={content} styles={s} />
        )}

        {/* COLUNAS */}
        {block.type === "COLUMNS" && (
          <div
            className={cn(
              "grid gap-4 w-full",
              `grid-cols-${content.cols || 1}`,
            )}
          >
            {[...Array(content.cols || 1)].map((_, i) => (
              <div
                key={`col-${i}`}
                className={cn(
                  "flex flex-col gap-4 min-h-[50px]",
                  !isPreview &&
                    "p-1 rounded-lg hover:bg-slate-50/50 transition-colors border border-transparent hover:border-dashed hover:border-slate-200",
                )}
              >
                {(content.children?.[`col${i}`] || []).map((sub: any) => (
                  <BlockRenderer
                    key={sub.id}
                    block={sub}
                    selectedBlockId={null}
                    onClick={onClick}
                    isPreview={isPreview}
                    pages={pages}
                    onCopyToPage={onCopyToPage}
                    onAddChild={onAddChild}
                    onMove={() => {}}
                    onDuplicate={() => {}}
                    onDelete={() => {}}
                  />
                ))}
                {!isPreview && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onAddChild) onAddChild(block.id, i);
                    }}
                    className="flex items-center justify-center w-full py-3 border-2 border-dashed border-slate-100 rounded-lg text-slate-300 hover:text-blue-500 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                  >
                    <Plus className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};