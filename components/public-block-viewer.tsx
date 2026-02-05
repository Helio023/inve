"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { MapPin, Video } from "lucide-react";
import { RsvpBlock } from "@/components/rsvp-block";
import { DEFAULT_STYLES } from "@/features/editor/types";
import { MenuRenderer } from "@/features/editor/components/blocks/menu-render";
import { ScheduleRenderer } from "@/features/editor/components/blocks/schedule-render";
import { CarouselRenderer } from "@/features/editor/components/blocks/carousel-render";
import { CountdownRenderer } from "@/features/editor/components/blocks/countdown-renderer";
import { getBackgroundStyle } from "@/features/editor/utils";

export function PublicBlockRenderer({
  block,
  isPreview = false,
  guest,
  canAnimate = true, // NOVA PROP: Controla o disparo
}: {
  block: any;
  isPreview?: boolean;
  guest?: any;
  canAnimate?: boolean;
}) {
  const { type, content, styles: blockStyles } = block;
  const s = { ...DEFAULT_STYLES, ...blockStyles };

  const [timeLeft, setTimeLeft] = useState({
    d: "00",
    h: "00",
    m: "00",
    s: "00",
  });
  const calculateTime = useCallback(() => {
    if (type !== "COUNTDOWN" || !content?.date) return;
    const target = new Date(content.date).getTime();
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
  }, [content?.date, type]);

  useEffect(() => {
    if (type === "COUNTDOWN") {
      calculateTime();
      const timer = setInterval(calculateTime, 1000);
      return () => clearInterval(timer);
    }
  }, [calculateTime, type]);

  const dynamicStyles: React.CSSProperties = {
    ...getBackgroundStyle(s.backgroundColor),
    paddingTop: `${s.paddingTop}px`,
    paddingBottom: `${s.paddingBottom}px`,
    paddingLeft: `${s.paddingLeft}px`,
    paddingRight: `${s.paddingRight}px`,
    marginTop: `${s.marginTop}px`,
    marginBottom: `${s.marginBottom}px`,
    marginLeft: `${s.marginLeft}px`,
    marginRight: `${s.marginRight}px`,
    width: s.width || "100%",
    height: type === "DIVIDER" ? "auto" : s.height || "auto",
    minHeight:
      !content?.image && type === "HERO"
        ? "auto"
        : type === "DIVIDER"
          ? "auto"
          : s.height,
    borderRadius: `${s.borderRadius}px`,
    borderWidth: `${s.borderWidth}px`,
    borderColor: s.borderColor,
    borderStyle: s.borderStyle as any,
    boxShadow:
      s.shadow === "none"
        ? "none"
        : s.shadow === "sm"
          ? "0 1px 2px rgba(0,0,0,0.05)"
          : s.shadow === "md"
            ? "0 4px 6px rgba(0,0,0,0.1)"
            : "0 10px 15px rgba(0,0,0,0.1)",
    color: s.color,
    fontFamily: s.fontFamily,
    fontSize: `${s.fontSize}px`,
    textAlign: s.textAlign as any,
    lineHeight: s.lineHeight,
    letterSpacing: `${s.letterSpacing}px`,
    textTransform: (s.textTransform || "none") as any,
    display: type === "DIVIDER" || type === "MAP" ? "block" : "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch",
  };

  const initialStates: Record<string, any> = {
    none: { opacity: 1, y: 0, x: 0, scale: 1, rotateX: 0 },
    fade: { opacity: 0 },
    "slide-up": { opacity: 0, y: 50 },
    "slide-down": { opacity: 0, y: -50 },
    "slide-left": { opacity: 0, x: 50 },
    "slide-right": { opacity: 0, x: -50 },
    "zoom-in": { opacity: 0, scale: 0.5 },
    "zoom-out": { opacity: 0, scale: 1.5 },
    flip: { opacity: 0, rotateX: 90 },
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
        duration: s.animationDuration || 0.8,
        delay: s.animationDelay || 0,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      key={`${block.id}-${s.animation}-${s.animationDuration}-${s.animationDelay}`}
      initial="hidden"
      // SÓ ANIMA PARA VISIBLE SE canAnimate FOR TRUE
      animate={canAnimate ? "visible" : "hidden"}
      variants={variants}
      style={dynamicStyles}
      className={cn("relative overflow-hidden shrink-0")}
    >
      {type === "HERO" && (
        <div
          style={{
            backgroundImage: content.image ? `url(${content.image})` : "none",
            backgroundSize: s.objectFit || "cover",
            backgroundPosition: "center",
            width: "100%",
            height: "100%",
            minHeight: s.height === "auto" ? "250px" : "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {content.image && (
            <div className="absolute inset-0 bg-black/20 z-0 pointer-events-none" />
          )}
          <div className="relative z-10 w-full px-4">
            <h1
              style={{
                margin: 0,
                width: "100%",
                color: s.titleColor || s.color,
                fontSize: s.titleFontSize ? `${s.titleFontSize}px` : "2em",
                fontFamily: s.titleFontFamily || s.fontFamily,
                fontWeight: s.titleFontWeight || "bold",
                lineHeight: s.titleLineHeight || 1.2,
                letterSpacing: `${s.titleLetterSpacing || 0}px`,
                textTransform: s.titleTextTransform as any,
                textAlign: (s.titleTextAlign || s.textAlign) as any,
              }}
            >
              {content.title || "Título"}
            </h1>
            <p
              style={{
                margin: 0,
                marginTop: "0.5em",
                width: "100%",
                color: s.descColor || s.color,
                fontSize: s.descFontSize ? `${s.descFontSize}px` : "1em",
                fontFamily: s.descFontFamily || s.fontFamily,
                fontWeight: s.descFontWeight || "normal",
                textAlign: (s.descTextAlign || s.textAlign) as any,
                opacity: 0.9,
              }}
            >
              {content.subtitle}
            </p>
          </div>
        </div>
      )}
      {type === "TEXT" && (
        <div style={{ width: "100%" }}>
          <p
            className="whitespace-pre-wrap w-full"
            style={{ margin: 0, width: "100%", textAlign: s.textAlign as any }}
          >
            {content.text}
          </p>
        </div>
      )}
      {type === "IMAGE" && content.url && (
        <img
          src={content.url}
          className="block"
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: (s.objectFit as any) || "cover",
            borderRadius: s.borderRadius ? `${s.borderRadius}px` : undefined,
          }}
        />
      )}
      {type === "VIDEO" && (
        <div className="w-full h-full min-h-[200px] overflow-hidden relative bg-black">
          {content.url ? (
            <iframe
              src={content.url.replace("watch?v=", "embed/")}
              className="w-full h-full absolute inset-0"
              style={{ border: 0 }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white opacity-50">
              <Video />
            </div>
          )}
        </div>
      )}
      {type === "MAP" && (
        <div className="w-full h-full flex flex-col min-h-[200px]">
          <div className="relative w-full flex-1 overflow-hidden">
            {content.link ? (
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                src={content.link.includes("embed") ? content.link : ""}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 bg-slate-100">
                <MapPin />
              </div>
            )}
          </div>
          {content.address && (
            <p
              style={{
                marginTop: "0.75em",
                opacity: 0.9,
                textAlign: s.textAlign as any,
              }}
            >
              {content.address}
            </p>
          )}
        </div>
      )}
      {type === "COUNTDOWN" && (
        <div className="flex justify-center gap-3 w-full">
          {[
            { l: "D", v: timeLeft.d },
            { l: "H", v: timeLeft.h },
            { l: "M", v: timeLeft.m },
            { l: "S", v: timeLeft.s },
          ].map((t, i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className="w-12 h-12 flex items-center justify-center font-bold text-xl"
                style={{
                  backgroundColor: s.itemBackgroundColor,
                  color: s.itemColor,
                  borderRadius: `${s.itemBorderRadius}px`,
                  border: `${s.itemBorderWidth}px solid ${s.itemBorderColor}`,
                }}
              >
                {t.v}
              </div>
              <span className="text-[10px] uppercase font-bold mt-1 opacity-60">
                {t.l}
              </span>
            </div>
          ))}
        </div>
      )}
      {type === "RSVP" && (
        <div className="pointer-events-auto">
          <RsvpBlock
            content={content}
            styles={s}
            isEditorPreview={isPreview}
            guest={guest}
          />
        </div>
      )}
      {type === "COLUMNS" && (
        <div
          className={cn("grid w-full", `grid-cols-${content.cols || 1}`)}
          style={{ gap: "1rem" }}
        >
          {[...Array(content.cols || 1)].map((_, i) => (
            <div key={i} className="flex flex-col">
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
      {type === "MENU" && (
        <MenuRenderer content={content} styles={s} isPreview={isPreview} />
      )}
      {type === "SCHEDULE" && <ScheduleRenderer content={content} styles={s} />}
      {type === "CAROUSEL" && <CarouselRenderer content={content} styles={s} />}
    </motion.div>
  );
}
