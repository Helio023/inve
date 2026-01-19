"use client";

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
} from "./panels/style-controls";

export const BlockSettingsManager = ({
  block,
  updateBlock,
  updateStyles,
}: any) => {
  const handleContentChange = (newContent: any) =>
    updateBlock(block.id, newContent);
  const handleStyleChange = (newStyles: any) =>
    updateStyles(block.id, newStyles);

  // Helper para formatar a data do banco para o padrão do input (YYYY-MM-DDThh:mm)
  const formatDataForInput = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      // Ajuste de fuso horário para o input não mudar a data sozinho
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

      <TabsContent
        value="content"
        className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300"
      >
        {/* --- CAPA (HERO) --- */}
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

        {/* --- TEXTO --- */}
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

        {/* --- MAPA (CORRIGIDO) --- */}
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

        {/* --- CRONÓMETRO (CORRIGIDO) --- */}
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
              Escolha a data exata da festa. O cronómetro fará a contagem
              regressiva automaticamente.
            </div>
          </div>
        )}

        {/* --- RSVP --- */}
        {block.type === "RSVP" && (
          <div className="space-y-1">
            <Label className="text-xs font-bold">
              Título do Bloco de Confirmação
            </Label>
            <Input
              value={block.content?.title || ""}
              onChange={(e) => handleContentChange({ title: e.target.value })}
            />
          </div>
        )}

        {/* --- IMAGE --- */}
        {block.type === "IMAGE" && (
          <div className="space-y-1">
            <Label className="text-xs font-bold">Carregar Foto</Label>
            <ImageUpload
              value={block.content?.url}
              onChange={(url: string) => handleContentChange({ url })}
            />
          </div>
        )}

        {/* --- COLUNAS --- */}
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
                      : "bg-white text-slate-500 hover:bg-slate-50"
                  )}
                >
                  {n} {n === 1 ? "Col" : "Cols"}
                </button>
              ))}
            </div>
          </div>
        )}
      </TabsContent>

      {/* --- ABA DESIGN (DESIGN UNIVERSAL) --- */}
      <TabsContent
        value="style"
        className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300"
      >
        <ColorControls
          styles={block.styles || {}}
          onUpdate={handleStyleChange}
        />
        <TypographyControls
          styles={block.styles || {}}
          onUpdate={handleStyleChange}
        />
        <BoxModelControls
          styles={block.styles || {}}
          onUpdate={handleStyleChange}
        />
        <DecorationControls
          styles={block.styles || {}}
          onUpdate={handleStyleChange}
        />
      </TabsContent>
    </Tabs>
  );
};
