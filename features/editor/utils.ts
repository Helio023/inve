export const getBackgroundStyle = (value?: string) => {
  if (!value) return {};

  if (value.includes("gradient") || value.includes("url")) {
    return { backgroundImage: value, backgroundColor: "transparent" };
  }

  return { backgroundColor: value, backgroundImage: "none" };
};

import { DEFAULT_STYLES } from "./types";

export const getTypographyStyle = (styles: any, prefix: string = "") => {
  const s = { ...DEFAULT_STYLES, ...styles };

  const p = (prop: string) => {
    const specific = prefix
      ? `${prefix}${prop.charAt(0).toUpperCase() + prop.slice(1)}`
      : prop;
    return styles[specific] ?? styles[prop];
  };

  return {
    color: p("color"),
    fontFamily: p("fontFamily"),
    fontSize: `${p("fontSize")}px`,
    fontWeight: p("fontWeight"),
    fontStyle: p("fontStyle"),
    textTransform: p("textTransform"),
    textDecoration: p("textDecoration"),
    lineHeight: p("lineHeight"),
    letterSpacing: `${p("letterSpacing")}px`,
    textAlign: p("textAlign"),
  };
};
