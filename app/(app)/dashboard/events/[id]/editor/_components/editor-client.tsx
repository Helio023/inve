"use client";

import { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Hooks de Negócio
import { useEditor } from "@/features/editor/hooks/useEditor";
import { useAutoSave } from "@/features/editor/hooks/useAutoSave";
// import { useMediaQuery } from "@/hooks/use-media-query";

// Tipos e Definições
import { BlockType } from "@/features/editor/types";
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
  Undo2,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
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
import { useMediaQuery } from "@/features/editor/hooks/use-media-query";

// --- CONSTANTES DE ESTILO ---
const colorMap: Record<string, string> = {
  rose: "text-rose-600 bg-rose-50 border-rose-100 group-hover:bg-rose-100 group-hover:border-rose-200",
  blue: "text-blue-600 bg-blue-50 border-blue-100 group-hover:bg-blue-100 group-hover:border-blue-200",
  emerald: "text-emerald-600 bg-emerald-50 border-emerald-100 group-hover:bg-emerald-100 group-hover:border-emerald-200",
  orange: "text-orange-600 bg-orange-50 border-orange-100 group-hover:bg-orange-100 group-hover:border-orange-200",
  purple: "text-purple-600 bg-purple-50 border-purple-100 group-hover:bg-purple-100 group-hover:border-purple-200",
  indigo: "text-indigo-600 bg-indigo-50 border-indigo-100 group-hover:bg-indigo-100 group-hover:border-indigo-200",
  cyan: "text-cyan-600 bg-cyan-50 border-cyan-100 group-hover:bg-cyan-100 group-hover:border-cyan-200",
  amber: "text-amber-600 bg-amber-50 border-amber-100 group-hover:bg-amber-100 group-hover:border-amber-200",
  pink: "text-pink-600 bg-pink-50 border-pink-100 group-hover:bg-pink-100 group-hover:border-pink-200",
  slate: "text-slate-600 bg-slate-50 border-slate-100 group-hover:bg-slate-100 group-hover:border-slate-200",
  sky: "text-sky-600 bg-sky-50 border-sky-100 group-hover:bg-sky-100 group-hover:border-sky-200",
  violet: "text-violet-600 bg-violet-50 border-violet-100 group-hover:bg-violet-100 group-hover:border-violet-200",
  teal: "text-teal-600 bg-teal-50 border-teal-100 group-hover:bg-teal-100 group-hover:border-teal-200",
  yellow: "text-yellow-700 bg-yellow-50 border-yellow-100 group-hover:bg-yellow-100 group-hover:border-yellow-200",
  red: "text-red-600 bg-red-50 border-red-100 group-hover:bg-red-100 group-hover:border-red-200",
};

// --- SUB-COMPONENTE: PREVIEW DE BLOCO ---
const BlockPreview = ({ preset }: { preset: any }) => {
  const definition = BLOCK_DEFINITIONS[preset.type as BlockType];
  const s = preset.styles || {};
  return (
    <div className="w-full h-24 rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden group-hover:border-blue-400 transition-all flex flex-col items-center justify-center relative p-3">
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundColor: s.backgroundColor || "#000" }} />
      <div className="p-2 bg-slate-50 rounded-full mb-2">
        {definition && <definition.icon className="w-4 h-4 text-slate-400" />}
      </div>
      <span className="text-[9px] font-black uppercase text-slate-500 tracking-tighter">{preset.label}</span>
    </div>
  );
};

