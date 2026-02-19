"use client";
import { getTypographyStyle } from "../../utils";

export const TextBlock = ({ block, styles: s }: any) => {
  return (
    <p
      className="whitespace-pre-wrap w-full"
      style={getTypographyStyle(s, "text")}
    >
      {block.content.text || "Escreva algo..."}
    </p>
  );
};