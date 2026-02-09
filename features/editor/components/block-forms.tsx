"use client";

import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/image-upload";
import { cn } from "@/lib/utils";

// Formulários Específicos
import { ScheduleForm } from "./forms/schedule-form";
import { MenuForm } from "./forms/menu-form";
import { CarouselForm } from "./forms/carousel-form";

// Painéis de Estilo
import {
  TypographyControls,
  ColorControls,
  BoxModelControls,
  DecorationControls,
  AnimationControls,
  SizeControls,
} from "./panels/style-controls";

// Ícones
import {
  Type,
  Layout,
  MousePointerClick,
  TextCursorInput,
  AlignLeft,
  BoxSelect,
  Image as ImageIcon,
  Minus,
  Layers,
  Video,
  Map as MapIcon,
  Columns,
} from "lucide-react";
import { DEFAULT_STYLES } from "../types";

const LABEL_MAP: Record<string, string> = {
  HERO: "Capa",
  TEXT: "Texto",
  IMAGE: "Imagem",
  VIDEO: "Vídeo",
  MAP: "Mapa",
  COUNTDOWN: "Cronómetro",
  RSVP: "Confirmação",
  COLUMNS: "Colunas",
  SCHEDULE: "Programa",
  CAROUSEL: "Carrossel",
  DIVIDER: "Divisor",
  MENU: "Menu",
};

// --- TIPO DE CONFIGURAÇÃO DA CAMADA ---
type LayerConfig = {
  typography?: boolean;
  colors?: boolean;
  spacing?: boolean;
  decoration?: boolean;
  size?: boolean;
  animation?: boolean;
};

type LayerDef = {
  id: string;
  label: string;
  icon: any;
  config: LayerConfig;
};

// --- PRESETS DE CONFIGURAÇÃO (CORRIGIDOS) ---

// 1. Texto (Sem animação interna, herda do container se precisar)
const CONFIG_TEXT: LayerConfig = {
  typography: true,
  colors: true,
  spacing: true,
  decoration: false,
  size: false,
};

// 2. Container (Box principal: Tem TUDO, inclusive animação)
const CONFIG_CONTAINER: LayerConfig = {
  typography: false,
  colors: true,
  spacing: true,
  decoration: true,
  size: true,
  animation: true,
};

// 3. Media (Imagem/Vídeo: Igual container, mas focado em mídia)
// *** CORREÇÃO AQUI: Adicionado animation: true ***
const CONFIG_MEDIA: LayerConfig = {
  typography: false,
  colors: true,
  spacing: true,
  decoration: true,
  size: true,
  animation: true,
};

// 4. Botões e Inputs
const CONFIG_BUTTON: LayerConfig = {
  typography: true,
  colors: true,
  spacing: true,
  decoration: true,
  size: true,
};
const CONFIG_INPUT: LayerConfig = {
  typography: true,
  colors: true,
  spacing: true,
  decoration: true,
  size: true,
};

// 5. Divisor e Mapa
const CONFIG_MAP: LayerConfig = {
  typography: true,
  colors: true,
  spacing: true,
  decoration: true,
  size: true,
  animation: true,
};
const CONFIG_DIVIDER: LayerConfig = {
  typography: false,
  colors: true,
  spacing: true,
  decoration: true,
  size: true,
  animation: true,
};

