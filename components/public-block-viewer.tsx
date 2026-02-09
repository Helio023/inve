"use client";

import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { Clock, MapPin, Video } from "lucide-react";

import { RsvpBlock } from "@/components/rsvp-block";
import { MenuRenderer } from "@/features/editor/components/blocks/menu-render";
import { ScheduleRenderer } from "@/features/editor/components/blocks/schedule-render";
import { CarouselRenderer } from "@/features/editor/components/blocks/carousel-render";
import { CountdownRenderer } from "@/features/editor/components/blocks/countdown-renderer";

import { DEFAULT_STYLES } from "@/features/editor/types";
import {
  getContainerStyle,
  getTypographyStyle,
  getBackgroundStyle,
} from "@/features/editor/utils";

export function PublicBlockRenderer({
  block,
  isPreview = false,
  guest,
  canAnimate = true,
}: {
  block: any;
  isPreview?: boolean;
  guest?: any;
  canAnimate?: boolean;
}) {
  const { type, content, styles: blockStyles } = block;
  const s = { ...DEFAULT_STYLES, ...block.styles };

  const finalMinHeight =
    s.minHeight || (type === "HERO" && s.height === "auto" ? 350 : s.height);

  const containerBase = getContainerStyle(s, "");
  const backgroundBase = getBackgroundStyle(s);

  const wrapperStyle: React.CSSProperties = {
    marginTop: `${s.marginTop}px`,
    marginBottom: `${s.marginBottom}px`,
    marginLeft: `${s.marginLeft}px`,
    marginRight: `${s.marginRight}px`,
    display: "flex",
    flexDirection: "column",
    width: s.width || "100%",
    minHeight: finalMinHeight,
    position: "relative",
  };

  const contentStyle: React.CSSProperties = {
    ...containerBase,
    ...backgroundBase,
    flex: 1,
    display: type === "DIVIDER" || type === "MAP" ? "block" : "flex",
    flexDirection: "column",
    justifyContent: s.justifyContent || "center",
    alignItems: s.alignItems || "stretch",
    textAlign: s.textAlign as any,
    position: "relative",
    overflow: "hidden",
  };

  const initialStates: Record<string, any> = {
    none: { opacity: 1, y: 0, x: 0, scale: 1, rotateX: 0 },
    fade: { opacity: 0 },
    "slide-up": { opacity: 0, y: 50 },
    "slide-down": { opacity: 0, y: -50 },
    "slide-left": { opacity: 0, x: 50 },
    "slide-right": { opacity: 0, x: -50 },
    "zoom-in": { opacity: 0, scale: 0.8 },
    "zoom-out": { opacity: 0, scale: 1.2 },
    flip: { opacity: 0, rotateX: 90 },
    bounce: { opacity: 0, y: 50, scale: 0.9 },
  };

  const animKey = (s.animation as string) || "none";
  const variants: Variants = {
    hidden: initialStates[animKey] || initialStates.none,
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: s.animationDuration || 0.6,
        delay: s.animationDelay || 0,
        type: animKey === "bounce" ? "spring" : "tween",
        stiffness: 100,
        damping: 15,
        ease: "easeOut",
      },
    },
  };

  const motionProps = canAnimate
    ? {
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, amount: 0.2 },
      }
    : { initial: "visible", animate: "visible" };

  return (
    <motion.div
      key={`${block.id}-${s.animation}`}
      variants={variants}
      {...motionProps}
      style={wrapperStyle}
      className={cn("shrink-0", type === "COLUMNS" ? "w-full" : "")}
    >
      <div style={contentStyle}>
        {/* HERO */}
        {type === "HERO" && (
          <>
            {content.image && (
              <div
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: `url(${content.image})`,
                  backgroundSize: s.objectFit || "cover",
                  backgroundPosition: "center",
                }}
              />
            )}
            {content.image && (
              <div className="absolute inset-0 z-0 bg-black/30" />
            )}
            <div className="relative z-10 w-full px-6">
              <h1 style={getTypographyStyle(s, "title")}>{content.title}</h1>
              {content.subtitle && (
                <p
                  style={{
                    ...getTypographyStyle(s, "desc"),
                    marginTop: s.descMarginTop
                      ? `${s.descMarginTop}px`
                      : "0.5em",
                    display:
                      s.descBorderTopWidth || s.descWidth
                        ? "inline-block"
                        : "block",
                  }}
                >
                  {content.subtitle}
                </p>
              )}
            </div>
          </>
        )}

        {/* TEXTO */}
        {type === "TEXT" && (
          <div style={{ width: "100%" }}>
            <p
              className="whitespace-pre-wrap w-full"
              style={getTypographyStyle(s, "")}
            >
              {content.text}
            </p>
          </div>
        )}

        {/* IMAGEM */}
        {type === "IMAGE" && content.url && (
          <img
            src={content.url}
            alt=""
            className="block"
            style={{
              width: "100%",
              height: "100%",
              objectFit: (s.objectFit as any) || "cover",
              display: "block",
            }}
          />
        )}

        {/* VIDEO */}
        {type === "VIDEO" && (
          <div
            className="w-full h-full relative bg-black"
            style={{ minHeight: s.height === "auto" ? "250px" : "100%" }}
          >
            {content.url ? (
              <iframe
                src={content.url.replace("watch?v=", "embed/").split("&")[0]}
                className="w-full h-full absolute inset-0"
                style={{ border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white opacity-50 absolute inset-0">
                <Video className="w-12 h-12" />
              </div>
            )}
          </div>
        )}

        {/* MAPA */}
        {type === "MAP" && (
          <div
            className="w-full h-full flex flex-col relative"
            style={{ flex: 1 }}
          >
            <div className="absolute inset-0 w-full h-full z-0">
              {content.link ? (
                <iframe
                  width="100%"
                  height="100%"
                  style={{
                    border: 0,
                    filter:
                      s.backgroundColor === "#000000"
                        ? "invert(90%) hue-rotate(180deg)"
                        : "none",
                  }}
                  src={content.link.includes("embed") ? content.link : ""}
                  loading="lazy"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 bg-slate-100 absolute inset-0">
                  <MapPin className="w-8 h-8 opacity-50" />
                </div>
              )}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(to bottom, transparent 70%, ${s.backgroundColor || "#ffffff"} 100%)`,
                }}
              />
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
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${content.venueName || ""} ${content.address || ""}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center py-2 px-4 rounded-lg font-bold transition-transform active:scale-95"
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
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DIVISOR */}
        {type === "DIVIDER" && (
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

        {/* COMPLEXOS */}
        {type === "RSVP" && (
          <div className="pointer-events-auto w-full">
            <RsvpBlock
              content={content}
              styles={s}
              isEditorPreview={isPreview}
              guest={guest}
            />
          </div>
        )}
        {type === "COUNTDOWN" && (
          <CountdownRenderer date={content?.date} styles={s} />
        )}
        {type === "MENU" && (
          <MenuRenderer content={content} styles={s} isPreview={isPreview} />
        )}
        {type === "SCHEDULE" && (
          <ScheduleRenderer content={content} styles={s} />
        )}
        {type === "CAROUSEL" && (
          <CarouselRenderer content={content} styles={s} />
        )}

        {/* COLUNAS */}
        {type === "COLUMNS" && (
          <div
            className={cn("grid w-full", `grid-cols-${content.cols || 1}`)}
            style={{ gap: "1rem" }}
          >
            {[...Array(content.cols || 1)].map((_, i) => (
              <div key={i} className="flex flex-col gap-4">
                {(content.children?.[`col${i}`] || []).map((sub: any) => (
                  <PublicBlockRenderer
                    key={sub.id}
                    block={sub}
                    isPreview={isPreview}
                    guest={guest}
                    canAnimate={canAnimate}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
