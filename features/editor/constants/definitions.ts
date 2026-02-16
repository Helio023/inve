import {
  Layout,
  Type,
  AlignLeft,
  MousePointerClick,
  BoxSelect,
  Image,
  Video,
  MapPin,
  Clock,
  Utensils,
  Star,
  Hash,
  Columns,
  Minus,
  HelpCircle,
  Calendar,
  Shirt,
  Music,
  PlayCircle,
} from "lucide-react";
import { BlockType } from "../types";

export type BlockCategory = "essencial" | "midia" | "evento" | "interativo";

export type StyleControl =
  | "typography"
  | "colors"
  | "spacing"
  | "decoration"
  | "size"
  | "animation";

export interface LayerDefinition {
  id: string;
  label: string;
  icon: any;
  controls: StyleControl[];
}

export interface BlockDefinition {
  label: string;
  icon: any;
  color: string;
  category: BlockCategory;
  layers: LayerDefinition[];
  supportsChildren?: boolean;
}

export const BLOCK_DEFINITIONS: Record<BlockType, BlockDefinition> = {
  HERO: {
    label: "Capa",
    icon: Layout,
    color: "rose",
    category: "essencial",
    layers: [
      {
        id: "container",
        label: "Fundo",
        icon: Layout,
        controls: ["colors", "spacing", "decoration", "size", "animation"],
      },
      {
        id: "title",
        label: "Título",
        icon: Type,
        controls: ["typography", "colors", "spacing"],
      },
      {
        id: "desc",
        label: "Subtítulo",
        icon: AlignLeft,
        controls: ["typography", "colors", "spacing"],
      },
    ],
  },
  TEXT: {
    label: "Texto",
    icon: Type,
    color: "blue",
    category: "essencial",
    layers: [
      {
        id: "container",
        label: "Bloco",
        icon: Layout,
        controls: ["colors", "spacing", "decoration", "size", "animation"],
      },
      {
        id: "text",
        label: "Texto",
        icon: Type,
        controls: ["typography", "colors"],
      },
    ],
  },
  IMAGE: {
    label: "Imagem",
    icon: Image,
    color: "emerald",
    category: "midia",
    layers: [
      {
        id: "container",
        label: "Estilo",
        icon: Layout,
        controls: ["spacing", "decoration", "size", "animation"],
      },
    ],
  },
  VIDEO: {
    label: "Vídeo",
    icon: Video,
    color: "red",
    category: "midia",
    layers: [
      {
        id: "container",
        label: "Moldura",
        icon: PlayCircle,
        controls: ["spacing", "decoration", "size", "animation"],
      },
    ],
  },
  MAP: {
    label: "Mapa/Local",
    icon: MapPin,
    color: "orange",
    category: "evento",
    layers: [
      {
        id: "container",
        label: "Fundo",
        icon: Layout,
        controls: ["colors", "spacing", "decoration", "size", "animation"],
      },
      {
        id: "title",
        label: "Nome Local",
        icon: Type,
        controls: ["typography", "colors"],
      },
      {
        id: "desc",
        label: "Endereço",
        icon: AlignLeft,
        controls: ["typography", "colors"],
      },
       { id: "btn", label: "Botão GPS", icon: MousePointerClick, controls: ["typography", "colors", "decoration", "size"] },
    ],
  },
  COUNTDOWN: {
    label: "Contagem",
    icon: Clock,
    color: "indigo",
    category: "evento",
    layers: [
      {
        id: "container",
        label: "Geral",
        icon: Layout,
        controls: ["colors", "spacing", "decoration", "size", "animation"],
      },
      {
        id: "item",
        label: "Caixas",
        icon: BoxSelect,
        controls: ["colors", "decoration"],
      },
      {
        id: "title",
        label: "Números",
        icon: Hash,
        controls: ["typography", "colors"],
      },
      {
        id: "label",
        label: "Legendas",
        icon: AlignLeft,
        controls: ["typography", "colors"],
      },
    ],
  },
  RSVP: {
    label: "Presença",
    icon: Star,
    color: "purple",
    category: "interativo",
    layers: [
      {
        id: "container",
        label: "Card",
        icon: Layout,
        controls: ["colors", "spacing", "decoration", "size", "animation"],
      },
      {
        id: "title",
        label: "Título",
        icon: Type,
        controls: ["typography", "colors"],
      },
      {
        id: "desc",
        label: "Descrição",
        icon: AlignLeft,
        controls: ["typography", "colors"],
      },
      {
        id: "label",
        label: "Etiquetas",
        icon: Star,
        controls: ["typography", "colors"],
      },
      {
        id: "input",
        label: "Campos",
        icon: BoxSelect,
        controls: ["typography", "colors", "decoration"],
      },
      {
        id: "btn",
        label: "Botão Enviar",
        icon: MousePointerClick,
        controls: ["typography", "colors", "decoration", "size"],
      },
    ],
  },
  SCHEDULE: {
    label: "Cronograma",
    icon: Clock,
    color: "amber",
    category: "evento",
    layers: [
      {
        id: "container",
        label: "Fundo",
        icon: Layout,
        controls: ["colors", "spacing", "decoration", "size", "animation"],
      },
      {
        id: "title",
        label: "Título",
        icon: Type,
        controls: ["typography", "colors"],
      },
      {
        id: "time",
        label: "Horário",
        icon: Clock,
        controls: ["typography", "colors"],
      },
      {
        id: "itemTitle",
        label: "Atividade",
        icon: Type,
        controls: ["typography", "colors"],
      },
      {
        id: "desc",
        label: "Detalhes",
        icon: AlignLeft,
        controls: ["typography", "colors"],
      },
    ],
  },
  MENU: {
    label: "Menu",
    icon: Utensils,
    color: "yellow",
    category: "evento",
    layers: [
      {
        id: "container",
        label: "Fundo",
        icon: Layout,
        controls: ["colors", "spacing", "decoration", "size", "animation"],
      },
      {
        id: "title",
        label: "Seções",
        icon: Type,
        controls: ["typography", "colors"],
      },
      {
        id: "itemTitle",
        label: "Pratos",
        icon: Type,
        controls: ["typography", "colors"],
      },
      {
        id: "desc",
        label: "Ingredientes",
        icon: AlignLeft,
        controls: ["typography", "colors"],
      },
    ],
  },
  CAROUSEL: {
    label: "Galeria",
    icon: Image,
    color: "violet",
    category: "midia",
    layers: [
      {
        id: "container",
        label: "Estilo",
        icon: Layout,
        controls: ["spacing", "decoration", "size", "animation"],
      },
    ],
  },
  BUTTON: {
    label: "Botão",
    icon: MousePointerClick,
    color: "cyan",
    category: "essencial",
    layers: [
      {
        id: "container",
        label: "Posicionamento",
        icon: Layout,
        controls: ["spacing", "size", "animation"],
      },
      {
        id: "btn",
        label: "Botão",
        icon: MousePointerClick,
        controls: ["typography", "colors", "decoration", "spacing", "size"],
      },
    ],
  },
  COLUMNS: {
    label: "Colunas",
    icon: Columns,
    color: "slate",
    category: "essencial",
    layers: [
      {
        id: "container",
        label: "Grid",
        icon: Layout,
        controls: ["spacing", "size", "animation"],
      },
    ],
    supportsChildren: true,
  },
  SONG_REQUEST: {
    label: "Música",
    icon: Music,
    color: "pink",
    category: "interativo",
    layers: [
      { id: "container", label: "Geral", icon: Layout, controls: ["colors", "spacing", "decoration", "size", "animation"] },
      { id: "title", label: "Título", icon: Type, controls: ["typography", "colors"] },
      { id: "input", label: "Campo", icon: BoxSelect, controls: ["colors", "typography", "decoration"] },
      { id: "btn", label: "Botão", icon: MousePointerClick, controls: ["colors", "typography", "decoration", "size"] },
    ],
  },
  ICON: {
    label: "Ícone",
    icon: Star,
    color: "yellow",
    category: "midia",
    layers: [
      {
        id: "container",
        label: "Estilo",
        icon: Star,
        controls: ["colors", "spacing", "typography", "size", "animation"],
      },
    ],
  },
  DIVIDER: {
    label: "Divisor",
    icon: Minus,
    color: "slate",
    category: "essencial",
    layers: [
      {
        id: "container",
        label: "Linha",
        icon: Layout,
        controls: ["colors", "spacing", "size"],
      },
    ],
  },
  SAVE_THE_DATE: {
    label: "Save Date",
    icon: Calendar,
    color: "indigo",
    category: "evento",
    layers: [
      {
        id: "container",
        label: "Fundo",
        icon: Layout,
        controls: ["colors", "spacing", "decoration", "size", "animation"],
      },
      {
        id: "title",
        label: "Destaque",
        icon: Type,
        controls: ["typography", "colors"],
      },
      { id: "btn", label: "Botão", icon: MousePointerClick, controls: ["typography", "colors", "decoration", "size"] },
    ],
  },
  DRESS_CODE: {
    label: "Vestuário",
    icon: Shirt,
    color: "teal",
    category: "evento",
    layers: [
      {
        id: "container",
        label: "Fundo",
        icon: Layout,
        controls: ["colors", "spacing", "decoration", "size", "animation"],
      },
      {
        id: "title",
        label: "Título",
        icon: Type,
        controls: ["typography", "colors"],
      },
      {
        id: "desc",
        label: "Descrição",
        icon: AlignLeft,
        controls: ["typography", "colors"],
      },
    ],
  },
  FAQ: {
    label: "FAQ",
    icon: HelpCircle,
    color: "violet",
    category: "interativo",
    layers: [
      {
        id: "container",
        label: "Fundo",
        icon: Layout,
        controls: ["colors", "spacing", "decoration", "size", "animation"],
      },
      {
        id: "title",
        label: "Pergunta",
        icon: Type,
        controls: ["typography", "colors"],
      },
      {
        id: "desc",
        label: "Resposta",
        icon: AlignLeft,
        controls: ["typography", "colors"],
      },
    ],
  },
};
