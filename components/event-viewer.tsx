// "use client";

// import { useState, useEffect } from "react";
// import { PublicBlockRenderer } from "./public-block-viewer";
// import { motion, AnimatePresence } from "framer-motion";
// import { Lock, ChevronLeft, ChevronRight } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { DEFAULT_PAGE_STYLES } from "@/features/editor/types";
// import { BackgroundMusicPlayer } from "./BackgroundMusicPlayer";
// import { EventInteractionProvider } from "@/features/editor/components/event-interaction-context";

// interface EventViewerProps {
//   pages: any[];
//   isPublished?: boolean;
//   isEditorPreview?: boolean;
//   settings?: {
//     music?: {
//       isEnabled: boolean;
//       url?: string;
//       autoPlay: boolean;
//     };
//   };
// }

// export function EventViewer({
//   pages,
//   isPublished,
//   isEditorPreview,
//   settings,
// }: EventViewerProps) {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const activePage = pages[currentIndex];

//   const nextSlide = () => {
//     if (currentIndex < pages.length - 1) setCurrentIndex((prev) => prev + 1);
//   };
//   const prevSlide = () => {
//     if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
//   };
//   const onDragEnd = (event: any, info: any) => {
//     if (info.offset.x < -50) nextSlide();
//     if (info.offset.x > 50) prevSlide();
//   };

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "ArrowRight") nextSlide();
//       if (e.key === "ArrowLeft") prevSlide();
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [currentIndex, pages.length]);

//   if (!pages || pages.length === 0) return <div>Sem conteúdo.</div>;

//   if (!isPublished && !isEditorPreview) {
//     return (
//       <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white">
//         <Lock className="w-12 h-12 text-slate-500 mb-4" />
//         <h1 className="text-2xl font-bold">Convite em Edição</h1>
//         <p className="text-slate-400 mt-2">Este link ainda não está ativo.</p>
//       </div>
//     );
//   }

//   const pageStyles = { ...DEFAULT_PAGE_STYLES, ...(activePage.styles || {}) };

//   return (
//     <div className="min-h-screen bg-slate-100 flex items-center justify-center font-sans overflow-hidden select-none p-4">
//       <EventInteractionProvider>
//         <div className="relative w-full max-w-md h-dvh bg-white shadow-xl md:rounded-2xl md:h-[90vh] overflow-hidden md:border md:border-slate-300 flex flex-col group">
//           {currentIndex > 0 && (
//             <button
//               onClick={prevSlide}
//               className="absolute left-2 top-1/2 -translate-y-1/2 z-50 h-8 w-8 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:left-4"
//             >
//               <ChevronLeft className="w-5 h-5 text-slate-800" />
//             </button>
//           )}
//           {currentIndex < pages.length - 1 && (
//             <button
//               onClick={nextSlide}
//               className="absolute right-2 top-1/2 -translate-y-1/2 z-50 h-8 w-8 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:right-4"
//             >
//               <ChevronRight className="w-5 h-5 text-slate-800" />
//             </button>
//           )}

//           <AnimatePresence mode="wait">
//             <motion.div
//               key={currentIndex}
//               drag="x"
//               dragConstraints={{ left: 0, right: 0 }}
//               onDragEnd={onDragEnd}
//               className="h-full w-full relative z-0 flex flex-col"
//               style={{
//                 backgroundColor: pageStyles.backgroundColor,
//                 backgroundImage: pageStyles.backgroundImage
//                   ? `url(${pageStyles.backgroundImage})`
//                   : "none",
//                 backgroundSize: "cover",
//                 backgroundPosition: "center",
//               }}
//             >
//               {pageStyles.backgroundImage && (
//                 <div
//                   className="absolute inset-0 z-0 pointer-events-none"
//                   style={{
//                     backgroundColor: `rgba(0,0,0,${pageStyles.backgroundOpacity})`,
//                   }}
//                 />
//               )}

