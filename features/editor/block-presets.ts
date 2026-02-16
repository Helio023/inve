import { BlockType, DEFAULT_STYLES } from "./types";

export type BlockPreset = {
  id: string;
  label: string;
  type: BlockType;
  content: any;
  styles: any;
};

const create = (
  type: BlockType,
  label: string,
  styles: any,
  content: any,
): BlockPreset => ({
  id: `${type}_${label.toLowerCase().replace(/\s/g, "_")}_${Math.random().toString(36).substr(2, 5)}`,
  label,
  type,
  content,
  styles: { ...DEFAULT_STYLES, ...styles },
});

export const BLOCK_PRESETS: Record<string, BlockPreset[]> = {
  HERO: [
    create(
      "HERO",
      "Editorial Vogue",
      {
        backgroundColor: "#000",
        minHeight: 700,
        titleColor: "#fff",
        titleFontFamily: "var(--font-cormorant)",
        titleFontSize: 72,
        titleTextTransform: "uppercase",
        descColor: "#d4af37",
        animation: "fade",
      },
      { title: "LUXURY", subtitle: "UMA EXPERIÊNCIA ÚNICA" },
    ),
    create(
      "HERO",
      "Minimalista",
      {
        backgroundColor: "#F5F5F0",
        minHeight: 500,
        titleColor: "#333",
        titleFontFamily: "var(--font-playfair)",
        titleFontSize: 48,
        descColor: "#8C8C7E",
        animation: "slide-up",
      },
      { title: "O Casamento", subtitle: "Ana & João" },
    ),
    create(
      "HERO",
      "Cyber Night",
      {
        backgroundColor: "#050505",
        image:
          "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070",
        minHeight: 600,
        titleColor: "#00f2ff",
        titleFontSize: 64,
        titleFontWeight: "900",
        animation: "zoom-in",
      },
      { title: "PARTY\n2026", subtitle: "THE FUTURE IS NOW" },
    ),
  ],

  TEXT: [
    create(
      "TEXT",
      "Citação Poética",
      {
        backgroundColor: "#fff",
        color: "#444",
        fontFamily: "var(--font-dancing)",
        fontSize: 32,
        textAlign: "center",
        paddingTop: 60,
        paddingBottom: 60,
      },
      { text: "“Onde há amor, há vida.”" },
    ),
    create(
      "TEXT",
      "Caixa Informativa",
      {
        backgroundColor: "#f8fafc",
        color: "#1e293b",
        fontSize: 16,
        textAlign: "justify",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#e2e8f0",
        paddingTop: 30,
        paddingBottom: 30,
        paddingLeft: 30,
        paddingRight: 30,
      },
      {
        text: "Pedimos a fineza de confirmar a presença até ao dia 15 de Maio.",
      },
    ),
    create(
      "TEXT",
      "Destaque Dark",
      {
        backgroundColor: "#000",
        color: "#fff",
        fontSize: 24,
        textAlign: "center",
        textTransform: "uppercase",
        letterSpacing: 4,
        paddingTop: 80,
        paddingBottom: 80,
      },
      { text: "Uma noite inesquecível." },
    ),
  ],

  RSVP: [
    create(
      "RSVP",
      "VIP Card",
      {
        backgroundColor: "#fff",
        borderRadius: 24,
        shadow: "xl",
        paddingTop: 40,
        paddingBottom: 40,
        titleFontSize: 32,
        btnBackgroundColor: "#000",
        btnColor: "#fff",
        btnBorderRadius: 12,
      },
      {
        title: "Confirmar Presença",
        description: "É uma honra tê-lo connosco.",
        buttonText: "Confirmar Agora",
      },
    ),
    create(
      "RSVP",
      "Neo Brutalist",
      {
        backgroundColor: "#fff",
        borderRadius: 0,
        borderWidth: 3,
        borderColor: "#000",
        titleFontWeight: "900",
        btnBackgroundColor: "#000",
      },
      {
        title: "RSVP.",
        description: "ENTRADA RESTRITA.",
        buttonText: "VALIDAR",
      },
    ),
    create(
      "RSVP",
      "Romantic Soft",
      {
        backgroundColor: "#fff5f5",
        borderRadius: 50,
        titleColor: "#9b2c2c",
        titleFontFamily: "var(--font-dancing)",
        btnBackgroundColor: "#f43f5e",
        btnBorderRadius: 99,
      },
      {
        title: "Vens celebrar?",
        description: "Diz-nos se vens!",
        buttonText: "Sim, eu vou!",
      },
    ),
  ],

  MAP: [
    create(
      "MAP",
      "Luxo Dourado",
      {
        backgroundColor: "#fff",
        borderRadius: 20,
        shadow: "xl",
        titleColor: "#1a1a1a",
        btnBackgroundColor: "#1a1a1a",
        btnColor: "#fff",
      },
      {
        venueName: "Palácio Real",
        address: "Avenida Central, 100",
        link: "",
        buttonText: "Abrir Localização",
      },
    ),
    create(
      "MAP",
      "Dark GPS",
      {
        backgroundColor: "#111",
        titleColor: "#00f2ff",
        descColor: "#888",
        btnBackgroundColor: "#00f2ff",
        btnColor: "#000",
      },
      {
        venueName: "The Club",
        address: "Rua Noturna, 50",
        link: "",
        buttonText: "Ver no Mapa",
      },
    ),
    create(
      "MAP",
      "Minimal Clean",
      {
        backgroundColor: "#fff",
        btnBorderWidth: 1,
        btnBorderColor: "#000",
        btnColor: "#000",
      },
      {
        venueName: "Jardim Oliveiras",
        address: "Rua do Mar, 20",
        link: "",
        buttonText: "Como Chegar",
      },
    ),
  ],

  FAQ: [
    create(
      "FAQ",
      "Clean List",
      { backgroundColor: "#fff", titleFontSize: 18, descColor: "#666" },
      {
        items: [
          { q: "Tem estacionamento?", a: "Sim, gratuito no local." },
          { q: "Dress Code?", a: "Formal / Gala." },
        ],
      },
    ),
    create(
      "FAQ",
      "Dark Accordion",
      {
        backgroundColor: "#111",
        titleColor: "#fff",
        descColor: "#aaa",
        titleBorderBottomWidth: 1,
      },
      { items: [{ q: "Crianças?", a: "Apenas maiores de 12 anos." }] },
    ),
    create(
      "FAQ",
      "Soft Cards",
      { backgroundColor: "#fdf2f8", titleColor: "#be185d", borderRadius: 16 },
      {
        items: [
          { q: "Presentes?", a: "A vossa presença é o melhor presente." },
        ],
      },
    ),
  ],

  DRESS_CODE: [
    create(
      "DRESS_CODE",
      "Classic Formal",
      { backgroundColor: "#fff", titleFontSize: 28 },
      { title: "Dress Code", description: "Fatos escuros e vestidos longos." },
    ),
    create(
      "DRESS_CODE",
      "Beach Casual",
      { backgroundColor: "#f0f9ff", titleColor: "#0369a1" },
      {
        title: "Traje de Praia",
        description: "Roupas leves e sapatos confortáveis.",
      },
    ),
    create(
      "DRESS_CODE",
      "Black Tie",
      { backgroundColor: "#000", titleColor: "#fff", descColor: "#ccc" },
      { title: "Black Tie", description: "Smokings e vestidos de gala." },
    ),
  ],

  BUTTON: [
    create(
      "BUTTON",
      "Luxury Pill",
      {
        btnBackgroundColor: "#c5a059",
        btnColor: "#fff",
        btnBorderRadius: 99,
        btnFontWeight: "bold",
      },
      { text: "Ver Lista de Casamento", url: "#" },
    ),
    create(
      "BUTTON",
      "Brutalist Box",
      {
        btnBackgroundColor: "#000",
        btnColor: "#fff",
        btnBorderRadius: 0,
        btnTextTransform: "uppercase",
      },
      { text: "Confirmar Agora", url: "#" },
    ),
    create(
      "BUTTON",
      "Glass Blur",
      {
        btnBackgroundColor: "rgba(255,255,255,0.2)",
        btnColor: "#000",
        btnBorderWidth: 1,
        btnBorderColor: "#ccc",
        backdropFilter: "blur(10px)",
      },
      { text: "Saber Mais", url: "#" },
    ),
  ],
};
