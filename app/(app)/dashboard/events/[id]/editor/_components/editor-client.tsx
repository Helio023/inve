"use client";

import { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Hooks de Negócio
import { useEditor } from "@/features/editor/hooks/useEditor";
import { useAutoSave } from "@/features/editor/hooks/useAutoSave";


// Tipos e Definições
import { BlockType, IBlock } from "@/features/editor/types";
import { BLOCK_DEFINITIONS } from "@/features/editor/constants/definitions";
import { BLOCK_PRESETS } from "@/features/editor/block-presets";

// Actions
import { publishEventAction } from "@/features/events/publish.action";
import { unpublishEventAction } from "@/features/events/unpublish.action";
import { updateEventSettingsAction } from "@/features/events/settings.action";
import { InsufficientCreditsDialog } from "./insufficient-credits-dialog";

// UI Components
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Files,
  Settings2,
  Trash2,
  ArrowLeftCircle,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Copy,
  ArrowLeft,
  ArrowRight,
  Layout,
  Image as ImageIcon,
  Calendar,
  MessageSquare,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { EditorHeader } from "@/features/editor/components/shell/editor-header";
import { EditorCanvas } from "@/features/editor/components/shell/editor-canvas";
import { BlockSettingsManager } from "@/features/editor/components/block-settings-manager";
import { PageSettingsPanel } from "@/features/editor/components/panels/page-settings";

// --- CONSTANTES DE ESTILO (AQUI ESTÁ O QUE FALTAVA) ---
const colorMap: Record<string, string> = {
  rose: "text-rose-600 bg-rose-50 border-rose-100 group-hover:bg-rose-100 group-hover:border-rose-200",
  blue: "text-blue-600 bg-blue-50 border-blue-100 group-hover:bg-blue-100 group-hover:border-blue-200",
  emerald:
    "text-emerald-600 bg-emerald-50 border-emerald-100 group-hover:bg-emerald-100 group-hover:border-emerald-200",
  orange:
    "text-orange-600 bg-orange-50 border-orange-100 group-hover:bg-orange-100 group-hover:border-orange-200",
  purple:
    "text-purple-600 bg-purple-50 border-purple-100 group-hover:bg-purple-100 group-hover:border-purple-200",
  indigo:
    "text-indigo-600 bg-indigo-50 border-indigo-100 group-hover:bg-indigo-100 group-hover:border-indigo-200",
  cyan: "text-cyan-600 bg-cyan-50 border-cyan-100 group-hover:bg-cyan-100 group-hover:border-cyan-200",
  amber:
    "text-amber-600 bg-amber-50 border-amber-100 group-hover:bg-amber-100 group-hover:border-amber-200",
  pink: "text-pink-600 bg-pink-50 border-pink-100 group-hover:bg-pink-100 group-hover:border-pink-200",
  slate:
    "text-slate-600 bg-slate-50 border-slate-100 group-hover:bg-slate-100 group-hover:border-slate-200",
  sky: "text-sky-600 bg-sky-50 border-sky-100 group-hover:bg-sky-100 group-hover:border-sky-200",
  violet:
    "text-violet-600 bg-violet-50 border-violet-100 group-hover:bg-violet-100 group-hover:border-violet-200",
  teal: "text-teal-600 bg-teal-50 border-teal-100 group-hover:bg-teal-100 group-hover:border-teal-200",
  yellow:
    "text-yellow-700 bg-yellow-50 border-yellow-100 group-hover:bg-yellow-100 group-hover:border-yellow-200",
  red: "text-red-600 bg-red-50 border-red-100 group-hover:bg-red-100 group-hover:border-red-200",
};

// --- SUB-COMPONENTE: PREVIEW DE BLOCO ---
const BlockPreview = ({ preset }: { preset: any }) => {
  const definition = BLOCK_DEFINITIONS[preset.type as BlockType];
  const s = preset.styles || {};
  return (
    <div className="w-full h-24 rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden group-hover:border-blue-400 transition-all flex flex-col items-center justify-center relative p-3">
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundColor: s.backgroundColor || "#000" }}
      />
      <div className="p-2 bg-slate-50 rounded-full mb-2">
        {definition && <definition.icon className="w-4 h-4 text-slate-400" />}
      </div>
      <span className="text-[9px] font-black uppercase text-slate-500 tracking-tighter">
        {preset.label}
      </span>
    </div>
  );
};