//               <div
//                 className="w-full overflow-y-auto no-scrollbar relative z-10 flex-1 flex flex-col"
//                 style={{
//                   paddingTop: `${pageStyles.paddingTop}px`,
//                   paddingBottom: `${pageStyles.paddingBottom}px`,
//                   paddingLeft: `${pageStyles.paddingLeft}px`,
//                   paddingRight: `${pageStyles.paddingRight}px`,
//                 }}
//               >
//                 <div className="flex flex-col">
//                   {activePage.blocks.map((block: any) => (
//                     <PublicBlockRenderer key={block.id} block={block} />
//                   ))}
//                 </div>
//               </div>
//             </motion.div>
//           </AnimatePresence>

//           <div className="absolute bottom-4 left-0 right-0 z-50 flex justify-center gap-2 pointer-events-none">
//             {pages.map((_, idx) => (
//               <div
//                 key={idx}
//                 className={cn(
//                   "h-2 rounded-full shadow-sm transition-all duration-300",
//                   idx === currentIndex
//                     ? "w-4 bg-slate-800"
//                     : "w-2 bg-slate-800/30",
//                 )}
//               />
//             ))}
//           </div>
//         </div>
//       </EventInteractionProvider>
//       {settings?.music?.isEnabled && settings?.music?.url && (
//         <BackgroundMusicPlayer
//           url={settings.music.url}
//           autoPlay={settings.music.autoPlay}
//         />
//       )}

//       <style jsx global>{`
//         .no-scrollbar::-webkit-scrollbar {
//           display: none;
//         }
//         .no-scrollbar {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//       `}</style>
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { PublicBlockRenderer } from "./public-block-viewer";
// import { motion, AnimatePresence } from "framer-motion";
// import { Lock, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { DEFAULT_PAGE_STYLES } from "@/features/editor/types";
// import { BackgroundMusicPlayer } from "./BackgroundMusicPlayer";
// import { EventInteractionProvider } from "@/features/editor/components/event-interaction-context";
// // import { BackgroundMusicPlayer } from "./background-music-player"; // Verifique path
// // import { EventInteractionProvider } from "./event-interaction-context";

// interface EventViewerProps {
//   pages: any[];
//   isPublished?: boolean;
//   isEditorPreview?: boolean;
//   settings?: {
//     music?: { isEnabled: boolean; url?: string; autoPlay: boolean };
    
//     navigation?: { direction: "horizontal" | "vertical"; effect: "slide" | "fade" | "scale" | "cube" };
//   };
// }

// export function EventViewer({
//   pages,
//   isPublished,
//   isEditorPreview,
//   settings,
// }: EventViewerProps) {

//   const [[page, direction], setPage] = useState([0, 0]);

  
//   const navDirection = settings?.navigation?.direction || "horizontal";
//   const navEffect = settings?.navigation?.effect || "slide";

//   const activePage = pages[page];

 
//   const paginate = useCallback((newDirection: number) => {
//     const newPage = page + newDirection;
//     if (newPage >= 0 && newPage < pages.length) {
//       setPage([newPage, newDirection]);
//     }
//   }, [page, pages.length]);

//   // Handlers de Arrasto
//   const onDragEnd = (e: any, { offset, velocity }: any) => {
//     const swipeConfidenceThreshold = 10000;
//     const swipePower = Math.abs(offset.x) * velocity.x; // Horizontal
//     const swipePowerY = Math.abs(offset.y) * velocity.y; // Vertical

//     if (navDirection === "horizontal") {
//       if (offset.x < -50 || swipePower < -swipeConfidenceThreshold) {
//         paginate(1); // Próximo
//       } else if (offset.x > 50 || swipePower > swipeConfidenceThreshold) {
//         paginate(-1); // Anterior
//       }
//     } else {
//       // Modo TikTok (Vertical)
//       if (offset.y < -50 || swipePowerY < -swipeConfidenceThreshold) {
//         paginate(1); // Próximo (Arrasta para cima)
//       } else if (offset.y > 50 || swipePowerY > swipeConfidenceThreshold) {
//         paginate(-1); // Anterior (Arrasta para baixo)
//       }
//     }
//   };

