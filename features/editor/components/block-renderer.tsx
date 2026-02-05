// "use client";

// import { motion } from "framer-motion";
// import { cn } from "@/lib/utils";
// import {
//   ChevronUp,
//   ChevronDown,
//   Copy,
//   Trash2,
//   Video,
//   MapPin,
//   MoreHorizontal,
//   ArrowRightCircle,
//   Plus,
// } from "lucide-react";
// import { DEFAULT_STYLES } from "../types";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// import { RsvpBlock } from "@/components/rsvp-block";
// import { CountdownRenderer } from "./blocks/countdown-renderer";
// import { MenuRenderer } from "./blocks/menu-render";
// import { ScheduleRenderer } from "./blocks/schedule-render";
// import { CarouselRenderer } from "./blocks/carousel-render";
// import { getBackgroundStyle } from "@/features/editor/utils";

// export const BlockRenderer = ({
//   block,
//   isSelected,
//   onClick,
//   isPreview,
//   onMove,
//   onDuplicate,
//   onDelete,
//   pages,
//   onCopyToPage,
//   isFirst,
//   onAddChild,
// }: any) => {
//   const s = { ...DEFAULT_STYLES, ...block.styles };

//   // 1. ANIMAÇÃO
//   const animVariants = {
//     none: { initial: false, animate: {} },
//     fade: { initial: { opacity: 0 }, animate: { opacity: 1 } },
//     "slide-up": {
//       initial: { opacity: 0, y: 30 },
//       animate: { opacity: 1, y: 0 },
//     },
//     "slide-down": {
//       initial: { opacity: 0, y: -30 },
//       animate: { opacity: 1, y: 0 },
//     },
//     "slide-left": {
//       initial: { opacity: 0, x: 30 },
//       animate: { opacity: 1, x: 0 },
//     },
//     "slide-right": {
//       initial: { opacity: 0, x: -50 },
//       animate: { opacity: 1, x: 0 },
//     },
//     "zoom-in": {
//       initial: { opacity: 0, scale: 0.8 },
//       animate: { opacity: 1, scale: 1 },
//     },
//     flip: {
//       initial: { opacity: 0, rotateX: 90 },
//       animate: { opacity: 1, rotateX: 0 },
//     },
//   };

//   const selectedAnim = (animVariants as any)[s.animation || "none"];

//   // 2. ESTILOS DO CONTEÚDO (Visual)
//   const contentBackground = getBackgroundStyle(s.backgroundColor);

//   const contentStyles: React.CSSProperties = {
//     ...contentBackground,
//     // Box Model
//     paddingTop: `${s.paddingTop}px`,
//     paddingBottom: `${s.paddingBottom}px`,
//     paddingLeft: `${s.paddingLeft}px`,
//     paddingRight: `${s.paddingRight}px`,
//     width: s.width || "100%",

//     // Alturas
//     height: block.type === "DIVIDER" ? "auto" : s.height || "auto",
//     minHeight:
//       !block.content?.image && block.type === "HERO"
//         ? "auto"
//         : block.type === "DIVIDER"
//           ? "auto"
//           : s.height,

//     // Decoração (Bordas e Sombra) aplicadas ao conteúdo visual
//     borderRadius: `${s.borderRadius}px`,
//     borderWidth: `${s.borderWidth}px`,
//     borderColor: s.borderColor,
//     borderStyle: s.borderStyle as any,
//     boxShadow:
//       s.shadow === "none"
//         ? "none"
//         : s.shadow === "sm"
//           ? "0 1px 2px rgba(0,0,0,0.1)"
//           : s.shadow === "md"
//             ? "0 4px 6px rgba(0,0,0,0.1)"
//             : "0 10px 15px rgba(0,0,0,0.1)",

//     // Tipografia Base
//     color: s.color,
//     fontFamily: s.fontFamily,
//     fontSize: `${s.fontSize}px`,
//     textAlign: s.textAlign as any,
//     lineHeight: s.lineHeight,
//     letterSpacing: `${s.letterSpacing}px`,
//     textTransform: s.textTransform as any,

//     // Layout Flex (Correção para Alinhamento)
//     display:
//       block.type === "DIVIDER" || block.type === "MAP" ? "block" : "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "stretch", // IMPORTANTE: Força os filhos a ocuparem a largura toda
//   };

