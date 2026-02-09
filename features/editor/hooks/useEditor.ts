"use client";

import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { IPage, IBlock, BlockType, DEFAULT_STYLES } from "../types";

// 1. HELPERS MOVIDOS PARA FORA (Para não serem recriados a cada render)
const INITIAL_BLOCK_DATA: Record<BlockType, any> = {
  HERO: { title: "Ana & João", subtitle: "02.05.2026", image: "" },
  TEXT: { text: "Escreva aqui os detalhes..." },
  IMAGE: { url: "" },
  VIDEO: { url: "" },
  MAP: { address: "Polana Serena Hotel" },
  COUNTDOWN: { date: new Date().toISOString() },
  RSVP: { title: "Confirme sua Presença" },
  COLUMNS: { cols: 2, children: { col0: [], col1: [], col2: [] } },
  MENU: {
    isInteractive: false,
    sections: [
      {
        title: "Entradas",
        items: [{ name: "Prato", description: "...", price: "" }],
      },
    ],
  },
  SCHEDULE: {
    title: "Programa",
    items: [{ time: "09:00", activity: "Início", location: "", speaker: "" }],
  },
  CAROUSEL: {
    images: [],
    autoplay: true,
    interval: 3,
    effect: "slide",
    height: "300px",
  },
};

// Funções puras (sem dependência de state)
const cloneBlockWithNewIds = (block: IBlock): IBlock => {
  const newBlock = { ...JSON.parse(JSON.stringify(block)), id: uuidv4() };
  if (newBlock.type === "COLUMNS" && newBlock.content.children) {
    Object.keys(newBlock.content.children).forEach((colKey) => {
      newBlock.content.children[colKey] = newBlock.content.children[colKey].map(
        (child: IBlock) => cloneBlockWithNewIds(child),
      );
    });
  }
  return newBlock;
};

