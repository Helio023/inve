"use client";
import React from "react";
import { IBlock, IBlockStyles } from "../types";
import { cn } from "@/lib/utils";

// Importação dos Componentes de Bloco Modularizados
import { HeroBlock } from "./blocks/hero-block";
import { TextBlock } from "./blocks/text-block";
import { ImageBlock } from "./blocks/image-block";
import { VideoBlock } from "./blocks/video-block";
import { MapBlock } from "./blocks/map-block";
import { IconBlock } from "./blocks/icon-block";
import { DividerBlock } from "./blocks/divider-block";
import { ButtonBlock } from "./blocks/button-block";
import { RsvpBlock } from "@/features/editor/components/blocks/rsvp-block";
import { CountdownRenderer } from "./blocks/countdown-renderer";
import { ScheduleRenderer } from "./blocks/schedule-render";
import { MenuRenderer } from "./blocks/menu-render";
import { CarouselRenderer } from "./blocks/carousel-render";
import { SaveTheDateRenderer } from "./blocks/save-date-render";
import { SongRequestBlock } from "./blocks/song-request-block";
import { FaqBlock } from "./blocks/FaqBlock";
import { DressCodeRenderer } from "./blocks/dress-code-render";
import { getContainerStyle } from "../utils";

interface SharedProps {
  block: IBlock;
  styles: Partial<IBlockStyles>;
  isPreview: boolean;
  guest?: any;
  renderChild?: (colIdx: number) => React.ReactNode;
}

export const SharedBlockContent = (props: SharedProps) => {
  const { block, styles: s, isPreview, guest, renderChild } = props;
  const blockType = block.type as string;

  // O SharedBlockContent agora funciona apenas como um "Router" de componentes.
  // A inteligência de estilos vive dentro de cada componente importado acima.
  switch (block.type) {
    case "HERO":
      return <HeroBlock content={block.content} styles={s} />;

    case "TEXT":
      return <TextBlock block={block} styles={s} />;

    case "IMAGE":
      return <ImageBlock block={block} styles={s} />;

    case "VIDEO":
      return <VideoBlock block={block} styles={s} />;

    case "MAP":
      return (
        <MapBlock content={block.content} styles={s} isPreview={isPreview} />
      );

    case "ICON":
      return <IconBlock content={block.content} styles={s} />;

    case "DIVIDER":
      return <DividerBlock content={block.content} styles={s} />;

    case "BUTTON":
      return (
        <ButtonBlock content={block.content} styles={s} isPreview={isPreview} />
      );

    case "DRESS_CODE":
      return <DressCodeRenderer content={block.content} styles={s} />;

    case "FAQ":
      return <FaqBlock content={block.content} styles={s} />;

    case "SONG_REQUEST":
      return (
        <SongRequestBlock
          content={block.content}
          styles={s}
          isPreview={isPreview}
        />
      );

    case "SAVE_THE_DATE":
      return (
        <SaveTheDateRenderer
          content={block.content}
          styles={s}
          isPreview={isPreview}
        />
      );

   case "RSVP":
      return (
        <RsvpBlock
          content={block.content}
          styles={s}
          isEditorPreview={!isPreview}
          guest={guest}
        />
      );

    case "COUNTDOWN":
      return <CountdownRenderer content={block.content} styles={s} />;

    case "CAROUSEL":
      return (
        <div
          style={{
            ...getContainerStyle(s),

            height: s.height && s.height !== "auto" ? s.height : "350px",
            minHeight: "200px",
            overflow: "hidden",
          }}
          className="w-full relative"
        >
          <CarouselRenderer content={block.content} styles={s} />
        </div>
      );

    case "SCHEDULE":
      return (
        <ScheduleRenderer
          content={{
            ...block.content,
            items: (block.content.items || []).map((it: any) => ({
              ...it,
              title: it.title || it.activity,
            })),
          }}
          styles={s}
        />
      );

    case "MENU":
      return (
        <MenuRenderer
          content={block.content}
          styles={s}
          isPreview={isPreview}
        />
      );

    case "COLUMNS":
      return (
        <div
          className={cn(
            "grid gap-4 w-full transition-all",
            !isPreview &&
              !s.backgroundColor &&
              "bg-slate-50/30 p-2 rounded-xl border border-slate-100",
          )}
          style={{
            gridTemplateColumns: `repeat(${block.content.cols || 1}, minmax(0, 1fr))`,
          }}
        >
          {[...Array(block.content.cols || 1)].map((_, i) => (
            <div key={i} className="flex flex-col gap-4">
              {renderChild && renderChild(i)}
            </div>
          ))}
        </div>
      );

    default:
      return (
        <div className="p-10 text-center opacity-30 border border-dashed rounded-xl">
          Elemento {blockType} não implementado
        </div>
      );
  }
};
