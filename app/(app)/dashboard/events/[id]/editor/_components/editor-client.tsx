"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { useEditor } from "@/features/editor/hooks/useEditor";
import { useAutoSave } from "@/features/editor/hooks/useAutoSave";
import { BLOCK_PRESETS } from "@/features/editor/block-presets";
import { BlockType } from "@/features/editor/types"; // Importação crucial

// Actions
import { publishEventAction } from "@/features/events/publish.action";
import { unpublishEventAction } from "@/features/events/unpublish.action";
import { updateEventSettingsAction } from "@/features/events/settings.action";

// Layout
import { EditorHeader } from "@/features/editor/components/shell/editor-header";
import { EditorCanvas } from "@/features/editor/components/shell/editor-canvas";
import { BlockSettingsManager } from "@/features/editor/components/block-forms";
import { PageSettingsPanel } from "@/features/editor/components/panels/page-settings";
import { InsufficientCreditsDialog } from "./insufficient-credits-dialog";

// UI / Icons
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Files,
  Images,
  Settings2,
  Trash2,
  Heart,
  Type,
  Image as ImageIcon,
  MapPin,
  Clock,
  CheckSquare,
  Columns,
  Video,
  ChevronLeft,
  ChevronRight,
  Utensils,
  CalendarDays,
  MoreHorizontal,
  Copy,
  ArrowLeft,
  ArrowRight,
  ArrowLeftCircle,
  Sparkles,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
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

const BlockPreview = ({ preset }: { preset: any }) => {
  const s = preset.styles;
  const type = preset.type;

  // Container Base da Miniatura
  const baseClass =
    "w-full h-24 rounded-lg overflow-hidden relative border border-slate-100 shadow-sm group-hover:border-blue-300 group-hover:shadow-md transition-all bg-white";

  // 1. HERO PREVIEW
  if (type === "HERO") {
    return (
      <div
        className={baseClass}
        style={{ backgroundColor: s.backgroundColor || "#fff" }}
      >
        {/* Se tiver imagem de fundo (simulada) */}
        {s.backgroundImage && (
          <div
            className="absolute inset-0 opacity-50 bg-center bg-cover"
            style={{
              backgroundImage: s.backgroundImage.includes("url")
                ? s.backgroundImage
                : undefined,
              backgroundColor: s.backgroundColor,
            }}
          />
        )}
        <div
          className={`absolute inset-0 flex flex-col justify-${s.justifyContent === "flex-end" ? "end" : "center"} p-3`}
        >
          <div
            className="w-3/4 h-2 mb-1 rounded-sm"
            style={{
              backgroundColor: s.titleColor || "#000",
              alignSelf: s.textAlign === "center" ? "center" : "flex-start",
              fontFamily: s.titleFontFamily,
            }}
          />
          <div
            className="w-1/2 h-1 rounded-sm opacity-60"
            style={{
              backgroundColor: s.descColor || s.titleColor || "#000",
              alignSelf: s.textAlign === "center" ? "center" : "flex-start",
            }}
          />
        </div>
      </div>
    );
  }

  // 2. IMAGE PREVIEW
  if (type === "IMAGE") {
    return (
      <div className={`${baseClass} flex items-center justify-center p-2`}>
        <div
          className="bg-slate-300"
          style={{
            width: s.borderRadius > 100 ? "50px" : "100%",
            height: s.borderRadius > 100 ? "50px" : "100%",
            borderRadius: s.borderRadius ? `${s.borderRadius}px` : "2px",
            // Simula o Arco
            borderTopLeftRadius: s.borderRadius?.toString().includes("300")
              ? "50px"
              : undefined,
            borderTopRightRadius: s.borderRadius?.toString().includes("300")
              ? "50px"
              : undefined,
          }}
        />
      </div>
    );
  }

  // 3. TEXT PREVIEW
  if (type === "TEXT") {
    return (
      <div className={`${baseClass} flex flex-col justify-center p-3 gap-1.5`}>
        {/* Linhas de texto simuladas */}
        <div
          className="w-full h-1 bg-slate-300 rounded-full"
          style={{
            alignSelf: s.textAlign === "center" ? "center" : "flex-start",
          }}
        />
        <div
          className="w-5/6 h-1 bg-slate-300 rounded-full"
          style={{
            alignSelf: s.textAlign === "center" ? "center" : "flex-start",
          }}
        />
        <div
          className="w-4/6 h-1 bg-slate-300 rounded-full"
          style={{
            alignSelf: s.textAlign === "center" ? "center" : "flex-start",
          }}
        />
        {s.fontStyle === "italic" && (
          <div className="absolute top-1 left-1 text-[8px] text-slate-300">
            Italic
          </div>
        )}
      </div>
    );
  }

  // 4. RSVP PREVIEW
  if (type === "RSVP") {
    const isCard = s.backgroundColor !== "transparent";
    return (
      <div
        className={`${baseClass} flex items-center justify-center bg-slate-50`}
      >
        <div
          className="flex flex-col items-center gap-1 w-3/4 py-2 px-2 border border-slate-200"
          style={{
            backgroundColor: s.backgroundColor || "#fff",
            borderRadius: s.borderRadius ? "6px" : "0px",
            boxShadow:
              s.shadow === "xl" ? "0 2px 5px rgba(0,0,0,0.05)" : "none",
          }}
        >
          <div className="w-1/2 h-1.5 bg-slate-800 rounded-sm mb-1" />
          <div className="w-full h-4 bg-slate-100 rounded-sm border border-slate-200" />
          <div
            className="w-full h-4 bg-slate-800 rounded-sm mt-1"
            style={{ backgroundColor: s.btnBackgroundColor }}
          />
        </div>
      </div>
    );
  }

  // Default Fallback
  return (
    <div className={`${baseClass} flex items-center justify-center`}>
      <span className="text-[9px] text-slate-400 font-bold uppercase">
        {preset.label}
      </span>
    </div>
  );
};

