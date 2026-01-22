"use client";

import { useState, useEffect } from "react";
import { PublicBlockRenderer } from "./public-block-viewer";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_PAGE_STYLES } from "@/features/editor/types";

interface EventViewerProps {
  pages: any[];
  isPublished?: boolean;
  isEditorPreview?: boolean;
}

export function EventViewer({
  pages,
  isPublished,
  isEditorPreview,
}: EventViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const activePage = pages[currentIndex];

  const nextSlide = () => {
    if (currentIndex < pages.length - 1) setCurrentIndex((prev) => prev + 1);
  };
  const prevSlide = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };
  const onDragEnd = (event: any, info: any) => {
    if (info.offset.x < -50) nextSlide();
    if (info.offset.x > 50) prevSlide();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, pages.length]);

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
    // Fundo da página ligeiramente mais claro para um look mais suave
    <div className="min-h-screen bg-slate-100 flex items-center justify-center font-sans overflow-hidden select-none p-4">
      {/* --- 1. ESTILO DO "MOCKUP" SUAVIZADO --- */}
      {/* Curvas menores (rounded-2xl), borda mais fina e cor mais clara */}
      <div className="relative w-full max-w-md h-[100dvh] bg-white shadow-xl md:rounded-2xl md:h-[90vh] overflow-hidden md:border md:border-slate-300 flex flex-col group">
        {/* --- BARRA DE PROGRESSO REMOVIDA --- */}

        {/* --- 2. BOTÕES DE NAVEGAÇÃO VISÍVEIS (em hover) --- */}
        {currentIndex > 0 && (
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-50 h-8 w-8 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:left-4"
          >
            <ChevronLeft className="w-5 h-5 text-slate-800" />
          </button>
        )}
        {currentIndex < pages.length - 1 && (
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-50 h-8 w-8 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:right-4"
          >
            <ChevronRight className="w-5 h-5 text-slate-800" />
          </button>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={onDragEnd}
            className="h-full w-full relative z-0 flex flex-col"
            style={{
              backgroundColor: pageStyles.backgroundColor,
              backgroundImage: pageStyles.backgroundImage
                ? `url(${pageStyles.backgroundImage})`
                : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {pageStyles.backgroundImage && (
              <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                  backgroundColor: `rgba(0,0,0,${pageStyles.backgroundOpacity})`,
                }}
              />
            )}

            <div
              className="w-full overflow-y-auto no-scrollbar relative z-10 flex-1 flex flex-col"
              style={{
                paddingTop: `${pageStyles.paddingTop}px`,
                paddingBottom: `${pageStyles.paddingBottom}px`,
                paddingLeft: `${pageStyles.paddingLeft}px`,
                paddingRight: `${pageStyles.paddingRight}px`,
              }}
            >
              <div className="flex flex-col">
                {activePage.blocks.map((block: any) => (
                  <PublicBlockRenderer key={block.id} block={block} />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* --- 3. INDICADORES DE PONTO (em vez da barra) --- */}
        <div className="absolute bottom-4 left-0 right-0 z-50 flex justify-center gap-2 pointer-events-none">
          {pages.map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "h-2 rounded-full shadow-sm transition-all duration-300",
                idx === currentIndex
                  ? "w-4 bg-slate-800"
                  : "w-2 bg-slate-800/30",
              )}
            />
          ))}
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
