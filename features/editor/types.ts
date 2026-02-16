export type BlockType =
  | "HERO"
  | "TEXT"
  | "IMAGE"
  | "VIDEO"
  | "MAP"
  | "COUNTDOWN"
  | "RSVP"
  | "COLUMNS"
  | "MENU"
  | "SCHEDULE"
  | "CAROUSEL"
  | "BUTTON"
  | "SONG_REQUEST"
  | "ICON"
  | "DIVIDER"
  | "SAVE_THE_DATE"
  | "DRESS_CODE"
  | "FAQ";

export interface BlockContentMap {
  HERO: { title: string; subtitle?: string; image?: string };
  TEXT: { text: string };
  IMAGE: { url: string; alt?: string };
  VIDEO: { url: string; provider?: "youtube" | "vimeo" };
  MAP: {
    venueName: string;
    address: string;
    time: string;
    link: string;
    buttonText?: string;
  };
  COUNTDOWN: { date: string; label?: string };
  RSVP: { title: string; description: string; buttonText: string };
  COLUMNS: { cols: number; children: Record<string, IBlock[]> };
  MENU: {
     isInteractive: boolean;
    sections: Array<{
      title: string;
      items: Array<{ name: string; description: string; price?: string }>;
    }>;
  };
   SCHEDULE: { 
    title?: string;
    items: Array<{ time: string; title: string; description: string }>; 
  };
  CAROUSEL: { images: Array<{ url: string; caption?: string }> };
  BUTTON: { text: string; url: string };
  SONG_REQUEST: { title: string; placeholder?: string; buttonText?: string; };
  ICON: { name: string; size?: number; repeat?: number };
  DIVIDER: { align: "left" | "center" | "right"; width?: string };
  SAVE_THE_DATE: { title: string; 
    date: string;       
    dateDisplay: string; 
    buttonText: string;
    location?: string; };
  DRESS_CODE: { title: string; description: string; image?: string };
  FAQ: { items: Array<{ q: string; a: string }> };
}

export type AnimationType =
  | "none"
  | "fade"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "zoom-in"
  | "zoom-out"
  | "bounce"
  | "flip";
export type BorderStyle = "none" | "solid" | "dashed" | "dotted" | "double";

export interface IBlockStyles {
  backgroundColor?: string;
  backgroundImage?: string;
  width?: string;
  height?: string | number;
  minHeight?: string | number;
  objectFit?: "cover" | "contain" | "fill" | "none";
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  borderRadius?: number;
  borderWidth?: number;
  borderStyle?: BorderStyle;
  borderColor?: string;
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  fontSize?: number;
  textAlign?: "left" | "center" | "right" | "justify";
  fontWeight?: string | number;
  fontStyle?: string;
  color?: string;
  fontFamily?: string;
  lineHeight?: number;
  letterSpacing?: number;
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  animation?: AnimationType;
  animationDuration?: number;
  animationDelay?: number;

  [key: string]: any;
}

export const DEFAULT_STYLES: IBlockStyles = {
  backgroundColor: "transparent",
  backgroundImage: "none",
  width: "100%",
  height: "auto",
  minHeight: 0,
  objectFit: "cover",
  paddingTop: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  paddingRight: 0,
  marginTop: 0,
  marginBottom: 0,
  marginLeft: 0,
  marginRight: 0,
  borderRadius: 0,
  borderWidth: 0,
  borderStyle: "solid",
  borderColor: "#e2e8f0",
  shadow: "none",
  fontSize: 16,
  textAlign: "center",
  fontWeight: "normal",
  fontStyle: "normal",
  color: "#1e293b",
  fontFamily: "inherit",
  lineHeight: 1.5,
  letterSpacing: 0,
  textTransform: "none",
  animation: "none",
  animationDuration: 0.5,
  animationDelay: 0,
};

// ESSENCIAL PARA O EVENT-VIEWER E EDITOR CANVAS
export const DEFAULT_PAGE_STYLES = {
  backgroundColor: "#ffffff",
  backgroundImage: "",
  backgroundOpacity: 0,
  paddingTop: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  paddingRight: 0,
};

export type IBlock = {
  [K in BlockType]: {
    id: string;
    type: K;
    content: BlockContentMap[K];
    styles: Partial<IBlockStyles>;
  };
}[BlockType];

export interface IPage {
  id: string;
  title: string;
  order: number;
  styles: {
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundOpacity?: number;
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
  };
  blocks: IBlock[];
}
