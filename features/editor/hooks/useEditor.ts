"use client";

import { useState, useCallback, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { IPage, IBlock, BlockType, DEFAULT_STYLES } from "../types";
import { toast } from "sonner";

const MAX_HISTORY = 6; 

const INITIAL_BLOCK_DATA: Record<BlockType, any> = {
  HERO: { title: "Ana & João", subtitle: "02.05.2026", image: "" },
  TEXT: { text: "Escreva aqui os detalhes..." },
  IMAGE: { url: "", alt: "" },
  VIDEO: { url: "" },
  MAP: {
    venueName: "Local",
    address: "Morada aqui",
    link: "",
    buttonText: "Abrir GPS",
  },
  COUNTDOWN: { date: new Date().toISOString(), label: "Faltam apenas" },
  RSVP: {
    title: "Confirme sua Presença",
    description: "Sua presença é importante",
    buttonText: "Confirmar",
  },
  COLUMNS: { cols: 2, children: { col0: [], col1: [] } },
  MENU: {
    isInteractive: false,
    sections: [
      { title: "Entradas", items: [{ name: "Prato", description: "" }] },
    ],
  },
  SCHEDULE: {
    title: "Cronograma do Evento",
    items: [{ time: "09:00", title: "Início", description: "Recepção" }],
  },
  CAROUSEL: { images: [], autoplay: true, interval: 3, effect: "slide" },
  BUTTON: { text: "Clique Aqui", url: "https://qonvip.com" },
  SONG_REQUEST: {
    title: "Sugira uma música",
    placeholder: "Nome da música...",
    buttonText: "Pedir",
  },
  ICON: { name: "Heart", size: 32, repeat: 1 },
  DIVIDER: { align: "center", width: "50%" },
  SAVE_THE_DATE: {
    title: "Nosso Casamento",
    date: "2026-05-20",
    dateDisplay: "20 de Maio",
    buttonText: "Salvar Data",
  },
  DRESS_CODE: { title: "Dress Code", description: "Traje Formal", image: "" },
  FAQ: { items: [{ q: "Pergunta?", a: "Resposta." }] },
};



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

// --- HOOK PRINCIPAL ---

export function useEditor(initialData: IPage[] = []) {
  const [pages, _setPages] = useState<IPage[]>(
    initialData.length > 0
      ? initialData
      : [
          {
            id: uuidv4(),
            title: "Capa",
            order: 0,
            blocks: [],
            styles: { backgroundColor: "#ffffff" },
          },
        ],
  );

  const [history, setHistory] = useState<IPage[][]>([
    initialData.length > 0 ? initialData : pages,
  ]);
  const [pointer, setPointer] = useState(0);
  const [activePageId, setActivePageId] = useState<string>(pages[0]?.id);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // Wrapper seguro para setPages com gestão de histórico
  const setPages = useCallback(
    (newPagesOrFn: IPage[] | ((prev: IPage[]) => IPage[])) => {
      _setPages((current) => {
        const next =
          typeof newPagesOrFn === "function"
            ? newPagesOrFn(current)
            : newPagesOrFn;

        // Evita gravar duplicados no histórico (cliques sem alteração)
        if (JSON.stringify(current) === JSON.stringify(next)) return current;

        setHistory((prev) => {
          const newHistory = prev.slice(0, pointer + 1);
          const updatedHistory = [...newHistory, next];
          if (updatedHistory.length > MAX_HISTORY) updatedHistory.shift();
          setPointer(updatedHistory.length - 1);
          return updatedHistory;
        });
        return next;
      });
    },
    [pointer],
  );

  const undo = useCallback(() => {
    if (pointer > 0) {
      const prevIndex = pointer - 1;
      const prevPages = history[prevIndex];
      _setPages(prevPages);
      setPointer(prevIndex);
      return true;
    }
    return false;
  }, [history, pointer]);

  // Atalho Ctrl+Z
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        if (undo()) toast.info("Ação desfeita", { duration: 1000 });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo]);

  // --- HANDLERS DE PÁGINA ---

  const addPage = useCallback(() => {
    const newPage: IPage = {
      id: uuidv4(),
      title: `Pág ${pages.length + 1}`,
      order: pages.length,
      blocks: [],
      styles: { backgroundColor: "#ffffff" },
    };
    setPages((prev) => [...prev, newPage]);
    setActivePageId(newPage.id);
  }, [pages.length, setPages]);

  const deletePage = useCallback(
    (id: string) => {
      setPages((prev) => {
        if (prev.length <= 1) return prev;
        const filtered = prev.filter((p) => p.id !== id);
        if (activePageId === id) setActivePageId(filtered[0].id);
        return filtered;
      });
    },
    [activePageId, setPages],
  );

  const duplicatePage = useCallback(
    (id: string) => {
      setPages((prev) => {
        const idx = prev.findIndex((p) => p.id === id);
        const original = prev[idx];
        const copy = {
          ...JSON.parse(JSON.stringify(original)),
          id: uuidv4(),
          title: `${original.title} (Cópia)`,
          blocks: original.blocks.map((b) => cloneBlockWithNewIds(b)),
        };
        const res = [...prev];
        res.splice(idx + 1, 0, copy);
        setActivePageId(copy.id);
        return res;
      });
    },
    [setPages],
  );

  const movePage = useCallback(
    (from: number, to: number) => {
      setPages((prev) => {
        const res = [...prev];
        const [moved] = res.splice(from, 1);
        res.splice(to, 0, moved);
        return res;
      });
    },
    [setPages],
  );

  const reorderPage = useCallback(
    (dir: "LEFT" | "RIGHT") => {
      setPages((prev) => {
        const idx = prev.findIndex((p) => p.id === activePageId);
        const newIdx = dir === "LEFT" ? idx - 1 : idx + 1;
        if (newIdx < 0 || newIdx >= prev.length) return prev;
        const res = [...prev];
        [res[idx], res[newIdx]] = [res[newIdx], res[idx]];
        return res;
      });
    },
    [activePageId, setPages],
  );

  // --- HANDLERS DE BLOCO ---

  const addBlock = useCallback(
    (
      type: BlockType,
      pId?: string,
      cIdx?: number,
      content?: any,
      styles?: any,
    ) => {
      const b: IBlock = {
        id: uuidv4(),
        type,
        content: content || INITIAL_BLOCK_DATA[type],
        styles: styles || { ...DEFAULT_STYLES },
      };
      setPages((prev) =>
        prev.map((p) => {
          if (p.id !== activePageId) return p;
          if (!pId) return { ...p, blocks: [...p.blocks, b] };
          return {
            ...p,
            blocks: p.blocks.map((bl) => {
              if (bl.id === pId && bl.type === "COLUMNS") {
                const k = `col${cIdx}`;
                const children = bl.content.children || {};
                return {
                  ...bl,
                  content: {
                    ...bl.content,
                    children: { ...children, [k]: [...(children[k] || []), b] },
                  },
                };
              }
              return bl;
            }),
          };
        }),
      );
      setSelectedBlockId(b.id);
    },
    [activePageId, setPages],
  );

  const updateBlock = useCallback(
    (id: string, content: any) =>
      setPages((prev) =>
        prev.map((p) => ({
          ...p,
          blocks: updateRecursive(p.blocks, id, content, "content"),
        })),
      ),
    [setPages],
  );

  const updateStyles = useCallback(
    (id: string, styles: any) =>
      setPages((prev) =>
        prev.map((p) => ({
          ...p,
          blocks: updateRecursive(p.blocks, id, styles, "styles"),
        })),
      ),
    [setPages],
  );

  const removeBlock = useCallback(
    (id: string) => {
      if (selectedBlockId === id) setSelectedBlockId(null);
      setPages((prev) =>
        prev.map((p) => ({ ...p, blocks: filterRecursive(p.blocks, id) })),
      );
    },
    [selectedBlockId, setPages],
  );

  const moveBlock = useCallback(
    (id: string, dir: "UP" | "DOWN") => {
      const move = (arr: IBlock[]): IBlock[] => {
        const idx = arr.findIndex((b) => b.id === id);
        if (idx !== -1) {
          const res = [...arr];
          const target = dir === "UP" ? idx - 1 : idx + 1;
          if (target >= 0 && target < res.length)
            [res[idx], res[target]] = [res[target], res[idx]];
          return res;
        }
        return arr.map((b) =>
          b.type === "COLUMNS"
            ? {
                ...b,
                content: {
                  ...b.content,
                  children: Object.fromEntries(
                    Object.entries(b.content.children).map(([k, v]) => [
                      k,
                      move(v as IBlock[]),
                    ]),
                  ),
                },
              }
            : b,
        );
      };
      setPages((prev) => prev.map((p) => ({ ...p, blocks: move(p.blocks) })));
    },
    [setPages],
  );

  const duplicateBlock = useCallback(
    (id: string) => {
      const dup = (arr: IBlock[]): IBlock[] => {
        const idx = arr.findIndex((b) => b.id === id);
        if (idx !== -1) {
          const res = [...arr];
          res.splice(idx + 1, 0, cloneBlockWithNewIds(arr[idx]));
          return res;
        }
        return arr.map((b) =>
          b.type === "COLUMNS"
            ? {
                ...b,
                content: {
                  ...b.content,
                  children: Object.fromEntries(
                    Object.entries(b.content.children).map(([k, v]) => [
                      k,
                      dup(v as IBlock[]),
                    ]),
                  ),
                },
              }
            : b,
        );
      };
      setPages((prev) => prev.map((p) => ({ ...p, blocks: dup(p.blocks) })));
    },
    [setPages],
  );

  const copyBlockToPage = useCallback(
    (id: string, tId: string) => {
      setPages((prev) => {
        let blockToCopy: IBlock | undefined;
        for (const p of prev) {
          blockToCopy = findBlockRecursive(p.blocks, id);
          if (blockToCopy) break;
        }
        if (!blockToCopy) return prev;
        return prev.map((p) =>
          p.id === tId
            ? {
                ...p,
                blocks: [...p.blocks, cloneBlockWithNewIds(blockToCopy!)],
              }
            : p,
        );
      });
    },
    [setPages],
  );

  return {
    // Estados
    pages,
    activePage: pages.find((p) => p.id === activePageId) || pages[0],
    activePageId,
    selectedBlockId,
    selectedBlock: findBlockRecursive(
      pages.find((p) => p.id === activePageId)?.blocks || [],
      selectedBlockId || "",
    ),

    // Histórico
    canUndo: pointer > 0,
    undo,

    // Ações de Página
    setActivePageId,
    addPage,
    deletePage,
    duplicatePage,
    movePage,
    updatePageTitle: (id: string, title: string) =>
      setPages((prev) => prev.map((p) => (p.id === id ? { ...p, title } : p))),
    updatePageStyles: (id: string, styles: any) =>
      setPages((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, styles: { ...p.styles, ...styles } } : p,
        ),
      ),
    reorderPage,

    // Ações de Bloco
    addBlock,
    updateBlock,
    updateStyles,
    removeBlock,
    moveBlock,
    duplicateBlock,
    copyBlockToPage,
    selectBlock: setSelectedBlockId,
  };
}
