"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, Play, Loader2, Pause, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";


const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }) as any;

interface MusicPlayerProps {
  url?: string;
  autoPlay?: boolean;
}

export function BackgroundMusicPlayer({ url, autoPlay }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 1. Timeout de Segurança: Se travar no loading, liberta o botão após 4s
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isReady && url) {
        console.warn("Player demorou a responder. Forçando estado pronto.");
        setIsReady(true);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [isReady, url]);

  // 2. Autoplay (Tentativa única)
  useEffect(() => {
    if (autoPlay && isReady && !hasError) {
      const timer = setTimeout(() => setIsPlaying(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, isReady, hasError]);

  const togglePlay = () => {
    if (hasError) return;
    setIsPlaying(!isPlaying);
  };

  const cleanUrl = url ? url.trim() : "";
  if (!isMounted || !cleanUrl) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-4">
      {/* 
        Mágica do CSS:
        Move o player para fora da tela em vez de usar display:none.
        Isso garante que o YouTube inicializa e dispara o onReady.
      */}
      <div 
        style={{ 
          position: 'fixed', 
          top: '-10000px', 
          left: '-10000px', 
          width: '1px', 
          height: '1px', 
          overflow: 'hidden',
          visibility: 'visible', // Garante que não é ignorado
          pointerEvents: 'none'
        }}
      >
        <ReactPlayer
          url={cleanUrl}
          playing={isPlaying}
          loop={true}
          volume={1}
          muted={false}
          playsinline={true}
          onReady={() => {
            console.log("Música carregada e pronta.");
            setIsReady(true);
            setHasError(false);
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={(e: any) => {
            console.error("Erro ao carregar áudio:", e);
            setHasError(true);
            setIsReady(true); // Para o spinner
            setIsPlaying(false);
          }}
          config={{
            youtube: { 
              playerVars: { showinfo: 0, controls: 0, disablekb: 1, playsinline: 1, origin: typeof window !== 'undefined' ? window.location.origin : '' } 
            },
            file: { 
              attributes: { controlsList: 'nodownload' } 
            }
          }}
        />
      </div>
      
      <Button
        onClick={togglePlay}
        disabled={(!isReady && !hasError)} // Bloqueia apenas enquanto carrega
        size="icon"
        className={`rounded-full w-12 h-12 shadow-xl border-2 border-white/20 transition-all duration-500 ${
          hasError 
            ? "bg-red-500 hover:bg-red-600"
            : isPlaying 
              ? "bg-emerald-500 hover:bg-emerald-600 scale-110" 
              : "bg-slate-900 hover:bg-slate-800"
        } ${(!isReady && !hasError) ? "opacity-80" : "opacity-100"}`}
      >
        {!isReady && !hasError ? (
           <Loader2 className="w-5 h-5 text-white animate-spin" />
        ) : isPlaying ? (
          <span className="relative flex h-full w-full items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-30"></span>
            <Volume2 className="relative inline-flex h-5 w-5 text-white" />
          </span>
        ) : (
          <Play className="w-5 h-5 text-white ml-1" />
        )}
      </Button>
    </div>
  );
}

// "use client";

// import { useState, useEffect, useRef } from "react";
// import { Volume2, Play, Loader2, Pause } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import dynamic from "next/dynamic";

// const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }) as any;

// interface MusicPlayerProps {
//   url?: string;
//   autoPlay?: boolean;
// }

// export function BackgroundMusicPlayer({ url, autoPlay }: MusicPlayerProps) {
//   const [isMounted, setIsMounted] = useState(false);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isReady, setIsReady] = useState(false);
  
//   // Usamos uma ref para impedir que o Autoplay dispare múltiplas vezes
//   const hasTriedAutoplay = useRef(false);

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   // Limpeza da URL
//   const cleanUrl = url ? url.trim() : "";

//   // Lógica de Autoplay "Suave"
//   useEffect(() => {
//     if (autoPlay && isReady && !hasTriedAutoplay.current) {
//       hasTriedAutoplay.current = true;
//       // Tentamos tocar. Se o browser bloquear, o onError ou o próprio player tratam disso.
//       // O setTimeout ajuda a evitar o conflito imediato de montagem/desmontagem
//       const timer = setTimeout(() => {
//         setIsPlaying(true);
//       }, 1500);
//       return () => clearTimeout(timer);
//     }
//   }, [autoPlay, isReady]);

//   const handleToggle = () => {
//     // Forçamos o estado oposto. O clique do utilizador tem prioridade máxima.
//     setIsPlaying((prev) => !prev);
//   };

//   if (!isMounted || !cleanUrl) return null;

//   return (
//     <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-4">
//       {/* 
//         MUDANÇA CRÍTICA DE CSS:
//         Em vez de posicionar fora do ecrã (-10000px), colocamos o player 
//         DENTRO do botão visualmente, mas com tamanho 0.
//         Isto garante que o navegador considera o player "visível" e parte da interação.
//       */}
//       <div style={{ width: 0, height: 0, overflow: 'hidden' }}>
//         <ReactPlayer
//           key={cleanUrl} // Força recriação se URL mudar
//           url={cleanUrl}
//           playing={isPlaying}
//           loop={true}
//           volume={1}
//           muted={false}
//           playsinline={true}
//           width="0"
//           height="0"
          
//           onReady={() => {
//             console.log("Música pronta.");
//             setIsReady(true);
//           }}
//           // Se o navegador bloquear o play (AbortError), capturamos aqui e desligamos o estado
//           onError={(e: any) => {
//             console.log("Erro/Bloqueio de Áudio:", e);
//             setIsPlaying(false); // Reverte para Pause se falhar
//             setIsReady(true);    // Desbloqueia o botão para tentar manualmente
//           }}
//           onStart={() => setIsPlaying(true)}
          
//           config={{
//             youtube: {
//               playerVars: { showinfo: 0, controls: 0, disablekb: 1, playsinline: 1, origin: window.location.origin }
//             },
//             file: {
//               forceAudio: true, // Força modo áudio para MP3
//               attributes: { controlsList: 'nodownload' } 
//             }
//           }}
//         />
//       </div>
      
//       <Button
//         onClick={handleToggle}
   
//         size="icon"
//         className={`rounded-full w-12 h-12 shadow-xl border-2 border-white/20 transition-all duration-300 ${
//           isPlaying 
//             ? "bg-emerald-500 hover:bg-emerald-600 scale-110" 
//             : "bg-slate-900 hover:bg-slate-800"
//         }`}
//       >
//         {!isReady ? (
//            // Mostra loading, mas permite clicar na mesma se estiver travado
//            <Loader2 className="w-5 h-5 text-white animate-spin" />
//         ) : isPlaying ? (
//           <div className="relative flex items-center justify-center w-full h-full">
//              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-30"></span>
//              <Pause className="relative w-5 h-5 text-white" />
//           </div>
//         ) : (
//           <Play className="w-5 h-5 text-white ml-1" />
//         )}
//       </Button>
//     </div>
//   );
// }