//   // Teclado
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (navDirection === "horizontal") {
//         if (e.key === "ArrowRight") paginate(1);
//         if (e.key === "ArrowLeft") paginate(-1);
//       } else {
//         if (e.key === "ArrowDown") paginate(1);
//         if (e.key === "ArrowUp") paginate(-1);
//       }
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [paginate, navDirection]);

//   // --- MOTOR DE ANIMAÇÕES ---
//   const variants = {
//     // 1. SLIDE (Clássico ou TikTok)
//     slide: {
//       enter: (direction: number) => {
//         if (navDirection === "vertical") return { y: direction > 0 ? "100%" : "-100%", opacity: 1 };
//         return { x: direction > 0 ? "100%" : "-100%", opacity: 1 };
//       },
//       center: { x: 0, y: 0, opacity: 1 },
//       exit: (direction: number) => {
//         if (navDirection === "vertical") return { y: direction < 0 ? "100%" : "-100%", opacity: 1 };
//         return { x: direction < 0 ? "100%" : "-100%", opacity: 1 };
//       },
//     },
//     // 2. FADE (Suave)
//     fade: {
//       enter: { opacity: 0 },
//       center: { opacity: 1 },
//       exit: { opacity: 0 },
//     },
//     // 3. SCALE (Estilo iOS / Profundidade)
//     scale: {
//       enter: (direction: number) => ({
//         x: navDirection === "horizontal" ? (direction > 0 ? "100%" : "-100%") : 0,
//         y: navDirection === "vertical" ? (direction > 0 ? "100%" : "-100%") : 0,
//         scale: 1,
//         opacity: 1,
//         zIndex: 1 // Entra por cima
//       }),
//       center: { x: 0, y: 0, scale: 1, opacity: 1, zIndex: 1 },
//       exit: (direction: number) => ({
//         x: 0, 
//         y: 0, 
//         scale: 0.8, // O slide antigo fica pequeno e escuro
//         opacity: 0.5,
//         zIndex: 0 // Fica por baixo
//       }),
//     },
//     // 4. CUBE (Rotação 3D) - Extra
//     cube: {
//       enter: (direction: number) => ({
//         rotateX: navDirection === "vertical" ? (direction > 0 ? 90 : -90) : 0,
//         rotateY: navDirection === "horizontal" ? (direction > 0 ? 90 : -90) : 0,
//         opacity: 0
//       }),
//       center: { rotateX: 0, rotateY: 0, opacity: 1, zIndex: 1 },
//       exit: (direction: number) => ({
//         rotateX: navDirection === "vertical" ? (direction < 0 ? 90 : -90) : 0,
//         rotateY: navDirection === "horizontal" ? (direction < 0 ? 90 : -90) : 0,
//         opacity: 0,
//         zIndex: 0
//       }),
//     }
//   };

//   // Seleciona as variantes com base na configuração. Fallback para 'slide'
//   const currentVariant = (variants as any)[navEffect] || variants.slide;

//   if (!pages || pages.length === 0) return <div>Sem conteúdo.</div>;

//   if (!isPublished && !isEditorPreview) {
//     return (
//       <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white">
//         <Lock className="w-12 h-12 text-slate-500 mb-4" />
//         <h1 className="text-2xl font-bold">Convite em Edição</h1>
//         <p className="text-slate-400 mt-2">Este link ainda não está ativo.</p>
//       </div>
//     );
//   }

//   const pageStyles = { ...DEFAULT_PAGE_STYLES, ...(activePage.styles || {}) };

