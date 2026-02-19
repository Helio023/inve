"use client";
import { cn } from "@/lib/utils";
import { getTypographyStyle } from "../../utils";

export const ButtonBlock = ({ content, styles, isPreview }: any) => {
  const s = styles;
  return (
    <div className="w-full flex" style={{ justifyContent: s.alignSelf || "center" }}>
      <a
        href={isPreview ? content.url : "#"}
        target={isPreview ? "_blank" : "_self"}
        onClick={(e) => !isPreview && e.preventDefault()}
        className={cn(
          "px-8 py-3 font-bold transition-all text-center shadow-md active:scale-95",
          !isPreview ? "cursor-default" : "cursor-pointer hover:brightness-110"
        )}
        style={{
          ...getTypographyStyle(s, "btn"),
          backgroundColor: s.btnBackgroundColor || "#000",
          color: s.btnColor || "#fff",
          borderRadius: s.btnBorderRadius || 8,
          width: s.width === "100%" ? "100%" : "auto",
        }}
      >
        {content.text || "Botão"}
      </a>
    </div>
  );
};