// --- DEFINIÇÃO DAS CAMADAS INTELIGENTES ---
const BLOCK_LAYERS: Record<string, LayerDef[]> = {
  HERO: [
    {
      id: "container",
      label: "Fundo Geral",
      icon: Layout,
      config: CONFIG_CONTAINER,
    },
    { id: "title", label: "Título", icon: Type, config: CONFIG_TEXT },
    { id: "desc", label: "Subtítulo", icon: AlignLeft, config: CONFIG_TEXT },
  ],
  TEXT: [
    {
      id: "container",
      label: "Container",
      icon: Layout,
      config: { ...CONFIG_CONTAINER, typography: true },
    },
  ],
  RSVP: [
    {
      id: "container",
      label: "Box Principal",
      icon: Layout,
      config: CONFIG_CONTAINER,
    },
    { id: "title", label: "Título", icon: Type, config: CONFIG_TEXT },
    {
      id: "label",
      label: "Etiquetas",
      icon: TextCursorInput,
      config: CONFIG_TEXT,
    },
    {
      id: "input",
      label: "Campos Input",
      icon: BoxSelect,
      config: CONFIG_INPUT,
    },
    {
      id: "btn",
      label: "Botão Enviar",
      icon: MousePointerClick,
      config: CONFIG_BUTTON,
    },
  ],
  COUNTDOWN: [
    { id: "container", label: "Geral", icon: Layout, config: CONFIG_CONTAINER },
    {
      id: "item",
      label: "Caixas Números",
      icon: BoxSelect,
      config: { ...CONFIG_CONTAINER, typography: true },
    },
    { id: "title", label: "Números (Texto)", icon: Type, config: CONFIG_TEXT },
    { id: "label", label: "Legendas", icon: AlignLeft, config: CONFIG_TEXT },
  ],
  MENU: [
    { id: "container", label: "Geral", icon: Layout, config: CONFIG_CONTAINER },
    { id: "title", label: "Títulos Secção", icon: Type, config: CONFIG_TEXT },
    { id: "desc", label: "Descrições", icon: AlignLeft, config: CONFIG_TEXT },
  ],
  SCHEDULE: [
    { id: "container", label: "Geral", icon: Layout, config: CONFIG_CONTAINER },
    { id: "title", label: "Título Principal", icon: Type, config: CONFIG_TEXT },
    { id: "desc", label: "Descrições", icon: AlignLeft, config: CONFIG_TEXT },
  ],

  // *** CORREÇÃO: Agora usam CONFIG_MEDIA (com animação) ***
  IMAGE: [
    { id: "container", label: "Imagem", icon: ImageIcon, config: CONFIG_MEDIA },
  ],
  VIDEO: [
    { id: "container", label: "Vídeo", icon: Video, config: CONFIG_MEDIA },
  ],
  CAROUSEL: [
    {
      id: "container",
      label: "Carrossel",
      icon: ImageIcon,
      config: CONFIG_MEDIA,
    },
  ],

 MAP: [
    { id: "container", label: "Fundo do Card", icon: Layout, config: CONFIG_CONTAINER },
    { id: "title", label: "Nome do Local", icon: Type, config: CONFIG_TEXT },
    { id: "desc", label: "Endereço", icon: AlignLeft, config: CONFIG_TEXT },
    { id: "btn", label: "Botão GPS", icon: MousePointerClick, config: CONFIG_BUTTON },
  ],
  DIVIDER: [
    { id: "container", label: "Linha", icon: Minus, config: CONFIG_DIVIDER },
  ],
  COLUMNS: [
    {
      id: "container",
      label: "Colunas",
      icon: Columns,
      config: CONFIG_CONTAINER,
    },
  ],
};