//   return (
//     <div className="min-h-screen bg-slate-100 flex items-center justify-center font-sans overflow-hidden select-none p-4">
//       <EventInteractionProvider>
//         {/* Adicionamos perspective para efeitos 3D */}
//         <div className="relative w-full max-w-md h-[100dvh] bg-white shadow-xl md:rounded-2xl md:h-[90vh] overflow-hidden md:border md:border-slate-300 flex flex-col group" style={{ perspective: 1000 }}>
          
//           {/* BOTÕES DE NAVEGAÇÃO (DESKTOP/HOVER) */}
//           {page > 0 && (
//             <button
//               onClick={() => paginate(-1)}
//               className={cn(
//                 "absolute z-50 h-8 w-8 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300",
//                 navDirection === "horizontal" 
//                   ? "left-2 top-1/2 -translate-y-1/2 md:left-4" 
//                   : "top-4 left-1/2 -translate-x-1/2"
//               )}
//             >
//               {navDirection === "horizontal" ? <ChevronLeft className="w-5 h-5 text-slate-800" /> : <ChevronUp className="w-5 h-5 text-slate-800" />}
//             </button>
//           )}
          
//           {page < pages.length - 1 && (
//             <button
//               onClick={() => paginate(1)}
//               className={cn(
//                 "absolute z-50 h-8 w-8 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300",
//                 navDirection === "horizontal" 
//                   ? "right-2 top-1/2 -translate-y-1/2 md:right-4" 
//                   : "bottom-12 left-1/2 -translate-x-1/2"
//               )}
//             >
//               {navDirection === "horizontal" ? <ChevronRight className="w-5 h-5 text-slate-800" /> : <ChevronDown className="w-5 h-5 text-slate-800" />}
//             </button>
//           )}

//           {/* ÁREA DE CONTEÚDO ANIMADA */}
//           <AnimatePresence initial={false} custom={direction} mode="popLayout">
//             <motion.div
//               key={page}
//               custom={direction}
//               variants={currentVariant}
//               initial="enter"
//               animate="center"
//               exit="exit"
//               transition={{
//                 x: { type: "spring", stiffness: 300, damping: 30 },
//                 y: { type: "spring", stiffness: 300, damping: 30 },
//                 opacity: { duration: 0.2 }
//               }}
//               // Drag dinâmico
//               drag={navDirection === "horizontal" ? "x" : "y"}
//               dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
//               dragElastic={0.5} // Dá sensação de elástico ao puxar
//               onDragEnd={onDragEnd}
//               className="h-full w-full absolute inset-0 z-0 flex flex-col bg-white" // absolute inset-0 é crucial para sobreposição correta
//               style={{
//                 backgroundColor: pageStyles.backgroundColor,
//                 backgroundImage: pageStyles.backgroundImage ? `url(${pageStyles.backgroundImage})` : "none",
//                 backgroundSize: "cover",
//                 backgroundPosition: "center",
//               }}
//             >
//               {pageStyles.backgroundImage && (
//                 <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundColor: `rgba(0,0,0,${pageStyles.backgroundOpacity})` }} />
//               )}

//               <div
//                 className="w-full h-full overflow-y-auto no-scrollbar relative z-10 flex flex-col"
//                 style={{
//                   paddingTop: `${pageStyles.paddingTop}px`,
//                   paddingBottom: `${pageStyles.paddingBottom}px`,
//                   paddingLeft: `${pageStyles.paddingLeft}px`,
//                   paddingRight: `${pageStyles.paddingRight}px`,
//                 }}
//               >
//                 <div className="flex flex-col min-h-full">
//                   {activePage.blocks.map((block: any) => (
//                     <PublicBlockRenderer key={block.id} block={block} isPreview={isEditorPreview} />
//                   ))}
//                 </div>
//               </div>
//             </motion.div>
//           </AnimatePresence>

