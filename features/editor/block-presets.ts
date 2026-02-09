import { BlockType, DEFAULT_STYLES } from "./types";

export type BlockPreset = {
  id: string;
  label: string;
  type: BlockType;
  content: any;
  styles: any;
  preview?: string;
};

const create = (
  type: BlockType,
  label: string,
  styles: any,
  content: any,
  preview: string = "",
): BlockPreset => ({
  id: `${type}_${label.toLowerCase().replace(/\s/g, "_")}_${Math.random().toString(36).substr(2, 5)}`,
  label,
  type,
  content,
  styles: { ...DEFAULT_STYLES, ...styles },
  preview,
});

// --- IMAGENS ---
const IMG_WEDDING_BW = "https://images.unsplash.com/photo-1511285560982-1351cdeb9821?q=80&w=2574&auto=format&fit=crop";
const IMG_FLORAL = "https://images.unsplash.com/photo-1507646227500-4d389b0012be?q=80&w=2600&auto=format&fit=crop";
const IMG_MINIMAL_VASE = "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=1000&auto=format&fit=crop";
const IMG_FOOD = "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1000&auto=format&fit=crop";
const IMG_PARTY = "https://images.unsplash.com/photo-1519671482538-518b5c2cd43b?q=80&w=1000&auto=format&fit=crop";
const IMG_ABSTRACT = "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop";

