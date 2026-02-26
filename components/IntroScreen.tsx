"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MailOpen, MapPin, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface IntroScreenProps {
  onEnter: () => void;
  title: string;
  subtitle?: string;
  coverImage?: string;
  guestName?: string;
  isExpired?: boolean;
  tableName?: string;
  sessionLabel?: string;
}

// --- COMPONENTE DE PÉTALAS (CORRIGIDO PARA HIDRATAÇÃO) ---
const FallingPetals = ({ color = "#ffb7c5" }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Geramos as pétalas apenas no cliente para evitar erro de mismatch
  const petals = useMemo(() => {
    if (!mounted) return [];
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: Math.random() * 12 + 15,
      delay: Math.random() * 10,
      size: Math.random() * 12 + 8,
      sway: Math.random() * 10 + 5,
    }));
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((p) => (
        <motion.svg
          key={p.id}
          viewBox="0 0 512 512"
          initial={{ y: -50, x: `${p.left}%`, opacity: 0, rotate: 0 }}
          animate={{
            y: "110vh",
            x: [
              `${p.left}%`,
              `${p.left + p.sway}%`,
              `${p.left - p.sway}%`,
              `${p.left}%`,
            ],
            opacity: [0, 0.7, 0.7, 0],
            rotate: 360,
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            width: p.size,
            fill: color,
            filter: "blur(0.4px)",
          }}
        >
          <path d="M256,0C114.6,0,0,114.6,0,256s114.6,256,256,256s256-114.6,256-256S397.4,0,256,0z" />
        </motion.svg>
      ))}
    </div>
  );
};

export function IntroScreen({
  onEnter,
  title,
  subtitle,
  coverImage,
  guestName,
  isExpired,
  tableName,
  sessionLabel,
}: IntroScreenProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = async () => {
    // Feedback tátil/áudio simulado
    try {
      const AudioContext =
        window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const audioCtx = new AudioContext();
        if (audioCtx.state === "suspended") await audioCtx.resume();
      }
    } catch (e) {
      console.warn(e);
    }

    setIsOpen(true);
    setTimeout(() => onEnter(), 900);
  };

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          key="intro-screen"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            filter: "blur(20px)",
            transition: { duration: 1, ease: "easeInOut" },
          }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[#FAF9F6] overflow-hidden"
        >
          {/* Fundo com textura de papel premium */}
          <div className="absolute inset-0 opacity-[0.06] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] pointer-events-none" />
          <FallingPetals />

          {/* Imagem de Capa com Parallax Sutil */}
          {coverImage && (
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="absolute inset-0 z-0"
            >
              <div
                className="absolute inset-0 bg-cover bg-center opacity-15 grayscale-[40%]"
                style={{ backgroundImage: `url(${coverImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F6] via-transparent to-[#FAF9F6]" />
            </motion.div>
          )}

          {/* O CARTÃO DE CONVITE */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={showContent ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-[92%] max-w-[420px] bg-[#fff] p-1 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] border border-slate-200/60"
          >
            {/* Borda Dupla Interna Estilo Luxo */}
            <div className="border border-slate-100 p-8 md:p-12 relative">
              {/* Ornamentos Minimalistas nos Cantos */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-slate-300" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-slate-300" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-slate-300" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-slate-300" />

              <div className="space-y-8 relative z-10">
                {/* Header do Convite */}
                <div className="space-y-3">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-center gap-2 mb-4"
                  >
                    <div className="h-[1px] w-6 bg-slate-200" />
                    <Sparkles className="w-3 h-3 text-slate-400" />
                    <div className="h-[1px] w-6 bg-slate-200" />
                  </motion.div>

                  {guestName ? (
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase tracking-[0.4em] text-slate-400 font-bold block">
                        Convidado de Honra
                      </span>
                      <h2 className="text-3xl font-serif italic text-slate-800 tracking-tight leading-none">
                        {guestName}
                      </h2>
                    </div>
                  ) : (
                    <span className="text-[10px] uppercase tracking-[0.4em] text-slate-400 font-bold block">
                      Você foi convidado
                    </span>
                  )}
                </div>

                {/* Badge de localização/mesa elegante */}
                {!isExpired && (tableName || sessionLabel) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="flex flex-wrap justify-center gap-3"
                  >
                    {sessionLabel && (
                      <span className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-100 text-[10px] font-medium text-slate-500 uppercase tracking-wider bg-slate-50/50">
                        <Calendar className="w-3 h-3 opacity-60" />{" "}
                        {sessionLabel}
                      </span>
                    )}
                    {tableName && (
                      <span className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-100 text-[10px] font-medium text-slate-500 uppercase tracking-wider bg-slate-50/50">
                        <MapPin className="w-3 h-3 opacity-60" /> {tableName}
                      </span>
                    )}
                  </motion.div>
                )}

                <div className="h-px w-24 bg-gradient-to-r from-transparent via-slate-200 to-transparent mx-auto" />

                {/* Nomes/Título */}
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-6xl font-serif text-slate-900 leading-none tracking-tighter">
                    {title.split("&").map((name, i, arr) => (
                      <span key={name}>
                        {name.trim()}
                        {i < arr.length - 1 && (
                          <span className="block text-3xl my-2 text-slate-400 font-light italic">
                            &
                          </span>
                        )}
                      </span>
                    ))}
                  </h1>
                  {subtitle && (
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 font-semibold">
                      {subtitle}
                    </p>
                  )}
                </div>

                {/* Botão de Selo de Cera (Wax Seal) */}
                <div className="pt-8 flex justify-center">
                  {isExpired ? (
                    <div className="px-6 py-3 bg-red-50 text-red-700 rounded-lg border border-red-100 text-[10px] font-bold uppercase tracking-[0.2em]">
                      Este convite expirou
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleEnter}
                      className="relative w-28 h-28 flex items-center justify-center group outline-none"
                    >
                      {/* Sombra do Selo */}
                      <div className="absolute inset-0 bg-black/10 rounded-full blur-xl translate-y-4 group-hover:translate-y-6 transition-transform" />

                      {/* Corpo do Selo de Cera */}
                      <div className="absolute inset-0 bg-[#8B2635] rounded-full shadow-[inset_0_4px_12px_rgba(0,0,0,0.3),0_10px_20px_rgba(139,38,53,0.3)] border-4 border-[#7a212e] overflow-hidden">
                        {/* Textura interna da cera */}
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/rocky-wall.png')]" />
                      </div>

                      <MailOpen className="relative z-10 w-8 h-8 text-[#FAF9F6] drop-shadow-md" />

                      {/* Texto Rotativo do Selo */}
                      <svg
                        className="absolute inset-0 w-full h-full animate-[spin_15s_linear_infinite]"
                        viewBox="0 0 100 100"
                      >
                        <path
                          id="circlePath"
                          d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                          fill="transparent"
                        />
                        <text className="text-[6.5px] font-bold uppercase tracking-[0.25em] fill-white/60">
                          <textPath xlinkHref="#circlePath">
                            Clique para Abrir •{" "}
                          </textPath>
                        </text>
                      </svg>

                      {/* Brilho do Selo */}
                      <div className="absolute top-4 left-4 w-12 h-6 bg-white/10 rounded-full blur-md -rotate-45" />
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Rodapé sutil */}
          <div className="fixed bottom-8 left-0 right-0 flex flex-col items-center gap-2 opacity-30">
            <div className="h-12 w-[1px] bg-gradient-to-b from-transparent to-slate-400" />
            <span className="text-[9px] uppercase tracking-[0.5em] text-slate-300 font-bold">
              Qonvip
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
