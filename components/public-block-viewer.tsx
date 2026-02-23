"use client";
import React from "react";
import { motion } from "framer-motion";
import { DEFAULT_STYLES, IBlock } from "@/features/editor/types";
import {
  getBackgroundStyle,
  getContainerStyle,
  getAnimationVariants, 
} from "@/features/editor/utils";
import { SharedBlockContent } from "@/features/editor/components/shared-block-content";

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
  // 1. Unifica estilos brutos
  const rawStyles = { ...DEFAULT_STYLES, ...block.styles };

  // 2. NORMALIZAÇÃO: Mapeia as chaves dos presets para chaves CSS que o navegador entende
  const normalizedStyles = {
    ...rawStyles,
    fontSize: rawStyles.textFontSize || rawStyles.fontSize,
    color: rawStyles.textColor || rawStyles.color,
    fontFamily: rawStyles.textFontFamily || rawStyles.fontFamily,
    letterSpacing: rawStyles.textLetterSpacing || rawStyles.letterSpacing,
    textTransform: rawStyles.textTextTransform || rawStyles.textTransform,
    fontWeight: rawStyles.textFontWeight || rawStyles.fontWeight,
    lineHeight: rawStyles.textLineHeight || rawStyles.lineHeight,
    textAlign: rawStyles.textAlign,
  };

  const variants = getAnimationVariants(
    normalizedStyles.animation || "none",
    normalizedStyles.animationDelay || 0,
    normalizedStyles.animationDuration || 0.5,
  );

  return (
    <motion.div
      key={`${block.id}-${normalizedStyles.animation}-${normalizedStyles.animationDelay}`}
      variants={variants}
      initial="hidden"
      whileInView={canAnimate ? "visible" : "hidden"}
      viewport={{ once: true, amount: 0.1 }}
      style={{
        ...getContainerStyle(normalizedStyles),
        ...getBackgroundStyle(normalizedStyles),
        position: "relative",
        width: normalizedStyles.width || "100%",
        display: "flex",
        flexDirection: "column", 
        height: normalizedStyles.height === "auto" ? "auto" : normalizedStyles.height,
        minHeight: normalizedStyles.minHeight, 
        flexShrink: 0,
        boxSizing: "border-box", 
      }}
      className="w-full shrink-0 pointer-events-auto"
    >
      <SharedBlockContent
        block={block}
        styles={normalizedStyles} 
        isPreview={false}
        guest={guest}
        renderChild={(colIdx: number) => {
          if (block.type !== "COLUMNS") return null;

          const colKey = `col${colIdx}`;
          const children = block.content.children?.[colKey] || [];

          return (
            <div className="flex flex-col gap-4 w-full h-full">
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