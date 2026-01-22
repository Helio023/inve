"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/image-upload";
import { cn } from "@/lib/utils";

import {
  TypographyControls,
  ColorControls,
  BoxModelControls,
  DecorationControls,
  AnimationControls,
} from "./panels/style-controls";

const LABEL_MAP: Record<string, string> = {
  HERO: "Capa",
  TEXT: "Texto",
  IMAGE: "Imagem",
  VIDEO: "Vídeo",
  MAP: "Mapa",
  COUNTDOWN: "Cronómetro",
  RSVP: "Confirmação",
  COLUMNS: "Colunas",
};

export const BlockSettingsManager = ({
  block,
  updateBlock,
  updateStyles,
}: any) => {
  const [activeLayer, setActiveLayer] = useState<string>("global");

  const handleContentChange = (newContent: any) =>
    updateBlock(block.id, newContent);

  // --- LÓGICA DE ESTILOS (Entrada e Saída) ---

  const handleStyleChange = (newStyles: any) => {
    if (activeLayer === "global") {
      updateStyles(block.id, newStyles);
      return;
    }

    const prefixedStyles: any = {};
    Object.keys(newStyles).forEach((key) => {
      let newKey = key;

      const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
      
      // --- CORREÇÃO 1: Adicionado "borderStyle" à lista ---
      if (
        [
          "backgroundColor",
          "color",
          "borderColor",
          "borderRadius",
          "borderWidth",
          "borderStyle", 
          "shadow",
        ].includes(key)
      ) {
        newKey = `${activeLayer}${capitalizedKey}`;
      }

      if (activeLayer === "btn" && key === "color") newKey = "btnTextColor";
      if (activeLayer === "btn" && key === "borderRadius") newKey = "btnRadius";
      if (activeLayer === "input" && key === "color") newKey = "inputTextColor";

      prefixedStyles[newKey] = newStyles[key];
    });

    updateStyles(block.id, prefixedStyles);
  };

  const getCurrentLayerStyles = () => {
    if (activeLayer === "global") return block.styles || {};

    const s = block.styles || {};
    const layerStyles: any = {};

    if (activeLayer === "item") {
      // Cronómetro
      layerStyles.backgroundColor = s.itemBackgroundColor;
      layerStyles.color = s.itemColor;
      layerStyles.borderRadius = s.itemBorderRadius;
      layerStyles.borderWidth = s.itemBorderWidth;
      layerStyles.borderColor = s.itemBorderColor;
      layerStyles.borderStyle = s.itemBorderStyle; 
      layerStyles.shadow = s.itemShadow;
    }
    if (activeLayer === "btn") {
      // Botão RSVP
      layerStyles.backgroundColor = s.btnBackgroundColor;
      layerStyles.color = s.btnTextColor;
      layerStyles.borderRadius = s.btnRadius;
      layerStyles.shadow = s.btnShadow;
      layerStyles.borderStyle = s.btnBorderStyle; 
      layerStyles.borderWidth = s.btnBorderWidth; 
      layerStyles.borderColor = s.btnBorderColor;
    }
    if (activeLayer === "input") {
      // Inputs RSVP
      layerStyles.backgroundColor = s.inputBackgroundColor;
      layerStyles.color = s.inputTextColor;
      layerStyles.borderColor = s.inputBorderColor;
      layerStyles.borderRadius = s.inputBorderRadius ;
      layerStyles.borderWidth = s.inputBorderWidth; 
      layerStyles.borderStyle = s.inputBorderStyle; 
      layerStyles.shadow = s.inputShadow;
    }

    return layerStyles;
  };

  const currentStyles = getCurrentLayerStyles();
  const blockLabel = LABEL_MAP[block.type] || block.type.toUpperCase();

  const renderLayerSelector = () => {
    if (block.type === "COUNTDOWN") {
      return (
        <div className="flex p-1 bg-slate-100 rounded-lg mb-4 border border-slate-200">
          <button
            onClick={() => setActiveLayer("global")}
            className={cn(
              "flex-1 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all",
              activeLayer === "global"
                ? "bg-white shadow text-blue-600"
                : "text-slate-500 hover:text-slate-700",
            )}
          >
            Container
          </button>
          <button
            onClick={() => setActiveLayer("item")}
            className={cn(
              "flex-1 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all",
              activeLayer === "item"
                ? "bg-white shadow text-blue-600"
                : "text-slate-500 hover:text-slate-700",
            )}
          >
            Números
          </button>
        </div>
      );
    }
    if (block.type === "RSVP") {
      return (
        <div className="flex p-1 bg-slate-100 rounded-lg mb-4 border border-slate-200">
          <button
            onClick={() => setActiveLayer("global")}
            className={cn(
              "flex-1 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all",
              activeLayer === "global"
                ? "bg-white shadow text-blue-600"
                : "text-slate-500",
            )}
          >
            Box
          </button>
          <button
            onClick={() => setActiveLayer("input")}
            className={cn(
              "flex-1 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all",
              activeLayer === "input"
                ? "bg-white shadow text-blue-600"
                : "text-slate-500",
            )}
          >
            Campos
          </button>
          <button
            onClick={() => setActiveLayer("btn")}
            className={cn(
              "flex-1 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all",
              activeLayer === "btn"
                ? "bg-white shadow text-blue-600"
                : "text-slate-500",
            )}
          >
            Botão
          </button>
        </div>
      );
    }
    return null;
  };

  const formatDataForInput = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const tzOffset = date.getTimezoneOffset() * 60000;
      return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
    } catch (e) {
      return "";
    }
  };

  return (
    <Tabs defaultValue="content" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6 h-10 p-1 bg-slate-100 rounded-lg">
        <TabsTrigger
          value="content"
          className="text-[10px] font-bold uppercase tracking-wider"
        >
          Conteúdo
        </TabsTrigger>
        <TabsTrigger
          value="style"
          className="text-[10px] font-bold uppercase tracking-wider"
        >
          Design
        </TabsTrigger>
      </TabsList>

      {/* ABA DE CONTEÚDO */}
      <TabsContent
        value="content"
        className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300"
      >
        <h4 className="font-bold text-slate-700">Editar {blockLabel}</h4>

        {block.type === "HERO" && (
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">Título Principal</Label>
              <Input
                value={block.content?.title || ""}
                onChange={(e) => handleContentChange({ title: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Subtítulo</Label>
              <Input
                value={block.content?.subtitle || ""}
                onChange={(e) =>
                  handleContentChange({ subtitle: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-bold uppercase text-slate-400 mt-2">
                Imagem de Fundo
              </Label>
              <ImageUpload
                value={block.content?.image}
                onChange={(url: string) => handleContentChange({ image: url })}
              />
            </div>
          </div>
        )}

        {block.type === "TEXT" && (
          <div className="space-y-1">
            <Label className="text-xs">Texto do Convite</Label>
            <Textarea
              rows={10}
              value={block.content?.text || ""}
              onChange={(e) => handleContentChange({ text: e.target.value })}
              className="resize-none"
            />
          </div>
        )}

        {block.type === "VIDEO" && (
          <div className="space-y-1">
            <Label className="text-xs">Link do Vídeo (YouTube/Vimeo)</Label>
            <Input
              value={block.content.url || ""}
              onChange={(e) => handleContentChange({ url: e.target.value })}
              placeholder="..."
            />
          </div>
        )}

        {block.type === "MAP" && (
          <div className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs font-bold">Nome do Local</Label>
              <Input
                value={block.content?.address || ""}
                onChange={(e) =>
                  handleContentChange({ address: e.target.value })
                }
                placeholder="Ex: Polana Serena Hotel"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-bold">Link do Google Maps</Label>
              <Input
                value={block.content?.link || ""}
                onChange={(e) => handleContentChange({ link: e.target.value })}
                placeholder="https://maps.app.goo.gl/..."
              />
              <p className="text-[10px] text-slate-400 italic">
                O link permitirá que o convidado abra o GPS.
              </p>
            </div>
          </div>
        )}

        {block.type === "COUNTDOWN" && (
          <div className="space-y-3">
            <Label className="text-xs font-bold">Data Alvo do Evento</Label>
            <Input
              type="datetime-local"
              className="h-10"
              value={formatDataForInput(block.content?.date)}
              onChange={(e) =>
                handleContentChange({
                  date: new Date(e.target.value).toISOString(),
                })
              }
            />
            <div className="p-3 bg-blue-50 text-blue-700 text-[10px] rounded-lg border border-blue-100">
              Escolha a data exata da festa.
            </div>
          </div>
        )}

        {block.type === "RSVP" && (
          <div className="space-y-1">
            <Label className="text-xs font-bold">Título do Bloco</Label>
            <Input
              value={block.content?.title || ""}
              onChange={(e) => handleContentChange({ title: e.target.value })}
            />
          </div>
        )}

        {block.type === "IMAGE" && (
          <div className="space-y-1">
            <Label className="text-xs font-bold">Carregar Foto</Label>
            <ImageUpload
              value={block.content?.url}
              onChange={(url: string) => handleContentChange({ url })}
            />
          </div>
        )}

        {block.type === "COLUMNS" && (
          <div className="space-y-4">
            <Label className="text-xs font-bold">Número de Colunas</Label>
            <div className="flex gap-2">
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  onClick={() => handleContentChange({ cols: n })}
                  className={cn(
                    "flex-1 py-3 border rounded-xl font-bold text-xs transition-all",
                    block.content?.cols === n
                      ? "bg-slate-900 text-white shadow-md"
                      : "bg-white text-slate-500 hover:bg-slate-50",
                  )}
                >
                  {n} {n === 1 ? "Col" : "Cols"}
                </button>
              ))}
            </div>
          </div>
        )}
      </TabsContent>

      {/* ABA DE DESIGN */}
      <TabsContent
        value="style"
        className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300"
      >
        {renderLayerSelector()}

        <ColorControls styles={currentStyles} onUpdate={handleStyleChange} />

        {(["TEXT", "HERO"].includes(block.type) ||
          ["global", "btn"].includes(activeLayer)) && (
          <TypographyControls
            styles={currentStyles}
            onUpdate={handleStyleChange}
          />
        )}

        {activeLayer === "global" && (
          <BoxModelControls
            styles={currentStyles}
            onUpdate={handleStyleChange}
          />
        )}

        <DecorationControls
          styles={currentStyles}
          onUpdate={handleStyleChange}
        />

        {activeLayer === "global" && (
          <AnimationControls
            styles={currentStyles}
            onUpdate={handleStyleChange}
          />
        )}
      </TabsContent>
    </Tabs>
  );
};