// --- NOVA TOOLBOX INTELIGENTE ---
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

  const tools: { type: BlockType; label: string; icon: any; color: string }[] =
    [
      { type: "HERO", label: "Capa", icon: Heart, color: "text-pink-500" },
      { type: "TEXT", label: "Texto", icon: Type, color: "text-blue-500" },
      {
        type: "IMAGE",
        label: "Imagem",
        icon: ImageIcon,
        color: "text-emerald-500",
      },
      { type: "VIDEO", label: "Vídeo", icon: Video, color: "text-red-500" },
      { type: "MAP", label: "Mapa", icon: MapPin, color: "text-orange-500" },
      {
        type: "COUNTDOWN",
        label: "Tempo",
        icon: Clock,
        color: "text-indigo-500",
      },
      {
        type: "RSVP",
        label: "RSVP",
        icon: CheckSquare,
        color: "text-purple-500",
      },
      { type: "MENU", label: "Menu", icon: Utensils, color: "text-amber-500" },
      {
        type: "SCHEDULE",
        label: "Programa",
        icon: CalendarDays,
        color: "text-blue-500",
      },
      {
        type: "CAROUSEL",
        label: "Galeria",
        icon: Images,
        color: "text-purple-500",
      },
      ...(!isNested
        ? [
            {
              type: "COLUMNS" as BlockType,
              label: "Colunas",
              icon: Columns,
              color: "text-slate-700",
            },
          ]
        : []),
    ];

  // NÍVEL 1: CATEGORIAS
  if (!selectedCategory) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-in slide-in-from-left-4 duration-300">
        {tools.map((tool) => (
          <button
            key={tool.type}
            onClick={() => {
              if (
                BLOCK_PRESETS[tool.type] &&
                BLOCK_PRESETS[tool.type].length > 0
              ) {
                setSelectedCategory(tool.type);
              } else {
                onAdd(tool.type);
              }
            }}
            className="flex flex-col items-center justify-center p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50 transition-all group shadow-sm active:scale-95"
          >
            <tool.icon
              className={cn(
                "w-6 h-6 mb-2 transition-transform group-hover:scale-110",
                tool.color,
              )}
            />
            <span className="text-[10px] font-bold uppercase tracking-tight text-slate-600">
              {tool.label}
            </span>
          </button>
        ))}
      </div>
    );
  }

  // NÍVEL 2: VARIANTES (COM VISUALIZAÇÃO REAL)
  const variants = BLOCK_PRESETS[selectedCategory] || [];
  const categoryInfo = tools.find((t) => t.type === selectedCategory);

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b sticky top-0 bg-white z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSelectedCategory(null)}
          className="h-8 w-8 -ml-2 rounded-full hover:bg-slate-100"
        >
          <ArrowLeftCircle className="w-5 h-5 text-slate-400" />
        </Button>
        <span className="text-xs font-bold uppercase text-slate-600">
          Estilos de {categoryInfo?.label || "Bloco"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 pb-4">
        {variants.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onAdd(preset.type, preset.content, preset.styles)}
            className="text-left group flex flex-col gap-2"
          >
            {/* O NOVO PREVIEW VISUAL */}
            <BlockPreview preset={preset} />

            <div className="px-1">
              <div className="font-bold text-[11px] text-slate-700">
                {preset.label}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Botão Padrão em baixo */}
      <button
        onClick={() => onAdd(selectedCategory)}
        className="w-full py-3 text-center text-[10px] font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg border border-dashed border-slate-200 mt-2"
      >
        Usar Padrão (Sem Estilo)
      </button>
    </div>
  );
};