//           {/* INDICADORES (DOTS) */}
//           <div 
//              className={cn(
//                "absolute z-50 flex justify-center gap-2 pointer-events-none transition-all",
//                navDirection === "horizontal" 
//                  ? "bottom-4 left-0 right-0 flex-row" 
//                  : "right-2 top-1/2 -translate-y-1/2 flex-col"
//              )}
//           >
//             {pages.map((_, idx) => (
//               <div
//                 key={idx}
//                 className={cn(
//                   "rounded-full shadow-sm transition-all duration-300 backdrop-blur-sm",
//                   idx === page ? "bg-slate-900" : "bg-slate-400/40",
//                   navDirection === "horizontal" 
//                      ? (idx === page ? "w-4 h-1.5" : "w-1.5 h-1.5")
//                      : (idx === page ? "h-4 w-1.5" : "h-1.5 w-1.5")
//                 )}
//               />
//             ))}
//           </div>
//         </div>
//       </EventInteractionProvider>

//       {settings?.music?.isEnabled && settings?.music?.url && (
//         <BackgroundMusicPlayer
//           url={settings.music.url}
//           autoPlay={settings.music.autoPlay}
//         />
//       )}

//       <style jsx global>{`
//         .no-scrollbar::-webkit-scrollbar { display: none; }
//         .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
//       `}</style>
//     </div>
//   );
// }


"use client";

