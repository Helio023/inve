'use client';

import { useState, useEffect } from "react";
import { PublicBlockRenderer } from "./public-block-viewer";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventViewerProps {
  pages: any[];
  isPublished?: boolean;
  isEditorPreview?: boolean;
}

export function EventViewer({ pages, isPublished, isEditorPreview }: EventViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const activePage = pages[currentIndex];

  // --- NAVEGAÇÃO ---
  const nextSlide = () => {
    if (currentIndex < pages.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  
  const onDragEnd = (event: any, info: any) => {
    const threshold = 50; 
    if (info.offset.x < -threshold) nextSlide();
    if (info.offset.x > threshold) prevSlide();
  };

 
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, pages.length]);

  
  if (!pages || pages.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <p>Este convite ainda não possui conteúdo.</p>
      </div>
    );
  }

  if (!isPublished && !isEditorPreview) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-slate-800">
          <Lock className="w-10 h-10 text-slate-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2 tracking-tight text-slate-100">Convite em Preparação</h1>
        <p className="text-slate-400 max-w-xs text-sm leading-relaxed">
          Este convite está sendo editado e ainda não foi publicado pela agência organizadora.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center font-sans overflow-hidden select-none">
      <div className="relative w-full max-w-md h-[100dvh] bg-white shadow-2xl md:rounded-[2.5rem] md:h-[90vh] md:my-8 overflow-hidden md:border-4 md:border-slate-800 flex flex-col">
        
        <div className="absolute top-4 left-4 right-4 z-50 flex gap-1.5 pointer-events-none">
          {pages.map((_, idx) => (
            <div key={idx} className="h-1 flex-1 bg-black/10 backdrop-blur-md rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full bg-slate-800 transition-all duration-300", 
                  idx <= currentIndex ? "w-full opacity-100" : "w-0 opacity-0"
                )} 
              />
            </div>
          ))}
        </div>

        
        <div className="absolute inset-y-0 left-0 w-[15%] z-40 cursor-pointer" onClick={prevSlide} />
        <div className="absolute inset-y-0 right-0 w-[15%] z-40 cursor-pointer" onClick={nextSlide} />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={onDragEnd}
            className="h-full w-full relative z-0 flex flex-col"
            style={{
              backgroundColor: activePage.styles?.backgroundColor || "#ffffff",
              backgroundImage: activePage.styles?.backgroundImage ? `url(${activePage.styles.backgroundImage})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* OVERLAY DE ESCURECIMENTO (Configurado no Editor) */}
            {activePage.styles?.backgroundImage && (
              <div 
                className="absolute inset-0 z-0 pointer-events-none" 
                style={{ backgroundColor: `rgba(0,0,0,${activePage.styles.backgroundOpacity || 0})` }}
              />
            )}

            {/* ÁREA DE SCROLL DO CONTEÚDO */}
            <div className="h-full w-full overflow-y-auto no-scrollbar pt-16 pb-20 px-6 relative z-10 flex flex-col justify-center">
              <div className="space-y-8">
                {activePage.blocks.map((block: any) => (
                  <PublicBlockRenderer key={block.id} block={block} />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* --- 4. INDICADOR DE PREVIEW (Apenas se for o editor) --- */}
        {isEditorPreview && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 bg-blue-600/90 backdrop-blur text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-2xl uppercase tracking-[0.2em] border border-blue-400 animate-pulse">
            Preview Ativo
          </div>
        )}

        {/* Botões de navegação auxiliares (Opcional - visíveis apenas no desktop) */}
        <div className="absolute bottom-8 left-0 right-0 hidden md:flex justify-between px-10 pointer-events-none z-40">
           <button 
             onClick={prevSlide}
             className={cn("p-2 rounded-full bg-white/20 backdrop-blur text-white pointer-events-auto transition-opacity", currentIndex === 0 && "opacity-0")}
           >
             <ChevronLeft className="w-5 h-5" />
           </button>
           <button 
             onClick={nextSlide}
             className={cn("p-2 rounded-full bg-white/20 backdrop-blur text-white pointer-events-auto transition-opacity", currentIndex === pages.length - 1 && "opacity-0")}
           >
             <ChevronRight className="w-5 h-5" />
           </button>
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}