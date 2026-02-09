"use client";

import { useState, useEffect, memo } from "react";
import { cn } from "@/lib/utils";
import { Plus, Trash2, Copy, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlockRenderer } from "../block-renderer";
import { getBackgroundStyle } from "../../utils";

const EditorCanvasComponent = ({
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
  duplicatePage,
  reorderPage,
  copyBlockToPage,
}: any) => {
  const pageStyles = activePage.styles || {};
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isRealMobile =
    isMounted && typeof window !== "undefined" && window.innerWidth < 768;

  const baseBackground = getBackgroundStyle(
    pageStyles.backgroundColor || "#ffffff",
  );

  return (
    <main
      className="flex-1 bg-slate-100 md:bg-slate-200/50 flex flex-col items-center justify-center overflow-hidden relative"
      onClick={() => selectBlock(null)}
    >
      <div
        className={cn(
          "transition-all duration-500 ease-in-out overflow-hidden flex flex-col relative bg-white shadow-sm",
          "w-full max-w-[420px] h-[85vh] rounded-[36px] border-[8px] border-slate-800 shadow-2xl",
          "max-md:!w-full max-md:!h-full max-md:!border-none max-md:!rounded-none max-md:!shadow-none",
          isPreview &&
            "shadow-none border-none rounded-none w-full h-full max-w-md mx-auto",
        )}
        style={{
          ...baseBackground,
          ...(pageStyles.backgroundImage
            ? {
                backgroundImage: `url(${pageStyles.backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }
            : {}),
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {pageStyles.backgroundImage && (
          <div
            className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300"
            style={{
              backgroundColor: "black",
              opacity: pageStyles.backgroundOpacity || 0,
            }}
          />
        )}

        <div
          className="flex-1 overflow-y-auto no-scrollbar relative z-10 flex flex-col"
          style={{
            paddingTop: `${pageStyles.paddingTop || 0}px`,
            paddingLeft: `${pageStyles.paddingLeft || 0}px`,
            paddingRight: `${pageStyles.paddingRight || 0}px`,
            paddingBottom: `${(pageStyles.paddingBottom || 0) + (isRealMobile && !isPreview ? 120 : 0)}px`,
          }}
        >
          {activePage.blocks.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 p-8 text-center animate-in fade-in zoom-in duration-500">
              <Plus className="w-12 h-12 mb-4 opacity-10" />
              <p className="font-medium italic">Página Vazia</p>
              {!isPreview && (
                <p className="text-xs mt-1 opacity-50">
                  Adicione elementos pelo menu
                </p>
              )}
            </div>
          ) : (
            // CORREÇÃO AQUI: Adicionado 'h-full' para garantir que o container ocupe 100% da altura disponível
            // Isso permite que filhos com height: 100% (convertido de 100dvh) funcionem.
            <div className="flex flex-col min-h-full h-full">
              {activePage.blocks.map((block: any, index: number) => (
                <BlockRenderer
                  key={block.id}
                  block={block}
                  isSelected={!isPreview && selectedBlockId === block.id}
                  selectedBlockId={selectedBlockId}
                  onClick={selectBlock}
                  isPreview={isPreview}
                  onAddChild={onAddChild}
                  onMove={onMoveBlock}
                  onDuplicate={onDuplicateBlock}
                  onDelete={onDeleteBlock}
                  pages={pages}
                  isFirst={index === 0}
                  onCopyToPage={copyBlockToPage}
                />
              ))}
            </div>
          )}
        </div>

        {/* Dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 pointer-events-none z-20">
          {pages.map((p: any) => (
            <div
              key={p.id}
              className={cn(
                "w-1.5 h-1.5 rounded-full shadow-sm transition-all duration-300 backdrop-blur-sm",
                p.id === activePageId ? "bg-white w-4" : "bg-white/40",
              )}
            />
          ))}
        </div>
      </div>

      {/* Navegação Inferior */}
      {!isPreview && (
        <div className="hidden md:flex absolute bottom-6 items-center gap-1 bg-white/90 backdrop-blur px-2 py-1.5 rounded-full shadow-xl border border-slate-200 z-30 animate-in slide-in-from-bottom-6">
          <Button variant="ghost" size="icon" onClick={() => reorderPage("LEFT")} disabled={pages.findIndex((p: any) => p.id === activePageId) === 0} className="rounded-full w-8 h-8 hover:bg-slate-100 text-slate-500"><ArrowLeft className="w-3.5 h-3.5" /></Button>
          <div className="w-px h-4 bg-slate-200 mx-1" />
          <Button variant="ghost" size="icon" onClick={addPage} className="rounded-full w-8 h-8 hover:bg-blue-50 text-blue-600"><Plus className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => duplicatePage(activePageId)} className="rounded-full w-8 h-8 hover:bg-purple-50 text-purple-600"><Copy className="w-3.5 h-3.5" /></Button>
          <div className="w-px h-4 bg-slate-200 mx-1" />
          <div className="flex gap-1 px-1">
            {pages.map((p: any, idx: number) => (
              <button key={p.id} onClick={() => setActivePageId(p.id)} className={cn("w-6 h-6 rounded-full text-[10px] font-bold border transition-all flex items-center justify-center", p.id === activePageId ? "bg-slate-900 text-white border-slate-900 shadow-md scale-110" : "bg-white text-slate-500 hover:border-slate-400 hover:text-slate-700")}>{idx + 1}</button>
            ))}
          </div>
          <div className="w-px h-4 bg-slate-200 mx-1" />
          <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 hover:bg-red-50 text-red-500" disabled={pages.length <= 1} onClick={() => deletePage(activePageId)}><Trash2 className="w-3.5 h-3.5" /></Button>
          <div className="w-px h-4 bg-slate-200 mx-1" />
          <Button variant="ghost" size="icon" onClick={() => reorderPage("RIGHT")} disabled={pages.findIndex((p: any) => p.id === activePageId) === pages.length - 1} className="rounded-full w-8 h-8 hover:bg-slate-100 text-slate-500"><ArrowRight className="w-3.5 h-3.5" /></Button>
        </div>
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </main>
  );
};

export const EditorCanvas = memo(EditorCanvasComponent);