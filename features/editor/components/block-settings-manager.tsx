"use client";

import React, { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BLOCK_DEFINITIONS } from "../constants/definitions";
import { IBlock, BlockType, DEFAULT_STYLES } from "../types";
import { cn } from "@/lib/utils";

// Painéis de Estilo (Controles Globais de Design)
import {
  TypographyControls,
  ColorControls,
  BoxModelControls,
  DecorationControls,
  AnimationControls,
  SizeControls,
} from "./panels/style-controls";

// Importação dos Formulários de Conteúdo Modularizados
import { HeroForm } from "./forms/hero-form";
import { TextForm } from "./forms/text-form";
import { ImageForm } from "./forms/image-form";
import { VideoForm } from "./forms/video-form";
import { MapForm } from "./forms/map-form";
import { SaveDateForm } from "./forms/save-date-form";
import { ScheduleForm } from "./forms/schedule-form";
import { MenuForm } from "./forms/menu-form";
import { CarouselForm } from "./forms/carousel-form";
import { RsvpForm } from "./forms/rsvp-form";
import { ButtonForm } from "./forms/button-form";
import { IconForm } from "./forms/icon-form";
import { DividerForm } from "./forms/divider-form";
import { DressCodeForm } from "./forms/dress-code-form";
import { FaqForm } from "./forms/faq-form";
import { SongRequestForm } from "./forms/song-request-form";
import { CountdownForm } from "./forms/countdown-form";

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

  const onUpdateContent = (data: any) => updateBlock(block.id, data);

  const activeLayer = definition?.layers.find(
    (l: any) => l.id === activeLayerId,
  );

  return (
    <Tabs defaultValue="content" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6 h-10 p-1 bg-slate-100 rounded-lg border border-slate-200/50">
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

      {/* ABA DE CONTEÚDO: Delegada aos sub-formulários */}
      <TabsContent
        value="content"
        className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300 outline-none"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-slate-100 rounded-lg">
              <definition.icon className="w-4 h-4 text-slate-500" />
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">
              Configuração de {definition.label}
            </p>
          </div>
          {renderBlockForm(block, onUpdateContent)}
        </div>
      </TabsContent>

      {/* ABA DE DESIGN: Gerador Dinâmico baseado no Contrato */}
      <TabsContent
        value="style"
        className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300 outline-none"
      >
        {/* Seletor de Camadas (Layers) */}
        <div className="bg-slate-100/50 p-1 rounded-xl border border-slate-200/60 mb-4">
          <div className="flex flex-wrap gap-1">
            {definition.layers.map((l: any) => (
              <button
                key={l.id}
                onClick={() => setActiveLayerId(l.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all border",
                  activeLayerId === l.id
                    ? "bg-white text-blue-600 shadow-sm border-slate-200"
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

function renderBlockForm(block: IBlock, onUpdate: (data: any) => void) {
  const props = { content: block.content, onUpdate };

  switch (block.type) {
    case "HERO":
      return <HeroForm {...props} />;
    case "TEXT":
      return <TextForm {...props} />;
    case "IMAGE":
      return <ImageForm {...props} />;
    case "VIDEO":
      return <VideoForm {...props} />;
    case "MAP":
      return <MapForm {...props} />;
    case "SAVE_THE_DATE":
      return <SaveDateForm {...props} />;
    case "SCHEDULE":
      return <ScheduleForm {...props} />;
    case "MENU":
      return <MenuForm {...props} />;
    case "CAROUSEL":
      return <CarouselForm {...props} />;
    case "RSVP":
      return <RsvpForm {...props} />;
    case "BUTTON":
      return <ButtonForm {...props} />;
    case "ICON":
      return <IconForm {...props} />;
    case "DIVIDER":
      return <DividerForm {...props} />;
    case "DRESS_CODE":
      return <DressCodeForm {...props} />;
    case "FAQ":
      return <FaqForm {...props} />;
    case "SONG_REQUEST":
      return <SongRequestForm {...props} />;
      case "COUNTDOWN": 
      return <CountdownForm {...props} />;
    default:
      return (
        <div className="text-center py-10 border-2 border-dashed rounded-xl opacity-40 uppercase text-[10px] font-bold">
          Sem campos de conteúdo
        </div>
      );
  }
}
