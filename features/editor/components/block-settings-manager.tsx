"use client";

import React, { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { BLOCK_DEFINITIONS } from "../constants/definitions";
import { IBlock, BlockType, DEFAULT_STYLES } from "../types";
import { cn } from "@/lib/utils";
import { ImageUpload } from "@/components/image-upload";

import {
  TypographyControls,
  ColorControls,
  BoxModelControls,
  DecorationControls,
  AnimationControls,
  SizeControls,
} from "./panels/style-controls";

interface SettingsProps {
  block: IBlock;
  updateBlock: (id: string, content: any) => void;
  updateStyles: (id: string, styles: any) => void;
}

export const BlockSettingsManager = ({
  block,
  updateBlock,
  updateStyles,
}: SettingsProps) => {
  const [activeLayerId, setActiveLayerId] = useState("container");
  const definition = BLOCK_DEFINITIONS[block.type as BlockType];

  if (!definition) return null;

  const currentStyles = useMemo(() => {
    const allStyles = block.styles || {};

    if (activeLayerId === "container") {
      return { ...DEFAULT_STYLES, ...allStyles };
    }

    const prefix = activeLayerId;
    const layerStyles: any = {};

    Object.keys(DEFAULT_STYLES).forEach((prop) => {
      const capitalizedProp = prop.charAt(0).toUpperCase() + prop.slice(1);
      const specificKey = `${prefix}${capitalizedProp}`;

      // Prioridade: Específico da Camada -> Global do Bloco -> Padrão do Sistema
      const value =
        allStyles[specificKey] !== undefined
          ? allStyles[specificKey]
          : allStyles[prop] !== undefined
            ? allStyles[prop]
            : (DEFAULT_STYLES as any)[prop];

      layerStyles[prop] = value;
    });

    return layerStyles;
  }, [block.styles, activeLayerId]);

  const handleStyleUpdate = (newStyles: any) => {
    if (activeLayerId === "container") {
      updateStyles(block.id, newStyles);
    } else {
      const prefixed: any = {};
      Object.keys(newStyles).forEach((key) => {
        const capitalized = key.charAt(0).toUpperCase() + key.slice(1);
        prefixed[`${activeLayerId}${capitalized}`] = newStyles[key];
      });
      updateStyles(block.id, prefixed);
    }
  };

  const handleContentChange = (data: any) => {
    updateBlock(block.id, data);
  };

  const activeLayer = definition?.layers.find(
    (l: any) => l.id === activeLayerId,
  );

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
        className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-slate-100 rounded-lg">
              <definition.icon className="w-4 h-4 text-slate-500" />
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Campos de {definition.label}
            </p>
          </div>
          {renderContentForm(block, handleContentChange)}
        </div>
      </TabsContent>

      <TabsContent
        value="style"
        className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300"
      >
        <div className="bg-slate-100/50 p-1 rounded-xl border border-slate-200/60 mb-4">
          <div className="flex flex-wrap gap-1">
            {definition.layers.map((l: any) => (
              <button
                key={l.id}
                onClick={() => setActiveLayerId(l.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all border",
                  activeLayerId === l.id
                    ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                    : "text-slate-500 hover:bg-white/50 border-transparent",
                )}
              >
                <l.icon className="w-3 h-3" /> {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {activeLayer?.controls.includes("typography") && (
            <TypographyControls
              styles={currentStyles}
              onUpdate={handleStyleUpdate}
            />
          )}
          {activeLayer?.controls.includes("colors") && (
            <ColorControls
              styles={currentStyles}
              onUpdate={handleStyleUpdate}
              showTextColor={true}
            />
          )}
          {activeLayer?.controls.includes("spacing") && (
            <BoxModelControls
              styles={currentStyles}
              onUpdate={handleStyleUpdate}
            />
          )}
          {activeLayer?.controls.includes("decoration") && (
            <DecorationControls
              styles={currentStyles}
              onUpdate={handleStyleUpdate}
            />
          )}
          {activeLayer?.controls.includes("size") && (
            <SizeControls styles={currentStyles} onUpdate={handleStyleUpdate} />
          )}
          {activeLayerId === "container" &&
            activeLayer?.controls.includes("animation") && (
              <AnimationControls
                styles={currentStyles}
                onUpdate={handleStyleUpdate}
              />
            )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

function renderContentForm(block: IBlock, onChange: (data: any) => void) {
  if (!block || !block.content) return null;

  const val = (v: any) => v || "";

  switch (block.type) {
    case "HERO":
      return (
        <div className="space-y-4 animate-in fade-in">
          <div className="space-y-1">
            <Label className="text-xs font-bold text-slate-500 uppercase">
              Título
            </Label>
            <Input
              value={val(block.content.title)}
              onChange={(e) => onChange({ title: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-bold text-slate-500 uppercase">
              Subtítulo
            </Label>
            <Input
              value={val(block.content.subtitle)}
              onChange={(e) => onChange({ subtitle: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-bold text-slate-500 uppercase">
              Imagem de Fundo
            </Label>
            <ImageUpload
              value={block.content.image}
              onChange={(url) => onChange({ image: url })}
            />
          </div>
        </div>
      );

    case "TEXT":
      return (
        <div className="space-y-1">
          <Label className="text-xs font-bold text-slate-500 uppercase">
            Mensagem
          </Label>
          <Textarea
            rows={10}
            value={val(block.content.text)}
            onChange={(e) => onChange({ text: e.target.value })}
          />
        </div>
      );

    case "SAVE_THE_DATE":
      return (
        <div className="space-y-4 animate-in fade-in">
          <div className="space-y-1">
            <Label className="text-xs font-bold text-slate-500 uppercase">
              Título Evento
            </Label>
            <Input
              value={val(block.content.title)}
              onChange={(e) => onChange({ title: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-500 uppercase">
                Data (Calendário)
              </Label>
              <Input
                type="date"
                value={val(block.content.date)}
                onChange={(e) => onChange({ date: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-500 uppercase">
                Texto Botão
              </Label>
              <Input
                value={val(block.content.buttonText)}
                onChange={(e) => onChange({ buttonText: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-bold text-slate-500 uppercase">
              Data Visível (Texto)
            </Label>
            <Input
              value={val(block.content.dateDisplay)}
              onChange={(e) => onChange({ dateDisplay: e.target.value })}
            />
          </div>
        </div>
      );

    case "SCHEDULE":
      return (
        <div className="space-y-4 animate-in fade-in">
          <div className="space-y-1">
            <Label className="text-xs font-bold text-slate-500 uppercase">
              Título da Agenda
            </Label>
            <Input
              value={val(block.content.title)}
              onChange={(e) => onChange({ title: e.target.value })}
            />
          </div>
          <div className="max-h-[350px] overflow-y-auto no-scrollbar space-y-3">
            {(block.content.items || []).map((item: any, idx: number) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 border rounded-xl space-y-2 relative group"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 text-red-500"
                  onClick={() =>
                    onChange({
                      items: block.content.items.filter(
                        (_: any, i: number) => i !== idx,
                      ),
                    })
                  }
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    className="col-span-1 bg-white h-8 text-[10px]"
                    value={val(item.time)}
                    placeholder="Hora"
                    onChange={(e) => {
                      const newList = [...block.content.items];
                      newList[idx] = { ...newList[idx], time: e.target.value };
                      onChange({ items: newList });
                    }}
                  />
                  <Input
                    className="col-span-2 bg-white h-8 text-[10px] font-bold"
                    value={val(item.title)}
                    placeholder="Atividade"
                    onChange={(e) => {
                      const newList = [...block.content.items];
                      newList[idx] = { ...newList[idx], title: e.target.value };
                      onChange({ items: newList });
                    }}
                  />
                </div>
                <Textarea
                  className="bg-white text-[10px]"
                  value={val(item.description)}
                  placeholder="Descrição..."
                  onChange={(e) => {
                    const newList = [...block.content.items];
                    newList[idx] = {
                      ...newList[idx],
                      description: e.target.value,
                    };
                    onChange({ items: newList });
                  }}
                />
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            className="w-full border-dashed h-10 text-[10px] font-bold"
            onClick={() =>
              onChange({
                items: [
                  ...(block.content.items || []),
                  { time: "", title: "", description: "" },
                ],
              })
            }
          >
            + NOVA ATIVIDADE
          </Button>
        </div>
      );

    case "FAQ":
      return (
        <div className="space-y-4 animate-in fade-in">
          <Label className="text-xs font-bold text-slate-500 uppercase">
            Perguntas Frequentes
          </Label>
          <div className="max-h-[350px] overflow-y-auto no-scrollbar space-y-3">
            {(block.content.items || []).map((item: any, idx: number) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 border rounded-xl space-y-2 relative group"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 text-red-400"
                  onClick={() =>
                    onChange({
                      items: block.content.items.filter(
                        (_: any, i: number) => i !== idx,
                      ),
                    })
                  }
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
                <Input
                  className="bg-white h-8 text-xs font-bold"
                  value={val(item.q)}
                  placeholder="Pergunta"
                  onChange={(e) => {
                    const newList = [...block.content.items];
                    newList[idx] = { ...newList[idx], q: e.target.value };
                    onChange({ items: newList });
                  }}
                />
                <Textarea
                  className="bg-white text-xs"
                  value={val(item.a)}
                  placeholder="Resposta"
                  onChange={(e) => {
                    const newList = [...block.content.items];
                    newList[idx] = { ...newList[idx], a: e.target.value };
                    onChange({ items: newList });
                  }}
                />
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            className="w-full border-dashed h-10 text-[10px] font-bold"
            onClick={() =>
              onChange({
                items: [...(block.content.items || []), { q: "", a: "" }],
              })
            }
          >
            + NOVA PERGUNTA
          </Button>
        </div>
      );

    case "MAP":
      return (
        <div className="space-y-4 animate-in fade-in">
          <div className="space-y-1">
            <Label className="text-xs font-bold text-slate-500 uppercase">
              Local
            </Label>
            <Input
              value={val(block.content.venueName)}
              onChange={(e) => onChange({ venueName: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-bold text-slate-500 uppercase">
              Morada
            </Label>
            <Input
              value={val(block.content.address)}
              onChange={(e) => onChange({ address: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-bold text-slate-500 uppercase">
              Texto Botão
            </Label>
            <Input
              value={val(block.content.buttonText)}
              onChange={(e) => onChange({ buttonText: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-bold text-slate-500 uppercase">
              Iframe / Link Maps
            </Label>
            <Textarea
              rows={3}
              value={val(block.content.link)}
              onChange={(e) => onChange({ link: e.target.value })}
            />
          </div>
        </div>
      );

    case "MENU":
      return (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-xl mb-4">
            <div className="space-y-0.5">
              <Label className="text-[10px] font-black uppercase text-blue-900 tracking-tighter">
                Menu Interativo
              </Label>
              <p className="text-[9px] text-blue-700 leading-none">
                Permitir escolha de pratos
              </p>
            </div>
            <Button
              size="sm"
              variant={block.content.isInteractive ? "default" : "outline"}
              className={cn(
                "h-7 text-[9px] font-bold",
                block.content.isInteractive ? "bg-blue-600" : "bg-white",
              )}
              onClick={() =>
                onChange({ isInteractive: !block.content.isInteractive })
              }
            >
              {block.content.isInteractive ? "ATIVADO" : "DESATIVADO"}
            </Button>
          </div>
          <Label className="text-xs font-bold text-slate-500 uppercase">
            Secções do Menu
          </Label>
          <div className="max-h-[400px] overflow-y-auto no-scrollbar space-y-4 pr-1">
            {(block.content.sections || []).map(
              (section: any, sIdx: number) => (
                <div
                  key={sIdx}
                  className="p-3 bg-slate-50 border rounded-xl space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <Input
                      className="bg-white h-8 text-[10px] font-black uppercase"
                      value={val(section.title)}
                      placeholder="Secção"
                      onChange={(e) => {
                        const news = [...block.content.sections];
                        news[sIdx] = { ...news[sIdx], title: e.target.value };
                        onChange({ sections: news });
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-red-400"
                      onClick={() =>
                        onChange({
                          sections: block.content.sections.filter(
                            (_: any, i: number) => i !== sIdx,
                          ),
                        })
                      }
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="pl-4 space-y-2 border-l-2 border-slate-200">
                    {section.items.map((item: any, iIdx: number) => (
                      <div
                        key={iIdx}
                        className="bg-white p-2 rounded-lg border relative group space-y-2"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover:opacity-100"
                          onClick={() => {
                            const news = [...block.content.sections];
                            news[sIdx].items = news[sIdx].items.filter(
                              (_: any, i: number) => i !== iIdx,
                            );
                            onChange({ sections: news });
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                        <Input
                          className="h-7 text-[10px] font-bold"
                          value={val(item.name)}
                          placeholder="Nome"
                          onChange={(e) => {
                            const news = [...block.content.sections];
                            news[sIdx].items[iIdx] = {
                              ...news[sIdx].items[iIdx],
                              name: e.target.value,
                            };
                            onChange({ sections: news });
                          }}
                        />
                        <Textarea
                          className="text-[9px] min-h-[40px]"
                          value={val(item.description)}
                          placeholder="Descrição"
                          onChange={(e) => {
                            const news = [...block.content.sections];
                            news[sIdx].items[iIdx] = {
                              ...news[sIdx].items[iIdx],
                              description: e.target.value,
                            };
                            onChange({ sections: news });
                          }}
                        />
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      className="text-[9px] h-7 w-full border-dashed border-slate-300"
                      onClick={() => {
                        const news = [...block.content.sections];
                        news[sIdx].items = [
                          ...news[sIdx].items,
                          { name: "", description: "" },
                        ];
                        onChange({ sections: news });
                      }}
                    >
                      + Prato
                    </Button>
                  </div>
                </div>
              ),
            )}
          </div>
          <Button
            variant="outline"
            className="w-full border-dashed h-10 text-[10px] font-bold"
            onClick={() =>
              onChange({
                sections: [
                  ...(block.content.sections || []),
                  { title: "", items: [] },
                ],
              })
            }
          >
            + NOVA SECÇÃO
          </Button>
        </div>
      );

    case "CAROUSEL":
      return (
        <div className="space-y-4">
          <Label className="text-xs font-bold text-slate-500 uppercase">
            Galeria de Fotos
          </Label>
          <div className="max-h-[350px] overflow-y-auto no-scrollbar space-y-3">
            {(block.content.images || []).map((img: any, idx: number) => (
              <div
                key={idx}
                className="relative p-2 bg-slate-50 border rounded-xl group"
              >
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() =>
                    onChange({
                      images: block.content.images.filter(
                        (_: any, i: number) => i !== idx,
                      ),
                    })
                  }
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
                <ImageUpload
                  value={img.url}
                  onChange={(url) => {
                    const news = [...block.content.images];
                    news[idx] = { ...news[idx], url };
                    onChange({ images: news });
                  }}
                />
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            className="w-full border-dashed h-10 text-[10px] font-bold uppercase"
            onClick={() =>
              onChange({
                images: [...(block.content.images || []), { url: "" }],
              })
            }
          >
            + ADICIONAR FOTO
          </Button>
        </div>
      );

    case "DRESS_CODE":
      return (
        <div className="space-y-4 animate-in fade-in">
          <div className="space-y-1">
            <Label className="text-xs font-bold text-slate-500 uppercase">
              Título
            </Label>
            <Input
              value={val(block.content.title)}
              onChange={(e) => onChange({ title: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-bold text-slate-500 uppercase">
              Descrição
            </Label>
            <Textarea
              rows={4}
              value={val(block.content.description)}
              onChange={(e) => onChange({ description: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-bold text-slate-500 uppercase">
              Foto Exemplo
            </Label>
            <ImageUpload
              value={block.content.image}
              onChange={(url) => onChange({ image: url })}
            />
          </div>
        </div>
      );

    case "SONG_REQUEST":
      return (
        <div className="space-y-4">
          <div className="space-y-1">
            <Label className="text-xs">TÍTULO</Label>
            <Input
              value={val(block.content.title)}
              onChange={(e) => onChange({ title: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">DICA (PLACEHOLDER)</Label>
            <Input
              value={val(block.content.placeholder)}
              onChange={(e) => onChange({ placeholder: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">TEXTO BOTÃO</Label>
            <Input
              value={val(block.content.buttonText)}
              onChange={(e) => onChange({ buttonText: e.target.value })}
            />
          </div>
        </div>
      );

    case "BUTTON":
      return (
        <div className="space-y-4">
          <div className="space-y-1">
            <Label className="text-xs font-bold text-slate-500">
              TEXTO DO BOTÃO
            </Label>
            <Input
              value={val(block.content.text)}
              onChange={(e) => onChange({ text: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-bold text-slate-500">
              URL DE DESTINO
            </Label>
            <Input
              value={val(block.content.url)}
              onChange={(e) => onChange({ url: e.target.value })}
            />
          </div>
        </div>
      );

    case "ICON":
      return (
        <div className="space-y-4">
          <div className="space-y-1">
            <Label className="text-xs font-bold">NOME ÍCONE (LUCIDE)</Label>
            <Input
              value={val(block.content.name)}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="Ex: Heart, Star, Music..."
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs font-bold">TAMANHO</Label>
              <Input
                type="number"
                value={block.content.size || 32}
                onChange={(e) => onChange({ size: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-bold">REPETIR</Label>
              <Input
                type="number"
                value={block.content.repeat || 1}
                onChange={(e) => onChange({ repeat: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>
      );

    case "VIDEO":
      return (
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase text-slate-500">
            Link YouTube
          </Label>
          <Input
            value={val(block.content.url)}
            onChange={(e) => onChange({ url: e.target.value })}
            placeholder="https://..."
          />
        </div>
      );

    case "COUNTDOWN":
      return (
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase text-slate-500">
            Data do Evento
          </Label>
          <Input
            type="datetime-local"
            value={
              block.content.date
                ? new Date(block.content.date).toISOString().slice(0, 16)
                : ""
            }
            onChange={(e) =>
              onChange({ date: new Date(e.target.value).toISOString() })
            }
          />
        </div>
      );

    case "DIVIDER":
      return (
        <div className="space-y-4">
          <Label className="text-xs font-bold uppercase text-slate-400">
            Largura
          </Label>
          <div className="flex gap-2">
            {["20%", "50%", "80%", "100%"].map((w) => (
              <Button
                key={w}
                variant={
                  (block.content.width || "50%") === w ? "default" : "outline"
                }
                className="flex-1"
                onClick={() => onChange({ width: w })}
              >
                {w}
              </Button>
            ))}
          </div>
          <Label className="text-xs font-bold uppercase text-slate-400">
            Alinhamento
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {["left", "center", "right"].map((a) => (
              <Button
                key={a}
                variant={
                  (block.content.align || "center") === a
                    ? "default"
                    : "outline"
                }
                onClick={() => onChange({ align: a })}
              >
                {a}
              </Button>
            ))}
          </div>
        </div>
      );

    case "IMAGE":
      return (
        <div className="space-y-4">
          <ImageUpload
            value={block.content.url}
            onChange={(url) => onChange({ url })}
          />
          <div className="space-y-1">
            <Label className="text-xs font-bold uppercase text-slate-500">
              Legenda
            </Label>
            <Input
              value={val(block.content.alt)}
              onChange={(e) => onChange({ alt: e.target.value })}
            />
          </div>
        </div>
      );

    case "COLUMNS":
      return (
        <div className="space-y-2">
          <Label className="text-xs font-bold">Nº COLUNAS</Label>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((n) => (
              <Button
                key={n}
                variant={block.content.cols === n ? "default" : "outline"}
                onClick={() => onChange({ cols: n })}
              >
                {n}
              </Button>
            ))}
          </div>
        </div>
      );

    default:
      return (
        <div className="text-center py-10 border-2 border-dashed rounded-xl opacity-40 uppercase text-[10px] font-bold">
          Sem campos editáveis
        </div>
      );
  }
}
