"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MusicPlayerProps {
  url?: string;
  autoPlay?: boolean;
}

export function BackgroundMusicPlayer({ url, autoPlay }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Limpeza da URL
  const cleanUrl = url ? url.trim() : "";

  useEffect(() => {
    // Se a URL mudar ou ativar o autoplay
    if (cleanUrl && audioRef.current) {
      audioRef.current.src = cleanUrl;
      audioRef.current.load();

      if (autoPlay) {
        // Tenta tocar. Se o browser bloquear, capturamos o erro silenciosamente
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.log("Autoplay bloqueado pelo navegador (esperando clique).");
              setIsPlaying(false);
            });
        }
      }
    }
  }, [cleanUrl, autoPlay]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((e) => console.error("Erro ao tocar:", e));
      }
    }
  };

  if (!cleanUrl) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-4">
      {/* Áudio Nativo Invisível */}
      <audio 
        ref={audioRef} 
        loop 
        preload="auto"
        onEnded={() => setIsPlaying(false)}
        onError={(e) => {
            console.error("Erro no ficheiro de áudio", e);
            setIsPlaying(false);
        }}
      />
      
      <Button
        onClick={togglePlay}
        size="icon"
        className={`rounded-full w-12 h-12 shadow-xl border-2 border-white/20 transition-all duration-300 ${
          isPlaying 
            ? "bg-emerald-500 hover:bg-emerald-600 scale-110" 
            : "bg-slate-900 hover:bg-slate-800"
        }`}
        title={isPlaying ? "Pausar Música" : "Tocar Música"}
      >
        {isPlaying ? (
          <div className="relative flex items-center justify-center w-full h-full">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-30"></span>
             <Pause className="relative w-5 h-5 text-white" />
          </div>
        ) : (
          <Play className="w-5 h-5 text-white ml-1" />
        )}
      </Button>
    </div>
  );
}