const SmartToolbox = ({
  onAdd,
  isNested,
}: {
  onAdd: (type: BlockType, content?: any, styles?: any) => void;
  isNested: boolean;
}) => {
  const [selectedCategory, setSelectedCategory] = useState<BlockType | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("essencial");

  const categories = [
    { id: "essencial", label: "Básicos", icon: Layout },
    { id: "midia", label: "Mídia", icon: ImageIcon },
    { id: "evento", label: "Evento", icon: Calendar },
    { id: "interativo", label: "Extras", icon: MessageSquare },
  ];

  if (selectedCategory) {
    const variants = BLOCK_PRESETS[selectedCategory] || [];
    return (
      <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-300 relative">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b bg-white sticky top-0 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedCategory(null)}
            className="h-8 w-8 rounded-full hover:bg-slate-100"
          >
            <ArrowLeftCircle className="w-5 h-5 text-slate-400" />
          </Button>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 leading-none">
              Estilos
            </span>
            <span className="text-xs font-bold text-slate-800">
              {BLOCK_DEFINITIONS[selectedCategory]?.label}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
          <div className="grid grid-cols-2 gap-3">
            {variants.map((preset: any) => (
              <button
                key={preset.id}
                onClick={() =>
                  onAdd(preset.type, preset.content, preset.styles)
                }
                className="group outline-none text-left flex flex-col gap-2 transition-all active:scale-95"
              >
                <BlockPreview preset={preset} />
                <div className="px-1 font-bold text-[9px] uppercase tracking-tighter text-slate-500 group-hover:text-blue-600">
                  {preset.label}
                </div>
              </button>
            ))}

            {/* BOTÃO SIMPLES: Integrado no grid, visível e elegante */}
            <button
              onClick={() => onAdd(selectedCategory)}
              className="flex flex-col items-center justify-center h-24 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all active:scale-95 group"
            >
              <Plus className="w-5 h-5 text-slate-300 group-hover:text-blue-500 mb-1" />
              <span className="text-[8px] font-bold uppercase tracking-tight text-slate-400 group-hover:text-blue-600">
                Simples
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full h-full flex flex-col"
    >
      <TabsList className="grid grid-cols-4 mb-6 bg-slate-200/40 p-1 rounded-xl h-12 shrink-0 border border-slate-200/50">
        {categories.map((cat) => (
          <TabsTrigger
            key={cat.id}
            value={cat.id}
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-lg transition-all duration-300",
              "data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm",
              "text-slate-500 hover:text-slate-700",
            )}
          >
            <cat.icon className="w-3.5 h-3.5" />
            <span className="text-[7px] font-bold uppercase tracking-tight leading-none">
              {cat.label}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {categories.map((cat) => (
          <TabsContent
            key={cat.id}
            value={cat.id}
            className="grid grid-cols-2 gap-3 mt-0 focus-visible:ring-0 animate-in fade-in zoom-in-95"
          >
            {Object.entries(BLOCK_DEFINITIONS)
              .filter(([_, def]) => def.category === cat.id)
              .filter(([type]) => !isNested || type !== "COLUMNS")
              .map(([key, def]: [string, any]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key as BlockType)}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-[20px] border transition-all duration-300 active:scale-95 shadow-sm h-24 bg-white group",
                    colorMap[def.color],
                  )}
                >
                  <def.icon className="w-5 h-5 mb-2 transition-transform group-hover:scale-110" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-center leading-tight">
                    {def.label}
                  </span>
                </button>
              ))}
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
};

// --- EDITOR CLIENT ---
export function EditorClient({
  eventId,
  initialData,
  eventType,
  currentStatus,
  eventSlug,
  agencySlug,
}: any) {
  const initialPages = Array.isArray(initialData)
    ? initialData
    : initialData?.designContent || [];

  const {
    pages,
    activePage,
    activePageId,
    selectedBlockId,
    selectedBlock,
    setActivePageId,
    addPage,
    deletePage,
    updatePageTitle,
    updatePageStyles,
    addBlock,
    moveBlock,
    updateBlock,
    updateStyles,
    removeBlock,
    selectBlock,
    duplicateBlock,
    duplicatePage,
    reorderPage,
    copyBlockToPage,
     undo,      
    canUndo, 
  } = useEditor(initialPages);

  const { status: saveStatus, performSave } = useAutoSave(eventId, pages);

  const [settings, setSettings] = useState(
    initialData?.settings || { music: { isEnabled: false } },
  );
  const [isPreview, setIsPreview] = useState(false);
  const [isToolsOpen, setToolsOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("block");
  const [isPublishing, setIsPublishing] = useState(false);
  const [published, setPublished] = useState(currentStatus === "PUBLISHED");
  const [showNoCredits, setShowNoCredits] = useState(false);
  const [addingTo, setAddingTo] = useState<{
    parentId: string;
    colIndex: number;
  } | null>(null);

  const activePageIndex = pages.findIndex((p) => p.id === activePageId);
  const totalPages = pages.length;

  const handleAddBlock = (type: BlockType, content?: any, styles?: any) => {
    if (addingTo) {
      addBlock(type, addingTo.parentId, addingTo.colIndex, content, styles);
    } else {
      addBlock(type, undefined, undefined, content, styles);
    }
    setAddingTo(null);
    setToolsOpen(false);
  };

  const handleUpdateSettings = useCallback(
    async (newSettings: any) => {
      setSettings(newSettings);
      const res = await updateEventSettingsAction(eventId, newSettings);
      if (res.error) toast.error("Erro ao salvar configurações");
    },
    [eventId],
  );

  useEffect(() => {
    if (selectedBlockId) {
      setActiveTab("block");
      if (window.innerWidth < 768) setSettingsOpen(true);
    }
  }, [selectedBlockId]);

  return (
    <div className="h-[100dvh] flex flex-col bg-slate-100 overflow-hidden relative font-sans antialiased">
      <EditorHeader
        activePageTitle={activePage?.title || "Página"}
        pageIndex={activePageIndex}
        totalPages={totalPages}
        saveStatus={saveStatus}
         canUndo={canUndo} 
  onUndo={undo}  
        onSave={performSave}
        onPublish={async () => {
          await performSave();
          setIsPublishing(true);
          const res = await publishEventAction(eventId);
          if (res.error === "INSUFFICIENT_FUNDS") setShowNoCredits(true);
          else if (!res.error) setPublished(true);
          setIsPublishing(false);
        }}
        onUnpublish={async () => {
          setIsPublishing(true);
          await unpublishEventAction(eventId);
          setPublished(false);
          setIsPublishing(false);
        }}
        isPublishing={isPublishing}
        published={published}
        eventId={eventId}
        eventSlug={eventSlug}
        agencySlug={agencySlug}
        isPreview={isPreview}
        setIsPreview={setIsPreview}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      <div className="flex-1 flex overflow-hidden relative">
        {!isPreview && (
          <aside className="hidden md:flex w-72 bg-white border-r flex-col z-10 shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-slate-50/50">
              <h3 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                Biblioteca
              </h3>
            </div>
            <div className="p-4 flex-1 overflow-y-auto no-scrollbar">
              <SmartToolbox onAdd={handleAddBlock} isNested={false} />
            </div>
          </aside>
        )}

        <EditorCanvas
          activePage={activePage}
          selectedBlockId={selectedBlockId}
          selectBlock={selectBlock}
          pages={pages}
          activePageId={activePageId}
          setActivePageId={setActivePageId}
          addPage={addPage}
          deletePage={deletePage}
          isPreview={isPreview}
          onAddChild={(parentId: string, colIndex: number) => {
            setAddingTo({ parentId, colIndex });
            setToolsOpen(true);
          }}
          onMoveBlock={moveBlock}
          onDuplicateBlock={duplicateBlock}
          onDeleteBlock={removeBlock}
          duplicatePage={duplicatePage}
          reorderPage={reorderPage}
          copyBlockToPage={copyBlockToPage}
        />

        {!isPreview && (
          <aside className="hidden md:flex w-80 bg-white border-l flex-col z-10 shadow-sm overflow-hidden">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex flex-col h-full"
            >
              <div className="p-4 border-b bg-slate-50/50">
                <TabsList className="grid grid-cols-2 h-9 w-full">
                  <TabsTrigger
                    value="block"
                    className="text-[10px] uppercase font-bold"
                  >
                    Elemento
                  </TabsTrigger>
                  <TabsTrigger
                    value="page"
                    className="text-[10px] uppercase font-bold"
                  >
                    Página
                  </TabsTrigger>
                </TabsList>
              </div>
              <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
                <TabsContent value="block" className="mt-0">
                  {selectedBlock ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
                      <div className="flex justify-between items-center border-b pb-4">
                        <p className="font-bold text-xs uppercase tracking-tighter">
                          Editar {selectedBlock.type}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeBlock(selectedBlockId!)}
                          className="text-red-400 h-8 w-8 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <BlockSettingsManager
                        block={selectedBlock}
                        updateBlock={updateBlock}
                        updateStyles={updateStyles}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-20 opacity-20">
                      <Settings2 className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-xs font-bold uppercase tracking-widest">
                        Selecione um bloco
                      </p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="page" className="mt-0">
                  <PageSettingsPanel
                    activePage={activePage}
                    onUpdate={(data: any) => {
                      if (data.title) updatePageTitle(activePageId, data.title);
                      if (data.styles)
                        updatePageStyles(activePageId, data.styles);
                    }}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </aside>
        )}
      </div>

      {/* MOBILE UI */}
      {!isPreview && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-3 flex justify-between items-center z-50 safe-area-bottom shadow-2xl">
          <Sheet open={isToolsOpen} onOpenChange={setToolsOpen}>
            <SheetTrigger asChild>
              <Button className="flex-1 mr-3 bg-slate-900 h-12 rounded-xl font-bold shadow-lg">
                <Plus className="mr-2 h-5 w-5" /> Adicionar
              </Button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="rounded-t-[2.5rem] p-0 overflow-hidden bg-slate-50 border-none"
            >
              <SheetHeader className="px-6 py-6 bg-white border-b text-left">
                <SheetTitle className="text-lg font-bold">
                  {addingTo ? "Adicionar na Coluna" : "Biblioteca"}
                </SheetTitle>
              </SheetHeader>
              <div className="p-6 pb-12 overflow-y-auto max-h-[70vh] no-scrollbar">
                <SmartToolbox onAdd={handleAddBlock} isNested={!!addingTo} />
              </div>
            </SheetContent>
          </Sheet>

          {selectedBlockId && (
            <Sheet open={isSettingsOpen} onOpenChange={setSettingsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-xl border-blue-200 bg-blue-50 text-blue-600"
                >
                  <Settings2 className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="rounded-t-[2.5rem] p-0 max-h-[85vh] bg-white border-none focus-visible:ring-0 outline-none"
              >
                {/* SOLUÇÃO DO ERRO: Título invisível para acessibilidade */}
                <SheetHeader className="sr-only">
                  <SheetTitle>Editar Propriedades do Bloco</SheetTitle>
                </SheetHeader>

                <div className="p-6 overflow-y-auto max-h-[80vh] pb-20 no-scrollbar">
                  <BlockSettingsManager
                    block={selectedBlock!}
                    updateBlock={updateBlock}
                    updateStyles={updateStyles}
                  />
                  <Button
                    variant="destructive"
                    className="w-full mt-8 h-12 rounded-2xl font-bold"
                    onClick={() => {
                      removeBlock(selectedBlockId!);
                      setSettingsOpen(false);
                    }}
                  >
                    Remover Elemento
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      )}

      {/* PAGINAÇÃO MOBILE */}
      {!isPreview && (
        <div className="md:hidden fixed bottom-20 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-white/90 backdrop-blur shadow-2xl border border-slate-100 rounded-full px-3 py-1.5 animate-in slide-in-from-bottom-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            disabled={activePageIndex === 0}
            onClick={() => setActivePageId(pages[activePageIndex - 1].id)}
          >
            <ChevronLeft className="w-5 h-5 text-slate-400" />
          </Button>
          <span className="text-[11px] font-bold text-slate-800 min-w-[3rem] text-center tabular-nums">
            {activePageIndex + 1} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            disabled={activePageIndex === totalPages - 1}
            onClick={() => setActivePageId(pages[activePageIndex + 1].id)}
          >
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </Button>

          <div className="w-px h-4 bg-slate-200 mx-1" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-slate-500"
              >
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              side="top"
              className="w-48 mb-2 rounded-xl"
            >
              <DropdownMenuLabel className="text-[10px] uppercase text-slate-400">
                Página Atual
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => duplicatePage(activePageId)}>
                <Copy className="w-3.5 h-3.5 mr-2" /> Duplicar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => reorderPage("LEFT")}
                disabled={activePageIndex === 0}
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Mover p/ Trás
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => reorderPage("RIGHT")}
                disabled={activePageIndex === totalPages - 1}
              >
                <ArrowRight className="w-3.5 h-3.5 mr-2" /> Mover p/ Frente
              </DropdownMenuItem>
              {pages.length > 1 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => deletePage(activePageId)}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-2" /> Apagar
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <InsufficientCreditsDialog
        open={showNoCredits}
        onOpenChange={setShowNoCredits}
        requiredType={eventType}
      />
    </div>
  );
}
