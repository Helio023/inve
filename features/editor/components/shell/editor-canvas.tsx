
"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Plus, Files, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlockRenderer } from "../block-renderer";

// As props 'device' já foram removidas, o que está correto.
export function EditorCanvas({
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isRealMobile = isMounted && typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <main
      className="flex-1 bg-slate-100 md:bg-slate-200/50 flex flex-col items-center justify-center overflow-hidden relative"
      onClick={() => selectBlock(null)}
    >
      <div
        className={cn(
          "transition-all duration-300 overflow-hidden flex flex-col relative bg-white shadow-sm",

          // --- CORREÇÃO AQUI ---
          // Aplicamos as classes do mockup de telemóvel diretamente, sem condições.
          // Este é o "quadradinho" que será sempre visível.
          "w-[375px] h-[667px] rounded-[30px] border-[8px] border-slate-800 shadow-2xl",
          // --------------------

          // Esta linha garante que em ecrãs muito pequenos (como um telemóvel real),
          // o mockup ocupa a tela inteira, proporcionando uma boa experiência de edição.
          "max-md:!w-full max-md:!h-full max-md:!border-none max-md:!rounded-none max-md:!shadow-none",
          
          // Quando o modo 'Preview' do header está ativo, removemos as bordas para uma visualização limpa.
          isPreview && "shadow-none border-none rounded-none w-full h-full max-w-md mx-auto"
        )}
        style={{
          backgroundColor: pageStyles.backgroundColor || "#ffffff",
          backgroundImage: pageStyles.backgroundImage ? `url(${pageStyles.backgroundImage})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* O resto do ficheiro permanece exatamente igual */}
        {pageStyles.backgroundImage && (
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{ backgroundColor: `rgba(0,0,0,${pageStyles.backgroundOpacity || 0})` }}
          />
        )}

        <div
          className="flex-1 overflow-y-auto no-scrollbar relative z-10"
          style={{
            paddingTop: `${pageStyles.paddingTop || 0}px`,
            paddingLeft: `${pageStyles.paddingLeft || 0}px`,
            paddingRight: `${pageStyles.paddingRight || 0}px`,
            paddingBottom: `${(pageStyles.paddingBottom || 0) + (isRealMobile && !isPreview ? 120 : 0)}px`,
          }}
        >
          {activePage.blocks.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 p-8 text-center">
              <Plus className="w-12 h-12 mb-4 opacity-10" />
              <p className="font-medium italic">Página Vazia</p>
              {!isPreview && <p className="text-xs mt-1">Adicione elementos</p>}
            </div>
          ) : (
            <div>
              {activePage.blocks.map((block: any) => (
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
                />
              ))}
            </div>
          )}
        </div>

        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 pointer-events-none z-20">
          {pages.map((p: any) => (
            <div
              key={p.id}
              className={cn(
                "w-1.5 h-1.5 rounded-full shadow-sm transition-all duration-300 backdrop-blur-sm",
                p.id === activePageId ? "bg-slate-800 w-4" : "bg-slate-400/50"
              )}
            />
          ))}
        </div>
      </div>

      {!isPreview && (
        <div className="hidden md:flex absolute bottom-6 items-center gap-2 bg-white/90 backdrop-blur px-2.5 py-2 rounded-full shadow-xl border border-slate-200 z-30">
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
                  "w-7 h-7 rounded-full text-xs font-bold border transition-all",
                  p.id === activePageId
                    ? "bg-slate-900 text-white border-slate-900 shadow-md scale-110"
                    : "bg-white text-slate-500 hover:border-slate-400"
                )}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          <div className="h-4 w-px bg-slate-200 mx-1" />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-red-50 text-red-500"
            disabled={pages.length <= 1}
            onClick={() => deletePage(activePageId)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}
    </main>
  );
}