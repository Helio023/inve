
// "use client";

// import { cn } from "@/lib/utils";
// import { Plus, Files, Trash2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { BlockRenderer } from "../block-renderer";

// export function EditorCanvas({
//   device,
//   activePage,
//   selectedBlockId,
//   selectBlock,
//   pages,
//   activePageId,
//   setActivePageId,
//   addPage,
//   deletePage,
//   isPreview,
//   onAddChild,
//   onMoveBlock,
//   onDuplicateBlock,
//   onDeleteBlock,
// }: any) {
//   return (
//     <main
//       className="flex-1 bg-slate-100 md:bg-slate-200/50 flex flex-col items-center justify-center overflow-hidden relative transition-all duration-500"
//       onClick={() => selectBlock(null)}
//     >
//       <div
//         className={cn(
//           "bg-white transition-all duration-500 overflow-hidden flex flex-col relative",
//           "w-full h-full md:w-[375px] md:h-[667px]",
//           device === "desktop" &&
//             "md:w-full md:max-w-5xl md:h-[95%] md:rounded-xl md:border md:border-slate-200",
//           device === "mobile" &&
//             "md:rounded-[45px] md:border-[12px] md:border-slate-950 md:shadow-2xl",
//           isPreview && "md:shadow-none md:border-none md:rounded-none"
//         )}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div
//           className={cn(
//             "flex-1 overflow-y-auto no-scrollbar bg-white",
//             !isPreview ? "pb-40 p-4 space-y-4" : "p-0"
//           )}
//         >
//           {activePage.blocks.length === 0 ? (
//             <div className="h-full flex flex-col items-center justify-center text-slate-300">
//               <Plus className="w-12 h-12 mb-4 opacity-10" />
//               <p className="font-medium italic">Página Vazia</p>
//             </div>
//           ) : (
//             activePage.blocks.map((block: any) => (
//               <BlockRenderer
//                 key={block.id}
//                 block={block}
//                 isSelected={!isPreview && selectedBlockId === block.id}
//                 onClick={selectBlock}
//                 isPreview={isPreview}
//                 onAddChild={onAddChild}
//                 onMove={onMoveBlock}
//                 onDuplicate={onDuplicateBlock}
//                 onDelete={onDeleteBlock}
//               />
//             ))
//           )}
//         </div>

//         <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
//           {pages.map((p: any) => (
//             <div
//               key={p.id}
//               className={cn(
//                 "w-1.5 h-1.5 rounded-full shadow-sm transition-all duration-300",
//                 p.id === activePageId ? "bg-slate-800 w-4" : "bg-slate-300"
//               )}
//             />
//           ))}
//         </div>
//       </div>

//       {!isPreview && (
//         <div className="hidden md:flex absolute bottom-6 items-center gap-2 bg-white/95 backdrop-blur px-2.5 py-2 rounded-full shadow-2xl border border-slate-200 z-30 animate-in slide-in-from-bottom-2">
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={addPage}
//             className="rounded-full hover:bg-blue-50"
//           >
//             <Files className="w-4 h-4 text-blue-600" />
//           </Button>
//           <div className="h-4 w-px bg-slate-200 mx-1" />
//           <div className="flex gap-1">
//             {pages.map((p: any, idx: number) => (
//               <button
//                 key={p.id}
//                 onClick={() => setActivePageId(p.id)}
//                 className={cn(
//                   "w-8 h-8 rounded-full text-xs font-bold transition-all border",
//                   p.id === activePageId
//                     ? "bg-slate-900 text-white border-slate-900 shadow-md scale-110"
//                     : "bg-white text-slate-500 hover:border-slate-400"
//                 )}
//               >
//                 {idx + 1}
//               </button>
//             ))}
//           </div>
//           <div className="h-4 w-px bg-slate-200 mx-1" />
//           <Button
//             variant="ghost"
//             size="icon"
//             className="rounded-full hover:bg-red-50 text-red-500"
//             disabled={pages.length <= 1}
//             onClick={() => deletePage(activePageId)}
//           >
//             <Trash2 className="w-4 h-4" />
//           </Button>
//         </div>
//       )}
//     </main>
//   );
// }