// --- SMART TOOLBOX ---
const SmartToolbox = ({ onAdd, isNested }: { onAdd: (type: BlockType, content?: any, styles?: any) => void; isNested: boolean }) => {
  const [selectedCategory, setSelectedCategory] = useState<BlockType | null>(null);
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
          <Button variant="ghost" size="icon" onClick={() => setSelectedCategory(null)} className="h-8 w-8 rounded-full hover:bg-slate-100">
            <ArrowLeftCircle className="w-5 h-5 text-slate-400" />
          </Button>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 leading-none">Estilos</span>
            <span className="text-xs font-bold text-slate-800">{BLOCK_DEFINITIONS[selectedCategory]?.label}</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
          <div className="grid grid-cols-2 gap-3">
            {variants.map((preset: any) => (
              <button key={preset.id} onClick={() => onAdd(preset.type, preset.content, preset.styles)} className="group outline-none text-left flex flex-col gap-2 transition-all active:scale-95">
                <BlockPreview preset={preset} />
                <div className="px-1 font-bold text-[9px] uppercase tracking-tighter text-slate-500 group-hover:text-blue-600 transition-colors">{preset.label}</div>
              </button>
            ))}
            <button onClick={() => onAdd(selectedCategory)} className="flex flex-col items-center justify-center h-24 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all active:scale-95 group">
              <Plus className="w-5 h-5 text-slate-300 group-hover:text-blue-500 mb-1" />
              <span className="text-[8px] font-bold uppercase tracking-tight text-slate-400 group-hover:text-blue-600">Simples</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
      <TabsList className="grid grid-cols-4 mb-6 bg-slate-200/40 p-1 rounded-xl h-12 shrink-0 border border-slate-200/50">
        {categories.map((cat) => (
          <TabsTrigger key={cat.id} value={cat.id} className="flex flex-col items-center justify-center gap-1 rounded-lg transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm text-slate-500 hover:text-slate-700">
            <cat.icon className="w-3.5 h-3.5" />
            <span className="text-[7px] font-bold uppercase tracking-tight leading-none">{cat.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {categories.map((cat) => (
          <TabsContent key={cat.id} value={cat.id} className="grid grid-cols-2 gap-3 mt-0 focus-visible:ring-0 animate-in fade-in zoom-in-95">
            {Object.entries(BLOCK_DEFINITIONS)
              .filter(([_, def]) => def.category === cat.id)
              .filter(([type]) => !isNested || type !== "COLUMNS")
              .map(([key, def]: [string, any]) => (
                <button key={key} onClick={() => setSelectedCategory(key as BlockType)} className={cn("flex flex-col items-center justify-center p-3 rounded-[20px] border transition-all duration-300 active:scale-95 shadow-sm h-24 bg-white group", colorMap[def.color])}>
                  <def.icon className="w-5 h-5 mb-2 transition-transform group-hover:scale-110" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-center leading-tight">{def.label}</span>
                </button>
              ))}
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
};

// --- EDITOR CLIENT ---
export function EditorClient({ eventId, initialData, eventType, currentStatus, eventSlug, agencySlug }: any) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const {
    pages, activePage, activePageId, selectedBlockId, selectedBlock,
    setActivePageId, addPage, deletePage, updatePageTitle, updatePageStyles,
    addBlock, moveBlock, updateBlock, updateStyles, removeBlock, selectBlock,
    duplicateBlock, duplicatePage, reorderPage, copyBlockToPage, undo, canUndo,redo,      
    canRedo
  } = useEditor(initialData?.designContent || []);

  const { status: saveStatus, performSave } = useAutoSave(eventId, pages);

  const [isPreview, setIsPreview] = useState(false);
  const [isToolsOpen, setToolsOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("block");
  const [isPublishing, setIsPublishing] = useState(false);
  const [published, setPublished] = useState(currentStatus === "PUBLISHED");
  const [showNoCredits, setShowNoCredits] = useState(false);
  const [addingTo, setAddingTo] = useState<{ parentId: string; colIndex: number } | null>(null);

  const activePageIndex = pages.findIndex((p) => p.id === activePageId);
  const totalPages = pages.length;

  // Sincroniza abertura automática de painéis no mobile
  useEffect(() => {
    if (selectedBlockId && !isDesktop) {
      setActiveTab("block");
      setSettingsOpen(true);
    }
  }, [selectedBlockId, isDesktop]);

  const handlePublish = async () => {
    await performSave();
    setIsPublishing(true);
    const res = await publishEventAction(eventId);
    if (res?.error === "INSUFFICIENT_FUNDS") setShowNoCredits(true);
    else if (!res?.error) {
      setPublished(true);
      toast.success("Publicado!");
    }
    setIsPublishing(false);
  };

  const handleUnpublish = async () => {
    setIsPublishing(true);
    await unpublishEventAction(eventId);
    setPublished(false);
    toast.info("Evento desativado");
    setIsPublishing(false);
  };

  const handleAddBlock = (type: BlockType, content?: any, styles?: any) => {
    if (addingTo) addBlock(type, addingTo.parentId, addingTo.colIndex, content, styles);
    else addBlock(type, undefined, undefined, content, styles);
    setAddingTo(null);
    setToolsOpen(false);
  };

  if (!isMounted) return null;

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
        onPublish={handlePublish}
        onUnpublish={handleUnpublish}
        isPublishing={isPublishing}
        published={published}
        eventId={eventId}
        eventSlug={eventSlug}
        agencySlug={agencySlug}
        isPreview={isPreview}
        setIsPreview={setIsPreview}
        settings={initialData?.settings}
        onUpdateSettings={async (s) => await updateEventSettingsAction(eventId, s)}
         canRedo={canRedo} 
        onRedo={redo} 
      />

      <div className="flex-1 flex overflow-hidden relative">
        {/* SIDEBAR ESQUERDA (DESKTOP) */}
        {!isPreview && isDesktop && (
          <aside className="w-72 bg-white border-r flex flex-col z-10 shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Biblioteca</h3>
              {canUndo && (
                <Button variant="ghost" size="icon" onClick={undo} className="h-6 w-6">
                  <Undo2 className="w-3.5 h-3.5 text-slate-400" />
                </Button>
              )}
            </div>
            <div className="p-4 flex-1 overflow-y-auto no-scrollbar">
              <SmartToolbox onAdd={handleAddBlock} isNested={false} />
            </div>
          </aside>
        )}

        {/* ÁREA DO CANVAS CENTRAL */}
        <main className="flex-1 relative overflow-hidden bg-slate-100 flex flex-col items-center justify-between">
          <div className="flex-1 w-full flex items-center justify-center p-4 min-h-0">
            <EditorCanvas
              activePage={activePage}
              selectedBlockId={selectedBlockId}
              selectBlock={selectBlock}
              pages={pages}
              activePageId={activePageId}
              setActivePageId={setActivePageId}
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
          </div>

          {/* BARRA DE PÁGINAS (DESKTOP) */}
          {!isPreview && isDesktop && (
            <div className="w-full bg-white border-t p-3 flex items-center justify-center gap-4 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border">
                <Button variant="ghost" size="icon" className="h-8 w-8" disabled={activePageIndex === 0} onClick={() => setActivePageId(pages[activePageIndex - 1].id)}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-1 max-w-[400px] overflow-x-auto no-scrollbar scroll-smooth px-2 py-1">
                  {pages.map((p: any, idx: number) => (
                    <button key={p.id} onClick={() => setActivePageId(p.id)} className={cn("min-w-[32px] h-8 rounded-lg text-[10px] font-black transition-all border flex items-center justify-center shrink-0", p.id === activePageId ? "bg-slate-900 text-white border-slate-900 shadow-md scale-105" : "bg-white text-slate-400 border-slate-100 hover:border-slate-300")}>
                      {idx + 1}
                    </button>
                  ))}
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" disabled={activePageIndex === totalPages - 1} onClick={() => setActivePageId(pages[activePageIndex + 1].id)}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2 border-l pl-4">
                <Button size="sm" variant="outline" className="h-9 gap-2 text-[10px] font-bold border-dashed border-slate-300 hover:border-blue-300 hover:text-blue-600 transition-all" onClick={addPage}>
                  <Plus className="w-3.5 h-3.5" /> NOVA PÁGINA
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400"><MoreHorizontal className="w-4 h-4"/></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl">
                    <DropdownMenuLabel className="text-[10px] uppercase text-slate-400">Página Atual</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => duplicatePage(activePageId)}><Copy className="w-4 h-4 mr-2"/> Duplicar</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => reorderPage("LEFT")} disabled={activePageIndex === 0}><ArrowLeft className="w-4 h-4 mr-2"/> Mover p/ Trás</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => reorderPage("RIGHT")} disabled={activePageIndex === totalPages - 1}><ArrowRight className="w-4 h-4 mr-2"/> Mover p/ Frente</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => deletePage(activePageId)} className="text-red-600" disabled={pages.length === 1}><Trash2 className="w-4 h-4 mr-2"/> Apagar</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}
        </main>

        {/* SIDEBAR DIREITA (DESKTOP) */}
        {!isPreview && isDesktop && (
          <aside className="w-80 bg-white border-l flex flex-col z-10 shadow-sm overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
              <div className="p-4 border-b bg-slate-50/50">
                <TabsList className="grid grid-cols-2 h-9 w-full">
                  <TabsTrigger value="block" className="text-[10px] uppercase font-bold tracking-widest">Elemento</TabsTrigger>
                  <TabsTrigger value="page" className="text-[10px] uppercase font-bold tracking-widest">Página</TabsTrigger>
                </TabsList>
              </div>
              <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
                <TabsContent value="block" className="mt-0 focus-visible:ring-0">
                  {selectedBlock ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
                      <div className="flex justify-between items-center border-b pb-4">
                        <p className="font-bold text-xs uppercase text-slate-800">Editar {selectedBlock.type}</p>
                        <Button variant="ghost" size="icon" onClick={() => removeBlock(selectedBlockId!)} className="text-red-400 h-8 w-8 hover:bg-red-50 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <BlockSettingsManager block={selectedBlock} updateBlock={updateBlock} updateStyles={updateStyles} />
                    </div>
                  ) : (
                    <div className="text-center py-20 opacity-20">
                      <Settings2 className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-xs font-bold uppercase tracking-widest">Selecione um elemento</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="page" className="mt-0 focus-visible:ring-0">
                  <PageSettingsPanel activePage={activePage} onUpdate={(data: any) => {
                    if (data.title) updatePageTitle(activePageId, data.title);
                    if (data.styles) updatePageStyles(activePageId, data.styles);
                  }} />
                </TabsContent>
              </div>
            </Tabs>
          </aside>
        )}
      </div>

      {/* MOBILE UI - BARRA FIXA */}
      {!isPreview && !isDesktop && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 flex items-center gap-2 z-50 pb-[calc(env(safe-area-inset-bottom)+12px)] shadow-2xl">
          <Sheet open={isToolsOpen} onOpenChange={setToolsOpen}>
            <SheetTrigger asChild>
              <Button className="flex-1 bg-slate-900 h-12 rounded-xl font-bold shadow-lg active:scale-95 transition-transform">
                <Plus className="mr-2 h-5 w-5" /> Adicionar
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-[2.5rem] p-0 overflow-hidden bg-slate-50 border-none">
              <SheetHeader className="px-6 py-6 bg-white border-b text-left">
                <SheetTitle className="text-lg font-bold">{addingTo ? "Adicionar na Coluna" : "Biblioteca"}</SheetTitle>
                <SheetDescription className="sr-only">Selecione um elemento para adicionar ao convite.</SheetDescription>
              </SheetHeader>
              <div className="p-6 pb-20 overflow-y-auto max-h-[70dvh] no-scrollbar">
                <SmartToolbox onAdd={handleAddBlock} isNested={!!addingTo} />
              </div>
            </SheetContent>
          </Sheet>

          <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl bg-slate-50 border-slate-200" onClick={() => { selectBlock(null); setActiveTab("page"); setSettingsOpen(true); }}>
            <Files className="h-5 w-5 text-slate-600" />
          </Button>

          {selectedBlockId && (
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-blue-200 bg-blue-50 text-blue-600" onClick={() => setSettingsOpen(true)}>
              <Settings2 className="h-6 w-6" />
            </Button>
          )}

          {/* SHEET DE CONFIGURAÇÕES MOBILE */}
          <Sheet open={isSettingsOpen} onOpenChange={setSettingsOpen}>
            <SheetContent side="bottom" className="rounded-t-[2.5rem] p-0 max-h-[85dvh] bg-white border-none outline-none">
              <SheetHeader className="sr-only"><SheetTitle>Ajustes</SheetTitle><SheetDescription>Ajustes contextuais</SheetDescription></SheetHeader>
              <div className="p-6 overflow-y-auto max-h-[80dvh] pb-32 no-scrollbar">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-2 mb-6 h-10 bg-slate-100 p-1 rounded-lg">
                    <TabsTrigger value="block" disabled={!selectedBlockId} className="text-[10px] font-bold">ELEMENTO</TabsTrigger>
                    <TabsTrigger value="page" className="text-[10px] font-bold">PÁGINA</TabsTrigger>
                  </TabsList>
                  <TabsContent value="block">
                    {selectedBlock && <BlockSettingsManager block={selectedBlock} updateBlock={updateBlock} updateStyles={updateStyles} />}
                    <Button variant="destructive" className="w-full mt-8 h-12 rounded-2xl font-bold" onClick={() => { removeBlock(selectedBlockId!); setSettingsOpen(false); }}>Remover Elemento</Button>
                  </TabsContent>
                  <TabsContent value="page">
                    <PageSettingsPanel activePage={activePage} onUpdate={(data: any) => {
                      if (data.title) updatePageTitle(activePageId, data.title);
                      if (data.styles) updatePageStyles(activePageId, data.styles);
                    }} />
                  </TabsContent>
                </Tabs>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}

      {/* PAGINAÇÃO MOBILE FLUTUANTE */}
      {!isPreview && !isDesktop && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-white/95 backdrop-blur-md shadow-2xl border border-slate-200 rounded-full px-3 py-1.5 animate-in slide-in-from-bottom-4">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" disabled={activePageIndex === 0} onClick={() => setActivePageId(pages[activePageIndex - 1].id)}>
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </Button>

          <div className="flex items-center gap-1.5 max-w-[120px] overflow-x-auto no-scrollbar scroll-smooth px-1">
            {pages.map((p: any, idx: number) => (
              <button key={p.id} onClick={() => setActivePageId(p.id)} className={cn("min-w-[28px] h-7 rounded-lg text-[10px] font-black transition-all flex items-center justify-center shrink-0 border", p.id === activePageId ? "bg-slate-900 text-white border-slate-900 shadow-lg" : "bg-white text-slate-400 border-slate-100")}>
                {idx + 1}
              </button>
            ))}
            <button onClick={addPage} className="min-w-[28px] h-7 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0"><Plus className="w-3.5 h-3.5"/></button>
          </div>

          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" disabled={activePageIndex === totalPages - 1} onClick={() => setActivePageId(pages[activePageIndex + 1].id)}>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Button>

          <div className="w-px h-4 bg-slate-200 mx-1" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-slate-500"><MoreHorizontal className="w-5 h-5"/></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side="top" className="w-48 mb-2 rounded-xl shadow-2xl border-none">
              <DropdownMenuLabel className="text-[10px] uppercase text-slate-400">Gerenciar</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => duplicatePage(activePageId)}><Copy className="w-3.5 h-3.5 mr-2" /> Duplicar Página</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => deletePage(activePageId)} className="text-red-600 focus:bg-red-50" disabled={pages.length === 1}><Trash2 className="w-3.5 h-3.5 mr-2" /> Apagar Página</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <InsufficientCreditsDialog open={showNoCredits} onOpenChange={setShowNoCredits} requiredType={eventType} />
    </div>
  );
}