//   // 3. ESTILOS DO WRAPPER (Posicionamento e Margem)
//   const wrapperStyles: React.CSSProperties = {
//     marginTop: `${s.marginTop}px`,
//     marginBottom: `${s.marginBottom}px`,
//     marginLeft: `${s.marginLeft}px`,
//     marginRight: `${s.marginRight}px`,
//     position: "relative",
//     zIndex: isSelected ? 20 : 1,
//   };

//   return (
//     <motion.div
//       onClick={(e) => {
//         e.stopPropagation();
//         if (!isPreview) onClick(block.id);
//       }}
//       style={wrapperStyles}
//       className={cn("group shrink-0", !isPreview && "cursor-pointer")}
//        initial={selectedAnim.initial}
//       animate={selectedAnim.animate}
//       transition={{
//         duration: s.animationDuration || 0.5,
//         delay: s.animationDelay || 0,
//         ease: "easeOut"
//       }}

//       key={block.id + s.animation}
//     >
//       {!isPreview && isSelected && (
//         <>
//           <div className="absolute inset-0 border-2 border-blue-600 pointer-events-none z-50" />

//           <div
//             className={cn(
//               "absolute flex bg-slate-900 text-white rounded-md shadow-xl z-[60] items-center h-8 border border-white/20 transition-all",

//               isFirst ? "top-2 right-2" : "-top-9 right-0",
//             )}
//           >
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onMove(block.id, "UP");
//               }}
//               disabled={isFirst}
//               className={cn(
//                 "px-2 h-full hover:bg-white/20 rounded-l-md border-r border-white/10",
//                 isFirst && "opacity-50 cursor-not-allowed",
//               )}
//               title="Mover Cima"
//             >
//               <ChevronUp className="w-3.5 h-3.5" />
//             </button>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onMove(block.id, "DOWN");
//               }}
//               className="px-2 h-full hover:bg-white/20 border-r border-white/10"
//               title="Mover Baixo"
//             >
//               <ChevronDown className="w-3.5 h-3.5" />
//             </button>

//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <button className="px-2 h-full hover:bg-white/20 border-r border-white/10 outline-none">
//                   <Copy className="w-3.5 h-3.5" />
//                 </button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-48 z-[70]">
//                 <DropdownMenuLabel className="text-[10px] uppercase text-slate-400">
//                   Ações
//                 </DropdownMenuLabel>
//                 <DropdownMenuItem
//                   onClick={() => onDuplicate(block.id)}
//                   className="cursor-pointer"
//                 >
//                   <Copy className="w-3 h-3 mr-2" /> Duplicar aqui
//                 </DropdownMenuItem>
//                 {pages && pages.length > 1 && (
//                   <>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuLabel className="text-[10px] uppercase text-slate-400">
//                       Copiar para...
//                     </DropdownMenuLabel>
//                     {pages.map((p: any, idx: number) => (
//                       <DropdownMenuItem
//                         key={p.id}
//                         onClick={() => onCopyToPage(block.id, p.id)}
//                         className="cursor-pointer text-xs"
//                       >
//                         <ArrowRightCircle className="w-3 h-3 mr-2 text-slate-400" />
//                         {p.title || `Página ${idx + 1}`}
//                       </DropdownMenuItem>
//                     ))}
//                   </>
//                 )}
//               </DropdownMenuContent>
//             </DropdownMenu>

//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onDelete(block.id);
//               }}
//               className="px-2 h-full hover:bg-red-600 rounded-r-md text-red-100 hover:text-white transition-colors"
//               title="Apagar"
//             >
//               <Trash2 className="w-3.5 h-3.5" />
//             </button>
//           </div>
//         </>
//       )}

//       {/* CONTEÚDO REAL DO BLOCO (Overflow Hidden para bordas arredondadas) */}
//       <div style={contentStyles} className="overflow-hidden relative">
//         {block.type === "HERO" && (
//           <>
//             <div
//               className="absolute inset-0 z-0"
//               style={{
//                 backgroundImage: block.content.image
//                   ? `url(${block.content.image})`
//                   : "none",
//                 backgroundSize: s.objectFit || "cover",
//                 backgroundPosition: "center",
//                 opacity: 1,
//               }}
//             />
//             {block.content.image && (
//               <div className="absolute inset-0 z-0 bg-black/20" />
//             )}

