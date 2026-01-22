export type BlockType =
  | "HERO"
  | "TEXT"
  | "IMAGE"
  | "VIDEO"
  | "MAP"
  | "COUNTDOWN"
  | "RSVP"
  | "COLUMNS";

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

export const DEFAULT_STYLES = {
  // Itens (Cronómetro)
  itemBackgroundColor: "transparent",
  itemColor: "inherit",
  itemBorderRadius: 8,
  itemBorderWidth: 1,
  itemShadow: "none" as const,
  itemBorderStyle: "solid" as BorderStyle,

  // Inputs (RSVP)
  inputBackgroundColor: "#ffffff",
  inputBorderColor: "#e2e8f0",
  inputTextColor: "#000000",
  inputShadow: "none" as const,

  // Botões (RSVP)
  btnBackgroundColor: "#000000",
  btnTextColor: "#ffffff",
  btnRadius: 8,
  btnShadow: "none" as const,
  inputBorderStyle: "solid" as BorderStyle,
  btnBorderStyle: "solid" as BorderStyle,

  fontSize: 16,
  textAlign: "center" as const,
  fontWeight: "normal",
  fontStyle: "normal",
  color: "#1e293b",
  fontFamily: "inherit",

  // Fundo
  backgroundColor: "transparent",

  paddingTop: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  paddingRight: 0,
  marginTop: 0,
  marginBottom: 0,

  borderRadius: 0,

  borderWidth: 0,
  borderStyle: "solid" as BorderStyle,
  borderColor: "#e2e8f0",
  // --------------------

  shadow: "none" as const,

  // Animação
  animation: "none" as AnimationType,
  animationDuration: 0.5,
  animationDelay: 0,
};

export const DEFAULT_PAGE_STYLES = {
  backgroundColor: "#ffffff",
  backgroundOpacity: 0,
  paddingTop: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  paddingRight: 0,
};

export interface IBlock {
  id: string;
  type: BlockType;
  content: any;
  styles: Partial<typeof DEFAULT_STYLES> & {
    animation?: AnimationType;
  };
}

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
