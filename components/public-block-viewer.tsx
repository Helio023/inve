"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RsvpBlock } from "./rsvp-block";
import { DEFAULT_STYLES } from "@/features/editor/types";
import { MenuRenderer } from "@/features/editor/components/blocks/menu-render";
import { ScheduleRenderer } from "@/features/editor/components/blocks/schedule-render";
import { CarouselRenderer } from "@/features/editor/components/blocks/carousel-render";

export function PublicBlockRenderer({
  block,
  isPreview = false,
  guest,
}: {
  block: any;
  isPreview?: boolean;
  guest?: any;
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

  // --- 1. Estilos Dinâmicos do Container Principal ---
  const dynamicStyles: React.CSSProperties = {
    backgroundColor: s.backgroundColor,
    color: s.color,
    fontFamily: s.fontFamily,
    fontSize: `${s.fontSize}px`,
    fontWeight: s.fontWeight as any,
    fontStyle: s.fontStyle as any,
    textAlign: s.textAlign as any,

    // Box Model Completo
    paddingTop: `${s.paddingTop}px`,
    paddingBottom: `${s.paddingBottom}px`,
    paddingLeft: `${s.paddingLeft}px`,
    paddingRight: `${s.paddingRight}px`,
    marginTop: `${s.marginTop}px`,
    marginBottom: `${s.marginBottom}px`,
    marginLeft: `${s.marginLeft}px`,
    marginRight: `${s.marginRight}px`,

    // Dimensões
    width: s.width || "100%",
    height: s.height || "auto",

    // Bordas e Sombras Globais
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
  };

  // --- 2. Estilos Específicos para os Itens do Cronómetro ---
  const countdownItemStyle: React.CSSProperties = {
    backgroundColor: s.itemBackgroundColor,
    color: s.itemColor,
    borderWidth: `${s.itemBorderWidth}px`,
    borderColor: s.itemBorderColor,
    borderStyle: s.itemBorderStyle as any,
    borderRadius: `${s.itemBorderRadius}px`,
    boxShadow: s.itemShadow === "none" ? "none" : "0 2px 4px rgba(0,0,0,0.1)",
  };

  const getFlexAlign = () => {
    if (s.textAlign === "left") return "items-start text-left";
    if (s.textAlign === "right") return "items-end text-right";
    return "items-center text-center";
  };

  // --- CORREÇÃO DE SINTAXE AQUI ---
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("youtube.com/watch?v="))
      return url.replace("watch?v=", "embed/");
    if (url.includes("youtu.be/"))
      return `https://www.youtube.com/embed/${url.split("/").pop()}`;
    return url;
  };
  // --------------------------------

  const animVariants = {
    none: { initial: false, animate: {} },
    fade: { initial: { opacity: 0 }, animate: { opacity: 1 } },
    "slide-up": {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 },
    },
    "slide-down": {
      initial: { opacity: 0, y: -50 },
      animate: { opacity: 1, y: 0 },
    },
    "slide-left": {
      initial: { opacity: 0, x: 50 },
      animate: { opacity: 1, x: 0 },
    },
    "slide-right": {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 },
    },
    "zoom-in": {
      initial: { opacity: 0, scale: 0.5 },
      animate: { opacity: 1, scale: 1 },
    },
    "zoom-out": {
      initial: { opacity: 0, scale: 1.5 },
      animate: { opacity: 1, scale: 1 },
    },
    bounce: {
      initial: { opacity: 0, y: 100 },
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
      initial={selectedAnim.initial || false}
      whileInView={selectedAnim.animate || {}}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: s?.animationDuration || 0.5,
        delay: s?.animationDelay || 0,
        ease: "easeOut",
        ...selectedAnim.transition,
      }}
      style={dynamicStyles}
      className={cn("relative overflow-hidden", "shrink-0")}
    >
      {type === "HERO" && (
        <div
          className={cn("w-full flex flex-col justify-center", getFlexAlign())}
          style={{
            backgroundImage: content.image ? `url(${content.image})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100%",
            minHeight: s.height === "auto" ? "200px" : undefined,
          }}
        >
          {content.image && (
            <div className="absolute inset-0 bg-black/30 z-0" />
          )}

          <div className="relative z-10 w-full">
            <h1 style={{ margin: 0, lineHeight: 1.2 }}>
              {content.title || "Título"}
            </h1>
            <div
              className={cn(
                "h-px w-20 bg-current my-4 opacity-50",
                s.textAlign === "center"
                  ? "mx-auto"
                  : s.textAlign === "right"
                    ? "ml-auto"
                    : "mr-auto",
              )}
            />
            <p style={{ fontSize: "1.2em", opacity: 0.9 }}>
              {content.subtitle}
            </p>
          </div>
        </div>
      )}

      {type === "TEXT" && (
        <p
          className="whitespace-pre-wrap leading-relaxed w-full"
          style={{ margin: 0 }}
        >
          {content.text}
        </p>
      )}

      {type === "IMAGE" && content.url && (
        <img
          src={content.url}
          className="block"
          alt="Imagem"
          style={{
            width: "100%",
            height: "100%",
            objectFit: s.objectFit as any,
          }}
        />
      )}

      {type === "CAROUSEL" && <CarouselRenderer content={content} styles={s} />}

      {type === "VIDEO" && content.url && (
        <div className="w-full h-full min-h-[200px] overflow-hidden rounded-lg relative bg-black">
          <iframe
            src={(() => {
              let src = getEmbedUrl(content.url);
              const params = [];
              if (s.videoAutoplay) params.push("autoplay=1");
              if (s.videoMuted) params.push("mute=1");
              if (s.videoLoop)
                params.push("loop=1&playlist=" + src.split("/").pop());
              if (!s.videoControls) params.push("controls=0");

              return params.length > 0 ? `${src}?${params.join("&")}` : src;
            })()}
            className="w-full h-full absolute inset-0"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            title="Video Player"
            style={{ border: 0 }}
          />
        </div>
      )}

      {/* MAPA CORRIGIDO (Transparente) */}
      {type === "MAP" && (
        <div
          className="w-full h-full flex flex-col"
          style={{ minHeight: s.height === "auto" ? "200px" : undefined }}
        >
          <div
            className="w-full flex-1 relative overflow-hidden"
            style={{
              backgroundColor: "transparent",
              borderRadius: `${s.borderRadius}px`,
              borderWidth: `${s.borderWidth}px`,
              borderColor: s.borderColor,
              borderStyle: s.borderStyle as any,
            }}
          >
            {content.link ? (
              <iframe
                width="100%"
                height="100%"
                loading="lazy"
                title="Localização"
                style={{ border: 0 }}
                src={
                  content.link.includes("embed")
                    ? content.link
                    : `https://www.google.com/maps/embed/v1/place?key=SUA_API_KEY&q=${encodeURIComponent(content.address)}`
                }
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                <MapPin className="w-8 h-8" />
              </div>
            )}
          </div>

          <div
            className="mt-3 flex flex-col gap-3"
            style={{
              alignItems:
                s.textAlign === "left"
                  ? "flex-start"
                  : s.textAlign === "right"
                    ? "flex-end"
                    : "center",
              textAlign: s.textAlign as any,
            }}
          >
            {content.address && (
              <p
                className="leading-relaxed opacity-90"
                style={{
                  fontFamily: s.fontFamily,
                  color: s.color,
                  fontSize: `${s.fontSize}px`,
                  fontWeight: s.fontWeight as any,
                  fontStyle: s.fontStyle as any,
                }}
              >
                {content.address}
              </p>
            )}

            {content.link && (
              <Button
                asChild
                variant="outline"
                style={{
                  color: s.color,
                  borderColor: s.color,
                  borderRadius: "9999px",
                }}
                className="h-8 px-4 text-xs uppercase font-bold tracking-widest hover:bg-black/5 transition-colors"
              >
                <a
                  href={content.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir GPS
                </a>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* COUNTDOWN CORRIGIDO */}
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
                className="w-12 h-12 flex items-center justify-center font-bold text-xl transition-all"
                style={countdownItemStyle} 
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
        <div
          className={cn(
            isPreview ? "pointer-events-auto" : "pointer-events-auto",
          )}
        >
          <RsvpBlock content={content} styles={s} isEditorPreview={isPreview} guest={guest}/>
        </div>
      )}

      {type === "COLUMNS" && (
        <div
          className={cn(
            "grid w-full",
            content.cols === 3
              ? "grid-cols-3"
              : content.cols === 2
                ? "grid-cols-2"
                : "grid-cols-1",
          )}
          style={{ gap: "1rem" }}
        >
          {[...Array(content.cols || 1)].map((_, i) => (
            <div key={i} className="flex flex-col">
              {(content.children?.[`col${i}`] || []).map((subBlock: any) => (
                <PublicBlockRenderer
                  key={subBlock.id}
                  block={subBlock}
                  isPreview={isPreview}
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
    </motion.div>
  );
}
