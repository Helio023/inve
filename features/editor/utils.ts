import { CSSProperties } from "react";
import { DEFAULT_STYLES, IBlockStyles } from "./types";

export const extractMapUrl = (input: string) => {
  if (!input) return "";
  if (input.includes("<iframe")) {
    const match = input.match(/src="([^"]+)"/);
    return match ? match[1] : "";
  }
  return input;
};

// Helper para converter link do YouTube em Embed
export const formatVideoUrl = (url: string) => {
  if (!url) return "";
  if (url.includes("youtube.com/watch?v=")) {
    return url.replace("watch?v=", "embed/").split("&")[0];
  }
  if (url.includes("youtu.be/")) {
    const id = url.split("/").pop();
    return `https://www.youtube.com/embed/${id}`;
  }
  return url;
};

export const getTypographyStyle = (
  styles: Partial<IBlockStyles>,
  prefix: string = "",
): CSSProperties => {
  const s = { ...DEFAULT_STYLES, ...styles };
  const px = (val: any) =>
    val !== undefined && val !== null && val !== "" ? `${val}px` : undefined;

  const get = (prop: string) => {
    const specificKey = prefix
      ? `${prefix}${prop.charAt(0).toUpperCase() + prop.slice(1)}`
      : prop;

    const specificVal = (s as any)[specificKey];

    if (
      specificVal !== undefined &&
      specificVal !== null &&
      specificVal !== ""
    ) {
      return specificVal;
    }

    return (s as any)[prop];
  };

  return {
    color: get("color"),
    fontFamily: get("fontFamily"),
    fontSize: px(get("fontSize")),
    fontWeight: get("fontWeight"),
    fontStyle: get("fontStyle"),
    lineHeight: get("lineHeight"),
    letterSpacing: px(get("letterSpacing")),
    textAlign: get("textAlign"),
    marginTop: px((s as any)[`${prefix}MarginTop`]),
    marginBottom: px((s as any)[`${prefix}MarginBottom`]),
    textTransform: get("textTransform") as any,
  
  };
};



export const getContainerStyle = (
  styles: Partial<IBlockStyles> | undefined,
  prefix: string = "",
): CSSProperties => {
  const s = { ...DEFAULT_STYLES, ...(styles || {}) };

  const get = (k: string) => {
    const key = prefix
      ? `${prefix}${k.charAt(0).toUpperCase() + k.slice(1)}`
      : k;
    return (s as any)[key];
  };

  const formatUnit = (val: any) => {
    if (val === undefined || val === null || val === "") return undefined;
    if (!isNaN(val) && typeof val !== "boolean") return `${val}px`; // Se for número, add px
    return val;
  };

  const shadowMap: Record<string, string> = {
    none: "none",
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 10px 10px 10px -5px rgb(0 0 0 / 0.04)",
  };

  return {
    backgroundColor: get("backgroundColor") || "transparent",
    width: formatUnit(get("width")),
    height: formatUnit(get("height")),
    minHeight: formatUnit(get("minHeight")),
    paddingTop: formatUnit(get("paddingTop")),
    paddingBottom: formatUnit(get("paddingBottom")),
    paddingLeft: formatUnit(get("paddingLeft")),
    paddingRight: formatUnit(get("paddingRight")),
    marginTop: formatUnit(get("marginTop")),
    marginBottom: formatUnit(get("marginBottom")),
    borderRadius: formatUnit(get("borderRadius")),
    borderWidth: formatUnit(get("borderWidth")),
    borderColor: get("borderColor") || "transparent",
    borderStyle: get("borderStyle") || "solid",
    boxShadow: shadowMap[get("shadow")] || "none",
  };
};

export const getBackgroundStyle = (
  styles: Partial<IBlockStyles> | undefined,
): CSSProperties => {
  if (!styles) return { backgroundColor: "transparent" };

  return {
    backgroundColor: styles.backgroundColor || "transparent",
    backgroundImage:
      styles.backgroundImage && styles.backgroundImage !== "none"
        ? `url(${styles.backgroundImage})`
        : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
};

import { Variants } from "framer-motion";


export const getAnimationVariants = (
  animType: string,
  delay: number = 0,
  duration: number = 0.5,
): Variants => {
  const initialStates: any = {
    none: { opacity: 1, y: 0, x: 0, scale: 1, rotateX: 0 },
    fade: { opacity: 0 },

    "slide-up": { opacity: 0, y: 30 },
    "slide-down": { opacity: 0, y: -30 },
    "slide-left": { opacity: 0, x: 30 },
    "slide-right": { opacity: 0, x: -30 },
    "zoom-in": { opacity: 0, scale: 0.92 },
    "zoom-out": { opacity: 0, scale: 1.08 },
    flip: { opacity: 0, rotateX: 90 },
    bounce: { opacity: 0, y: 40, scale: 0.95 },
  };

  return {
    hidden: initialStates[animType] || initialStates.none,
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        ease: "linear",

        duration: duration,
        delay: delay,

        type: "tween",
      },
    },
  };
};
