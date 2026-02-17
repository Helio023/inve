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
  const s = { ...DEFAULT_STYLES, ...block.styles };

  const variants = getAnimationVariants(
    s.animation || "none",
    s.animationDelay || 0,
    s.animationDuration || 0.5,
  );

  return (
    <motion.div
      key={`${block.id}-${s.animation}-${s.animationDelay}`}
      variants={variants}
      initial="hidden"
      whileInView={canAnimate ? "visible" : "hidden"}
      viewport={{ once: true, amount: 0.1 }}
      style={{
        ...getContainerStyle(s),
        ...getBackgroundStyle(s),
        position: "relative",
        width: s.width || "100%",
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