export const BLOCK_PRESETS: Record<string, BlockPreset[]> = {
  
  // CAPAS (HERO) - Altura padronizada com minHeight: 600
  HERO: [
    create("HERO", "Cinemático Dark", {
      backgroundColor: "#000000",
      backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 100%), url(${IMG_WEDDING_BW})`,
      backgroundSize: "cover",
      height: "auto", 
      minHeight: 600, // Altura Fixa
      justifyContent: "flex-end", // Alinha em baixo
      paddingBottom: 80,
      paddingLeft: 30,
      paddingRight: 30,
      textAlign: "left",
      titleColor: "#ffffff",
      titleFontFamily: "Playfair Display, serif",
      titleFontSize: 48,
      titleLineHeight: 1,
      descColor: "#d4d4d4",
      descFontSize: 14,
      descLetterSpacing: 4,
      descTextTransform: "uppercase",
      descMarginTop: 16
    }, {
      title: "Ana & Pedro",
      subtitle: "20 OUT 2026 • LISBOA"
    }, "Fundo total escuro com texto no rodapé"),

    create("HERO", "Convite Clássico", {
      backgroundColor: "#FDFBF7",
      paddingTop: 80,
      paddingBottom: 80,
      textAlign: "center",
      borderWidth: 12, 
      borderColor: "#FDFBF7",
      titleColor: "#4a4a4a",
      titleFontFamily: "Montserrat, sans-serif",
      titleFontSize: 28,
      titleFontWeight: "300",
      titleLetterSpacing: 6,
      titleTextTransform: "uppercase",
      descColor: "#bcaaa4",
      descFontFamily: "Dancing Script, cursive",
      descFontSize: 32,
      descMarginTop: 10,
      height: "auto", 
      minHeight: 600,
    }, {
      title: "CASAMENTO DE",
      subtitle: "Mariana & Lucas"
    }, "Fundo creme, borda limpa"),

    create("HERO", "Editorial Moda", {
      backgroundColor: "#ffffff",
      backgroundImage: `url(${IMG_MINIMAL_VASE})`,
      backgroundSize: "cover",
      height: "auto", 
      minHeight: 600,
      titleColor: "#000000",
      titleFontSize: 52,
      titleFontWeight: "900",
      titleLineHeight: 0.9,
      titleTextTransform: "uppercase",
      titleTextAlign: "center",
      justifyContent: "center",
      alignItems: "center"
    }, {
      title: "SAVE\nTHE\nDATE",
      subtitle: ""
    }, "Estilo poster de revista"),
    
    create("HERO", "Gradiente Moderno", {
      backgroundImage: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
      paddingTop: 100,
      paddingBottom: 100,
      textAlign: "center",
      titleColor: "#1e293b",
      titleFontSize: 40,
      titleFontFamily: "serif",
      titleFontStyle: "italic",
      descColor: "#64748b",
      descFontSize: 12,
      descLetterSpacing: 2,
      descTextTransform: "uppercase",
      descMarginTop: 20,
      descBorderTopWidth: 1, 
      descPaddingTop: 20,
      descBorderColor: "#cbd5e1",
      descWidth: "fit-content",
      alignItems: "center",
      justifyContent: "center",
      height: "auto", 
      minHeight: 600,
    }, {
      title: "Celebrando o Amor",
      subtitle: "25 . 05 . 2026"
    }, "Clean com linha decorativa"),
  ],

  // TEXTO
  TEXT: [
    create("TEXT", "Parágrafo Leitura", {
      color: "#334155",
      textAlign: "left",
      lineHeight: 1.8,
      fontSize: 16,
      paddingTop: 20,
      paddingBottom: 20,
      paddingLeft: 24,
      paddingRight: 24,
      backgroundColor: "#ffffff",
    }, { text: "Estamos muito felizes em compartilhar este momento único com vocês." }, "Texto alinhado à esquerda"),

    create("TEXT", "Citação Central", {
      backgroundColor: "#F8FAFC",
      color: "#475569",
      textAlign: "center",
      fontStyle: "italic",
      fontFamily: "Playfair Display, serif",
      fontSize: 22,
      lineHeight: 1.5,
      paddingTop: 60,
      paddingBottom: 60,
      paddingLeft: 40,
      paddingRight: 40,
      borderRadius: 8,
      marginLeft: 20,
      marginRight: 20
    }, { text: "“O amor é a única coisa que cresce à medida que se reparte.”" }, "Box cinza claro"),
  ],

  // IMAGEM
  IMAGE: [
    create("IMAGE", "Arco (Arch)", { width: "100%", height: "450px", borderRadius: "50% 50% 0 0", objectFit: "cover", marginTop: 30 }, { url: IMG_FLORAL }, "Topo arredondado"),
    create("IMAGE", "Círculo Perfeito", { width: "240px", height: "240px", aspectRatio: "1/1", borderRadius: 9999, objectFit: "cover", marginTop: 30, marginBottom: 30, borderWidth: 6, borderColor: "#ffffff", shadow: "lg", alignSelf: "center" }, { url: IMG_MINIMAL_VASE }, "Avatar redondo"),
    create("IMAGE", "Full Bleed", { width: "100%", height: "400px", objectFit: "cover", borderRadius: 0, marginTop: 0, marginBottom: 0 }, { url: IMG_ABSTRACT }, "Largura total"),
  ],

  // MENU
  MENU: [
    create("MENU", "Bistrô Clássico", { backgroundColor: "#FDFBF7", paddingTop: 40, paddingBottom: 40, titleFontFamily: "Playfair Display, serif", titleFontSize: 24, titleColor: "#d97706", titleTextAlign: "center", titleTextTransform: "none", titleMarginBottom: 20, color: "#4b5563", textAlign: "left" }, { sections: [{ title: "Entradas", items: [{ name: "Carpaccio", description: "...", price: "" }] }] }, "Estilo restaurante"),
  ],

  // COUNTDOWN
  COUNTDOWN: [
    create("COUNTDOWN", "Glassmorphism", { paddingTop: 50, paddingBottom: 50, backgroundImage: `url(${IMG_ABSTRACT})`, backgroundSize: "cover", itemBackgroundColor: "rgba(255, 255, 255, 0.2)", itemColor: "#ffffff", itemBorderRadius: 12, itemBorderWidth: 1, itemBorderColor: "rgba(255, 255, 255, 0.3)", itemShadow: "0 4px 30px rgba(0, 0, 0, 0.1)", titleFontSize: 24, titleFontWeight: "bold", labelColor: "#e2e8f0", labelFontSize: 10, labelFontWeight: "600" }, { date: new Date(Date.now() + 864000000).toISOString() }, "Fundo vidro"),
  ],

  // RSVP
  RSVP: [
    create("RSVP", "Card Shadow", { backgroundColor: "#ffffff", width: "90%", marginTop: 40, marginBottom: 40, paddingTop: 40, paddingBottom: 40, paddingLeft: 24, paddingRight: 24, borderRadius: 24, shadow: "xl", alignSelf: "center", titleFontSize: 24, titleColor: "#1e293b", titleFontWeight: "bold", btnBackgroundColor: "#0f172a", btnColor: "#ffffff", btnBorderRadius: 50, btnHeight: 50, btnFontWeight: "600", inputBackgroundColor: "#f1f5f9", inputBorderWidth: 0, inputBorderRadius: 12, inputHeight: 48 }, { title: "Confirme sua Presença", description: "Por favor, responda até o dia 20.", buttonText: "Confirmar Agora" }, "Card branco"),
  ],

  // SCHEDULE
  SCHEDULE: [
    create("SCHEDULE", "Linha do Tempo Clean", { backgroundColor: "transparent", paddingTop: 40, paddingBottom: 40, titleFontSize: 28, titleFontFamily: "serif", titleTextAlign: "center", color: "#475569", borderColor: "#e2e8f0" }, { title: "Programação do Dia", items: [{ time: "16:00", activity: "Cerimônia" }] }, "Timeline vertical"),
  ],

  // MAPA
  MAP: [
    create("MAP", "Card Flutuante", { backgroundColor: "#ffffff", borderRadius: 16, shadow: "xl", titleFontSize: 20, titleFontWeight: "bold", titleColor: "#1e293b", color: "#64748b", btnBackgroundColor: "#0f172a", btnColor: "#ffffff", btnBorderRadius: 8 }, { venueName: "Local", address: "Endereço", time: "16:30", buttonText: "Como Chegar", link: "" }, "Card sobreposto"),
  ]
};