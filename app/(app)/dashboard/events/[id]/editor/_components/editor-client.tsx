"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Hooks
import { useEditor } from "@/features/editor/hooks/useEditor";
import { useAutoSave } from "@/features/editor/hooks/useAutoSave";

// Actions
import { publishEventAction } from "@/features/events/publish.action";
import { unpublishEventAction } from "@/features/events/unpublish.action";
// --- NOVO IMPORT ---
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
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BackgroundMusicPlayer } from "@/components/BackgroundMusicPlayer";

const Toolbox = ({
  onAdd,
  isNested,
}: {
  onAdd: (t: any) => void;
  isNested: boolean;
}) => {
  const tools = [
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
    { type: "SCHEDULE", label: "Programa", icon: CalendarDays, color: "text-blue-500" },
    { type: "CAROUSEL", label: "Galeria", icon: Images, color: "text-purple-500" },
    ...(!isNested
      ? [
          {
            type: "COLUMNS",
            label: "Colunas",
            icon: Columns,
            color: "text-slate-700",
          },
        ]
      : []),
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {tools.map((tool) => (
        <button
          key={tool.type}
          onClick={() => onAdd(tool.type)}
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
};

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

  const editor = useEditor(initialPages);
  const { status, performSave } = useAutoSave(eventId, editor.pages);

  const [settings, setSettings] = useState(
    (!Array.isArray(initialData) ? initialData?.settings : null) || {
      music: { isEnabled: false, url: "", autoPlay: false },
    },
  );

  const [isPreview, setIsPreview] = useState(false);
  const [isToolsOpen, setToolsOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [addingTo, setAddingTo] = useState<{
    parentId: string;
    colIndex: number;
  } | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showNoCredits, setShowNoCredits] = useState(false);
  const [published, setPublished] = useState(currentStatus === "PUBLISHED");

  const activePageIndex = editor.pages.findIndex(
    (p: any) => p.id === editor.activePageId,
  );

  useEffect(() => {
    if (editor.selectedBlockId && window.innerWidth < 768)
      setSettingsOpen(true);
  }, [editor.selectedBlockId]);

  const handleAddBlock = (type: any) => {
    if (addingTo) editor.addBlock(type, addingTo.parentId, addingTo.colIndex);
    else editor.addBlock(type);
    setAddingTo(null);
    setToolsOpen(false);
  };

  const handleUpdateSettings = async (newSettings: any) => {
    setSettings(newSettings);

    const res = await updateEventSettingsAction(eventId, newSettings);
    if (res.error) {
      toast.error("Erro ao salvar configurações");
    } else {
      toast.success("Configurações salvas!");
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col bg-slate-100 overflow-hidden relative font-sans antialiased">
      <EditorHeader
        activePageTitle={editor.activePage.title}
        pageIndex={activePageIndex}
        totalPages={editor.pages.length}
        saveStatus={status}
        onSave={performSave}
        // --- PASSAR AS PROPS NOVAS AQUI ---
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        // ----------------------------------

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
          const res = await unpublishEventAction(eventId);
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
          <aside className="hidden md:flex w-72 bg-white border-r flex-col z-10 shadow-sm overflow-y-auto">
            <div className="p-4 border-b bg-slate-50/50">
              <h3 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                Elementos
              </h3>
            </div>
            <div className="p-4">
              <Toolbox onAdd={handleAddBlock} isNested={false} />
            </div>
          </aside>
        )}

        <EditorCanvas
          {...editor}
          isPreview={isPreview}
          onAddChild={(p: string, c: number) => {
            setAddingTo({ parentId: p, colIndex: c });
            setToolsOpen(true);
          }}
          onMoveBlock={editor.moveBlock}
          onDuplicateBlock={editor.duplicateBlock}
          onDeleteBlock={editor.removeBlock}
        />

        {!isPreview && (
          <aside className="hidden md:flex w-80 bg-white border-l flex-col z-10 shadow-sm overflow-hidden">
            <Tabs defaultValue="block" className="flex flex-col h-full">
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
                  {editor.selectedBlock ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
                      <div className="flex justify-between items-center border-b pb-4">
                        <p className="font-bold text-xs uppercase tracking-tighter">
                          Editar {editor.selectedBlock.type}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            editor.removeBlock(editor.selectedBlockId!)
                          }
                          className="text-red-400 hover:text-red-600 h-8 w-8"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <BlockSettingsManager
                        block={editor.selectedBlock}
                        updateBlock={editor.updateBlock}
                        updateStyles={editor.updateStyles}
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
                    activePage={editor.activePage}
                    onUpdate={(data: any) => {
                      if (data.title)
                        editor.updatePageTitle(editor.activePageId, data.title);
                      if (data.styles)
                        editor.updatePageStyles(
                          editor.activePageId,
                          data.styles,
                        );
                    }}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </aside>
        )}
      </div>

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
                <SheetTitle className="text-lg font-bold">Elementos</SheetTitle>
                <SheetDescription className="text-xs">
                  O que deseja inserir?
                </SheetDescription>
              </SheetHeader>
              <div className="p-6 pb-12">
                <Toolbox onAdd={handleAddBlock} isNested={!!addingTo} />
              </div>
            </SheetContent>
          </Sheet>
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-xl bg-slate-50 mr-2 border-slate-200"
            onClick={() => editor.addPage()}
          >
            <Files className="h-5 w-5 text-slate-600" />
          </Button>
          {editor.selectedBlockId && (
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
                  <Tabs defaultValue="block">
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
                        block={editor.selectedBlock}
                        updateBlock={editor.updateBlock}
                        updateStyles={editor.updateStyles}
                      />
                      <Button
                        variant="destructive"
                        className="w-full mt-8 h-12 rounded-2xl font-bold shadow-md"
                        onClick={() => {
                          editor.removeBlock(editor.selectedBlockId!);
                          setSettingsOpen(false);
                        }}
                      >
                        Remover
                      </Button>
                    </TabsContent>
                    <TabsContent value="page">
                      <PageSettingsPanel
                        activePage={editor.activePage}
                        onUpdate={(data: any) => {
                          if (data.title)
                            editor.updatePageTitle(
                              editor.activePageId,
                              data.title,
                            );
                          if (data.styles)
                            editor.updatePageStyles(
                              editor.activePageId,
                              data.styles,
                            );
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

      {/* Navegação Mobile */}
      {!isPreview && (
        <div className="md:hidden fixed bottom-20 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-white/90 backdrop-blur shadow-2xl border border-slate-100 rounded-full px-3 py-1.5 animate-in slide-in-from-bottom-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            disabled={activePageIndex === 0}
            onClick={() =>
              editor.setActivePageId(editor.pages[activePageIndex - 1].id)
            }
          >
            <ChevronLeft className="w-5 h-5 text-slate-400" />
          </Button>
          <span className="text-[11px] font-bold text-slate-800 min-w-[3.5rem] text-center tabular-nums">
            {activePageIndex + 1} / {editor.pages.length}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            disabled={activePageIndex === editor.pages.length - 1}
            onClick={() =>
              editor.setActivePageId(editor.pages[activePageIndex + 1].id)
            }
          >
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </Button>

          {editor.pages.length > 1 && (
            <>
              <div className="w-px h-4 bg-slate-200 mx-1" />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-red-50 text-red-500"
                onClick={() => editor.deletePage(editor.activePageId)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      )}

      <InsufficientCreditsDialog
        open={showNoCredits}
        onOpenChange={setShowNoCredits}
        requiredType={eventType}
      />

      {settings.music?.isEnabled && settings.music?.url && (
        <BackgroundMusicPlayer
          url={settings.music.url}
          autoPlay={settings.music.autoPlay}
        />
      )}
    </div>
  );
}
