"use client";
import { getContainerStyle } from "../../utils";

export const DividerBlock = ({ content, styles }: any) => {
  const s = styles;
  return (
    <div
      className="w-full flex"
      style={{
        ...getContainerStyle(s),
        justifyContent: content.align === "left" ? "flex-start" : content.align === "right" ? "flex-end" : "center",
        height: "auto",
        minHeight: "1px",
      }}
    >
      <div
        style={{
          height: (!s.height || s.height === "auto") ? "2px" : (typeof s.height === "number" ? `${s.height}px` : s.height),
          width: content.width || "50%",
          backgroundColor: s.color || s.borderColor || "#e2e8f0",
          borderRadius: "99px",
          opacity: s.opacity ?? 1,
        }}
      />
    </div>
  );
};