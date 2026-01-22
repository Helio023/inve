// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { DEFAULT_STYLES } from "../../types";

// export function CountdownRenderer({
//   date,
//   styles,
// }: {
//   date: string;
//   styles?: any;
// }) {
//   const [timeLeft, setTimeLeft] = useState({
//     d: "00",
//     h: "00",
//     m: "00",
//     s: "00",
//   });

//   const calculateTime = useCallback(() => {
//     if (!date) return;

//     const target = new Date(date).getTime();
//     const now = new Date().getTime();
//     const diff = target - now;

//     if (diff > 0) {
//       setTimeLeft({
//         d: Math.floor(diff / (1000 * 60 * 60 * 24))
//           .toString()
//           .padStart(2, "0"),
//         h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
//           .toString()
//           .padStart(2, "0"),
//         m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
//           .toString()
//           .padStart(2, "0"),
//         s: Math.floor((diff % (1000 * 60)) / 1000)
//           .toString()
//           .padStart(2, "0"),
//       });
//     } else {
//       setTimeLeft({ d: "00", h: "00", m: "00", s: "00" });
//     }
//   }, [date]);

//   useEffect(() => {
//     calculateTime();
//     const timer = setInterval(calculateTime, 1000);
//     return () => clearInterval(timer);
//   }, [calculateTime]);

//   // --- ESTILOS DOS ITENS (Caixas) ---
//   const s = { ...DEFAULT_STYLES, ...styles };

//   const getShadow = (shadowType: string) => {
//     if (shadowType === "sm") return "0 1px 2px rgba(0,0,0,0.05)";
//     if (shadowType === "md") return "0 4px 6px -1px rgba(0,0,0,0.1)";
//     if (shadowType === "lg") return "0 10px 15px -3px rgba(0,0,0,0.1)";
//     return "none";
//   };

//   const boxStyle = {
//     backgroundColor: s.itemBackgroundColor || "transparent",
//     color: s.itemColor || "inherit",
//     borderRadius: `${s.itemBorderRadius || 0}px`,
//     borderWidth: `${s.itemBorderWidth || 0}px`,
//     borderColor: "currentColor",
//     borderStyle: "solid",
//     boxShadow: getShadow(s.itemShadow),
//   };

//   return (
//     <div className="flex w-full justify-center gap-3 sm:gap-4">
//       {[
//         { l: "Dias", v: timeLeft.d },
//         { l: "Hrs", v: timeLeft.h },
//         { l: "Min", v: timeLeft.m },
//         { l: "Seg", v: timeLeft.s },
//       ].map((t, i) => (
//         <div key={i} className="flex flex-col items-center">
//           {/* Caixa do Número */}
//           <div
//             className="flex aspect-square min-w-[3.5rem] items-center justify-center text-2xl font-bold leading-none shadow-sm transition-all"
//             style={boxStyle}
//           >
//             {t.v}
//           </div>
//           {/* Label */}
//           <span
//             className="mt-1 text-[9px] font-bold uppercase tracking-wider opacity-80"
//             style={{ color: s.color }}
//           >
//             {t.l}
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// }


"use client";

import { useState, useEffect, useCallback } from "react";
import { DEFAULT_STYLES } from "../../types";

export function CountdownRenderer({
  date,
  styles,
}: {
  date: string;
  styles?: any;
}) {
  const [timeLeft, setTimeLeft] = useState({
    d: "00",
    h: "00",
    m: "00",
    s: "00",
  });

  const calculateTime = useCallback(() => {
    // ... (lógica do cálculo do tempo permanece inalterada)
    if (!date) return;
    const target = new Date(date).getTime();
    const now = new Date().getTime();
    const diff = target - now;
    if (diff > 0) {
      setTimeLeft({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, "0"),
        h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, "0"),
        m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, "0"),
        s: Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, "0"),
      });
    } else {
      setTimeLeft({ d: "00", h: "00", m: "00", s: "00" });
    }
  }, [date]);

  useEffect(() => {
    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [calculateTime]);

  const s = { ...DEFAULT_STYLES, ...styles };

  const getShadow = (shadowType: string) => {
    if (shadowType === "sm") return "0 1px 2px rgba(0,0,0,0.05)";
    if (shadowType === "md") return "0 4px 6px -1px rgba(0,0,0,0.1)";
    if (shadowType === "lg") return "0 10px 15px -3px rgba(0,0,0,0.1)";
    return "none";
  };

  const boxStyle = {
    backgroundColor: s.itemBackgroundColor || "transparent",
    color: s.itemColor || s.color, // Usar a cor principal como fallback
    borderRadius: `${s.itemBorderRadius || 0}px`,
    borderWidth: `${s.itemBorderWidth || 0}px`,
    borderColor: s.itemColor || s.color,
    borderStyle: "solid",
    boxShadow: getShadow(s.itemShadow),
  };

  // --- ALTERAÇÕES PRINCIPAIS AQUI ---
  const numberStyle = {
    fontSize: `${s.fontSize}px`,
    fontWeight: s.fontWeight,
    fontFamily: s.fontFamily,
    fontStyle: s.fontStyle,
    color: s.itemColor || s.color, // Cor do número herda da caixa ou do bloco
  };

  const labelStyle = {
    fontSize: `${s.fontSize * 0.4}px`, // Tamanho do rótulo proporcional
    fontWeight: s.fontWeight,
    fontFamily: s.fontFamily,
    color: s.color, // Cor do rótulo usa a cor principal do bloco
  };
  // ------------------------------------

  return (
    <div className="flex w-full justify-center gap-3 sm:gap-4" style={{ textAlign: s.textAlign }}>
      {[
        { l: "Dias", v: timeLeft.d },
        { l: "Hrs", v: timeLeft.h },
        { l: "Min", v: timeLeft.m },
        { l: "Seg", v: timeLeft.s },
      ].map((t, i) => (
        <div key={i} className="flex flex-col items-center">
          {/* Caixa do Número */}
          <div
            // A classe 'text-2xl' foi removida para permitir que o estilo inline funcione
            className="flex aspect-square min-w-[3.5rem] items-center justify-center font-bold leading-none shadow-sm transition-all"
            style={{ ...boxStyle, ...numberStyle }} // Combina os estilos da caixa e do número
          >
            {t.v}
          </div>
          {/* Label */}
          <span
            // A classe 'text-[9px]' foi removida
            className="mt-1 font-bold uppercase tracking-wider opacity-80"
            style={labelStyle} // Aplica o novo estilo do rótulo
          >
            {t.l}
          </span>
        </div>
      ))}
    </div>
  );
}