const updateRecursive = (
  blocks: IBlock[],
  id: string,
  data: any,
  type: "content" | "styles",
): IBlock[] => {
  return blocks.map((block) => {
    if (block.id === id)
      return { ...block, [type]: { ...block[type], ...data } };
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

const findBlockRecursive = (
  blocks: IBlock[],
  id: string,
): IBlock | undefined => {
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

const filterRecursive = (blocks: IBlock[], id: string): IBlock[] => {
  return blocks
    .filter((b) => b.id !== id)
    .map((b) => {
      if (b.type === "COLUMNS" && b.content.children) {
        const newChildren = { ...b.content.children };
        Object.keys(newChildren).forEach((k) => {
          newChildren[k] = filterRecursive(newChildren[k], id);
        });
        return { ...b, content: { ...b.content, children: newChildren } };
      }
      return b;
    });
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
        ],
  );

  const [activePageId, setActivePageId] = useState<string>(pages[0].id);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const activePage = pages.find((p) => p.id === activePageId) || pages[0];

  // 2. USECALLBACK EM TODAS AS ACTIONS (Evita re-renders dos filhos)

  const addPage = useCallback(() => {
    const newPage: IPage = {
      id: uuidv4(),
      title: `Pág ${pages.length + 1}`,
      order: pages.length,
      blocks: [],
      styles: { backgroundColor: "#ffffff", backgroundOpacity: 0 },
    };
    setPages((prev) => [...prev, newPage]);
    setActivePageId(newPage.id);
  }, [pages.length]);

  const deletePage = useCallback(
    (pageId: string) => {
      setPages((prev) => {
        if (prev.length <= 1) return prev;
        const newPages = prev.filter((p) => p.id !== pageId);
        // Se apagou a ativa, ajusta o foco
        if (activePageId === pageId) setActivePageId(newPages[0].id);
        return newPages;
      });
    },
    [activePageId],
  );

  const duplicatePage = useCallback((pageId: string) => {
    setPages((prev) => {
      const pageIndex = prev.findIndex((p) => p.id === pageId);
      if (pageIndex === -1) return prev;
      const originalPage = prev[pageIndex];
      const newPage: IPage = {
        ...JSON.parse(JSON.stringify(originalPage)),
        id: uuidv4(),
        title: `${originalPage.title} (Cópia)`,
        order: pageIndex + 1,
        blocks: originalPage.blocks.map((block) => cloneBlockWithNewIds(block)),
      };
      const newPages = [...prev];
      newPages.splice(pageIndex + 1, 0, newPage);
      setActivePageId(newPage.id);
      return newPages;
    });
  }, []);

  const movePage = useCallback((fromIndex: number, toIndex: number) => {
    setPages((prev) => {
      const newPages = [...prev];
      const [movedPage] = newPages.splice(fromIndex, 1);
      newPages.splice(toIndex, 0, movedPage);
      return newPages;
    });
  }, []);

  const reorderPage = useCallback(
    (direction: "LEFT" | "RIGHT") => {
      setPages((prev) => {
        const index = prev.findIndex((p) => p.id === activePageId);
        if (index === -1) return prev;
        const newIndex = direction === "LEFT" ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= prev.length) return prev;
        const newPages = [...prev];
        [newPages[index], newPages[newIndex]] = [
          newPages[newIndex],
          newPages[index],
        ];
        return newPages;
      });
    },
    [activePageId],
  );

  const updatePageTitle = useCallback((id: string, newTitle: string) => {
    setPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, title: newTitle } : p)),
    );
  }, []);

  const updatePageStyles = useCallback((id: string, newStyles: any) => {
    setPages((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, styles: { ...p.styles, ...newStyles } } : p,
      ),
    );
  }, []);

  // --- ACTIONS DE BLOCO ---

  const addBlock = useCallback(
    (
      type: BlockType,
      parentId?: string,
      colIndex?: number,
      customContent?: any,
      customStyles?: any,
    ) => {
      const finalContent = customContent || INITIAL_BLOCK_DATA[type] || {};

      const finalStyles = customStyles || { ...DEFAULT_STYLES };
      const newBlock: IBlock = {
        id: uuidv4(),
        type,
        content: finalContent,
        styles: finalStyles,
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
                    children: {
                      ...currentCols,
                      [colKey]: [...(currentCols[colKey] || []), newBlock],
                    },
                  },
                };
              }
              return block;
            }),
          };
        }),
      );
      setSelectedBlockId(newBlock.id);
    },
    [activePageId],
  );

  const removeBlock = useCallback(
    (id: string) => {
      // Limpa seleção se for o bloco apagado (evita crash do painel lateral)
      if (selectedBlockId === id) setSelectedBlockId(null);

      setPages((prev) =>
        prev.map((p) => {
          if (p.id !== activePageId) return p;
          return { ...p, blocks: filterRecursive(p.blocks, id) };
        }),
      );
    },
    [activePageId, selectedBlockId],
  );

  const updateBlock = useCallback(
    (id: string, content: any) => {
      setPages((prev) =>
        prev.map((p) =>
          p.id === activePageId
            ? {
                ...p,
                blocks: updateRecursive(p.blocks, id, content, "content"),
              }
            : p,
        ),
      );
    },
    [activePageId],
  );

  const updateStyles = useCallback(
    (id: string, styles: any) => {
      setPages((prev) =>
        prev.map((p) =>
          p.id === activePageId
            ? { ...p, blocks: updateRecursive(p.blocks, id, styles, "styles") }
            : p,
        ),
      );
    },
    [activePageId],
  );

  const duplicateBlock = useCallback(
    (blockId: string) => {
      setPages((prev) =>
        prev.map((page) => {
          if (page.id !== activePageId) return page;

          const target = findBlockRecursive(page.blocks, blockId);
          if (!target) return page;

          const newBlock = cloneBlockWithNewIds(target);

          // Lógica local de inserção
          const insertDuplicate = (arr: IBlock[]): IBlock[] => {
            const idx = arr.findIndex((b) => b.id === blockId);
            if (idx !== -1) {
              const newArr = [...arr];
              newArr.splice(idx + 1, 0, newBlock);
              return newArr;
            }
            return arr.map((b) => {
              if (b.type === "COLUMNS" && b.content.children) {
                const newChildren = { ...b.content.children };
                Object.keys(newChildren).forEach((k) => {
                  newChildren[k] = insertDuplicate(newChildren[k]);
                });
                return {
                  ...b,
                  content: { ...b.content, children: newChildren },
                };
              }
              return b;
            });
          };

          return { ...page, blocks: insertDuplicate(page.blocks) };
        }),
      );
    },
    [activePageId],
  );

  const moveBlock = useCallback(
    (blockId: string, direction: "UP" | "DOWN") => {
      setPages((prev) =>
        prev.map((page) => {
          if (page.id !== activePageId) return page;

          const moveInArray = (arr: IBlock[]): IBlock[] => {
            const idx = arr.findIndex((b) => b.id === blockId);
            if (idx !== -1) {
              const newArr = [...arr];
              const targetIdx = direction === "UP" ? idx - 1 : idx + 1;
              if (targetIdx >= 0 && targetIdx < newArr.length) {
                [newArr[idx], newArr[targetIdx]] = [
                  newArr[targetIdx],
                  newArr[idx],
                ];
              }
              return newArr;
            }
            return arr.map((b) => {
              if (b.type === "COLUMNS" && b.content.children) {
                const newChildren = { ...b.content.children };
                Object.keys(newChildren).forEach((k) => {
                  newChildren[k] = moveInArray(newChildren[k]);
                });
                return {
                  ...b,
                  content: { ...b.content, children: newChildren },
                };
              }
              return b;
            });
          };

          return { ...page, blocks: moveInArray(page.blocks) };
        }),
      );
    },
    [activePageId],
  );

  const copyBlockToPage = useCallback(
    (blockId: string, targetPageId: string) => {
      setPages((prev) => {
        // 1. Encontrar o bloco original
        let blockToCopy: IBlock | undefined;
        // Procura em todas as páginas para garantir
        for (const page of prev) {
          blockToCopy = findBlockRecursive(page.blocks, blockId);
          if (blockToCopy) break;
        }

        if (!blockToCopy) return prev;

        const newBlock = cloneBlockWithNewIds(blockToCopy);

        return prev.map((p) => {
          if (p.id === targetPageId) {
            return { ...p, blocks: [...p.blocks, newBlock] };
          }
          return p;
        });
      });
    },
    [],
  );

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
    duplicatePage,
    copyBlockToPage,
    movePage,
  };
}
