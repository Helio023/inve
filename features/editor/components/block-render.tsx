"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Plus,
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2,
  ArrowRightCircle,
} from "lucide-react";
import { IBlock, DEFAULT_STYLES, IPage } from "../types";
import { SharedBlockContent } from "./shared-block-content";
import { 
  getContainerStyle, 
  getBackgroundStyle, 
  getAnimationVariants 
} from "../utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BLOCK_DEFINITIONS } from "../constants/definitions";

interface BlockRendererProps {
  block: IBlock;
  isSelected: boolean;
  selectedBlockId?: string | null;
  onClick: (id: string) => void;
  onAddChild: (parentId: string, colIdx: number) => void;
  isPreview?: boolean;
  onMove: (id: string, dir: "UP" | "DOWN") => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  pages: IPage[];
  onCopyToPage: (blockId: string, pageId: string) => void;
  isFirst: boolean;
}

export const BlockRenderer = ({
  block,
  isSelected,
  onClick,
  onAddChild,
  isPreview,
  onMove,
  onDuplicate,
  onDelete,
  pages,
  onCopyToPage,
  isFirst,
  selectedBlockId,
}: BlockRendererProps) => {
  const s = { ...DEFAULT_STYLES, ...block.styles };
  const definition = BLOCK_DEFINITIONS[block.type];
  
  // RESTAURAÇÃO DAS ANIMAÇÕES:
  // Usamos o helper para transformar a string "fade", "slide-up" etc em objetos do Framer Motion
  const variants = getAnimationVariants(s.animation || "none");

  return (
    <motion.div
      // A key única garante que a animação reinicie quando você mudar o tipo de animação no painel
      key={`${block.id}-${s.animation}`}
      variants={variants}
      initial="hidden"
      animate="visible"
      onClick={(e) => {
        e.stopPropagation();
        if (!isPreview) onClick(block.id);
      }}
      style={{
        ...getContainerStyle(s),
        ...getBackgroundStyle(s),
        position: "relative",
      }}
      className={cn(
        "group transition-all duration-200 outline-none",
        !isPreview && isSelected
          ? "ring-2 ring-blue-500 ring-inset z-20 shadow-2xl"
          : "hover:ring-1 hover:ring-slate-300",
        !isPreview && "cursor-pointer",
      )}
    >
      {/* UI DE AÇÕES FLUTUANTE */}
      {!isPreview && isSelected && (
        <div className="absolute inset-0 pointer-events-none z-50">
          <div
            className={cn(
              "absolute flex bg-slate-900 text-white rounded-md shadow-xl items-center h-8 border border-white/20 transition-all pointer-events-auto",
              isFirst ? "top-2 right-2" : "-top-9 right-0",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onMove(block.id, "UP")}
              disabled={isFirst}
              className={cn(
                "px-2 h-full hover:bg-white/20 border-r border-white/10",
                isFirst && "opacity-30",
              )}
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onMove(block.id, "DOWN")}
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
                <DropdownMenuLabel className="text-[10px] uppercase text-slate-400 font-bold">
                  Ações
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => onDuplicate(block.id)}
                  className="cursor-pointer"
                >
                  <Copy className="w-3 h-3 mr-2" /> Duplicar aqui
                </DropdownMenuItem>
                {pages.length > 1 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-[10px] uppercase text-slate-400 font-bold">
                      Copiar para...
                    </DropdownMenuLabel>
                    {pages.map((p) => (
                      <DropdownMenuItem
                        key={p.id}
                        onClick={() => onCopyToPage(block.id, p.id)}
                        className="cursor-pointer text-xs"
                      >
                        <ArrowRightCircle className="w-3 h-3 mr-2 text-slate-400" />{" "}
                        {p.title}
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              onClick={() => onDelete(block.id)}
              className="px-2 h-full hover:bg-red-600 rounded-r-md"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* RENDERIZAÇÃO DO CONTEÚDO */}
      <SharedBlockContent
        block={block}
        styles={s}
        isPreview={!!isPreview}
        renderChild={(colIdx: number) => {
          // USO DA DEFINITION: Segurança para blocos que não aceitam filhos
          if (!definition.supportsChildren || block.type !== "COLUMNS") return null;

          const colKey = `col${colIdx}`;
          const children = block.content.children?.[colKey] || [];

          return (
            <div 
              className={cn(
                "relative flex flex-col gap-2 min-h-[80px] transition-all",
                // RESOLUÇÃO VISUAL: No editor, se o fundo for transparente, 
                // forçamos uma visibilidade para as colunas não sumirem
                !isPreview && "outline-1 outline-dashed outline-slate-200 -outline-offset-1 rounded-lg bg-slate-50/20"
              )}
            >
              {children.map((child: IBlock) => (
                <BlockRenderer
                  key={child.id}
                  block={child}
                  isSelected={selectedBlockId === child.id}
                  selectedBlockId={selectedBlockId}
                  onClick={onClick}
                  isPreview={isPreview}
                  onMove={onMove}
                  onDuplicate={onDuplicate}
                  onDelete={onDelete}
                  pages={pages}
                  onCopyToPage={onCopyToPage}
                  isFirst={false}
                  onAddChild={onAddChild}
                />
              ))}
              
              {!isPreview && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddChild(block.id, colIdx);
                  }}
                  className="mt-auto py-2 flex justify-center text-slate-300 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        }}
      />
    </motion.div>
  );
};