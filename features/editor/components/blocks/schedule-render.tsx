
// "use client";

// import { cn } from "@/lib/utils";
// import { MapPin, User } from "lucide-react";

// export function ScheduleRenderer({ content, styles }: { content: any; styles: any }) {
//   const items = content.items || [];

//   // --- ESTILOS DE CAMADAS ---
//   const mainTitleStyle = {
//     color: styles.titleColor || styles.color,
//     fontSize: styles.titleFontSize ? `${styles.titleFontSize}px` : "1.5rem",
//     fontFamily: styles.titleFontFamily || styles.fontFamily,
//     fontWeight: styles.titleFontWeight || "bold",
//     textTransform: (styles.titleTextTransform || "uppercase") as any,
//     marginBottom: "2.5rem",
//     textAlign: "center" as const
//   };

//   const activityTitleStyle = {
//     color: styles.color,
//     fontSize: `${styles.fontSize}px`, // Tamanho base
//     fontWeight: "bold",
//     fontFamily: styles.fontFamily,
//     lineHeight: 1.2
//   };

//   const descStyle = {
//     color: styles.descColor || styles.color,
//     fontSize: styles.descFontSize ? `${styles.descFontSize}px` : "0.85em",
//     fontFamily: styles.fontFamily,
//     opacity: styles.descColor ? 1 : 0.7,
//     marginTop: "0.25rem"
//   };

//   // Cor dos elementos gráficos (linha e bola) - Usa borderColor ou color
//   const accentColor = styles.borderColor || styles.color;

//   return (
//     <div className="w-full py-6 px-2">
//       {content.title && (
//         <h3 style={mainTitleStyle}>
//           {content.title}
//         </h3>
//       )}

//       <div className="flex flex-col relative pl-2">
//         {/* LINHA VERTICAL */}
//         <div
//           className="absolute left-[85px] top-2 bottom-4 w-px opacity-30"
//           style={{ backgroundColor: accentColor }}
//         />

//         {items.map((item: any, idx: number) => (
//           <div key={idx} className="flex gap-5 relative pb-8 group last:pb-0">
//             {/* Coluna da Hora */}
//             <div
//               className="w-[75px] shrink-0 text-right pt-0.5 flex flex-col items-end"
//               style={{ fontFamily: styles.fontFamily, color: styles.color }}
//             >
//               <span className="text-sm font-bold opacity-100">{item.time}</span>
//               {item.endTime && (
//                 <span className="text-[10px] opacity-60 leading-none mt-0.5">
//                   {item.endTime}
//                 </span>
//               )}
//             </div>

//             {/* Ponto na Linha */}
//             <div className="relative shrink-0">
//               <div
//                 className="w-3 h-3 rounded-full border-2 bg-white z-10 relative mt-1.5"
//                 style={{ borderColor: accentColor }}
//               />
//             </div>

//             {/* Conteúdo */}
//             <div className="flex-1 -mt-1">
//               <h4 style={activityTitleStyle}>
//                 {item.activity}
//               </h4>

//               {/* Metadados: Local e Orador */}
//               {(item.location || item.speaker) && (
//                 <div className="flex flex-wrap gap-3 mb-2 mt-1.5">
//                   {item.location && (
//                     <div className="flex items-center gap-1 opacity-80" style={{ color: styles.color }}>
//                       <MapPin className="w-3 h-3" />
//                       <span className="text-xs font-medium" style={{ fontFamily: styles.fontFamily }}>{item.location}</span>
//                     </div>
//                   )}
//                   {item.speaker && (
//                     <div className="flex items-center gap-1 opacity-80" style={{ color: styles.color }}>
//                       <User className="w-3 h-3" />
//                       <span className="text-xs font-medium" style={{ fontFamily: styles.fontFamily }}>{item.speaker}</span>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {item.description && (
//                 <p style={descStyle}>
//                   {item.description}
//                 </p>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       {items.length === 0 && (
//         <div className="text-center p-6 border border-dashed border-slate-300 rounded-xl text-slate-400 text-sm">
//           Adicione atividades ao programa
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { cn } from "@/lib/utils";
import { MapPin, User } from "lucide-react";
import { getTypographyStyle } from "@/features/editor/utils";

export function ScheduleRenderer({ content, styles }: { content: any; styles: any }) {
  const items = content.items || [];

  // --- ESTILOS AUTOMÁTICOS ---
  const mainTitleStyle = {
    ...getTypographyStyle(styles, "title"),
    marginBottom: "2.5rem",
    width: "100%", // Garante alinhamento
  };

  const activityTitleStyle = {
    ...getTypographyStyle(styles, ""), // Global
    fontWeight: "bold",
    marginBottom: "0.25rem"
  };

  const descStyle = {
    ...getTypographyStyle(styles, "desc"),
    opacity: styles.descColor ? 1 : 0.7,
    marginTop: "0.25rem"
  };

  // Hora usa fonte global mas menor
  const timeStyle = {
    ...getTypographyStyle(styles, ""),
    fontSize: "0.85em",
    fontWeight: "bold",
  };

  const accentColor = styles.borderColor || styles.color;

  return (
    <div className="w-full py-6 px-2">
      {content.title && (
        <h3 style={mainTitleStyle}>
          {content.title}
        </h3>
      )}

      <div className="flex flex-col relative pl-2">
        <div className="absolute left-[85px] top-2 bottom-4 w-px opacity-30" style={{ backgroundColor: accentColor }} />

        {items.map((item: any, idx: number) => (
          <div key={idx} className="flex gap-5 relative pb-8 group last:pb-0">
            {/* Coluna da Hora */}
            <div className="w-[75px] shrink-0 text-right pt-0.5 flex flex-col items-end" style={{ color: timeStyle.color, fontFamily: timeStyle.fontFamily }}>
              <span style={timeStyle}>{item.time}</span>
              {item.endTime && (
                <span className="text-[10px] opacity-60 leading-none mt-0.5" style={{ fontFamily: timeStyle.fontFamily }}>
                  {item.endTime}
                </span>
              )}
            </div>

            {/* Ponto */}
            <div className="relative shrink-0">
              <div className="w-3 h-3 rounded-full border-2 bg-white z-10 relative mt-1.5" style={{ borderColor: accentColor }} />
            </div>

            {/* Conteúdo */}
            <div className="flex-1 -mt-1">
              <h4 style={activityTitleStyle}>
                {item.activity}
              </h4>

              {(item.location || item.speaker) && (
                <div className="flex flex-wrap gap-3 mb-2 mt-1.5">
                  {item.location && (
                    <div className="flex items-center gap-1 opacity-80" style={{ color: styles.color }}>
                      <MapPin className="w-3 h-3" />
                      <span className="text-xs font-medium" style={{ fontFamily: styles.fontFamily }}>{item.location}</span>
                    </div>
                  )}
                  {item.speaker && (
                    <div className="flex items-center gap-1 opacity-80" style={{ color: styles.color }}>
                      <User className="w-3 h-3" />
                      <span className="text-xs font-medium" style={{ fontFamily: styles.fontFamily }}>{item.speaker}</span>
                    </div>
                  )}
                </div>
              )}

              {item.description && (
                <p style={descStyle}>
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center p-6 border border-dashed border-slate-300 rounded-xl text-slate-400 text-sm">Adicione atividades</div>
      )}
    </div>
  );
}