// --- EDITOR PRINCIPAL ---
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
  } = useEditor(initialPages);

  const { status, performSave } = useAutoSave(eventId, pages);

  const [settings, setSettings] = useState(
    (!Array.isArray(initialData) ? initialData?.settings : null) || {
      music: { isEnabled: false, url: "", autoPlay: false },
    },
  );

  const [isPreview, setIsPreview] = useState(false);
  const [isToolsOpen, setToolsOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  // Tab ativa do painel direito
  const [activeTab, setActiveTab] = useState<string>("block");

  const [addingTo, setAddingTo] = useState<{
    parentId: string;
    colIndex: number;
  } | null>(null);

  const [isPublishing, setIsPublishing] = useState(false);
  const [showNoCredits, setShowNoCredits] = useState(false);
  const [published, setPublished] = useState(currentStatus === "PUBLISHED");

  const activePageIndex = pages.findIndex((p) => p.id === activePageId);

  useEffect(() => {
    if (selectedBlockId) {
      setActiveTab("block");
      if (window.innerWidth < 768) setSettingsOpen(true);
    }
  }, [selectedBlockId]);

  // --- CORREÇÃO DE TIPO DO HANDLE ADD BLOCK ---
  // Agora aceita BlockType em vez de string genérica
  const handleAddBlock = (type: BlockType, content?: any, styles?: any) => {
    if (addingTo) {
      // Se estiver adicionando dentro de colunas
      addBlock(type, addingTo.parentId, addingTo.colIndex, content, styles);
    } else {
      // Se estiver adicionando na raiz
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
      else toast.success("Configurações salvas!");
    },
    [eventId],
  );

  return (
    <div className="h-[100dvh] flex flex-col bg-slate-100 overflow-hidden relative font-sans antialiased">
      <EditorHeader
        activePageTitle={activePage?.title || "Página"}
        pageIndex={activePageIndex}
        totalPages={pages.length}
        saveStatus={status}
        onSave={performSave}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onPublish={async () => {
          await performSave();
          setIsPublishing(true);
          const res = await publishEventAction(eventId);
          if (res.error === "INSUFFICIENT_FUNDS") setShowNoCredits(true);
          else if (res.error) toast.error(res.error);
          else setPublished(true);
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
      />

      <div className="flex-1 flex overflow-hidden relative">
        {!isPreview && (
          <aside className="hidden md:flex w-72 bg-white border-r flex-col z-10 shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-slate-50/50">
              <h3 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                Biblioteca
              </h3>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
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
          onAddChild={(p: string, c: number) => {
            setAddingTo({ parentId: p, colIndex: c });
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
                <TabsList className="grid grid-cols-2 h-9 w-full bg-slate-200/50">
                  <TabsTrigger
                    value="block"
                    className="text-[10px] uppercase font-bold tracking-widest"
                  >
                    Elemento
                  </TabsTrigger>
                  <TabsTrigger
                    value="page"
                    className="text-[10px] uppercase font-bold tracking-widest"
                  >
                    Página
                  </TabsTrigger>
                </TabsList>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <TabsContent value="block" className="mt-0">
                  {selectedBlock ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
                      <div className="flex justify-between items-center border-b pb-4">
                        <p className="font-bold text-xs uppercase tracking-tighter">
                          Editar {selectedBlock.type}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeBlock(selectedBlockId!)}
                          className="text-red-400 hover:text-red-600 h-8 w-8"
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

      {/* Mobile Tools */}
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
              className="rounded-t-[2.5rem] border-t-0 p-0 overflow-hidden bg-slate-50"
            >
              <SheetHeader className="px-6 py-6 bg-white border-b text-left">
                <SheetTitle className="text-lg font-bold">
                  {addingTo ? "Adicionar na Coluna" : "Biblioteca de Elementos"}
                </SheetTitle>
                <SheetDescription className="text-xs">
                  Escolha um estilo para adicionar.
                </SheetDescription>
              </SheetHeader>
              <div className="p-6 pb-12 overflow-y-auto max-h-[70vh]">
                <SmartToolbox onAdd={handleAddBlock} isNested={!!addingTo} />
              </div>
            </SheetContent>
          </Sheet>

          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-xl bg-slate-50 mr-2 border-slate-200"
            onClick={addPage}
          >
            <Files className="h-5 w-5 text-slate-600" />
          </Button>

          {selectedBlockId && (
            <Sheet open={isSettingsOpen} onOpenChange={setSettingsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-xl border-blue-200 bg-blue-50 text-blue-600 animate-in zoom-in"
                >
                  <Settings2 className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="rounded-t-[2.5rem] border-t-0 p-0 max-h-[85vh] bg-white"
              >
                <SheetHeader className="px-6 py-6 border-b text-left">
                  <SheetTitle className="text-lg font-bold">
                    Propriedades
                  </SheetTitle>
                  <SheetDescription className="text-xs">
                    Ajuste o elemento.
                  </SheetDescription>
                </SheetHeader>
                <div className="p-6 overflow-y-auto max-h-[60vh] pb-20">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-2 h-9 w-full mb-6">
                      <TabsTrigger
                        value="block"
                        className="text-[10px] uppercase font-bold"
                      >
                        Bloco
                      </TabsTrigger>
                      <TabsTrigger
                        value="page"
                        className="text-[10px] uppercase font-bold"
                      >
                        Página
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="block">
                      <BlockSettingsManager
                        block={selectedBlock}
                        updateBlock={updateBlock}
                        updateStyles={updateStyles}
                      />
                      <Button
                        variant="destructive"
                        className="w-full mt-8 h-12 rounded-2xl font-bold shadow-md"
                        onClick={() => {
                          removeBlock(selectedBlockId!);
                          setSettingsOpen(false);
                        }}
                      >
                        Remover
                      </Button>
                    </TabsContent>
                    <TabsContent value="page">
                      <PageSettingsPanel
                        activePage={activePage}
                        onUpdate={(data: any) => {
                          if (data.title)
                            updatePageTitle(activePageId, data.title);
                          if (data.styles)
                            updatePageStyles(activePageId, data.styles);
                        }}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      )}

      {/* Navegação Mobile Inferior */}
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
          <span className="text-[11px] font-bold text-slate-800 min-w-[3.5rem] text-center tabular-nums">
            {activePageIndex + 1} / {pages.length}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            disabled={activePageIndex === pages.length - 1}
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
                className="h-8 w-8 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              side="top"
              className="w-48 mb-2"
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
                disabled={activePageIndex === pages.length - 1}
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