//             <div className="relative z-10 w-full flex flex-col justify-center h-full px-4">
//               <h1
//                 style={{
//                   margin: 0,
//                   width: "100%",
//                   color: s.titleColor || s.color,
//                   fontSize: s.titleFontSize ? `${s.titleFontSize}px` : "2em",
//                   fontFamily: s.titleFontFamily || s.fontFamily,
//                   fontWeight: s.titleFontWeight || "bold",
//                   lineHeight: s.titleLineHeight || 1.2,
//                   letterSpacing: `${s.titleLetterSpacing || 0}px`,
//                   textTransform: s.titleTextTransform as any,
//                   textAlign: (s.titleTextAlign || s.textAlign) as any,
//                 }}
//               >
//                 {block.content.title || "Título"}
//               </h1>

//               <p
//                 style={{
//                   margin: 0,
//                   marginTop: "0.5em",
//                   width: "100%",
//                   color: s.descColor || s.color,
//                   fontSize: s.descFontSize ? `${s.descFontSize}px` : "1em",
//                   fontFamily: s.descFontFamily || s.fontFamily,
//                   fontWeight: s.descFontWeight || "normal",
//                   lineHeight: s.descLineHeight || 1.5,
//                   textAlign: (s.descTextAlign || s.textAlign) as any,
//                   opacity: 0.9,
//                 }}
//               >
//                 {block.content.subtitle}
//               </p>
//             </div>
//           </>
//         )}

//         {block.type === "TEXT" && (
//           <div style={{ width: "100%" }}>
//             <p
//               className="whitespace-pre-wrap w-full"
//               style={{
//                 margin: 0,
//                 width: "100%",
//                 textAlign: s.textAlign as any,
//               }}
//             >
//               {block.content.text || "Escreva aqui..."}
//             </p>
//           </div>
//         )}

//         {block.type === "IMAGE" &&
//           (block.content.url ? (
//             <img
//               src={block.content.url}
//               style={{
//                 width: "100%",
//                 height: "100%",
//                 display: "block",
//                 objectFit: (s.objectFit as any) || "cover",
//                 borderRadius: s.borderRadius
//                   ? `${s.borderRadius}px`
//                   : undefined,
//               }}
//               alt=""
//             />
//           ) : (
//             <div className="h-full min-h-[150px] bg-slate-50 flex items-center justify-center text-slate-400 text-[10px] uppercase font-bold border-2 border-dashed border-slate-200">
//               SEM IMAGEM
//             </div>
//           ))}

//         {block.type === "VIDEO" && (
//           <div className="w-full h-full bg-slate-950 flex items-center justify-center text-white min-h-[200px] relative">
//             {block.content.url ? (
//               <iframe
//                 src={block.content.url.replace("watch?v=", "embed/")}
//                 className="w-full h-full absolute inset-0 pointer-events-none"
//                 title="Video Preview"
//                 frameBorder="0"
//               />
//             ) : (
//               <Video className="w-10 h-10 opacity-50" />
//             )}
//           </div>
//         )}

//         {block.type === "MAP" && (
//           <div className="w-full h-full flex flex-col min-h-[200px]">
//             <div className="relative w-full flex-1 overflow-hidden bg-slate-100/50 rounded-sm">
//               {block.content.link ? (
//                 <iframe
//                   width="100%"
//                   height="100%"
//                   loading="lazy"
//                   style={{ border: 0, display: "block", pointerEvents: "none" }}
//                   src={
//                     block.content.link.includes("embed")
//                       ? block.content.link
//                       : ""
//                   }
//                 />
//               ) : (
//                 <div className="flex flex-col items-center justify-center h-full text-slate-400">
//                   <MapPin className="w-8 h-8 opacity-50 mb-2" />
//                   <p className="text-[10px] uppercase font-bold">Sem Mapa</p>
//                 </div>
//               )}
//             </div>
//             {block.content.address && (
//               <p
//                 style={{
//                   marginTop: "0.75em",
//                   lineHeight: 1.4,
//                   opacity: 0.8,
//                   textAlign: s.textAlign as any,
//                 }}
//               >
//                 {block.content.address}
//               </p>
//             )}
//           </div>
//         )}