import { useState, useEffect, useCallback } from "react";
import { PublicBlockRenderer } from "./public-block-viewer";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_PAGE_STYLES } from "@/features/editor/types";
import { EventInteractionProvider } from "@/features/editor/components/event-interaction-context";
import { BackgroundMusicPlayer } from "./BackgroundMusicPlayer";
// import { BackgroundMusicPlayer } from "@/components/background-music-player"; // Confirme o caminho
// import { EventInteractionProvider } from "./event-interaction-context";

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
  // Estado Tupla: [página_atual, direção_do_movimento]
  const [[page, direction], setPage] = useState([0, 0]);

  // Ler configurações com defaults
  const navDirection = settings?.navigation?.direction || "horizontal";
  const navEffect = settings?.navigation?.effect || "slide";

  // Garantir que não estouramos o array
  const activePage = pages[page] || pages[0];

  const paginate = useCallback((newDirection: number) => {
    const newPage = page + newDirection;
    if (newPage >= 0 && newPage < pages.length) {
      setPage([newPage, newDirection]);
    }
  }, [page, pages.length]);

  // Lógica de Arrasto (Swipe)
  const onDragEnd = (e: any, { offset, velocity }: any) => {
    const swipeConfidenceThreshold = 10000;
    const swipePowerX = Math.abs(offset.x) * velocity.x;
    const swipePowerY = Math.abs(offset.y) * velocity.y;

    if (navDirection === "horizontal") {
      if (offset.x < -50 || swipePowerX < -swipeConfidenceThreshold) {
        paginate(1); // Próximo
      } else if (offset.x > 50 || swipePowerX > swipeConfidenceThreshold) {
        paginate(-1); // Anterior
      }
    } else {
      // Modo Vertical (TikTok)
      // Arrastar para CIMA (offset negativo) vai para o PRÓXIMO slide
      if (offset.y < -50 || swipePowerY < -swipeConfidenceThreshold) {
        paginate(1); 
      } else if (offset.y > 50 || swipePowerY > swipeConfidenceThreshold) {
        paginate(-1); 
      }
    }
  };

  // Navegação por Teclado
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

  // --- ANIMAÇÕES (VARIANTS) ---
  const variants = {
    slide: {
      enter: (direction: number) => {
        if (navDirection === "vertical") return { y: direction > 0 ? "100%" : "-100%", opacity: 1 };
        return { x: direction > 0 ? "100%" : "-100%", opacity: 1 };
      },
      center: { x: 0, y: 0, opacity: 1 },
      exit: (direction: number) => {
        if (navDirection === "vertical") return { y: direction < 0 ? "100%" : "-100%", opacity: 1 };
        return { x: direction < 0 ? "100%" : "-100%", opacity: 1 };
      },
    },
    fade: {
      enter: { opacity: 0 },
      center: { opacity: 1 },
      exit: { opacity: 0 },
    },
    scale: { // Estilo Profundidade
      enter: (direction: number) => ({
        x: navDirection === "horizontal" ? (direction > 0 ? "100%" : "-100%") : 0,
        y: navDirection === "vertical" ? (direction > 0 ? "100%" : "-100%") : 0,
        scale: 0.8,
        opacity: 0,
        zIndex: 1
      }),
      center: { x: 0, y: 0, scale: 1, opacity: 1, zIndex: 1 },
      exit: (direction: number) => ({
        x: navDirection === "horizontal" ? (direction < 0 ? "50%" : "-50%") : 0, // Movimento subtil de saída
        y: navDirection === "vertical" ? (direction < 0 ? "50%" : "-50%") : 0,
        scale: 0.8,
        opacity: 0,
        zIndex: 0
      }),
    },
    cube: { // Cubo 3D
      enter: (direction: number) => ({
        rotateX: navDirection === "vertical" ? (direction > 0 ? 90 : -90) : 0,
        rotateY: navDirection === "horizontal" ? (direction > 0 ? 90 : -90) : 0,
        opacity: 0,
        scale: 0.8
      }),
      center: { rotateX: 0, rotateY: 0, opacity: 1, scale: 1, zIndex: 1 },
      exit: (direction: number) => ({
        rotateX: navDirection === "vertical" ? (direction < 0 ? 90 : -90) : 0,
        rotateY: navDirection === "horizontal" ? (direction < 0 ? 90 : -90) : 0,
        opacity: 0,
        scale: 0.8,
        zIndex: 0
      }),
    }
  };

  const currentVariant = (variants as any)[navEffect] || variants.slide;

  // Renderização
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
        {/* Adicionada perspective para efeitos 3D */}
        <div 
          className="relative w-full max-w-md h-[100dvh] bg-white shadow-xl md:rounded-2xl md:h-[90vh] overflow-hidden md:border md:border-slate-300 flex flex-col group"
          style={{ perspective: "1000px" }}
        >
          
          {/* BOTÕES DE NAVEGAÇÃO (DESKTOP/HOVER) - ADAPTÁVEIS */}
          {page > 0 && (
            <button
              onClick={() => paginate(-1)}
              className={cn(
                "absolute z-50 h-8 w-8 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                navDirection === "horizontal" 
                  ? "left-2 top-1/2 -translate-y-1/2 md:left-4" 
                  : "top-4 left-1/2 -translate-x-1/2" // Botão em cima se vertical
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
                navDirection === "horizontal" 
                  ? "right-2 top-1/2 -translate-y-1/2 md:right-4" 
                  : "bottom-12 left-1/2 -translate-x-1/2" // Botão em baixo se vertical
              )}
            >
              {navDirection === "horizontal" ? <ChevronRight className="w-5 h-5 text-slate-800" /> : <ChevronDown className="w-5 h-5 text-slate-800" />}
            </button>
          )}

          {/* ÁREA ANIMADA */}
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
                opacity: { duration: 0.3 }
              }}
              drag={navDirection === "horizontal" ? "x" : "y"} // Eixo dinâmico
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.5}
              onDragEnd={onDragEnd}
              className="h-full w-full absolute inset-0 z-0 flex flex-col bg-white" // absolute para sobreposição
              style={{
                backgroundColor: pageStyles.backgroundColor,
                backgroundImage: pageStyles.backgroundImage ? `url(${pageStyles.backgroundImage})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {pageStyles.backgroundImage && (
                <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundColor: `rgba(0,0,0,${pageStyles.backgroundOpacity})` }} />
              )}

              <div
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
                    <PublicBlockRenderer 
                      key={block.id} 
                      block={block} 
                      isPreview={isEditorPreview} 
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* INDICADORES (DOTS) ADAPTÁVEIS */}
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

      {/* PLAYER DE MÚSICA */}
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