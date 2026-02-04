// "use client";

// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
// import { cn } from "@/lib/utils";

// export function CarouselRenderer({ content, styles }: { content: any; styles: any }) {
//   const images = content.images || [];
//   const [index, setIndex] = useState(0);
//   const autoplay = content.autoplay ?? true;
//   const intervalTime = (content.interval || 3) * 1000;
//   const effect = content.effect || "slide";

//   // Autoplay Logic
//   useEffect(() => {
//     if (!autoplay || images.length <= 1) return;
//     const timer = setInterval(() => {
//       setIndex((prev) => (prev + 1) % images.length);
//     }, intervalTime);
//     return () => clearInterval(timer);
//   }, [autoplay, intervalTime, images.length]);

//   const next = () => setIndex((prev) => (prev + 1) % images.length);
//   const prev = () => setIndex((prev) => (prev - 1 + images.length) % images.length);

//   // Variantes de Animação
//   const variants = {
//     slide: {
//       initial: { x: "100%", opacity: 1 },
//       animate: { x: 0, opacity: 1 },
//       exit: { x: "-100%", opacity: 1 },
//     },
//     fade: {
//       initial: { opacity: 0 },
//       animate: { opacity: 1 },
//       exit: { opacity: 0 },
//     }
//   };

//   if (images.length === 0) {
//     return (
//       <div className="w-full h-full min-h-[200px] flex flex-col items-center justify-center bg-slate-100 text-slate-400 border border-slate-200 rounded-lg">
//         <ImageIcon className="w-10 h-10 opacity-50 mb-2" />
//         <span className="text-xs font-bold uppercase tracking-wider">Sem imagens</span>
//       </div>
//     );
//   }

//   return (
//     <div 
//       className="relative w-full overflow-hidden group"
//       // Respeita a altura definida no painel "Design" > "Dimensões"
//       // Se não houver altura definida, usa 100% do pai (que deve ser controlado pelo BlockRenderer)
//       style={{ 
//         height: "100%", 
//         minHeight: styles.height === 'auto' ? '300px' : undefined,
//         borderRadius: styles.borderRadius ? `${styles.borderRadius}px` : undefined
//       }}
//     >
//       <AnimatePresence initial={false} mode="popLayout">
//         <motion.img
//           key={index}
//           src={images[index]}
//           alt={`Slide ${index}`}
//           variants={(variants as any)[effect]}
//           initial="initial"
//           animate="animate"
//           exit="exit"
//           transition={{ duration: 0.5, ease: "easeInOut" }}
//           className="absolute inset-0 w-full h-full"
//           style={{ 
//             objectFit: styles.objectFit || "cover" // Respeita o object-fit do painel
//           }}
//         />
//       </AnimatePresence>

//       {/* Controles (Só aparecem se houver > 1 imagem) */}
//       {images.length > 1 && (
//         <>
//           {/* Setas (Visíveis em hover ou sempre em mobile) */}
//           <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/20 text-white backdrop-blur-sm hover:bg-black/40 transition-all opacity-0 group-hover:opacity-100">
//             <ChevronLeft className="w-4 h-4" />
//           </button>
//           <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/20 text-white backdrop-blur-sm hover:bg-black/40 transition-all opacity-0 group-hover:opacity-100">
//             <ChevronRight className="w-4 h-4" />
//           </button>

//           {/* Dots Indicadores */}
//           <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
//             {images.map((_:any, i:number) => (
//               <div 
//                 key={i} 
//                 className={cn(
//                   "w-1.5 h-1.5 rounded-full transition-all shadow-sm", 
//                   i === index ? "bg-white w-3" : "bg-white/50"
//                 )} 
//               />
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getBackgroundStyle } from "@/features/editor/utils";

export function CarouselRenderer({ content, styles }: { content: any; styles: any }) {
  const images = content.images || [];
  const [index, setIndex] = useState(0);
  const autoplay = content.autoplay ?? true;
  const intervalTime = (content.interval || 3) * 1000;
  const effect = content.effect || "slide";

  // Autoplay Logic
  useEffect(() => {
    if (!autoplay || images.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, intervalTime);
    return () => clearInterval(timer);
  }, [autoplay, intervalTime, images.length]);

  const next = () => setIndex((prev) => (prev + 1) % images.length);
  const prev = () => setIndex((prev) => (prev - 1 + images.length) % images.length);

  // Variantes de Animação
  const variants = {
    slide: {
      initial: { x: "100%", opacity: 1 },
      animate: { x: 0, opacity: 1 },
      exit: { x: "-100%", opacity: 1 },
    },
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    }
  };

  // Estilos de Container (Borda, Sombra, Fundo)
  const containerStyle = {
    height: "100%",
    minHeight: styles.height === 'auto' ? '300px' : undefined,
    borderRadius: styles.borderRadius ? `${styles.borderRadius}px` : undefined,
    boxShadow: styles.shadow === 'none' ? 'none' : styles.shadow === 'sm' ? '0 1px 2px rgba(0,0,0,0.1)' : '0 4px 6px rgba(0,0,0,0.1)',
    borderWidth: styles.borderWidth ? `${styles.borderWidth}px` : undefined,
    borderColor: styles.borderColor,
    borderStyle: styles.borderStyle,
    ...getBackgroundStyle(styles.backgroundColor)
  };

  if (images.length === 0) {
    return (
      <div 
        className="w-full h-full min-h-[200px] flex flex-col items-center justify-center bg-slate-100 text-slate-400"
        style={{ borderRadius: containerStyle.borderRadius }}
      >
        <ImageIcon className="w-10 h-10 opacity-50 mb-2" />
        <span className="text-xs font-bold uppercase tracking-wider">Sem imagens</span>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full overflow-hidden group"
      style={containerStyle}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.img
          key={index}
          src={images[index]}
          alt={`Slide ${index}`}
          variants={(variants as any)[effect]}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
          style={{ 
            objectFit: styles.objectFit || "cover"
          }}
        />
      </AnimatePresence>

      {/* Controles */}
      {images.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100 z-10">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100 z-10">
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
            {images.map((_:any, i:number) => (
              <div 
                key={i} 
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all shadow-sm", 
                  i === index ? "bg-white w-4" : "bg-white/50"
                )} 
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}