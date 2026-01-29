// "use client";

// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Play, Heart } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface IntroScreenProps {
//   onEnter: () => void;
//   title: string;
//   subtitle?: string;
//   coverImage?: string;
// }

// export function IntroScreen({ onEnter, title, subtitle, coverImage }: IntroScreenProps) {
//   const [isOpen, setIsOpen] = useState(false);

//   const handleEnter = () => {
//     setIsOpen(true);
//     // Pequeno delay para a animação de saída acontecer antes de notificar o pai
//     setTimeout(() => {
//       onEnter();
//     }, 800);
//   };

//   return (
//     <AnimatePresence>
//       {!isOpen && (
//         <motion.div
//           exit={{ opacity: 0, y: -100, transition: { duration: 0.8, ease: "easeInOut" } }}
//           className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-white text-slate-900"
//         >
//           {/* Fundo com imagem desfocada (opcional) */}
//           {coverImage && (
//             <div 
//               className="absolute inset-0 bg-cover bg-center opacity-20 blur-xl"
//               style={{ backgroundImage: `url(${coverImage})` }}
//             />
//           )}

//           <div className="relative z-10 flex flex-col items-center gap-6 p-8 text-center">
//             <div className="space-y-2">
//               <h1 className="text-4xl font-serif font-bold tracking-tight text-slate-900">{title}</h1>
//               {subtitle && <p className="text-lg text-slate-500 font-light">{subtitle}</p>}
//             </div>

//             {/* Botão de "Selo" ou Entrada */}
//             <button 
//               onClick={handleEnter}
//               className="group relative flex items-center justify-center w-20 h-20 bg-slate-900 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300"
//             >
//               <div className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-50" />
//               <Heart className="w-8 h-8 text-white fill-white/20 group-hover:fill-white transition-all" />
//               <span className="sr-only">Abrir Convite</span>
//             </button>
            
//             <p className="text-xs uppercase tracking-widest text-slate-400 mt-4 animate-pulse">
//               Toque para abrir
//             </p>
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MailOpen } from "lucide-react";

interface IntroScreenProps {
  onEnter: () => void;
  title: string;       // Ex: Ana & João
  subtitle?: string;   // Ex: 02.05.2026
  coverImage?: string; // Imagem de fundo
  guestName?: string;  // <--- NOVO: Nome do convidado (vindo do token)
}

export function IntroScreen({ onEnter, title, subtitle, coverImage, guestName }: IntroScreenProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Pequeno delay para a animação de entrada do texto
    setTimeout(() => setShowButton(true), 500);
  }, []);

  const handleEnter = () => {
    setIsOpen(true);
    setTimeout(() => {
      onEnter();
    }, 800);
  };

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)", transition: { duration: 0.8 } }}
          className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900 text-white overflow-hidden"
        >
          {/* Fundo com imagem + Overlay escuro */}
          {coverImage && (
            <div className="absolute inset-0">
               <div 
                 className="absolute inset-0 bg-cover bg-center opacity-40 scale-105"
                 style={{ backgroundImage: `url(${coverImage})` }}
               />
               <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/20 to-slate-900/80" />
            </div>
          )}

          <div className="relative z-10 flex flex-col items-center gap-8 p-8 text-center max-w-sm">
            
            {/* SAUDAÇÃO AO CONVIDADO */}
            {guestName ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center gap-2"
              >
                <span className="text-xs uppercase tracking-[0.2em] text-amber-200/80">Convite Especial Para</span>
                <h2 className="text-2xl font-serif italic text-amber-100">{guestName}</h2>
                <div className="w-12 h-px bg-amber-200/30 my-2" />
              </motion.div>
            ) : (
              <motion.span 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-xs uppercase tracking-[0.2em] text-white/60"
              >
                Você foi convidado
              </motion.span>
            )}

            {/* TÍTULO DO EVENTO */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="space-y-2"
            >
              <h1 className="text-5xl font-serif font-bold tracking-tight text-white drop-shadow-lg leading-tight">
                {title}
              </h1>
              {subtitle && <p className="text-lg text-white/80 font-light">{subtitle}</p>}
            </motion.div>

            {/* BOTÃO DE SELO */}
            {showButton && (
              <motion.button 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEnter}
                className="group relative flex items-center justify-center w-24 h-24 mt-4 cursor-pointer"
              >
                {/* Efeito de "Pulse" */}
                <div className="absolute inset-0 rounded-full bg-white/10 animate-ping opacity-75" />
                <div className="absolute inset-2 rounded-full bg-white/20 blur-md" />
                
                {/* O Botão Físico */}
                <div className="relative w-full h-full bg-amber-100 rounded-full shadow-[0_0_30px_rgba(251,191,36,0.3)] flex items-center justify-center border-4 border-slate-900/10">
                   <MailOpen className="w-8 h-8 text-slate-900 group-hover:scale-110 transition-transform" />
                </div>
              </motion.button>
            )}
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-[10px] uppercase tracking-widest text-white/40 mt-2"
            >
              Toque para abrir
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}