"use client";

import { cn } from "@/lib/utils";
import { Plus, Files, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlockRenderer } from "../block-renderer";

export function EditorCanvas({
  device,
  activePage,
  selectedBlockId,
  selectBlock,
  pages,
  activePageId,
  setActivePageId,
  addPage,
  deletePage,
  isPreview,
  onAddChild,
  onMoveBlock,
  onDuplicateBlock,
  onDeleteBlock,
}: any) {
  const pageStyles = activePage.styles || {};

  return (
    <main
      className="flex-1 bg-slate-100 md:bg-slate-200/50 flex flex-col items-center justify-center overflow-hidden relative transition-all duration-500"
      onClick={() => selectBlock(null)}
    >
      <div
        className={cn(
          "transition-all duration-500 overflow-hidden flex flex-col relative",
          "w-full h-full md:w-[375px] md:h-[667px]",
          device === "desktop" && "md:w-full md:max-w-5xl md:h-[95%] md:rounded-xl md:border md:border-slate-200",
          device === "mobile" && "md:rounded-[45px] md:border-[12px] md:border-slate-950 md:shadow-2xl",
          isPreview && "md:shadow-none md:border-none md:rounded-none"
        )}
        style={{
            backgroundColor: pageStyles.backgroundColor || "#ffffff",
            backgroundImage: pageStyles.backgroundImage ? `url(${pageStyles.backgroundImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Camada de Escurecimento (Overlay) */}
        {pageStyles.backgroundImage && (
            <div 
                className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-500" 
                style={{ backgroundColor: `rgba(0,0,0,${pageStyles.backgroundOpacity || 0})` }}
            />
        )}

        <div
          className={cn(
            "flex-1 overflow-y-auto no-scrollbar relative z-10",
            !isPreview ? "pb-40 p-4 space-y-4" : "p-0"
          )}
        >
          {activePage.blocks.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-300">
              <Plus className="w-12 h-12 mb-4 opacity-10" />
              <p className="font-medium italic">Página Vazia</p>
            </div>
          ) : (
            activePage.blocks.map((block: any) => (
              <BlockRenderer
                key={block.id}
                block={block}
                isSelected={!isPreview && selectedBlockId === block.id}
                onClick={selectBlock}
                isPreview={isPreview}
                onAddChild={onAddChild}
                onMove={onMoveBlock}
                onDuplicate={onDuplicateBlock}
                onDelete={onDeleteBlock}
              />
            ))
          )}
        </div>

        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5 pointer-events-none z-20">
          {pages.map((p: any) => (
            <div
              key={p.id}
              className={cn(
                "w-1.5 h-1.5 rounded-full shadow-sm transition-all duration-300",
                p.id === activePageId ? "bg-slate-800 w-4" : "bg-slate-300"
              )}
            />
          ))}
        </div>
      </div>

      {!isPreview && (
        <div className="hidden md:flex absolute bottom-6 items-center gap-2 bg-white/95 backdrop-blur px-2.5 py-2 rounded-full shadow-2xl border border-slate-200 z-30 animate-in slide-in-from-bottom-2">
          <Button variant="ghost" size="icon" onClick={addPage} className="rounded-full hover:bg-blue-50">
            <Files className="w-4 h-4 text-blue-600" />
          </Button>
          <div className="h-4 w-px bg-slate-200 mx-1" />
          <div className="flex gap-1">
            {pages.map((p: any, idx: number) => (
              <button
                key={p.id}
                onClick={() => setActivePageId(p.id)}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all border",
                  p.id === activePageId ? "bg-slate-900 text-white border-slate-900 shadow-md scale-110" : "bg-white text-slate-500 hover:border-slate-400"
                )}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          <div className="h-4 w-px bg-slate-200 mx-1" />
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-red-50 text-red-500" disabled={pages.length <= 1} onClick={() => deletePage(activePageId)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}
    </main>
  );
}