"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RsvpBlock } from "./rsvp-block";
import { DEFAULT_STYLES } from "@/features/editor/types";

export function PublicBlockRenderer({ block }: { block: any }) {
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
    backgroundColor: s.backgroundColor,
    color: s.color,

    textAlign: s.textAlign,
    fontFamily: s.fontFamily,
    fontSize: `${s.fontSize}px`,
    fontWeight: s.fontWeight,
    fontStyle: s.fontStyle,

    paddingTop: `${s.paddingTop}px`,
    paddingBottom: `${s.paddingBottom}px`,
    paddingLeft: `${s.paddingLeft}px`,
    paddingRight: `${s.paddingRight}px`,
    marginTop: `${s.marginTop}px`,
    marginBottom: `${s.marginBottom}px`,

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

  const getFlexAlign = () => {
    if (s.textAlign === "left") return "items-start text-left";
    if (s.textAlign === "right") return "items-end text-right";
    return "items-center text-center";
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("youtube.com/watch?v="))
      return url.replace("watch?v=", "embed/");
    if (url.includes("youtu.be/"))
      return `https://www.youtube.com/embed/${url.split("/").pop()}`;
    return url;
  };

  // Animações
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
      className="w-full relative overflow-hidden"
    >
      {type === "HERO" && (
        <div
          className={cn(
            "w-full flex flex-col justify-center min-h-[200px]",
            getFlexAlign(),
          )}
          style={{
            backgroundImage: content.image ? `url(${content.image})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {content.image && (
            <div className="absolute inset-0 bg-black/30 z-0" />
          )}

          <div className="relative z-10 w-full">
            {/* Título: Usa a fonte herdada (sem font-serif forçada) e tamanho herdado */}
            <h1
              style={{ fontSize: "2.5em", fontWeight: "bold", lineHeight: 1.2 }}
            >
              {content.title || "Título"}
            </h1>

            {/* Linha decorativa: Usa a cor do texto atual */}
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

      {/* TEXTO: Removido padding fixo */}
      {type === "TEXT" && (
        <p className="whitespace-pre-wrap leading-relaxed w-full">
          {content.text}
        </p>
      )}

      {/* IMAGEM: Ocupa 100% da largura do container (respeitando padding do bloco) */}
      {type === "IMAGE" && content.url && (
        <img src={content.url} className="w-full h-auto block" alt="Imagem" />
      )}

      {/* VÍDEO */}
      {type === "VIDEO" && content.url && (
        <div className="aspect-video w-full overflow-hidden rounded-lg">
          <iframe
            src={getEmbedUrl(content.url)}
            className="w-full h-full"
            allowFullScreen
            title="Video Player"
            style={{ border: 0 }}
          />
        </div>
      )}

      {/* MAPA: Removido estilo de "Card" branco */}
      {type === "MAP" && (
        <div className="w-full">
          <div
            className="w-full aspect-video overflow-hidden border border-slate-200"
            style={{ borderRadius: s.borderRadius }}
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
              <div className="flex items-center justify-center h-full bg-slate-100 text-slate-400">
                <MapPin className="w-8 h-8" />
              </div>
            )}
          </div>
          {/* O endereço herda a cor e fonte do bloco */}
          <p className="mt-2 text-sm opacity-80">{content.address}</p>
          {content.link && (
            <div
              className={cn(
                "mt-2",
                s.textAlign === "left"
                  ? "text-left"
                  : s.textAlign === "right"
                    ? "text-right"
                    : "text-center",
              )}
            >
              <Button
                asChild
                variant="outline"
                size="sm"
                className="text-xs uppercase font-bold tracking-widest"
              >
                <a
                  href={content.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir GPS
                </a>
              </Button>
            </div>
          )}
        </div>
      )}

      {/* COUNTDOWN: Removido estilo de "cartão preto" fixo */}
      {type === "COUNTDOWN" && (
        <div className="flex justify-center gap-3 w-full">
          {[
            { l: "D", v: timeLeft.d },
            { l: "H", v: timeLeft.h },
            { l: "M", v: timeLeft.m },
            { l: "S", v: timeLeft.s },
          ].map((t, i) => (
            <div key={i} className="flex flex-col items-center">
              {/* O número herda a cor do texto do bloco. Fundo levemente contrastante. */}
              <div
                className="w-12 h-12 flex items-center justify-center rounded-lg text-xl font-bold border border-current opacity-80"
                style={{ borderColor: s.color }}
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

      {/* RSVP: Renderiza o bloco puro */}
      {type === "RSVP" && <RsvpBlock content={content} styles={s} />}

      {/* COLUNAS: Removido gap forçado, user define margem nos filhos se quiser */}
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
          style={{ gap: "1rem" }} // Gap padrão mínimo para colunas
        >
          {[...Array(content.cols || 1)].map((_, i) => (
            <div key={i} className="flex flex-col">
              {(content.children?.[`col${i}`] || []).map((subBlock: any) => (
                <PublicBlockRenderer key={subBlock.id} block={subBlock} />
              ))}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