export const BlockSettingsManager = ({
  block,
  updateBlock,
  updateStyles,
}: any) => {
  const [activeTab, setActiveTab] = useState("content");
  const [activeLayerId, setActiveLayerId] = useState<string>("container");

  // Reseta layer ao mudar de bloco
  useMemo(() => {
    setActiveLayerId("container");
  }, [block.id]);

  const handleContentChange = (newContent: any) => {
    updateBlock(block.id, newContent);
  };

  const layers = BLOCK_LAYERS[block.type] || [
    { id: "container", label: "Geral", icon: Layout, config: CONFIG_CONTAINER },
  ];
  const blockLabel = LABEL_MAP[block.type] || block.type;

  const activeLayerConfig =
    layers.find((l) => l.id === activeLayerId)?.config || CONFIG_CONTAINER;

  // --- LÓGICA DE ESCRITA ---
  const handleStyleChange = (newStyles: any) => {
    if (activeLayerId === "container") {
      updateStyles(block.id, newStyles);
      return;
    }

    const prefixedStyles: any = {};
    Object.keys(newStyles).forEach((key) => {
      const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
      const prefixedKey = `${activeLayerId}${capitalizedKey}`;
      prefixedStyles[prefixedKey] = newStyles[key];
    });

    updateStyles(block.id, prefixedStyles);
  };

  // --- LÓGICA DE LEITURA ---
  const currentLayerStyles = useMemo(() => {
    const s = { ...DEFAULT_STYLES, ...block.styles };

    if (activeLayerId === "container") return s;

    const mapped: any = {};
    const uiProps = [
      "color",
      "backgroundColor",
      "borderColor",
      "borderRadius",
      "borderWidth",
      "borderStyle",
      "fontSize",
      "fontWeight",
      "fontFamily",
      "textAlign",
      "lineHeight",
      "letterSpacing",
      "textTransform",
      "paddingTop",
      "paddingBottom",
      "paddingLeft",
      "paddingRight",
      "marginTop",
      "marginBottom",
      "marginLeft",
      "marginRight",
      "width",
      "height",
      "shadow",
      "objectFit",
    ];

    uiProps.forEach((prop) => {
      const capitalizedKey = prop.charAt(0).toUpperCase() + prop.slice(1);
      const prefixedKey = `${activeLayerId}${capitalizedKey}`;

      if (s[prefixedKey] !== undefined) {
        mapped[prop] = s[prefixedKey];
      }
    });

    return mapped;
  }, [block.styles, activeLayerId]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6 h-10 p-1 bg-slate-100 rounded-lg">
        <TabsTrigger
          value="content"
          className="text-[10px] font-bold uppercase tracking-wider"
        >
          Conteúdo
        </TabsTrigger>
        <TabsTrigger
          value="style"
          className="text-[10px] font-bold uppercase tracking-wider"
        >
          Design
        </TabsTrigger>
      </TabsList>

      {/* ABA CONTEÚDO */}
      <TabsContent
        value="content"
        className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300"
      >
        <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider border-b pb-2">
          Dados do {blockLabel}
        </h4>
        {renderContentForm(block, handleContentChange)}
      </TabsContent>

      {/* ABA DESIGN */}
      <TabsContent
        value="style"
        className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300"
      >
        {/* SELETOR DE CAMADAS */}
        {layers.length > 1 && (
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 mb-2 px-1">
              <Layers className="w-3 h-3 text-slate-400" />
              <Label className="text-[9px] font-bold uppercase text-slate-500 tracking-wider">
                Editar Camada
              </Label>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {layers.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setActiveLayerId(l.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all border",
                    activeLayerId === l.id
                      ? "bg-white border-blue-200 text-blue-700 shadow-sm ring-1 ring-blue-100"
                      : "bg-transparent border-transparent text-slate-500 hover:bg-slate-200 hover:text-slate-800",
                  )}
                >
                  <l.icon className="w-3.5 h-3.5" />
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-1">
          {activeLayerConfig.colors && (
            <ColorControls
              styles={currentLayerStyles}
              onUpdate={handleStyleChange}
              showTextColor={
                activeLayerId !== "container" && activeLayerId !== "image"
              }
            />
          )}

          {activeLayerConfig.typography && (
            <TypographyControls
              styles={currentLayerStyles}
              onUpdate={handleStyleChange}
            />
          )}

          {activeLayerConfig.spacing && (
            <BoxModelControls
              styles={currentLayerStyles}
              onUpdate={handleStyleChange}
            />
          )}

          {activeLayerConfig.decoration && (
            <DecorationControls
              styles={currentLayerStyles}
              onUpdate={handleStyleChange}
            />
          )}

          {activeLayerConfig.size && (
            <SizeControls
              styles={currentLayerStyles}
              onUpdate={handleStyleChange}
              showObjectFit={
                block.type === "IMAGE" ||
                block.type === "CAROUSEL" ||
                block.type === "HERO"
              }
            />
          )}

          {/* CORREÇÃO FINAL: Animação agora aparece para todos que tenham animation:true na config */}
          {activeLayerConfig.animation && activeLayerId === "container" && (
            <AnimationControls
              styles={currentLayerStyles}
              onUpdate={handleStyleChange}
            />
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

// --- HELPER DE CONTEÚDO ---
function renderContentForm(block: any, onChange: (c: any) => void) {
  if (block.type === "HERO")
    return (
      <div className="space-y-3">
        <div className="space-y-1">
          <Label className="text-xs">Título Principal</Label>
          <Input
            value={block.content?.title || ""}
            onChange={(e) => onChange({ title: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Subtítulo</Label>
          <Input
            value={block.content?.subtitle || ""}
            onChange={(e) => onChange({ subtitle: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px] font-bold uppercase text-slate-400 mt-2">
            Imagem de Fundo
          </Label>
          <ImageUpload
            value={block.content?.image}
            onChange={(url: string) => onChange({ image: url })}
          />
        </div>
      </div>
    );

  if (block.type === "TEXT")
    return (
      <div className="space-y-1">
        <Label className="text-xs">Texto</Label>
        <Textarea
          rows={8}
          value={block.content?.text || ""}
          onChange={(e) => onChange({ text: e.target.value })}
          className="resize-none"
        />
      </div>
    );

  if (block.type === "RSVP")
    return (
      <div className="space-y-3">
        <div className="space-y-1">
          <Label className="text-xs">Título</Label>
          <Input
            value={block.content?.title || ""}
            onChange={(e) => onChange({ title: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Descrição / Prazo</Label>
          <Textarea
            value={block.content?.description || ""}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Ex: Responda até dia 20..."
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Texto do Botão</Label>
          <Input
            value={block.content?.buttonText || ""}
            onChange={(e) => onChange({ buttonText: e.target.value })}
            placeholder="Confirmar Presença"
          />
        </div>
      </div>
    );

   if (block.type === "MAP") return (
    <div className="space-y-4">
      <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-3">
        <div className="space-y-1">
          <Label className="text-xs font-bold text-slate-500 uppercase">Detalhes Principais</Label>
          <Input 
            value={block.content?.venueName || ""} 
            onChange={(e) => onChange({ venueName: e.target.value })} 
            placeholder="Nome do Local (ex: Igreja da Sé)" 
            className="font-medium"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
           <div className="space-y-1">
            <Label className="text-xs">Horário</Label>
            <Input 
              value={block.content?.time || ""} 
              onChange={(e) => onChange({ time: e.target.value })} 
              placeholder="ex: 16:30" 
            />
           </div>
           <div className="space-y-1">
            <Label className="text-xs">Botão</Label>
            <Input 
              value={block.content?.buttonText || ""} 
              onChange={(e) => onChange({ buttonText: e.target.value })} 
              placeholder="Ver no GPS" 
            />
           </div>
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Endereço Completo</Label>
        <Textarea 
          value={block.content?.address || ""} 
          onChange={(e) => onChange({ address: e.target.value })} 
          placeholder="Rua, Número, Cidade..." 
          rows={2}
        />
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Link de Incorporação (Iframe)</Label>
        <Input 
          value={block.content?.link || ""} 
          onChange={(e) => onChange({ link: e.target.value })} 
          placeholder="Cole o link 'Embed' do Google Maps aqui" 
          className="text-xs font-mono"
        />
        <p className="text-[10px] text-slate-400 leading-tight pt-1">
          Dica: No Google Maps, clique em Compartilhar {'>'} Incorporar mapa.
        </p>
      </div>
    </div>
  );

  if (block.type === "COUNTDOWN")
    return (
      <div className="space-y-3">
        <Label className="text-xs">Data Alvo</Label>
        <Input
          type="datetime-local"
          className="h-10"
          value={
            block.content?.date
              ? new Date(block.content.date).toISOString().slice(0, 16)
              : ""
          }
          onChange={(e) =>
            onChange({ date: new Date(e.target.value).toISOString() })
          }
        />
      </div>
    );

  if (block.type === "VIDEO")
    return (
      <div className="space-y-1">
        <Label className="text-xs">Link (YouTube/Vimeo)</Label>
        <Input
          value={block.content.url || ""}
          onChange={(e) => onChange({ url: e.target.value })}
          placeholder="https://..."
        />
      </div>
    );

  if (block.type === "IMAGE")
    return (
      <div className="space-y-1">
        <Label className="text-xs">Upload Imagem</Label>
        <ImageUpload
          value={block.content?.url}
          onChange={(url: string) => onChange({ url })}
        />
      </div>
    );

  if (block.type === "DIVIDER")
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs">Alinhamento</Label>
          <div className="flex gap-2">
            {["flex-start", "center", "flex-end"].map((a) => (
              <button
                key={a}
                onClick={() => onChange({ align: a })}
                className={cn(
                  "px-3 py-1 border rounded text-xs capitalize",
                  block.content?.align === a
                    ? "bg-slate-900 text-white"
                    : "bg-white",
                )}
              >
                {a === "flex-start" ? "Esq" : a === "center" ? "Centro" : "Dir"}
              </button>
            ))}
          </div>
        </div>
      </div>
    );

  if (block.type === "COLUMNS")
    return (
      <div className="space-y-4">
        <Label className="text-xs font-bold">Número de Colunas</Label>
        <div className="flex gap-2">
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              onClick={() => onChange({ cols: n })}
              className={cn(
                "flex-1 py-3 border rounded-xl font-bold text-xs transition-all",
                block.content?.cols === n
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-500 hover:bg-slate-50",
              )}
            >
              {n} {n === 1 ? "Col" : "Cols"}
            </button>
          ))}
        </div>
      </div>
    );

  if (block.type === "SCHEDULE")
    return (
      <ScheduleForm
        content={block.content || { items: [] }}
        onUpdate={onChange}
      />
    );
  if (block.type === "MENU")
    return (
      <MenuForm
        content={block.content || { sections: [] }}
        onUpdate={onChange}
      />
    );
  if (block.type === "CAROUSEL")
    return (
      <CarouselForm
        content={block.content || { images: [] }}
        onUpdate={onChange}
      />
    );

  return (
    <div className="text-xs text-slate-400 text-center py-4">
      Conteúdo configurável diretamente no componente.
    </div>
  );
}
