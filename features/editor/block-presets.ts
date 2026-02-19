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
  // ==========================================
  // CAPAS (HERO)
  // ==========================================
  HERO: [
    create(
      "HERO",
      "Vogue Luxury",
      {
        backgroundColor: "#000",
        minHeight: 700,
        titleColor: "#fff",
        titleFontFamily: "var(--font-cormorant)",
        titleFontSize: 72,
        titleTextTransform: "uppercase",
        titleLetterSpacing: 10,
        descColor: "#d4af37",
        descFontSize: 14,
        animation: "fade",
      },
      { title: "LUXURY", subtitle: "UMA EXPERIÊNCIA ÚNICA" },
    ),
    create(
      "HERO",
      "Minimal Zen",
      {
        backgroundColor: "#F5F5F0",
        minHeight: 600,
        titleColor: "#333",
        titleFontFamily: "var(--font-inter)",
        titleFontSize: 48,
        titleFontWeight: "200",
        descColor: "#8C8C7E",
        animation: "slide-up",
      },
      { title: "The Wedding", subtitle: "Ana & João | 2026" },
    ),
    create(
      "HERO",
      "Night Launch",
      {
        backgroundColor: "#050505",
        image:
          "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070",
        minHeight: 650,
        titleColor: "#00f2ff",
        titleFontSize: 64,
        titleFontWeight: "900",
        animation: "zoom-in",
      },
      { title: "PARTY\n2026", subtitle: "READY FOR THE FUTURE" },
    ),
  ],

  // ==========================================
  // TEXTOS
  // ==========================================
  TEXT: [
    create(
      "TEXT",
      "Script Poético",
      {
        backgroundColor: "#fff",
        textColor: "#444",
        textFontFamily: "var(--font-vibes)",
        textFontSize: 32,
        textAlign: "center",
        paddingTop: 60,
        paddingBottom: 60,
      },
      { text: "“Onde há amor, há vida.”" },
    ),
    create(
      "TEXT",
      "Clean Info",
      {
        backgroundColor: "#f8fafc",
        textColor: "#1e293b",
        textFontSize: 16,
        textAlign: "justify",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#e2e8f0",
        paddingLeft: 30,
        paddingRight: 30,
      },
      {
        text: "Pedimos a fineza de confirmar a presença até ao dia 15 de Maio. O traje sugerido é formal.",
      },
    ),
    create(
      "TEXT",
      "Brutalist Dark",
      {
        backgroundColor: "#000",
        textColor: "#fff",
        textFontFamily: "var(--font-cinzel)",
        textFontSize: 24,
        textAlign: "center",
        textTextTransform: "uppercase",
        textLetterSpacing: 4,
      },
      { text: "UMA NOITE INESQUECÍVEL." },
    ),
  ],

  // ==========================================
  // CONFIRMAÇÃO (RSVP)
  // ==========================================
  RSVP: [
    create(
      "RSVP",
      "Royal Card",
      {
        backgroundColor: "#fff",
        borderRadius: 30,
        shadow: "xl",
        titleFontSize: 32,
        titleFontFamily: "var(--font-cormorant)",
        btnBackgroundColor: "#1a1a1a",
        btnColor: "#fff",
        btnBorderRadius: 0,
      },
      {
        title: "Presença",
        description: "Sua presença é nosso maior presente.",
        buttonText: "Confirmar Agora",
      },
    ),
    create(
      "RSVP",
      "Neo-Brutal",
      {
        backgroundColor: "#fff",
        borderRadius: 0,
        borderWidth: 3,
        borderColor: "#000",
        titleFontWeight: "900",
        btnBackgroundColor: "#000",
        btnColor: "#fff",
      },
      {
        title: "RSVP.",
        description: "ENTRADA RESTRITA.",
        buttonText: "VALIDAR ACESSO",
      },
    ),
    create(
      "RSVP",
      "Soft Garden",
      {
        backgroundColor: "#fff5f5",
        borderRadius: 50,
        titleColor: "#9b2c2c",
        titleFontFamily: "var(--font-dancing)",
        btnBackgroundColor: "#f43f5e",
        btnBorderRadius: 99,
      },
      {
        title: "Vens connosco?",
        description: "Diz-nos se estarás presente.",
        buttonText: "Sim, eu vou!",
      },
    ),
  ],

  // ==========================================
  // MAPAS
  // ==========================================
  MAP: [
    create(
      "MAP",
      "Gold Estate",
      {
        backgroundColor: "#fff",
        borderRadius: 20,
        shadow: "xl",
        titleColor: "#1a1a1a",
        btnBackgroundColor: "#c5a059",
        btnColor: "#fff",
      },
      {
        venueName: "Palácio Real",
        address: "Avenida Principal, 100",
        buttonText: "Abrir Localização",
      },
    ),
    create(
      "MAP",
      "Cyber Map",
      {
        backgroundColor: "#111",
        titleColor: "#00f2ff",
        descColor: "#888",
        btnBackgroundColor: "#00f2ff",
        btnColor: "#000",
        borderRadius: 0,
      },
      {
        venueName: "The Night Club",
        address: "Distrito Industrial, Galpão 4",
        buttonText: "Ver Coordenadas",
      },
    ),
    create(
      "MAP",
      "Minimalist Paper",
      {
        backgroundColor: "#fafafa",
        btnBorderWidth: 1,
        btnBorderColor: "#000",
        btnColor: "#000",
        btnBackgroundColor: "transparent",
      },
      {
        venueName: "Casa do Jardim",
        address: "Rua das Flores, 12",
        buttonText: "Como Chegar",
      },
    ),
  ],

  // ==========================================
  // CRONOGRAMA (SCHEDULE)
  // ==========================================
  SCHEDULE: [
    create(
      "SCHEDULE",
      "Royal Timeline",
      {
        backgroundColor: "#fff",
        titleFontFamily: "var(--font-cormorant)",
        itemTitleFontWeight: "bold",
        timeColor: "#c5a059",
      },
      {
        title: "Momentos",
        items: [
          {
            time: "17:00",
            title: "Cerimónia",
            description: "Troca de alianças no jardim.",
          },
          {
            time: "19:00",
            title: "Jantar",
            description: "Banquete no salão principal.",
          },
        ],
      },
    ),
    create(
      "SCHEDULE",
      "Modern List",
      {
        backgroundColor: "#000",
        titleColor: "#fff",
        itemTitleColor: "#fff",
        timeColor: "#3b82f6",
      },
      {
        title: "THE LINEUP",
        items: [
          {
            time: "22:00",
            title: "Main Stage",
            description: "DJ Set Internacional",
          },
        ],
      },
    ),
    create(
      "SCHEDULE",
      "Soft Garden",
      {
        backgroundColor: "#fff9f9",
        titleFontFamily: "var(--font-dancing)",
        titleColor: "#9b2c2c",
        borderColor: "#feb2b2",
      },
      {
        title: "Nossa História",
        items: [
          { time: "11:30", title: "Brunch", description: "Encontro casual" },
        ],
      },
    ),
  ],

  // ==========================================
  // MENU
  // ==========================================
  MENU: [
    create(
      "MENU",
      "Gourmet Dark",
      {
        backgroundColor: "#111",
        titleColor: "#c5a059",
        itemTitleColor: "#fff",
        descColor: "#888",
      },
      {
        sections: [
          {
            title: "Degustação",
            items: [
              {
                name: "Trufa Negra",
                description: "Risotto de cogumelos selvagens",
              },
            ],
          },
        ],
      },
    ),
    create(
      "MENU",
      "Bistrô White",
      {
        backgroundColor: "#fff",
        titleFontFamily: "var(--font-playfair)",
        itemTitleColor: "#333",
        borderColor: "#eee",
        borderWidth: 1,
      },
      {
        sections: [
          {
            title: "Prato Principal",
            items: [{ name: "Salmão", description: "Com crosta de ervas" }],
          },
        ],
      },
    ),
    create(
      "MENU",
      "Kraft Vintage",
      {
        backgroundColor: "#f4ede4",
        titleFontFamily: "var(--font-dancing)",
        itemTitleColor: "#5d4037",
        descColor: "#8d6e63",
      },
      {
        sections: [
          {
            title: "Sobremesas",
            items: [{ name: "Mousse", description: "Chocolate belga 70%" }],
          },
        ],
      },
    ),
  ],

  // ==========================================
  // GALERIA (CAROUSEL)
  // ==========================================
  CAROUSEL: [
    create(
      "CAROUSEL",
      "Cinematic Shadow",
      { height: 500, shadow: "xl", borderRadius: 20 },
      {
        images: [
          {
            url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80",
          },
        ],
        effect: "fade",
        autoplay: true,
      },
    ),
    create(
      "CAROUSEL",
      "Edge-to-Edge",
      { height: 400, borderRadius: 0 },
      {
        images: [
          {
            url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80",
          },
        ],
        effect: "slide",
        autoplay: true,
      },
    ),
    create(
      "CAROUSEL",
      "Polaroid Frame",
      { backgroundColor: "#fff", paddingAll: 20, shadow: "md", height: 450 },
      {
        images: [
          {
            url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80",
          },
        ],
        effect: "slide",
      },
    ),
  ],

  // ==========================================
  // SAVE THE DATE (FUNCIONAL)
  // ==========================================
  SAVE_THE_DATE: [
    create(
      "SAVE_THE_DATE",
      "Editorial Vogue",
      {
        backgroundColor: "#fff",
        titleFontFamily: "var(--font-cormorant)",
        btnBackgroundColor: "#000",
        btnColor: "#fff",
      },
      {
        title: "SAVE THE DATE",
        date: "2026-05-20",
        dateDisplay: "20 DE MAIO DE 2026",
        buttonText: "ADICIONAR AO CALENDÁRIO",
      },
    ),
    create(
      "SAVE_THE_DATE",
      "Luxury Gold",
      {
        backgroundColor: "#0a0a0a",
        titleColor: "#d4af37",
        dateColor: "#fff",
        btnBackgroundColor: "#d4af37",
      },
      {
        title: "RESERVE A DATA",
        date: "2026-09-12",
        dateDisplay: "12 DE SETEMBRO",
        buttonText: "SALVAR DATA",
      },
    ),
    create(
      "SAVE_THE_DATE",
      "Minimal Mono",
      {
        backgroundColor: "#fff",
        titleFontWeight: "900",
        btnBorderWidth: 1,
        btnBorderColor: "#000",
        btnBackgroundColor: "transparent",
        btnColor: "#000",
      },
      {
        title: "20.10.26",
        date: "2026-10-20",
        dateDisplay: "OUTUBRO 20",
        buttonText: "RESERVAR",
      },
    ),
  ],

  // ==========================================
  // PEDIR MÚSICA (SONG_REQUEST)
  // ==========================================
  SONG_REQUEST: [
    create(
      "SONG_REQUEST",
      "Spotify Style",
      {
        backgroundColor: "#191414",
        titleColor: "#1DB954",
        inputBackgroundColor: "#282828",
        inputTextColor: "#fff",
        btnBackgroundColor: "#1DB954",
      },
      {
        title: "Playlist dos Noivos",
        placeholder: "Qual música não pode faltar?",
        buttonText: "Sugerir",
      },
    ),
    create(
      "SONG_REQUEST",
      "Elegant White",
      {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#eee",
        btnBackgroundColor: "#000",
      },
      {
        title: "Sugestões Musicais",
        placeholder: "Artista ou Música",
        buttonText: "Enviar ao DJ",
      },
    ),
    create(
      "SONG_REQUEST",
      "Soft Glass",
      {
        backgroundColor: "rgba(255,255,255,0.1)",
        backdropFilter: "blur(10px)",
        titleColor: "#fff",
        btnBackgroundColor: "#fff",
        btnColor: "#000",
      },
      {
        title: "Diz ao DJ",
        placeholder: "Sua música favorita...",
        buttonText: "Pedir",
      },
    ),
  ],

  // ==========================================
  // EXTRAS (ICON, DIVIDER, VIDEO, IMAGE)
  // ==========================================
  ICON: [
    create(
      "ICON",
      "Shine Gold",
      { color: "#d4af37", fontSize: 48 },
      { name: "Sparkles", repeat: 1 },
    ),
    create(
      "ICON",
      "Love Pulse",
      { color: "#f43f5e", fontSize: 32 },
      { name: "Heart", repeat: 3 },
    ),
    create(
      "ICON",
      "Modern Black",
      { color: "#000", fontSize: 24 },
      { name: "Star", repeat: 5 },
    ),
  ],

  DIVIDER: [
    create(
      "DIVIDER",
      "Chic Thin",
      { color: "#eee", height: 1 },
      { width: "80%", align: "center" },
    ),
    create(
      "DIVIDER",
      "Luxury Double",
      { color: "#d4af37", height: 3 },
      { width: "40%", align: "center" },
    ),
    create(
      "DIVIDER",
      "Modern Solid",
      { color: "#000", height: 8 },
      { width: "100%", align: "left" },
    ),
  ],

  IMAGE: [
    create(
      "IMAGE",
      "Shadow Frame",
      { borderRadius: 20, shadow: "xl" },
      {
        url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80",
        alt: "Casamento",
      },
    ),
    create(
      "IMAGE",
      "Minimal Edge",
      { borderRadius: 0, shadow: "none" },
      {
        url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80",
        alt: "Evento",
      },
    ),
    create(
      "IMAGE",
      "Soft Rounded",
      { borderRadius: 100, shadow: "md" },
      {
        url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80",
        alt: "Detalhe",
      },
    ),
  ],

  VIDEO: [
    create(
      "VIDEO",
      "Cinema Wide",
      { borderRadius: 0, shadow: "lg" },
      { url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ" },
    ),
    create(
      "VIDEO",
      "Rounded Box",
      { borderRadius: 24, shadow: "xl" },
      { url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ" },
    ),
    create(
      "VIDEO",
      "Glass Frame",
      {
        backgroundColor: "rgba(255,255,255,0.1)",
        paddingAll: 10,
        borderRadius: 16,
      },
      { url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ" },
    ),
  ],
  BUTTON: [
    create(
      "BUTTON",
      "Luxury Gold",
      {
        btnBackgroundColor: "#c5a059",
        btnColor: "#fff",
        btnBorderRadius: 0,
        btnFontFamily: "var(--font-cinzel)",
        btnLetterSpacing: 4,
        btnTextTransform: "uppercase",
        btnFontWeight: "bold",
      },
      { text: "Ver Lista de Presentes", url: "#" },
    ),

    create(
      "BUTTON",
      "Modern Glass",
      {
        btnBackgroundColor: "rgba(255,255,255,0.1)",
        btnColor: "#000",
        btnBorderRadius: 12,
        btnBorderWidth: 1,
        btnBorderColor: "#e2e8f0",
        backdropFilter: "blur(10px)",
        btnFontWeight: "600",
      },
      { text: "Confirmar Presença", url: "#" },
    ),

    create(
      "BUTTON",
      "Minimal Pill",
      {
        btnBackgroundColor: "#000",
        btnColor: "#fff",
        btnBorderRadius: 99,
        btnFontSize: 12,
        btnLetterSpacing: 2,
        btnTextTransform: "uppercase",
      },
      { text: "Explorar Localização", url: "#" },
    ),
  ],
  COUNTDOWN: [
    create(
      "COUNTDOWN",
      "Editorial Serif",
      {
        backgroundColor: "#fff",
        titleFontFamily: "var(--font-cormorant)",
        titleFontSize: 42,
        titleColor: "#1a1a1a",
        labelFontFamily: "var(--font-inter)",
        labelFontSize: 10,
        labelTextTransform: "uppercase",
        labelLetterSpacing: 2,
        itemBackgroundColor: "transparent",
        itemBorderWidth: 0,
      },
      {
        date: new Date(Date.now() + 864000000).toISOString(),
        label: "O grande dia chega em...",
      },
    ),

    create(
      "COUNTDOWN",
      "Digital Night",
      {
        backgroundColor: "#000",
        titleColor: "#00f2ff",
        titleFontFamily: "monospace",
        titleFontSize: 36,
        itemBackgroundColor: "#111",
        itemBorderRadius: 12,
        itemBorderWidth: 1,
        itemBorderColor: "#333",
        labelColor: "#666",
      },
      {
        date: new Date(Date.now() + 864000000).toISOString(),
        label: "SYSTEM_BOOT_IN:",
      },
    ),

    create(
      "COUNTDOWN",
      "Romantic Soft",
      {
        backgroundColor: "#fff5f5",
        titleColor: "#f43f5e",
        titleFontFamily: "var(--font-playfair)",
        itemBackgroundColor: "#fff",
        itemBorderRadius: 50,
        shadow: "sm",
        labelColor: "#fb7185",
        labelFontStyle: "italic",
      },
      {
        date: new Date(Date.now() + 864000000).toISOString(),
        label: "Contando os segundos...",
      },
    ),
  ],
  FAQ: [
    create(
      "FAQ",
      "Clean Minimal",
      {
        backgroundColor: "#fff",
        titleFontFamily: "var(--font-playfair)",
        titleFontSize: 28,
        itemTitleFontWeight: "bold",
        itemTitleColor: "#1a1a1a",
        descColor: "#666",
        descFontSize: 14,
      },
      {
        title: "Informações Úteis",
        items: [
          {
            q: "Onde estacionar?",
            a: "Temos um parque privativo gratuito no local do evento.",
          },
          {
            q: "Dress Code?",
            a: "Sugerimos traje formal (Fato/Gravata e Vestido Longo).",
          },
        ],
      },
    ),

    create(
      "FAQ",
      "Modern Cards",
      {
        backgroundColor: "#f8fafc",
        borderRadius: 24,
        itemTitleColor: "#2563eb",
        itemTitleTextTransform: "uppercase",
        itemTitleLetterSpacing: 1,
        descColor: "#475569",
      },
      {
        title: "Dúvidas Frequentes",
        items: [
          {
            q: "Crianças são bem-vindas?",
            a: "Sim! Teremos uma área dedicada com animadores para os mais pequenos.",
          },
        ],
      },
    ),

    create(
      "FAQ",
      "Luxury Dark",
      {
        backgroundColor: "#0a0a0a",
        titleColor: "#d4af37",
        itemTitleColor: "#fff",
        descColor: "#a1a1aa",
        itemTitleFontFamily: "var(--font-cinzel)",
      },
      {
        title: "Q&A",
        items: [
          {
            q: "Posso levar acompanhante?",
            a: "O convite é estritamente pessoal e intransmissível devido à lotação do espaço.",
          },
        ],
      },
    ),
  ],
};
