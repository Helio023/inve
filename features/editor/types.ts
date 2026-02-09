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
  // | "DIVIDER"; // Garanta que DIVIDER está aqui

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
  videoAutoplay: false,
  videoLoop: false,
  videoMuted: false,
  videoControls: true,

  backgroundColor: "transparent",
  width: "100%",
  height: "auto",
  objectFit: "cover",

  // Box Model (Espaçamento)
  paddingTop: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  paddingRight: 0,
  marginTop: 0,
  marginBottom: 0,
  marginLeft: 0,
  marginRight: 0,

  // Decoração (Bordas e Sombra)
  borderRadius: 0,
  borderWidth: 0,
  borderStyle: "solid" as BorderStyle,
  borderColor: "#e2e8f0",
  shadow: "none" as const,

  // Animação
  animation: "none" as AnimationType,
  animationDuration: 0.5,
  animationDelay: 0,

  // =================================================================
  // ESTILOS DE TIPOGRAFIA BASE
  // =================================================================
  fontSize: 16,
  textAlign: "center" as const,
  fontWeight: "normal",
  fontStyle: "normal",
  color: "#1e293b",
  fontFamily: "inherit",
  lineHeight: 1.5,
  letterSpacing: 0,
  textTransform: "none",

  // =================================================================
  // OVERRIDES POR CAMADA (Corrigido e Expandido)
  // =================================================================

  // 1. Títulos
  titleFontFamily: "inherit",
  titleFontSize: 24,
  titleColor: "inherit",
  titleFontWeight: "bold",
  titleLineHeight: 1.2,
  titleLetterSpacing: 0,
  titleTextTransform: "none",
  titleTextAlign: "center" as const, // Adicionado para override específico

  // 2. Subtítulos / Descrições
  descFontFamily: "inherit",
  descFontSize: 14,
  descColor: "inherit",
  descFontWeight: "normal",
  descLineHeight: 1.5,
  descTextAlign: "center" as const,

  // 3. Labels
  labelColor: "#64748b",
  labelFontSize: 12,
  labelFontWeight: "bold",
  labelTextTransform: "uppercase",
  labelFontFamily: "inherit",
  labelTextAlign: "left" as const,

  // 4. Botões
  btnFontFamily: "inherit",
  btnFontSize: 14,
  btnFontWeight: "bold",
  btnColor: "#ffffff",
  btnBackgroundColor: "#000000",
  btnBorderRadius: 8,
  btnBorderWidth: 0,
  btnBorderColor: "transparent",
  btnBorderStyle: "solid" as BorderStyle,
  btnShadow: "none" as const,
  btnPaddingTop: 12,
  btnPaddingBottom: 12,
  btnPaddingLeft: 24,  // Adicionado
  btnPaddingRight: 24, // Adicionado
  btnTextTransform: "none",

  // 5. Inputs (Campos de Texto) - EXPANDIDO PARA SUPORTE TOTAL
  inputBackgroundColor: "#ffffff",
  inputTextColor: "#000000",
  inputColor: "#000000",
  inputBorderColor: "#e2e8f0",
  inputBorderRadius: 8,
  inputBorderWidth: 1,
  inputBorderStyle: "solid" as BorderStyle,
  inputShadow: "none" as const,
  inputHeight: 40,
  inputFontSize: 14,         // Novo: Essencial para input
  inputFontFamily: "inherit", // Novo
  inputPaddingLeft: 12,      // Novo
  inputPaddingRight: 12,     // Novo

  // 6. Itens (Cronômetro, Cards)
  itemBackgroundColor: "transparent",
  itemColor: "inherit",
  itemBorderRadius: 8,
  itemBorderWidth: 1,
  itemBorderColor: "#000000",
  itemBorderStyle: "solid" as BorderStyle,
  itemShadow: "none" as const,
  itemFontSize: 20,         // Novo: Para números do cronômetro
  itemFontWeight: "bold",   // Novo
};

export const DEFAULT_PAGE_STYLES = {
  backgroundColor: "#ffffff",
  backgroundImage: "",
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
  styles: Partial<typeof DEFAULT_STYLES> & Record<string, any>; 
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