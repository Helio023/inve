"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ImageIcon, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function CarouselRenderer({
  content,
  styles,
}: {
  content: any;
  styles: any;
}) {
  // 1. Filtra URLs válidas com segurança máxima
  const images = Array.isArray(content?.images) 
    ? content.images.filter((img: any) => img?.url && typeof img.url === "string" && img.url.trim() !== "")
    : [];

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const autoplay = content?.autoplay ?? true;
  const intervalTime = (content?.interval || 3) * 1000;
  const effect = content?.effect || "slide";

  // Sincroniza o índice se a lista de imagens mudar
  useEffect(() => {
    if (index >= images.length) {
      setIndex(0);
    }
  }, [images.length, index]);

  // Autoplay
  useEffect(() => {
    if (!autoplay || images.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % images.length);
    }, intervalTime);
    return () => clearInterval(timer);
  }, [autoplay, intervalTime, images.length]);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setIndex((prev) => (prev + newDirection + images.length) % images.length);
  };

  const variants = {
    slide: {
      initial: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
      animate: { x: 0, opacity: 1 },
      exit: (dir: number) => ({ x: dir < 0 ? "100%" : "-100%", opacity: 0 }),
    },
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
  };

  // PLACEHOLDER: Se não houver imagens válidas, mostra o esqueleto
  if (images.length === 0) {
    return (
      <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-slate-50 text-slate-400 border-2 border-dashed border-slate-200 rounded-[inherit]">
        <div className="p-6 bg-white rounded-2xl shadow-sm flex flex-col items-center gap-3">
          <div className="relative">
            <ImageIcon className="w-10 h-10 text-blue-500 opacity-40" />
            <div className="absolute -right-1 -top-1 bg-blue-600 rounded-full p-0.5 shadow-sm">
                <Plus className="w-3 h-3 text-white" />
            </div>
          </div>
          <div className="text-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 block">Galeria de Fotos</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase mt-1 block">Carregue as imagens no painel</span>
          </div>
        </div>
      </div>
    );
  }

  // Segurança: Se por algum motivo o índice estiver fora, não tenta renderizar a imagem
  const currentImage = images[index];
  if (!currentImage?.url) return null;

  return (
    <div className="relative w-full h-full overflow-hidden group">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.img
          key={currentImage.url} // Usa a URL como chave para animação suave
          src={currentImage.url}
          alt={`Slide ${index}`}
          custom={direction}
          variants={(variants as any)[effect]}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0 w-full h-full"
          style={{ objectFit: styles.objectFit || "cover" }}
        />
      </AnimatePresence>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); paginate(-1); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40 transition-all opacity-0 group-hover:opacity-100 z-20"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); paginate(1); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40 transition-all opacity-0 group-hover:opacity-100 z-20"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-20">
            {images.map((_: any, i: number) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300 shadow-sm",
                  i === index ? "bg-white w-5" : "bg-white/40 w-1.5",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}