//         {block.type === "DIVIDER" && (
//           <div
//             style={{
//               width: "100%",
//               display: "flex",
//               justifyContent: block.content?.align || "center",
//               height: "auto",
//               padding: "10px 0",
//             }}
//           >
//             <div
//               style={{
//                 width:
//                   block.content?.orientation === "vertical"
//                     ? "0px"
//                     : s.width || "100%",
//                 height:
//                   block.content?.orientation === "vertical"
//                     ? s.height || "100px"
//                     : "0px",
//                 borderTopWidth:
//                   block.content?.orientation !== "vertical"
//                     ? `${s.borderWidth || 2}px`
//                     : 0,
//                 borderLeftWidth:
//                   block.content?.orientation === "vertical"
//                     ? `${s.borderWidth || 2}px`
//                     : 0,
//                 borderStyle: (s.borderStyle as any) || "solid",
//                 borderColor: s.borderColor || "#000000",
//                 backgroundColor: "transparent",
//               }}
//             />
//           </div>
//         )}

//         {/* Blocos Complexos */}
//         {block.type === "RSVP" && (
//           <div
//             className={cn(
//               isPreview ? "pointer-events-auto" : "pointer-events-none",
//             )}
//           >
//             <RsvpBlock
//               content={block.content}
//               styles={s}
//               isEditorPreview={!isPreview}
//             />
//           </div>
//         )}
//         {block.type === "COUNTDOWN" && (
//           <CountdownRenderer date={block.content?.date} styles={s} />
//         )}
//         {block.type === "MENU" && (
//           <MenuRenderer
//             content={block.content}
//             styles={s}
//             isPreview={isPreview}
//           />
//         )}
//         {block.type === "SCHEDULE" && (
//           <ScheduleRenderer content={block.content} styles={s} />
//         )}
//         {block.type === "CAROUSEL" && (
//           <CarouselRenderer content={block.content} styles={s} />
//         )}

//         {/* COLUNAS (Corrigido com Botão Plus) */}
//         {block.type === "COLUMNS" && (
//           <div
//             className={cn(
//               "grid gap-4 w-full",
//               `grid-cols-${block.content.cols || 1}`,
//             )}
//           >
//             {[...Array(block.content.cols || 1)].map((_, i) => (
//               <div
//                 key={i}
//                 className={cn(
//                   "flex flex-col gap-4 min-h-[50px]",
//                   // Sem borda feia, apenas padding
//                   !isPreview && "p-1",
//                 )}
//               >
//                 {(block.content.children?.[`col${i}`] || []).map((sub: any) => (
//                   <BlockRenderer
//                     key={sub.id}
//                     block={sub}
//                     selectedBlockId={null}
//                     onClick={onClick}
//                     isPreview={isPreview}
//                     pages={pages}
//                     onCopyToPage={onCopyToPage}
//                     onAddChild={onAddChild}
//                     onMove={() => {}}
//                     onDuplicate={() => {}}
//                     onDelete={() => {}}
//                   />
//                 ))}

//                 {!isPreview && (
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();

//                       if (onAddChild) onAddChild(block.id, i);
//                     }}
//                     className="flex items-center justify-center w-full py-3 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 hover:text-blue-500 hover:border-blue-300 hover:bg-blue-50 transition-all group"
//                     title="Adicionar elemento nesta coluna"
//                   >
//                     <Plus className="w-5 h-5 opacity-70 group-hover:opacity-100" />
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </motion.div>
//   );
// };

"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2,
  Video,
  MapPin,
  ArrowRightCircle,
  Plus,
} from "lucide-react";
import { DEFAULT_STYLES } from "../types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Renderizadores Específicos
import { RsvpBlock } from "@/components/rsvp-block";
import { CountdownRenderer } from "./blocks/countdown-renderer";
import { MenuRenderer } from "./blocks/menu-render";
import { ScheduleRenderer } from "./blocks/schedule-render";
import { CarouselRenderer } from "./blocks/carousel-render";
import { getBackgroundStyle } from "@/features/editor/utils";

