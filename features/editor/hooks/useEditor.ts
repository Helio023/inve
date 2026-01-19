"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { IPage, IBlock, BlockType, DEFAULT_STYLES } from "../types";

const INITIAL_BLOCK_DATA: Record<BlockType, any> = {
  HERO: { title: "Ana & João", subtitle: "02.05.2026", image: "" },
  TEXT: { text: "Escreva aqui os detalhes..." },
  IMAGE: { url: "" },
  VIDEO: { url: "" },
  MAP: { address: "Polana Serena Hotel" },
  COUNTDOWN: { date: new Date().toISOString() },
  RSVP: { title: "Confirme sua Presença" },
  COLUMNS: { cols: 2, children: { col0: [], col1: [], col2: [] } },
};

export function useEditor(initialPages: IPage[] = []) {
  const [pages, setPages] = useState<IPage[]>(
    initialPages && initialPages.length > 0
      ? initialPages
      : [
          {
            id: uuidv4(),
            title: "Capa",
            order: 0,
            blocks: [],
            styles: { backgroundColor: "#ffffff", backgroundOpacity: 0 },
          },
        ]
  );
  const [activePageId, setActivePageId] = useState<string>(pages[0].id);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // --- HELPER PARA CLONAGEM PROFUNDA (Resolve o erro de duplicação) ---
  const cloneBlockWithNewIds = (block: IBlock): IBlock => {
    const newBlock = {
      ...JSON.parse(JSON.stringify(block)), 
      id: uuidv4(), // Novo ID para o bloco principal
    };

    // Se for colunas, gera novos IDs para todos os filhos recursivamente
    if (newBlock.type === "COLUMNS" && newBlock.content.children) {
      Object.keys(newBlock.content.children).forEach((colKey) => {
        newBlock.content.children[colKey] = newBlock.content.children[colKey].map(
          (child: IBlock) => cloneBlockWithNewIds(child)
        );
      });
    }
    return newBlock;
  };

  // --- HELPERS RECURSIVOS PARA BUSCA E UPDATE ---
  const updateRecursive = (
    blocks: IBlock[],
    id: string,
    data: any,
    type: "content" | "styles"
  ): IBlock[] => {
    return blocks.map((block) => {
      if (block.id === id) {
        return { ...block, [type]: { ...block[type], ...data } };
      }
      if (block.type === "COLUMNS" && block.content.children) {
        const newChildren = { ...block.content.children };
        Object.keys(newChildren).forEach((key) => {
          newChildren[key] = updateRecursive(newChildren[key], id, data, type);
        });
        return { ...block, content: { ...block.content, children: newChildren } };
      }
      return block;
    });
  };

  const findBlockRecursive = (blocks: IBlock[], id: string): IBlock | undefined => {
    for (const b of blocks) {
      if (b.id === id) return b;
      if (b.type === "COLUMNS" && b.content.children) {
        for (const col of Object.values(b.content.children)) {
          const found = findBlockRecursive(col as IBlock[], id);
          if (found) return found;
        }
      }
    }
  };

  // --- ACTIONS DE PÁGINA ---

  const addPage = () => {
    const newPage: IPage = {
      id: uuidv4(),
      title: `Pág ${pages.length + 1}`,
      order: pages.length,
      blocks: [],
      styles: { backgroundColor: "#ffffff", backgroundOpacity: 0 },
    };
    setPages([...pages, newPage]);
    setActivePageId(newPage.id);
  };

  const deletePage = (pageId: string) => {
    if (pages.length > 1) {
      const newPages = pages.filter((p) => p.id !== pageId);
      setPages(newPages);
      setActivePageId(newPages[0].id);
    }
  };

  const updatePageTitle = (id: string, newTitle: string) => {
    setPages((prev) => prev.map((p) => (p.id === id ? { ...p, title: newTitle } : p)));
  };

  const updatePageStyles = (id: string, newStyles: any) => {
    setPages((prev) => prev.map((p) => (p.id === id ? { ...p, styles: { ...p.styles, ...newStyles } } : p)));
  };

  const reorderPage = (direction: "LEFT" | "RIGHT") => {
    const index = pages.findIndex((p) => p.id === activePageId);
    if (index === -1) return;
    const newIndex = direction === "LEFT" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= pages.length) return;
    const newPages = [...pages];
    [newPages[index], newPages[newIndex]] = [newPages[newIndex], newPages[index]];
    setPages(newPages);
  };

  // --- ACTIONS DE BLOCO ---

  const addBlock = (type: BlockType, parentId?: string, colIndex?: number) => {
    const newBlock: IBlock = {
      id: uuidv4(),
      type,
      content: INITIAL_BLOCK_DATA[type],
      styles: { ...DEFAULT_STYLES },
    };

    setPages((prev) =>
      prev.map((page) => {
        if (page.id !== activePageId) return page;
        if (!parentId) return { ...page, blocks: [...page.blocks, newBlock] };

        return {
          ...page,
          blocks: page.blocks.map((block) => {
            if (block.id === parentId && block.type === "COLUMNS") {
              const colKey = `col${colIndex}`;
              const currentCols = block.content.children || {};
              return {
                ...block,
                content: {
                  ...block.content,
                  children: { ...currentCols, [colKey]: [...(currentCols[colKey] || []), newBlock] },
                },
              };
            }
            return block;
          }),
        };
      })
    );
    setSelectedBlockId(newBlock.id);
  };

  const moveBlock = (blockId: string, direction: "UP" | "DOWN") => {
    const moveInArray = (arr: IBlock[]): IBlock[] => {
      const idx = arr.findIndex((b) => b.id === blockId);
      if (idx !== -1) {
        const newArr = [...arr];
        const targetIdx = direction === "UP" ? idx - 1 : idx + 1;
        if (targetIdx >= 0 && targetIdx < newArr.length) {
          [newArr[idx], newArr[targetIdx]] = [newArr[targetIdx], newArr[idx]];
        }
        return newArr;
      }
      return arr.map((b) => {
        if (b.type === "COLUMNS" && b.content.children) {
          const newChildren = { ...b.content.children };
          Object.keys(newChildren).forEach((k) => { newChildren[k] = moveInArray(newChildren[k]); });
          return { ...b, content: { ...b.content, children: newChildren } };
        }
        return b;
      });
    };
    setPages((prev) => prev.map((p) => p.id === activePageId ? { ...p, blocks: moveInArray(p.blocks) } : p));
  };

  const updateBlock = (id: string, content: any) => {
    setPages((prev) => prev.map((p) => ({ ...p, blocks: updateRecursive(p.blocks, id, content, "content") })));
  };

  const updateStyles = (id: string, styles: any) => {
    setPages((prev) => prev.map((p) => ({ ...p, blocks: updateRecursive(p.blocks, id, styles, "styles") })));
  };

  const removeBlock = (id: string) => {
    const filterRecursive = (blocks: IBlock[]): IBlock[] => {
      return blocks.filter((b) => b.id !== id).map((b) => {
          if (b.type === "COLUMNS" && b.content.children) {
            const newChildren = { ...b.content.children };
            Object.keys(newChildren).forEach((k) => { newChildren[k] = filterRecursive(newChildren[k]); });
            return { ...b, content: { ...b.content, children: newChildren } };
          }
          return b;
        });
    };
    setPages((prev) => prev.map((p) => ({ ...p, blocks: filterRecursive(p.blocks) })));
    setSelectedBlockId(null);
  };

  const activePage = pages.find((p) => p.id === activePageId) || pages[0];

  const duplicateBlock = (blockId: string) => {
    const target = findBlockRecursive(activePage.blocks, blockId);
    if (!target) return;

    // CORREÇÃO: Usando a nova função que gera IDs únicos recursivamente
    const newBlock = cloneBlockWithNewIds(target);

    const duplicateInArray = (arr: IBlock[]): IBlock[] => {
      const idx = arr.findIndex((b) => b.id === blockId);
      if (idx !== -1) {
        const newArr = [...arr];
        newArr.splice(idx + 1, 0, newBlock);
        return newArr;
      }
      return arr.map((b) => {
        if (b.type === "COLUMNS" && b.content.children) {
          const newChildren = { ...b.content.children };
          Object.keys(newChildren).forEach((k) => { newChildren[k] = duplicateInArray(newChildren[k]); });
          return { ...b, content: { ...b.content, children: newChildren } };
        }
        return b;
      });
    };

    setPages((prev) => prev.map((p) => p.id === activePageId ? { ...p, blocks: duplicateInArray(p.blocks) } : p));
    setSelectedBlockId(newBlock.id);
  };

  return {
    pages,
    activePage,
    activePageId,
    selectedBlockId,
    selectedBlock: findBlockRecursive(activePage.blocks, selectedBlockId || ""),
    setActivePageId,
    addPage,
    deletePage,
    updatePageTitle,
    updatePageStyles,
    reorderPage,
    addBlock,
    updateBlock,
    updateStyles,
    removeBlock,
    moveBlock,
    selectBlock: setSelectedBlockId,
    duplicateBlock,
  };
}