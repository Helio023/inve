"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PublicBlockRenderer } from "./public-block-viewer";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_PAGE_STYLES } from "@/features/editor/types";
import { EventInteractionProvider } from "@/features/editor/components/event-interaction-context";
import { BackgroundMusicPlayer } from "./BackgroundMusicPlayer";
import { IntroScreen } from "./IntroScreen";
import { getBackgroundStyle } from "@/features/editor/utils";

interface EventViewerProps {
  pages: any[];
  isPublished?: boolean;
  isEditorPreview?: boolean;
  disableMusic?: boolean;
  settings?: {
    music?: { isEnabled: boolean; url?: string; autoPlay: boolean };
    navigation?: {
      direction: "horizontal" | "vertical";
      effect: "slide" | "fade" | "scale" | "cube";
    };
  };
  guestName?: string;
  guest?: any;
}

export function EventViewer({
  pages,
  isPublished,
  isEditorPreview,
  disableMusic = false,
  settings,
  guestName,
  guest,
}: EventViewerProps) {
  const [[page, direction], setPage] = useState([0, 0]);
  const [hasEntered, setHasEntered] = useState(false);
  const [playMusic, setPlayMusic] = useState(false);
  const touchStartY = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const navDirection = settings?.navigation?.direction || "horizontal";
  const navEffect = settings?.navigation?.effect || "slide";
  const activePage = pages[page] || pages[0];

  const isExpired =
    guest?.validUntil && new Date(guest.validUntil) < new Date();

  const handleEnterEvent = () => {
    setHasEntered(true);
    if (settings?.music?.isEnabled) setPlayMusic(true);
  };

  useEffect(() => {
    if (isEditorPreview) setHasEntered(true);
  }, [isEditorPreview]);

  const paginate = useCallback(
    (newDirection: number) => {
      const newPage = page + newDirection;
      if (newPage >= 0 && newPage < pages.length)
        setPage([newPage, newDirection]);
    },
    [page, pages.length],
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (navDirection !== "vertical") return;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;
    const threshold = 60;
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const isAtBottom =
      Math.abs(
        container.scrollHeight - container.scrollTop - container.clientHeight,
      ) < 2;
    const isAtTop = container.scrollTop === 0;
    
    if (deltaY > threshold && isAtBottom) paginate(1);
    if (deltaY < -threshold && isAtTop) paginate(-1);
  };

  const onDragEnd = (e: any, { offset, velocity }: any) => {
    const swipeConfidenceThreshold = 10000;
    const swipePowerX = Math.abs(offset.x) * velocity.x;
    if (navDirection === "horizontal") {
      if (offset.x < -50 || swipePowerX < -swipeConfidenceThreshold)
        paginate(1);
      else if (offset.x > 50 || swipePowerX > swipeConfidenceThreshold)
        paginate(-1);
    }
  };

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

  const variants = {
    slide: {
      enter: (direction: number) => {
        if (navDirection === "vertical")
          return { y: direction > 0 ? "100%" : "-100%", opacity: 1, zIndex: 1 };
        return { x: direction > 0 ? "100%" : "-100%", opacity: 1, zIndex: 1 };
      },
      center: { zIndex: 1, x: 0, y: 0, opacity: 1 },
      exit: (direction: number) => {
        if (navDirection === "vertical")
          return { zIndex: 0, y: direction < 0 ? "100%" : "-100%", opacity: 1 };
        return { zIndex: 0, x: direction < 0 ? "100%" : "-100%", opacity: 1 };
      },
    },
    fade: {
      enter: { opacity: 0, zIndex: 1 },
      center: { opacity: 1, zIndex: 1 },
      exit: { opacity: 0, zIndex: 0 },
    },
    scale: {
      enter: { opacity: 0, scale: 0.8, zIndex: 1 },
      center: { opacity: 1, scale: 1, zIndex: 2 },
      exit: { opacity: 0, scale: 1.1, zIndex: 0 },
    },
    cube: {
      enter: (direction: number) => ({
        rotateX: navDirection === "vertical" ? (direction > 0 ? 90 : -90) : 0,
        rotateY: navDirection === "horizontal" ? (direction > 0 ? 90 : -90) : 0,
        opacity: 0,
        scale: 0.8,
        zIndex: 1,
      }),
      center: { rotateX: 0, rotateY: 0, opacity: 1, scale: 1, zIndex: 2 },
      exit: (direction: number) => ({
        rotateX: navDirection === "vertical" ? (direction < 0 ? 90 : -90) : 0,
        rotateY: navDirection === "horizontal" ? (direction < 0 ? 90 : -90) : 0,
        opacity: 0,
        scale: 0.8,
        zIndex: 0,
      }),
    },
  };

  const currentVariant = (variants as any)[navEffect] || variants.slide;
  const navBtnClass =
    "absolute z-50 p-2.5 rounded-full shadow-2xl bg-white/80 backdrop-blur-md border border-white/50 text-slate-800 hover:bg-white hover:scale-110 active:scale-95 transition-all duration-200";

  if (!pages || pages.length === 0) return <div>Sem conteúdo.</div>;
  if (!isPublished && !isEditorPreview)
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white">
        <Lock className="w-12 h-12 text-slate-500 mb-4" />
        <h1 className="text-2xl font-bold">Convite em Edição</h1>
        <p className="text-slate-400 mt-2">Este link ainda não está ativo.</p>
      </div>
    );

  const pageStyles = { ...DEFAULT_PAGE_STYLES, ...(activePage.styles || {}) };
  const backgroundStyle = getBackgroundStyle(pageStyles.backgroundColor);

  return (
    <div className="min-h-screen-safe bg-slate-100 flex items-center justify-center font-sans overflow-hidden my-0 select-none p-0 md:p-4">
      <div
        className={cn(
          "relative w-full max-w-md shadow-xl md:rounded-2xl overflow-hidden md:border md:border-slate-300 flex flex-col group",
          // Garante altura consistente (100dvh mobile, 90vh desktop)
          "h-dvh md:h-[90vh]" 
        )}
        style={{ perspective: "1000px" }}
      >
        {!isEditorPreview && !hasEntered && (
          <IntroScreen
            title={pages[0]?.content?.title || "Bem-vindo"}
            subtitle="Você tem um convite especial"
            coverImage={pages[0]?.content?.image}
            guestName={guestName}
            onEnter={handleEnterEvent}
            isExpired={isExpired}
            tableName={guest?.tableName}
            sessionLabel={guest?.sessionLabel}
          />
        )}
        <EventInteractionProvider>
          {page > 0 && (
            <button
              onClick={() => paginate(-1)}
              className={cn(
                navBtnClass,
                navDirection === "horizontal"
                  ? "left-3 top-1/2 -translate-y-1/2"
                  : "top-4 left-1/2 -translate-x-1/2",
              )}
            >
              {navDirection === "horizontal" ? (
                <ChevronLeft className="w-6 h-6" />
              ) : (
                <ChevronUp className="w-6 h-6" />
              )}
            </button>
          )}
          {page < pages.length - 1 && (
            <button
              onClick={() => paginate(1)}
              className={cn(
                navBtnClass,
                navDirection === "horizontal"
                  ? "right-3 top-1/2 -translate-y-1/2"
                  : "bottom-14 left-1/2 -translate-x-1/2",
              )}
            >
              {navDirection === "horizontal" ? (
                <ChevronRight className="w-6 h-6" />
              ) : (
                <ChevronDown className="w-6 h-6" />
              )}
            </button>
          )}
          <AnimatePresence initial={true} custom={direction} mode="popLayout">
            <motion.div
              key={page}
              custom={direction}
              variants={currentVariant}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.5,
              }}
              drag={navDirection === "horizontal" ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.5}
              onDragEnd={onDragEnd}
              className="h-full w-full absolute inset-0 z-0 flex flex-col bg-white"
              style={{
                ...backgroundStyle,
                ...(pageStyles.backgroundImage
                  ? {
                      backgroundImage: `url(${pageStyles.backgroundImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }
                  : {}),
              }}
            >
              {pageStyles.backgroundImage && (
                <div
                  className="absolute inset-0 z-0 pointer-events-none"
                  style={{
                    backgroundColor: "black",
                    opacity: pageStyles.backgroundOpacity || 0,
                  }}
                />
              )}
              
              {/* CONTAINER DE SCROLL ORIGINAL MANTIDO */}
              <div
                ref={scrollContainerRef}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                // Adicionado 'flex flex-col' aqui para alinhar o conteúdo interno corretamente
                className="w-full h-full overflow-y-auto no-scrollbar relative z-10 flex flex-col"
                style={{
                  paddingTop: `${pageStyles.paddingTop}px`,
                  paddingBottom: `${pageStyles.paddingBottom}px`,
                  paddingLeft: `${pageStyles.paddingLeft}px`,
                  paddingRight: `${pageStyles.paddingRight}px`,
                  touchAction:
                    navDirection === "horizontal" ? "pan-y" : "pan-x",
                }}
              >
              
                <div className="flex flex-col min-h-full">
                  {activePage.blocks.map((block: any) => (
                    <PublicBlockRenderer
                      key={block.id}
                      block={block}
                      isPreview={isEditorPreview}
                      guest={guest}
                      canAnimate={hasEntered}
                    />
                  ))}
                  {/* Espaçador original mantido */}
                  <div className="h-20 w-full shrink-0" />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div
            className={cn(
              "absolute z-40 flex justify-center gap-2 pointer-events-none transition-all",
              navDirection === "horizontal"
                ? "bottom-4 left-0 right-0 flex-row"
                : "right-2 top-1/2 -translate-y-1/2 flex-col",
            )}
          >
            {pages.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "rounded-full shadow-sm transition-all duration-300 backdrop-blur-sm border border-white/20",
                  idx === page ? "bg-white scale-125" : "bg-white/40",
                  navDirection === "horizontal"
                    ? idx === page
                      ? "w-4 h-1.5"
                      : "w-1.5 h-1.5"
                    : idx === page
                      ? "h-4 w-1.5"
                      : "h-1.5 w-1.5",
                )}
              />
            ))}
          </div>
        </EventInteractionProvider>
      </div>
      {!disableMusic && settings?.music?.isEnabled && settings?.music?.url && (
        <BackgroundMusicPlayer url={settings.music.url} autoPlay={playMusic} />
      )}
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