export const BlockRenderer = ({
  block,
  isSelected,
  onClick,
  isPreview,
  onMove,
  onDuplicate,
  onDelete,
  pages,
  onCopyToPage,
  isFirst,
  onAddChild,
}: any) => {
  const s = { ...DEFAULT_STYLES, ...block.styles };

  const animVariants = {
    none: {
      initial: { opacity: 1, y: 0, scale: 1 },
      animate: { opacity: 1, y: 0, scale: 1 },
    },
    fade: { initial: { opacity: 0 }, animate: { opacity: 1 } },
    "slide-up": {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
    },
    "slide-down": {
      initial: { opacity: 0, y: -30 },
      animate: { opacity: 1, y: 0 },
    },
    "slide-left": {
      initial: { opacity: 0, x: 30 },
      animate: { opacity: 1, x: 0 },
    },
    "slide-right": {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 },
    },
    "zoom-in": {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
    },
    "zoom-out": {
      initial: { opacity: 0, scale: 1.2 },
      animate: { opacity: 1, scale: 1 },
    },
    flip: {
      initial: { opacity: 0, rotateX: 90 },
      animate: { opacity: 1, rotateX: 0 },
    },
  };

  const selectedAnim = (animVariants as any)[s.animation || "none"];

  const motionProps = isPreview
    ? {
        initial: selectedAnim.initial,
        whileInView: selectedAnim.animate,
        viewport: { once: true, amount: 0.1 },
      }
    : {
        initial: selectedAnim.initial,
        animate: selectedAnim.animate,
      };

  const contentBackground = getBackgroundStyle(s.backgroundColor);

  const contentStyles: React.CSSProperties = {
    ...contentBackground,
    paddingTop: `${s.paddingTop}px`,
    paddingBottom: `${s.paddingBottom}px`,
    paddingLeft: `${s.paddingLeft}px`,
    paddingRight: `${s.paddingRight}px`,
    width: s.width || "100%",
    height: block.type === "DIVIDER" ? "auto" : s.height || "auto",
    minHeight:
      !block.content?.image && block.type === "HERO"
        ? "auto"
        : block.type === "DIVIDER"
          ? "auto"
          : s.height,
    borderRadius: `${s.borderRadius}px`,
    borderWidth: `${s.borderWidth}px`,
    borderColor: s.borderColor,
    borderStyle: s.borderStyle as any,
    boxShadow:
      s.shadow === "none"
        ? "none"
        : s.shadow === "sm"
          ? "0 1px 2px rgba(0,0,0,0.1)"
          : s.shadow === "md"
            ? "0 4px 6px rgba(0,0,0,0.1)"
            : "0 10px 15px rgba(0,0,0,0.1)",
    color: s.color,
    fontFamily: s.fontFamily,
    fontSize: `${s.fontSize}px`,
    textAlign: s.textAlign as any,
    lineHeight: s.lineHeight,
    letterSpacing: `${s.letterSpacing}px`,
    textTransform: s.textTransform as any,
    display:
      block.type === "DIVIDER" || block.type === "MAP" ? "block" : "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch",
  };

  const wrapperStyles: React.CSSProperties = {
    marginTop: `${s.marginTop}px`,
    marginBottom: `${s.marginBottom}px`,
    marginLeft: `${s.marginLeft}px`,
    marginRight: `${s.marginRight}px`,
    position: "relative",
    zIndex: isSelected ? 20 : 1,
  };

  return (
    <motion.div
      onClick={(e) => {
        e.stopPropagation();
        if (!isPreview) onClick(block.id);
      }}
      style={wrapperStyles}
      className={cn("group shrink-0", !isPreview && "cursor-pointer")}
      {...motionProps}
      transition={{
        duration: s.animationDuration || 0.5,
        delay: s.animationDelay || 0,
        ease: "easeOut",
      }}
      key={`${block.id}-${isPreview}-${s.animation}-${s.animationDuration}-${s.animationDelay}`}
    >
      {/* --- UI DE SELEÇÃO (KEY ADICIONADA) --- */}
      {!isPreview && isSelected && (
        <div key="selection-ui-wrapper">
          <div className="absolute inset-0 border-2 border-blue-600 pointer-events-none z-50" />
          <div
            className={cn(
              "absolute flex bg-slate-900 text-white rounded-md shadow-xl z-[60] items-center h-8 border border-white/20 transition-all",
              isFirst ? "top-2 right-2" : "-top-9 right-0",
            )}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMove(block.id, "UP");
              }}
              disabled={isFirst}
              className={cn(
                "px-2 h-full hover:bg-white/20 rounded-l-md border-r border-white/10",
                isFirst && "opacity-50 cursor-not-allowed",
              )}
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMove(block.id, "DOWN");
              }}
              className="px-2 h-full hover:bg-white/20 border-r border-white/10"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="px-2 h-full hover:bg-white/20 border-r border-white/10 outline-none">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 z-[70]">
                <DropdownMenuLabel className="text-[10px] uppercase text-slate-400">
                  Ações
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => onDuplicate(block.id)}
                  className="cursor-pointer"
                >
                  <Copy className="w-3 h-3 mr-2" /> Duplicar aqui
                </DropdownMenuItem>
                {pages && pages.length > 1 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-[10px] uppercase text-slate-400">
                      Copiar para...
                    </DropdownMenuLabel>
                    {pages.map((p: any, idx: number) => (
                      <DropdownMenuItem
                        key={p.id}
                        onClick={() => onCopyToPage(block.id, p.id)}
                        className="cursor-pointer text-xs"
                      >
                        <ArrowRightCircle className="w-3 h-3 mr-2 text-slate-400" />
                        {p.title || `Página ${idx + 1}`}
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(block.id);
              }}
              className="px-2 h-full hover:bg-red-600 rounded-r-md text-red-100 hover:text-white transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* --- CONTEÚDO REAL DO BLOCO (KEY ADICIONADA) --- */}
      <div
        key="block-content-wrapper"
        style={contentStyles}
        className="overflow-hidden relative"
      >
        {block.type === "HERO" && (
          <div className="w-full h-full">
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: block.content.image
                  ? `url(${block.content.image})`
                  : "none",
                backgroundSize: s.objectFit || "cover",
                backgroundPosition: "center",
                opacity: 1,
              }}
            />
            {block.content.image && (
              <div className="absolute inset-0 z-0 bg-black/20" />
            )}
            <div className="relative z-10 w-full flex flex-col justify-center h-full px-4">
              <h1
                style={{
                  margin: 0,
                  width: "100%",
                  color: s.titleColor || s.color,
                  fontSize: s.titleFontSize ? `${s.titleFontSize}px` : "2em",
                  fontFamily: s.titleFontFamily || s.fontFamily,
                  fontWeight: s.titleFontWeight || "bold",
                  lineHeight: s.titleLineHeight || 1.2,
                  letterSpacing: `${s.titleLetterSpacing || 0}px`,
                  textTransform: s.titleTextTransform as any,
                  textAlign: (s.titleTextAlign || s.textAlign) as any,
                }}
              >
                {block.content.title || "Título"}
              </h1>
              <p
                style={{
                  margin: 0,
                  marginTop: "0.5em",
                  width: "100%",
                  color: s.descColor || s.color,
                  fontSize: s.descFontSize ? `${s.descFontSize}px` : "1em",
                  fontFamily: s.descFontFamily || s.fontFamily,
                  fontWeight: s.descFontWeight || "normal",
                  textAlign: (s.descTextAlign || s.textAlign) as any,
                  opacity: 0.9,
                }}
              >
                {block.content.subtitle}
              </p>
            </div>
          </div>
        )}

        {block.type === "TEXT" && (
          <div style={{ width: "100%" }}>
            <p
              className="whitespace-pre-wrap w-full"
              style={{
                margin: 0,
                width: "100%",
                textAlign: s.textAlign as any,
              }}
            >
              {block.content.text || "Escreva aqui..."}
            </p>
          </div>
        )}

        {block.type === "IMAGE" &&
          (block.content.url ? (
            <img
              src={block.content.url}
              style={{
                width: "100%",
                height: "100%",
                display: "block",
                objectFit: (s.objectFit as any) || "cover",
                borderRadius: s.borderRadius
                  ? `${s.borderRadius}px`
                  : undefined,
              }}
              alt=""
            />
          ) : (
            <div className="h-full min-h-[150px] bg-slate-50 flex items-center justify-center text-slate-400 text-[10px] uppercase font-bold border-2 border-dashed border-slate-200">
              SEM IMAGEM
            </div>
          ))}

        {block.type === "VIDEO" && (
          <div className="w-full h-full bg-slate-950 flex items-center justify-center text-white min-h-[200px] relative">
            {block.content.url ? (
              <iframe
                src={block.content.url.replace("watch?v=", "embed/")}
                className="w-full h-full absolute inset-0 pointer-events-none"
                title="Video Preview"
                frameBorder="0"
              />
            ) : (
              <Video className="w-10 h-10 opacity-50" />
            )}
          </div>
        )}

        {block.type === "MAP" && (
          <div className="w-full h-full flex flex-col min-h-[200px]">
            <div className="relative w-full flex-1 overflow-hidden bg-slate-100/50 rounded-sm">
              {block.content.link ? (
                <iframe
                  width="100%"
                  height="100%"
                  loading="lazy"
                  style={{ border: 0, display: "block", pointerEvents: "none" }}
                  src={
                    block.content.link.includes("embed")
                      ? block.content.link
                      : ""
                  }
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <MapPin className="w-8 h-8 opacity-50 mb-2" />
                  <p className="text-[10px] uppercase font-bold">Sem Mapa</p>
                </div>
              )}
            </div>
            {block.content.address && (
              <p
                style={{
                  marginTop: "0.75em",
                  lineHeight: 1.4,
                  opacity: 0.8,
                  textAlign: s.textAlign as any,
                }}
              >
                {block.content.address}
              </p>
            )}
          </div>
        )}

        {block.type === "DIVIDER" && (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: block.content?.align || "center",
              height: "auto",
              padding: "10px 0",
            }}
          >
            <div
              style={{
                width:
                  block.content?.orientation === "vertical"
                    ? "0px"
                    : s.width || "100%",
                height:
                  block.content?.orientation === "vertical"
                    ? s.height || "100px"
                    : "0px",
                borderTopWidth:
                  block.content?.orientation !== "vertical"
                    ? `${s.borderWidth || 2}px`
                    : 0,
                borderLeftWidth:
                  block.content?.orientation === "vertical"
                    ? `${s.borderWidth || 2}px`
                    : 0,
                borderStyle: (s.borderStyle as any) || "solid",
                borderColor: s.borderColor || "#000000",
                backgroundColor: "transparent",
              }}
            />
          </div>
        )}

        {block.type === "RSVP" && (
          <div
            className={cn(
              isPreview ? "pointer-events-auto" : "pointer-events-none",
            )}
          >
            <RsvpBlock
              content={block.content}
              styles={s}
              isEditorPreview={!isPreview}
            />
          </div>
        )}
        {block.type === "COUNTDOWN" && (
          <CountdownRenderer date={block.content?.date} styles={s} />
        )}
        {block.type === "MENU" && (
          <MenuRenderer
            content={block.content}
            styles={s}
            isPreview={isPreview}
          />
        )}
        {block.type === "SCHEDULE" && (
          <ScheduleRenderer content={block.content} styles={s} />
        )}
        {block.type === "CAROUSEL" && (
          <CarouselRenderer content={block.content} styles={s} />
        )}

        {block.type === "COLUMNS" && (
          <div
            className={cn(
              "grid gap-4 w-full",
              `grid-cols-${block.content.cols || 1}`,
            )}
          >
            {[...Array(block.content.cols || 1)].map((_, i) => (
              <div
                key={`col-${i}`}
                className={cn(
                  "flex flex-col gap-4 min-h-[50px]",
                  !isPreview &&
                    "p-1 rounded-lg hover:bg-slate-50/50 transition-colors",
                )}
              >
                {(block.content.children?.[`col${i}`] || []).map((sub: any) => (
                  <BlockRenderer
                    key={sub.id}
                    block={sub}
                    selectedBlockId={null}
                    onClick={onClick}
                    isPreview={isPreview}
                    pages={pages}
                    onCopyToPage={onCopyToPage}
                    onAddChild={onAddChild}
                    onMove={() => {}}
                    onDuplicate={() => {}}
                    onDelete={() => {}}
                  />
                ))}
                {!isPreview && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onAddChild) onAddChild(block.id, i);
                    }}
                    className="flex items-center justify-center w-full py-3 border-2 border-dashed border-slate-100 rounded-lg text-slate-300 hover:text-blue-500 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                  >
                    <Plus className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
