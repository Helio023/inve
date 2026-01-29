"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PublicBlockRenderer } from "./public-block-viewer";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_PAGE_STYLES } from "@/features/editor/types";
import { EventInteractionProvider } from "@/features/editor/components/event-interaction-context";
import { BackgroundMusicPlayer } from "./BackgroundMusicPlayer";

interface EventViewerProps {
  pages: any[];
  isPublished?: boolean;
  isEditorPreview?: boolean;
  settings?: {
    music?: { isEnabled: boolean; url?: string; autoPlay: boolean };
    navigation?: { direction: "horizontal" | "vertical"; effect: "slide" | "fade" | "scale" | "cube" };
  };
}

export function EventViewer({
  pages,
  isPublished,
  isEditorPreview,
  settings,
}: EventViewerProps) {
  const [[page, direction], setPage] = useState([0, 0]);
  
  // Refs para lógica de toque manual (Vertical Mode)
  const touchStartY = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const navDirection = settings?.navigation?.direction || "horizontal";
  const navEffect = settings?.navigation?.effect || "slide";
  const activePage = pages[page] || pages[0];

  const paginate = useCallback((newDirection: number) => {
    const newPage = page + newDirection;
    if (newPage >= 0 && newPage < pages.length) {
      setPage([newPage, newDirection]);
    }
  }, [page, pages.length]);

  // --- LÓGICA DE TOQUE INTELIGENTE (VERTICAL) ---
  const handleTouchStart = (e: React.TouchEvent) => {
    // Guarda onde o dedo tocou inicialmente
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (navDirection !== "vertical") return;

    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY; // Positivo = Swipe Up (Próximo)
    const threshold = 60; // Sensibilidade
    const container = scrollContainerRef.current;

    if (!container) return;

    // Lógica: 
    // 1. Swipe UP (Ir para Próximo) -> Só se estivermos no final do scroll
    // 2. Swipe DOWN (Ir para Anterior) -> Só se estivermos no topo do scroll

    const isAtBottom = Math.abs(container.scrollHeight - container.scrollTop - container.clientHeight) < 2;
    const isAtTop = container.scrollTop === 0;

    // Próximo Slide
    if (deltaY > threshold && isAtBottom) {
      paginate(1);
    }
    
    // Slide Anterior
    if (deltaY < -threshold && isAtTop) {
      paginate(-1);
    }
  };

  // --- LÓGICA DE ARRASTO (HORIZONTAL - FRAMER MOTION) ---
  const onDragEnd = (e: any, { offset, velocity }: any) => {
    const swipeConfidenceThreshold = 10000;
    const swipePowerX = Math.abs(offset.x) * velocity.x;

    if (navDirection === "horizontal") {
      if (offset.x < -50 || swipePowerX < -swipeConfidenceThreshold) paginate(1);
      else if (offset.x > 50 || swipePowerX > swipeConfidenceThreshold) paginate(-1);
    }
  };

  // Teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (navDirection === "horizontal") {
        if (e.key === "ArrowRight") paginate(1);
        if (e.key === "ArrowLeft") paginate(-1);
      } else {
        if (e.key === "ArrowDown") paginate(1);
        if (e.key === "ArrowUp") paginate(-1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [paginate, navDirection]);

  // --- VARIANTES DE ANIMAÇÃO ---
  const variants = {
    slide: {
      enter: (direction: number) => {
        if (navDirection === "vertical") return { y: direction > 0 ? "100%" : "-100%", opacity: 1, zIndex: 1 };
        return { x: direction > 0 ? "100%" : "-100%", opacity: 1, zIndex: 1 };
      },
      center: { zIndex: 1, x: 0, y: 0, opacity: 1 },
      exit: (direction: number) => {
        if (navDirection === "vertical") return { zIndex: 0, y: direction < 0 ? "100%" : "-100%", opacity: 1 };
        return { zIndex: 0, x: direction < 0 ? "100%" : "-100%", opacity: 1 };
      },
    },
    fade: {
      enter: { opacity: 0, zIndex: 1 },
      center: { opacity: 1, zIndex: 1 },
      exit: { opacity: 0, zIndex: 0 },
    },
    scale: {
      enter: (direction: number) => {
        if (navDirection === "vertical") return { y: direction > 0 ? "100%" : "-100%", scale: 1, opacity: 1, zIndex: 2 };
        return { x: direction > 0 ? "100%" : "-100%", scale: 1, opacity: 1, zIndex: 2 };
      },
      center: { x: 0, y: 0, scale: 1, opacity: 1, zIndex: 2 },
      exit: (direction: number) => ({ x: 0, y: 0, scale: 0.9, opacity: 0.5, zIndex: 0 }),
    },
    cube: {
      enter: (direction: number) => ({
        rotateX: navDirection === "vertical" ? (direction > 0 ? 90 : -90) : 0,
        rotateY: navDirection === "horizontal" ? (direction > 0 ? 90 : -90) : 0,
        opacity: 0, scale: 0.8, zIndex: 1,
      }),
      center: { rotateX: 0, rotateY: 0, opacity: 1, scale: 1, zIndex: 2, transition: { duration: 0.4 } },
      exit: (direction: number) => ({
        rotateX: navDirection === "vertical" ? (direction < 0 ? 90 : -90) : 0,
        rotateY: navDirection === "horizontal" ? (direction < 0 ? 90 : -90) : 0,
        opacity: 0, scale: 0.8, zIndex: 0, transition: { duration: 0.4 }
      }),
    }
  };

  const currentVariant = (variants as any)[navEffect] || variants.slide;

  if (!pages || pages.length === 0) return <div>Sem conteúdo.</div>;

  if (!isPublished && !isEditorPreview) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white">
        <Lock className="w-12 h-12 text-slate-500 mb-4" />
        <h1 className="text-2xl font-bold">Convite em Edição</h1>
        <p className="text-slate-400 mt-2">Este link ainda não está ativo.</p>
      </div>
    );
  }

  const pageStyles = { ...DEFAULT_PAGE_STYLES, ...(activePage.styles || {}) };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center font-sans overflow-hidden select-none p-4">
      <EventInteractionProvider>
        <div 
          className="relative w-full max-w-md h-[100dvh] bg-white shadow-xl md:rounded-2xl md:h-[90vh] overflow-hidden md:border md:border-slate-300 flex flex-col group bg-black"
          style={{ perspective: "1000px" }} 
        >
          {/* BOTÕES DE NAVEGAÇÃO (Apenas Desktop) */}
          <div className="hidden md:block">
            {page > 0 && (
              <button
                onClick={() => paginate(-1)}
                className={cn(
                  "absolute z-50 h-8 w-8 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                  navDirection === "horizontal" ? "left-4 top-1/2 -translate-y-1/2" : "top-4 left-1/2 -translate-x-1/2"
                )}
              >
                {navDirection === "horizontal" ? <ChevronLeft className="w-5 h-5 text-slate-800" /> : <ChevronUp className="w-5 h-5 text-slate-800" />}
              </button>
            )}
            {page < pages.length - 1 && (
              <button
                onClick={() => paginate(1)}
                className={cn(
                  "absolute z-50 h-8 w-8 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                  navDirection === "horizontal" ? "right-4 top-1/2 -translate-y-1/2" : "bottom-12 left-1/2 -translate-x-1/2"
                )}
              >
                {navDirection === "horizontal" ? <ChevronRight className="w-5 h-5 text-slate-800" /> : <ChevronDown className="w-5 h-5 text-slate-800" />}
              </button>
            )}
          </div>

          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={page}
              custom={direction}
              variants={currentVariant}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                y: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
                rotateX: { duration: 0.5 },
              }}
              
              // --- CORREÇÃO DE ARRASTO ---
              // Se for Vertical, DESATIVAMOS o drag do Framer Motion para não bloquear o scroll
              drag={navDirection === "horizontal" ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.5}
              onDragEnd={onDragEnd}
              // --------------------------

              className="h-full w-full absolute inset-0 z-0 flex flex-col bg-white"
              style={{
                backgroundColor: pageStyles.backgroundColor,
                backgroundImage: pageStyles.backgroundImage ? `url(${pageStyles.backgroundImage})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                // Removemos touch-action fixo para permitir a lógica manual funcionar
              }}
            >
              {pageStyles.backgroundImage && (
                <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundColor: `rgba(0,0,0,${pageStyles.backgroundOpacity})` }} />
              )}

              {/* 
                  CONTAINER COM SCROLL 
                  Ouvimos os toques aqui para detetar quando o utilizador quer mudar de slide
              */}
              <div
                ref={scrollContainerRef}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="w-full h-full overflow-y-auto no-scrollbar relative z-10 flex flex-col"
                style={{
                  paddingTop: `${pageStyles.paddingTop}px`,
                  paddingBottom: `${pageStyles.paddingBottom}px`,
                  paddingLeft: `${pageStyles.paddingLeft}px`,
                  paddingRight: `${pageStyles.paddingRight}px`,
                }}
              >
                <div className="flex flex-col min-h-full">
                  {activePage.blocks.map((block: any) => (
                    <PublicBlockRenderer key={block.id} block={block} isPreview={isEditorPreview} />
                  ))}
                  {/* Espaço extra no final para facilitar o swipe up no último elemento */}
                  <div className="h-10 w-full shrink-0" />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* INDICADORES */}
          <div 
             className={cn(
               "absolute z-50 flex justify-center gap-2 pointer-events-none transition-all",
               navDirection === "horizontal" 
                 ? "bottom-4 left-0 right-0 flex-row" 
                 : "right-2 top-1/2 -translate-y-1/2 flex-col"
             )}
          >
            {pages.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "rounded-full shadow-sm transition-all duration-300 backdrop-blur-sm",
                  idx === page ? "bg-slate-900" : "bg-slate-400/40",
                  navDirection === "horizontal" 
                     ? (idx === page ? "w-4 h-1.5" : "w-1.5 h-1.5")
                     : (idx === page ? "h-4 w-1.5" : "h-1.5 w-1.5")
                )}
              />
            ))}
          </div>
        </div>
      </EventInteractionProvider>

      {settings?.music?.isEnabled && settings?.music?.url && (
        <BackgroundMusicPlayer
          url={settings.music.url}
          autoPlay={settings.music.autoPlay}
        />
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}