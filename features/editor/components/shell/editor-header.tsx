"use client";

import { memo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Save,
  Loader2,
  CheckCircle,
  Cloud,
  AlertCircle,
  Globe,
  Eye,
  EyeOff,
  ChevronDown,
  ExternalLink,
  Undo2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GlobalSettingsDialog } from "../panels/global-settings-dialog";

interface EditorHeaderProps {
  activePageTitle: string;
  pageIndex: number;
  totalPages: number;
  saveStatus: "saved" | "saving" | "unsaved" | "error";
  onSave: () => void;
  onPublish: () => void;
  onUnpublish: () => void;
  isPublishing: boolean;
  published: boolean;
  eventId: string;
  eventSlug: string;
  agencySlug: string;
  isPreview: boolean;
  setIsPreview: (v: boolean) => void;
  settings?: any;
  onUpdateSettings?: (newSettings: any) => void;
  // NOVAS PROPS PARA UNDO
  canUndo?: boolean;
  onUndo?: () => void;
}

const EditorHeaderComponent = ({
  activePageTitle,
  pageIndex,
  totalPages,
  saveStatus,
  onSave,
  onPublish,
  onUnpublish,
  isPublishing,
  published,
  eventId,
  eventSlug,
  agencySlug,
  isPreview,
  setIsPreview,
  settings,
  onUpdateSettings,
  canUndo,
  onUndo,
}: EditorHeaderProps) => {
  const publicUrl = `/sites/${agencySlug}/${eventSlug}`;

  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-3 md:px-4 shrink-0 z-50 relative shadow-sm">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 hover:bg-slate-100 rounded-full"
          asChild
          title="Voltar"
        >
          <Link href={`/dashboard/events`}>
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </Link>
        </Button>

        <div className="flex flex-col border-l pl-3 border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black text-slate-900 uppercase tracking-tighter max-w-[100px] md:max-w-[200px] truncate">
              {activePageTitle}
            </span>
            <div className="flex items-center">
              {saveStatus === "saving" && (
                <span className="text-[9px] font-bold text-blue-600 flex items-center bg-blue-50 px-1.5 py-0.5 rounded">
                  <Loader2 className="w-2.5 h-2.5 mr-1 animate-spin" /> SALVANDO
                </span>
              )}
              {saveStatus === "saved" && (
                <span className="text-[9px] font-bold text-emerald-600 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded">
                  <CheckCircle className="w-2.5 h-2.5 mr-1" /> SALVO
                </span>
              )}
              {saveStatus === "unsaved" && (
                <span className="text-[9px] font-bold text-amber-600 flex items-center bg-amber-50 px-1.5 py-0.5 rounded">
                  <Cloud className="w-2.5 h-2.5 mr-1" /> PENDENTE
                </span>
              )}
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            Slide {pageIndex + 1} de {totalPages}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* BOTÃO DESFAZER (UNDO) */}
        {!isPreview && (
          <Button
            variant="ghost"
            size="icon"
            disabled={!canUndo}
            onClick={onUndo}
            className="h-9 w-9 text-slate-500 hover:text-blue-600 disabled:opacity-30"
            title="Desfazer (Ctrl+Z)"
          >
            <Undo2 className="w-5 h-5" />
          </Button>
        )}

        {!isPreview && onUpdateSettings && (
          <GlobalSettingsDialog
            settings={settings}
            onUpdate={onUpdateSettings}
          />
        )}

        <div className="w-px h-6 bg-slate-200 mx-1 hidden md:block" />

        {!isPreview && (
          <Button
            size="sm"
            variant="ghost"
            className="hidden lg:flex text-slate-500 font-bold hover:bg-slate-50"
            onClick={onSave}
            disabled={saveStatus === "saving"}
          >
            <Save className="w-4 h-4 mr-2" /> Salvar
          </Button>
        )}

    

        <div className="w-px h-6 bg-slate-200 mx-1 hidden md:block" />

        {published ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                className="h-9 px-4 bg-emerald-500 text-white font-bold rounded-lg shadow-sm border-b-2 border-emerald-700 active:border-b-0 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />{" "}
                <span className="hidden sm:inline text-[11px] uppercase">
                  No Ar
                </span>{" "}
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 p-1 rounded-xl shadow-xl"
            >
              <DropdownMenuItem
                className="cursor-pointer flex items-center gap-2 py-2"
                onClick={() => window.open(publicUrl, "_blank")}
              >
                <ExternalLink className="w-4 h-4 text-blue-500" />{" "}
                <span className="font-semibold text-xs">Abrir</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onUnpublish}
                className="cursor-pointer flex items-center gap-2 py-2 text-red-600"
              >
                <EyeOff className="w-4 h-4" />{" "}
                <span className="font-semibold text-xs">Tirar do Ar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md h-9 px-4 border-b-2 border-blue-800"
            onClick={onPublish}
            disabled={isPublishing || saveStatus === "saving"}
          >
            {isPublishing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Globe className="w-4 h-4 sm:mr-2" />
            )}
            <span className="hidden sm:inline uppercase text-[11px] font-black">
              Publicar
            </span>
          </Button>
        )}
      </div>
    </header>
  );
};

export const EditorHeader = memo(EditorHeaderComponent);
