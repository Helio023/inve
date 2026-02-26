
"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { getBackgroundStyle } from "../../utils";
import { EventInteractionProvider } from "@/features/editor/components/event-interaction-context";
import { BlockRenderer } from "../block-render";

const EditorCanvasComponent = ({
  activePage,
  selectedBlockId,
  selectBlock,
  pages,
  isPreview,
  onAddChild,
  onMoveBlock,
  onDuplicateBlock,
  onDeleteBlock,
  copyBlockToPage,
}: any) => {
  const pageStyles = activePage?.styles || {};
  const baseBackground = getBackgroundStyle(pageStyles);

  return (
    <EventInteractionProvider>
      <div
        className={cn(
          "flex-1 flex flex-col items-center justify-center relative w-full h-full",
          !isPreview ? "p-4" : "p-0",
        )}
        onClick={() => selectBlock(null)}
      >
        <div
          id="phone-mockup"
          className={cn(
            "transition-all duration-500 flex flex-col relative bg-white shrink-0 z-20 overflow-hidden shadow-2xl",
            "md:w-[472px] md:h-[min(85dvh,850px)] md:rounded-[48px] md:border-[12px] md:border-slate-900",
            "max-md:w-full max-md:h-full max-md:rounded-[32px] max-md:border-[6px] max-md:border-slate-800",
            isPreview &&
              "shadow-none border-none rounded-none w-full h-full max-w-[448px] mx-auto",
          )}
          style={baseBackground}
          onClick={(e) => e.stopPropagation()}
        >
          {pageStyles.backgroundImage && (
            <div
              className="absolute inset-0 z-0 bg-black"
              style={{ opacity: pageStyles.backgroundOpacity || 0 }}
            />
          )}

          <div
            className="flex-1 overflow-y-auto no-scrollbar relative z-10 flex flex-col h-full"
            style={{
              paddingTop: `${pageStyles.paddingTop || 0}px`,
              paddingBottom: `${pageStyles.paddingBottom || 0}px`,
              paddingLeft: `${pageStyles.paddingLeft || 0}px`,
              paddingRight: `${pageStyles.paddingRight || 0}px`,
            }}
          >
            <div className="flex flex-col min-h-full">
              {activePage?.blocks.map((block: any, index: number) => {
                const isSelected = !isPreview && selectedBlockId === block.id;
                
                // EXTRAÇÃO CIRÚRGICA DE MARGENS
                const mt = !isPreview ? (block.styles?.marginTop || 0) : 0;
                const mb = !isPreview ? (block.styles?.marginBottom || 0) : 0;

                return (
                  <div key={block.id} className="w-full flex flex-col">
                    {/* 1. ESPAÇADOR DE TOPO (Invisível, fora da borda de seleção) */}
                    <div style={{ height: mt }} className="w-full pointer-events-none" />

                    {/* 2. ÁREA DO BLOCO (Onde a borda realmente deve aparecer) */}
                    <div
                      className={cn(
                        "relative group transition-all duration-200",
                        !isPreview && "hover:ring-1 hover:ring-blue-400/40 hover:ring-inset",
                        isSelected && "ring-2 ring-blue-500 ring-inset z-50 shadow-md"
                      )}
                    >
                      <BlockRenderer
               
                        block={{
                          ...block,
                          styles: isPreview ? block.styles : { ...block.styles, marginTop: 0, marginBottom: 0 }
                        }}
                        isSelected={isSelected}
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
                    </div>

                    
                    <div style={{ height: mb }} className="w-full pointer-events-none" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </EventInteractionProvider>
  );
};

export const EditorCanvas = memo(EditorCanvasComponent);