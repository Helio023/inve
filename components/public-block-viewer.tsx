"use client";
import React from "react";
import { motion } from "framer-motion";
import { DEFAULT_STYLES, IBlock } from "@/features/editor/types";
import { getBackgroundStyle, getContainerStyle } from "@/features/editor/utils";
import { SharedBlockContent } from "@/features/editor/components/shared-block-content";
// import { IBlock, DEFAULT_STYLES } from "../types";
// import { SharedBlockContent } from "./shared-block-content";
// import { getContainerStyle, getBackgroundStyle } from "../utils";

interface PublicBlockRendererProps {
  block: IBlock;
  guest?: any;
  canAnimate?: boolean;
}

export const PublicBlockRenderer = ({
  block,
  guest,
  canAnimate = true,
}: PublicBlockRendererProps) => {
  const s = { ...DEFAULT_STYLES, ...block.styles };

  // Lógica de animação simplificada para o público
  const animKey = (s.animation as string) || "none";
  
  const initialStates: any = {
    none: { opacity: 1 },
    fade: { opacity: 0 },
    "slide-up": { opacity: 0, y: 30 },
    "slide-down": { opacity: 0, y: -30 },
    "zoom-in": { opacity: 0, scale: 0.9 },
  };

  const motionProps = canAnimate 
    ? {
        initial: initialStates[animKey] || initialStates.none,
        whileInView: { opacity: 1, y: 0, x: 0, scale: 1 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: s.animationDuration || 0.5, delay: s.animationDelay || 0 }
      }
    : {};

  return (
    <motion.div
      {...motionProps}
      style={{
        ...getContainerStyle(s),
        ...getBackgroundStyle(s),
        position: "relative",
      }}
      className="w-full shrink-0"
    >
      <SharedBlockContent
        block={block}
        styles={s}
        isPreview={true} 
        guest={guest}
        renderChild={(colIdx: number) => {
          if (block.type !== "COLUMNS") return null;

          const colKey = `col${colIdx}`;
          const children = block.content.children?.[colKey] || [];

          return (
            <div className="flex flex-col gap-4 w-full">
              {children.map((child: IBlock) => (
                <PublicBlockRenderer
                  key={child.id}
                  block={child}
                  guest={guest}
                  canAnimate={canAnimate}
                />
              ))}
            </div>
          );
        }}
      />
    </motion.div>
  );
};