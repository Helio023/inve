// "use client";

// import { useState } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { ImageUpload } from "@/components/image-upload";
// import { cn } from "@/lib/utils";
// import { ScheduleForm } from "./forms/schedule-form";

// import {
//   TypographyControls,
//   ColorControls,
//   BoxModelControls,
//   DecorationControls,
//   AnimationControls,
//   SizeControls,
// } from "./panels/style-controls";
// import { MenuForm } from "./forms/menu-form";
// import { CarouselForm } from "./forms/carousel-form";

// const LABEL_MAP: Record<string, string> = {
//   HERO: "Capa",
//   TEXT: "Texto",
//   IMAGE: "Imagem",
//   VIDEO: "Vídeo",
//   MAP: "Mapa",
//   COUNTDOWN: "Cronómetro",
//   RSVP: "Confirmação",
//   COLUMNS: "Colunas",
//   SCHEDULE: "Programa",
//   CAROUSEL: "Carrossel",
//   DIVIDER: "Divisor",
// };

// // --- RADIOGRAFIA DE ESTILOS (CAPACIDADES) ---
// const BLOCK_CAPABILITIES: Record<
//   string,
//   {
//     typography: boolean;
//     textColor: boolean;
//     backgroundColor: boolean;
//     sizing: boolean;
//     objectFit: boolean;
//   }
// > = {
//   HERO: {
//     typography: true,
//     textColor: true,
//     backgroundColor: true,
//     sizing: true,
//     objectFit: true,
//   },

//   TEXT: {
//     typography: true,
//     textColor: true,
//     backgroundColor: true,
//     sizing: true,
//     objectFit: false,
//   },

//   IMAGE: {
//     typography: false,
//     textColor: false,
//     backgroundColor: true,
//     sizing: true,
//     objectFit: true,
//   },

//   DIVIDER: {
//     typography: false,
//     textColor: false,
//     backgroundColor: false,
//     sizing: true,
//     objectFit: false,
//   },

//   VIDEO: {
//     typography: false,
//     textColor: false,
//     backgroundColor: true,
//     sizing: true,
//     objectFit: false,
//   },

//   // MAP: Texto do endereço. Fundo. Tamanho. Fit não.
//   MAP: {
//     typography: true,
//     textColor: true,
//     backgroundColor: true,
//     sizing: true,
//     objectFit: false,
//   },

//   // COUNTDOWN: Texto dos números. Fundo. Tamanho. Fit NÃO.
//   COUNTDOWN: {
//     typography: true,
//     textColor: true,
//     backgroundColor: true,
//     sizing: true,
//     objectFit: false,
//   },

//   // RSVP: Texto do form. Fundo. Tamanho. Fit NÃO.
//   RSVP: {
//     typography: true,
//     textColor: true,
//     backgroundColor: true,
//     sizing: true,
//     objectFit: false,
//   },

//   MENU: {
//     typography: true,
//     textColor: true,
//     backgroundColor: true,
//     sizing: false,
//     objectFit: false,
//   },

//   SCHEDULE: {
//     typography: true,
//     textColor: true,
//     backgroundColor: true,
//     sizing: true,
//     objectFit: false,
//   },
//   CAROUSEL: {
//     typography: false,
//     textColor: false,
//     backgroundColor: true,
//     sizing: true,
//     objectFit: true,
//   },
//   // COLUNAS: Apenas fundo. Tamanho automático.
//   COLUMNS: {
//     typography: false,
//     textColor: false,
//     backgroundColor: true,
//     sizing: false,
//     objectFit: false,
//   },
// };

// export const BlockSettingsManager = ({
//   block,
//   updateBlock,
//   updateStyles,
// }: any) => {
//   const [activeLayer, setActiveLayer] = useState<string>("global");

//   const handleContentChange = (newContent: any) =>
//     updateBlock(block.id, newContent);

//   const handleStyleChange = (newStyles: any) => {
//     if (activeLayer === "global") {
//       updateStyles(block.id, newStyles);
//       return;
//     }

//     const prefixedStyles: any = {};
//     Object.keys(newStyles).forEach((key) => {
//       let newKey = key;

//       const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);

//       if (
//         [
//           "backgroundColor",
//           "color",
//           "borderColor",
//           "borderRadius",
//           "borderWidth",
//           "borderStyle",
//           "shadow",
//         ].includes(key)
//       ) {
//         newKey = `${activeLayer}${capitalizedKey}`;
//       }

//       if (activeLayer === "btn" && key === "color") newKey = "btnTextColor";
//       if (activeLayer === "btn" && key === "borderRadius") newKey = "btnRadius";
//       if (activeLayer === "input" && key === "color") newKey = "inputTextColor";

//       prefixedStyles[newKey] = newStyles[key];
//     });

//     updateStyles(block.id, prefixedStyles);
//   };

//   const getCurrentLayerStyles = () => {
//     if (activeLayer === "global") return block.styles || {};

//     const s = block.styles || {};
//     const layerStyles: any = {};

//     if (activeLayer === "item") {
//       // Cronómetro
//       layerStyles.backgroundColor = s.itemBackgroundColor;
//       layerStyles.color = s.itemColor;
//       layerStyles.borderRadius = s.itemBorderRadius;
//       layerStyles.borderWidth = s.itemBorderWidth;
//       layerStyles.borderColor = s.itemBorderColor;
//       layerStyles.borderStyle = s.itemBorderStyle;
//       layerStyles.shadow = s.itemShadow;
//     }
//     if (activeLayer === "btn") {
//       // Botão RSVP
//       layerStyles.backgroundColor = s.btnBackgroundColor;
//       layerStyles.color = s.btnTextColor;
//       layerStyles.borderRadius = s.btnRadius;
//       layerStyles.shadow = s.btnShadow;
//       layerStyles.borderStyle = s.btnBorderStyle;
//       layerStyles.borderWidth = s.btnBorderWidth;
//       layerStyles.borderColor = s.btnBorderColor;
//     }
//     if (activeLayer === "input") {
//       // Inputs RSVP
//       layerStyles.backgroundColor = s.inputBackgroundColor;
//       layerStyles.color = s.inputTextColor;
//       layerStyles.borderColor = s.inputBorderColor;
//       layerStyles.borderRadius = s.inputBorderRadius;
//       layerStyles.borderWidth = s.inputBorderWidth;
//       layerStyles.borderStyle = s.inputBorderStyle;
//       layerStyles.shadow = s.inputShadow;
//     }

//     return layerStyles;
//   };

//   const currentStyles = getCurrentLayerStyles();
//   const blockLabel = LABEL_MAP[block.type] || block.type.toUpperCase();

//   // --- DETERMINAR CAPACIDADES ---
//   const caps = BLOCK_CAPABILITIES[block.type] || {
//     typography: true,
//     textColor: true,
//     backgroundColor: true,
//     sizing: true,
//     objectFit: true,
//   };

//   const showTypography = activeLayer === "global" ? caps.typography : true;
//   const showTextColor = activeLayer === "global" ? caps.textColor : true;
//   const showSizing = activeLayer === "global" ? caps.sizing : false;
//   // Apenas mostra Object Fit se o bloco permitir E estivermos na camada global
//   const showObjectFit = activeLayer === "global" ? caps.objectFit : false;

//   const renderLayerSelector = () => {
//     if (block.type === "COUNTDOWN") {
//       return (
//         <div className="flex p-1 bg-slate-100 rounded-lg mb-4 border border-slate-200">
//           <button
//             onClick={() => setActiveLayer("global")}
//             className={cn(
//               "flex-1 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all",
//               activeLayer === "global"
//                 ? "bg-white shadow text-blue-600"
//                 : "text-slate-500 hover:text-slate-700",
//             )}
//           >
//             Container
//           </button>
//           <button
//             onClick={() => setActiveLayer("item")}
//             className={cn(
//               "flex-1 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all",
//               activeLayer === "item"
//                 ? "bg-white shadow text-blue-600"
//                 : "text-slate-500 hover:text-slate-700",
//             )}
//           >
//             Números
//           </button>
//         </div>
//       );
//     }
//     if (block.type === "RSVP") {
//       return (
//         <div className="flex p-1 bg-slate-100 rounded-lg mb-4 border border-slate-200">
//           <button
//             onClick={() => setActiveLayer("global")}
//             className={cn(
//               "flex-1 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all",
//               activeLayer === "global"
//                 ? "bg-white shadow text-blue-600"
//                 : "text-slate-500",
//             )}
//           >
//             Box
//           </button>
//           <button
//             onClick={() => setActiveLayer("input")}
//             className={cn(
//               "flex-1 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all",
//               activeLayer === "input"
//                 ? "bg-white shadow text-blue-600"
//                 : "text-slate-500",
//             )}
//           >
//             Campos
//           </button>
//           <button
//             onClick={() => setActiveLayer("btn")}
//             className={cn(
//               "flex-1 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all",
//               activeLayer === "btn"
//                 ? "bg-white shadow text-blue-600"
//                 : "text-slate-500",
//             )}
//           >
//             Botão
//           </button>
//         </div>
//       );
//     }
//     return null;
//   };

//   const formatDataForInput = (dateString: string) => {
//     if (!dateString) return "";
//     try {
//       const date = new Date(dateString);
//       const tzOffset = date.getTimezoneOffset() * 60000;
//       return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
//     } catch (e) {
//       return "";
//     }
//   };

//   return (
//     <Tabs defaultValue="content" className="w-full">
//       <TabsList className="grid w-full grid-cols-2 mb-6 h-10 p-1 bg-slate-100 rounded-lg">
//         <TabsTrigger
//           value="content"
//           className="text-[10px] font-bold uppercase tracking-wider"
//         >
//           Conteúdo
//         </TabsTrigger>
//         <TabsTrigger
//           value="style"
//           className="text-[10px] font-bold uppercase tracking-wider"
//         >
//           Design
//         </TabsTrigger>
//       </TabsList>

//       <TabsContent
//         value="content"
//         className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300"
//       >
//         <h4 className="font-bold text-slate-700">Editar {blockLabel}</h4>

//         {block.type === "HERO" && (
//           <div className="space-y-3">
//             {" "}
//             <div className="space-y-1">
//               {" "}
//               <Label className="text-xs">Título Principal</Label>{" "}
//               <Input
//                 value={block.content?.title || ""}
//                 onChange={(e) => handleContentChange({ title: e.target.value })}
//               />{" "}
//             </div>{" "}
//             <div className="space-y-1">
//               {" "}
//               <Label className="text-xs">Subtítulo</Label>{" "}
//               <Input
//                 value={block.content?.subtitle || ""}
//                 onChange={(e) =>
//                   handleContentChange({ subtitle: e.target.value })
//                 }
//               />{" "}
//             </div>{" "}
//             <div className="space-y-1">
//               {" "}
//               <Label className="text-[10px] font-bold uppercase text-slate-400 mt-2">
//                 {" "}
//                 Imagem de Fundo{" "}
//               </Label>{" "}
//               <ImageUpload
//                 value={block.content?.image}
//                 onChange={(url: string) => handleContentChange({ image: url })}
//               />{" "}
//             </div>{" "}
//           </div>
//         )}
//         {block.type === "TEXT" && (
//           <div className="space-y-1">
//             {" "}
//             <Label className="text-xs">Texto do Convite</Label>{" "}
//             <Textarea
//               rows={10}
//               value={block.content?.text || ""}
//               onChange={(e) => handleContentChange({ text: e.target.value })}
//               className="resize-none"
//             />{" "}
//           </div>
//         )}
//         {block.type === "VIDEO" && (
//           <div className="space-y-1">
//             {" "}
//             <Label className="text-xs">
//               Link do Vídeo (YouTube/Vimeo)
//             </Label>{" "}
//             <Input
//               value={block.content.url || ""}
//               onChange={(e) => handleContentChange({ url: e.target.value })}
//               placeholder="..."
//             />{" "}
//           </div>
//         )}
//         {block.type === "MAP" && (
//           <div className="space-y-4">
//             {" "}
//             <div className="space-y-1">
//               {" "}
//               <Label className="text-xs font-bold">Nome do Local</Label>{" "}
//               <Input
//                 value={block.content?.address || ""}
//                 onChange={(e) =>
//                   handleContentChange({ address: e.target.value })
//                 }
//                 placeholder="Ex: Polana Serena Hotel"
//               />{" "}
//             </div>{" "}
//             <div className="space-y-1">
//               {" "}
//               <Label className="text-xs font-bold">
//                 Link do Google Maps
//               </Label>{" "}
//               <Input
//                 value={block.content?.link || ""}
//                 onChange={(e) => handleContentChange({ link: e.target.value })}
//                 placeholder="https://maps.app.goo.gl/..."
//               />{" "}
//               <p className="text-[10px] text-slate-400 italic">
//                 {" "}
//                 O link permitirá que o convidado abra o GPS.{" "}
//               </p>{" "}
//             </div>{" "}
//           </div>
//         )}
//         {block.type === "COUNTDOWN" && (
//           <div className="space-y-3">
//             {" "}
//             <Label className="text-xs font-bold">
//               Data Alvo do Evento
//             </Label>{" "}
//             <Input
//               type="datetime-local"
//               className="h-10"
//               value={formatDataForInput(block.content?.date)}
//               onChange={(e) =>
//                 handleContentChange({
//                   date: new Date(e.target.value).toISOString(),
//                 })
//               }
//             />{" "}
//             <div className="p-3 bg-blue-50 text-blue-700 text-[10px] rounded-lg border border-blue-100">
//               {" "}
//               Escolha a data exata da festa.{" "}
//             </div>{" "}
//           </div>
//         )}
//         {block.type === "RSVP" && (
//           <div className="space-y-1">
//             {" "}
//             <Label className="text-xs font-bold">Título do Bloco</Label>{" "}
//             <Input
//               value={block.content?.title || ""}
//               onChange={(e) => handleContentChange({ title: e.target.value })}
//             />{" "}
//           </div>
//         )}
//         {block.type === "IMAGE" && (
//           <div className="space-y-1">
//             {" "}
//             <Label className="text-xs font-bold">Carregar Foto</Label>{" "}
//             <ImageUpload
//               value={block.content?.url}
//               onChange={(url: string) => handleContentChange({ url })}
//             />{" "}
//           </div>
//         )}
//         {block.type === "COLUMNS" && (
//           <div className="space-y-4">
//             {" "}
//             <Label className="text-xs font-bold">Número de Colunas</Label>{" "}
//             <div className="flex gap-2">
//               {" "}
//               {[1, 2, 3].map((n) => (
//                 <button
//                   key={n}
//                   onClick={() => handleContentChange({ cols: n })}
//                   className={cn(
//                     "flex-1 py-3 border rounded-xl font-bold text-xs transition-all",
//                     block.content?.cols === n
//                       ? "bg-slate-900 text-white shadow-md"
//                       : "bg-white text-slate-500 hover:bg-slate-50",
//                   )}
//                 >
//                   {" "}
//                   {n} {n === 1 ? "Col" : "Cols"}{" "}
//                 </button>
//               ))}{" "}
//             </div>{" "}
//           </div>
//         )}
//         {block.type === "MENU" && (
//           <MenuForm
//             content={block.content || { sections: [] }}
//             onUpdate={(newContent: any) => handleContentChange(newContent)}
//           />
//         )}

//         {block.type === "SCHEDULE" && (
//           <ScheduleForm
//             content={block.content || { items: [] }}
//             onUpdate={(newContent: any) => handleContentChange(newContent)}
//           />
//         )}

//         {block.type === "CAROUSEL" && (
//           <CarouselForm
//             content={block.content || { images: [] }}
//             onUpdate={(newContent: any) => handleContentChange(newContent)}
//           />
//         )}

     
//       </TabsContent>

//       {/* ABA DE DESIGN */}
//       <TabsContent
//         value="style"
//         className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300"
//       >
//         {renderLayerSelector()}

//         {/* 1. Cores (Condicional) */}
//         {caps.backgroundColor && (
//           <ColorControls
//             styles={currentStyles}
//             onUpdate={handleStyleChange}
//             showTextColor={showTextColor}
//           />
//         )}

//         {/* 2. Tipografia (Condicional) */}
//         {showTypography && (
//           <TypographyControls
//             styles={currentStyles}
//             onUpdate={handleStyleChange}
//           />
//         )}

//         {/* 3. Tamanho (NOVO - Condicional) */}
//         {showSizing && (
//           <SizeControls
//             styles={currentStyles}
//             onUpdate={handleStyleChange}
//             showObjectFit={showObjectFit}
//           />
//         )}

//         {/* 4. Box Model (Global) */}
//         {activeLayer === "global" && (
//           <BoxModelControls
//             styles={currentStyles}
//             onUpdate={handleStyleChange}
//           />
//         )}

//         <DecorationControls
//           styles={currentStyles}
//           onUpdate={handleStyleChange}
//         />

//         {activeLayer === "global" && (
//           <AnimationControls
//             styles={currentStyles}
//             onUpdate={handleStyleChange}
//           />
//         )}
//       </TabsContent>
//     </Tabs>
//   );
// };


"use client";

import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/image-upload";
import { cn } from "@/lib/utils";

// Formulários Específicos (Certifique-se que estes ficheiros existem na pasta ./forms/)
import { ScheduleForm } from "./forms/schedule-form";
import { MenuForm } from "./forms/menu-form";
import { CarouselForm } from "./forms/carousel-form";

// Painéis de Estilo (Os novos componentes avançados)
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
  List,
  Video,
  Map as MapIcon,
  Columns
} from "lucide-react";

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
  typography?: boolean; // Fonte, tamanho, peso...
  colors?: boolean;     // Cor texto, fundo...
  spacing?: boolean;    // Margin, Padding...
  decoration?: boolean; // Borda, Sombra, Radius...
  size?: boolean;       // Largura, Altura...
  animation?: boolean;  // Fade, Slide...
};

type LayerDef = {
  id: string;
  label: string;
  icon: any;
  config: LayerConfig;
};

// --- PRESETS DE CONFIGURAÇÃO ---
const CONFIG_TEXT: LayerConfig = { typography: true, colors: true, spacing: true, decoration: false, size: false };
const CONFIG_CONTAINER: LayerConfig = { typography: false, colors: true, spacing: true, decoration: true, size: true, animation: true };
const CONFIG_BUTTON: LayerConfig = { typography: true, colors: true, spacing: true, decoration: true, size: true };
const CONFIG_INPUT: LayerConfig = { typography: true, colors: true, spacing: true, decoration: true, size: true };
const CONFIG_SIMPLE: LayerConfig = { typography: false, colors: true, spacing: true, decoration: true, size: true };

// --- DEFINIÇÃO DAS CAMADAS INTELIGENTES ---
const BLOCK_LAYERS: Record<string, LayerDef[]> = {
  // Blocos Complexos (Mantêm-se iguais)
  HERO: [
    { id: "container", label: "Fundo Geral", icon: Layout, config: CONFIG_CONTAINER },
    { id: "title", label: "Título", icon: Type, config: CONFIG_TEXT },
    { id: "desc", label: "Subtítulo", icon: AlignLeft, config: CONFIG_TEXT },
    { id: "btn", label: "Botão (Se houver)", icon: MousePointerClick, config: CONFIG_BUTTON },
  ],
  TEXT: [
    { id: "container", label: "Container", icon: Layout, config: { ...CONFIG_CONTAINER, typography: true } },
  ],
  RSVP: [
    { id: "container", label: "Box Principal", icon: Layout, config: CONFIG_CONTAINER },
    { id: "title", label: "Título", icon: Type, config: CONFIG_TEXT },
    { id: "label", label: "Etiquetas", icon: TextCursorInput, config: CONFIG_TEXT },
    { id: "input", label: "Campos Input", icon: BoxSelect, config: CONFIG_INPUT },
    { id: "btn", label: "Botão Enviar", icon: MousePointerClick, config: CONFIG_BUTTON },
  ],
  COUNTDOWN: [
    { id: "container", label: "Geral", icon: Layout, config: CONFIG_CONTAINER },
    { id: "item", label: "Caixas Números", icon: BoxSelect, config: { ...CONFIG_CONTAINER, typography: false } },
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


  IMAGE: [{ id: "container", label: "Imagem", icon: ImageIcon, config: CONFIG_SIMPLE }],
  VIDEO: [{ id: "container", label: "Vídeo", icon: Video, config: CONFIG_SIMPLE }],
  MAP: [{ id: "container", label: "Mapa", icon: MapIcon, config: CONFIG_SIMPLE }],
  CAROUSEL: [{ id: "container", label: "Carrossel", icon: ImageIcon, config: CONFIG_SIMPLE }],
  COLUMNS: [{ id: "container", label: "Colunas", icon: Columns, config: CONFIG_CONTAINER }], // Colunas mantêm Container para ter Animação
  

};
export const BlockSettingsManager = ({ block, updateBlock, updateStyles }: any) => {
  const [activeTab, setActiveTab] = useState("content");
  const [activeLayerId, setActiveLayerId] = useState<string>("container");

  // 1. Função para atualizar o conteúdo (Textos, Imagens, etc)
  const handleContentChange = (newContent: any) => {
    updateBlock(block.id, newContent);
  };

  const layers = BLOCK_LAYERS[block.type] || [{ id: "container", label: "Geral", icon: Layout, config: CONFIG_CONTAINER }];
  const blockLabel = LABEL_MAP[block.type] || block.type;

  // Encontra a configuração da camada ativa para saber o que mostrar
  const activeLayerConfig = layers.find(l => l.id === activeLayerId)?.config || CONFIG_CONTAINER;

  // --- 2. LÓGICA DE ESCRITA DE ESTILOS (Salvar no Banco) ---
  const handleStyleChange = (newStyles: any) => {
    // Se for container, salva direto. Se for camada, adiciona prefixo.
    if (activeLayerId === "container") {
      updateStyles(block.id, newStyles);
      return;
    }

    const prefixedStyles: any = {};
    Object.keys(newStyles).forEach((key) => {
      // Ex: fontSize -> titleFontSize
      const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
      const prefixedKey = `${activeLayerId}${capitalizedKey}`;
      prefixedStyles[prefixedKey] = newStyles[key];
    });

    updateStyles(block.id, prefixedStyles);
  };

  // --- 3. LÓGICA DE LEITURA DE ESTILOS (Mostrar no Editor) ---
  const currentLayerStyles = useMemo(() => {
    const s = block.styles || {};
    
    // Se for container, retorna tudo direto
    if (activeLayerId === "container") return s;

    const mapped: any = {};
    
    // Lista de propriedades que os componentes de UI emitem
    const uiProps = [
      "color", "backgroundColor", "borderColor", "borderRadius", "borderWidth", "borderStyle",
      "fontSize", "fontWeight", "fontFamily", "textAlign", "lineHeight", "letterSpacing", "textTransform",
      "paddingTop", "paddingBottom", "paddingLeft", "paddingRight", 
      "marginTop", "marginBottom", "marginLeft", "marginRight",
      "width", "height", "shadow", "objectFit"
    ];

    uiProps.forEach(prop => {
      const capitalizedKey = prop.charAt(0).toUpperCase() + prop.slice(1);
      const prefixedKey = `${activeLayerId}${capitalizedKey}`; // Ex: titleFontSize
      
      // Se existir valor específico (ex: titleFontSize), usa-o.
      // Se não, undefined (para mostrar placeholder/default do componente visual).
      if (s[prefixedKey] !== undefined) {
        mapped[prop] = s[prefixedKey];
      }
    });

    return mapped;
  }, [block.styles, activeLayerId]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6 h-10 p-1 bg-slate-100 rounded-lg">
        <TabsTrigger value="content" className="text-[10px] font-bold uppercase tracking-wider">
          Conteúdo
        </TabsTrigger>
        <TabsTrigger value="style" className="text-[10px] font-bold uppercase tracking-wider">
          Design
        </TabsTrigger>
      </TabsList>

      {/* ================= ABA CONTEÚDO ================= */}
      <TabsContent value="content" className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
        <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider border-b pb-2">
          Dados do {blockLabel}
        </h4>
        {/* Renderiza o formulário de conteúdo completo */}
        {renderContentForm(block, handleContentChange)}
      </TabsContent>

      {/* ================= ABA DESIGN (INTELIGENTE) ================= */}
      <TabsContent value="style" className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
        
        {/* 1. SELETOR DE CAMADAS (Só aparece se houver > 1) */}
        {layers.length > 1 && (
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
             <div className="flex items-center gap-2 mb-2 px-1">
                <Layers className="w-3 h-3 text-slate-400" />
                <Label className="text-[9px] font-bold uppercase text-slate-500 tracking-wider">
                  Selecionar Camada
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
                        : "bg-transparent border-transparent text-slate-500 hover:bg-slate-200 hover:text-slate-800"
                    )}
                  >
                    <l.icon className="w-3.5 h-3.5" />
                    {l.label}
                  </button>
                ))}
             </div>
          </div>
        )}

        {/* 2. CONTROLOS FILTRADOS (INTELIGÊNCIA) */}
        <div className="space-y-1">
            
            {/* Cores */}
            {activeLayerConfig.colors && (
              <ColorControls 
                styles={currentLayerStyles} 
                onUpdate={handleStyleChange} 
                showTextColor={activeLayerId !== 'container' && activeLayerId !== 'image'} 
              />
            )}

            {/* Tipografia */}
            {activeLayerConfig.typography && (
               <TypographyControls 
                 styles={currentLayerStyles} 
                 onUpdate={handleStyleChange} 
               />
            )}

            {/* Box Model (Espaçamento) */}
            {activeLayerConfig.spacing && (
               <BoxModelControls 
                 styles={currentLayerStyles} 
                 onUpdate={handleStyleChange} 
               />
            )}

            {/* Decoração (Bordas) */}
            {activeLayerConfig.decoration && (
               <DecorationControls 
                 styles={currentLayerStyles} 
                 onUpdate={handleStyleChange} 
               />
            )}

            {/* Tamanho */}
            {activeLayerConfig.size && (
              <SizeControls 
                styles={currentLayerStyles} 
                onUpdate={handleStyleChange} 
                showObjectFit={block.type === 'IMAGE' || block.type === 'CAROUSEL' || block.type === 'HERO'}
              />
            )}

            {/* Animação (Apenas Container) */}
            {activeLayerConfig.animation && activeLayerId === 'container' && (
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

// --- HELPER PARA RENDERIZAR O FORMULÁRIO DE CONTEÚDO ---
// Contém todas as variações de inputs para cada tipo de bloco
function renderContentForm(block: any, onChange: (c: any) => void) {
  
  // 1. HERO
  if (block.type === "HERO") return (
    <div className="space-y-3">
        <div className="space-y-1"><Label className="text-xs">Título Principal</Label><Input value={block.content?.title || ""} onChange={(e) => onChange({ title: e.target.value })} /></div>
        <div className="space-y-1"><Label className="text-xs">Subtítulo</Label><Input value={block.content?.subtitle || ""} onChange={(e) => onChange({ subtitle: e.target.value })} /></div>
        <div className="space-y-1"><Label className="text-[10px] font-bold uppercase text-slate-400 mt-2">Imagem de Fundo</Label><ImageUpload value={block.content?.image} onChange={(url:string) => onChange({ image: url })} /></div>
    </div>
  );

  // 2. TEXTO
  if (block.type === "TEXT") return (
    <div className="space-y-1"><Label className="text-xs">Texto</Label><Textarea rows={8} value={block.content?.text || ""} onChange={(e) => onChange({ text: e.target.value })} className="resize-none" /></div>
  );

  // 3. RSVP
  if (block.type === "RSVP") return (
    <div className="space-y-3">
        <div className="space-y-1"><Label className="text-xs">Título</Label><Input value={block.content?.title || ""} onChange={(e) => onChange({ title: e.target.value })} /></div>
        <div className="space-y-1"><Label className="text-xs">Descrição / Prazo</Label><Textarea value={block.content?.description || ""} onChange={(e) => onChange({ description: e.target.value })} placeholder="Ex: Responda até dia 20..." /></div>
        <div className="space-y-1"><Label className="text-xs">Texto do Botão</Label><Input value={block.content?.buttonText || ""} onChange={(e) => onChange({ buttonText: e.target.value })} placeholder="Confirmar Presença" /></div>
    </div>
  );

  // 4. MAPA
  if (block.type === "MAP") return (
    <div className="space-y-4">
      <div className="space-y-1"><Label className="text-xs">Nome do Local</Label><Input value={block.content?.address || ""} onChange={(e) => onChange({ address: e.target.value })} placeholder="Ex: Polana Serena Hotel" /></div>
      <div className="space-y-1"><Label className="text-xs">Link do Google Maps (Embed)</Label><Input value={block.content?.link || ""} onChange={(e) => onChange({ link: e.target.value })} placeholder="Cole o link de incorporação aqui..." /></div>
    </div>
  );

  // 5. COUNTDOWN
  if (block.type === "COUNTDOWN") return (
    <div className="space-y-3">
      <Label className="text-xs">Data Alvo</Label>
      <Input type="datetime-local" className="h-10" value={block.content?.date ? new Date(block.content.date).toISOString().slice(0, 16) : ""} onChange={(e) => onChange({ date: new Date(e.target.value).toISOString() })} />
    </div>
  );

  // 6. VIDEO
  if (block.type === "VIDEO") return (
    <div className="space-y-1"><Label className="text-xs">Link (YouTube/Vimeo)</Label><Input value={block.content.url || ""} onChange={(e) => onChange({ url: e.target.value })} placeholder="https://..." /></div>
  );

  // 7. IMAGEM
  if (block.type === "IMAGE") return (
    <div className="space-y-1"><Label className="text-xs">Upload Imagem</Label><ImageUpload value={block.content?.url} onChange={(url:string) => onChange({ url })} /></div>
  );

 

  // 9. COLUNAS
  if (block.type === "COLUMNS") return (
    <div className="space-y-4">
      <Label className="text-xs font-bold">Número de Colunas</Label>
      <div className="flex gap-2">
        {[1, 2, 3].map((n) => (
          <button key={n} onClick={() => onChange({ cols: n })} className={cn("flex-1 py-3 border rounded-xl font-bold text-xs transition-all", block.content?.cols === n ? "bg-slate-900 text-white shadow-md" : "bg-white text-slate-500 hover:bg-slate-50")}>
            {n} {n === 1 ? "Col" : "Cols"}
          </button>
        ))}
      </div>
    </div>
  );

  // 10. COMPLEXOS (Usam formulários externos)
  if (block.type === "SCHEDULE") return <ScheduleForm content={block.content || { items: [] }} onUpdate={onChange} />;
  if (block.type === "MENU") return <MenuForm content={block.content || { sections: [] }} onUpdate={onChange} />;
  if (block.type === "CAROUSEL") return <CarouselForm content={block.content || { images: [] }} onUpdate={onChange} />;

  return <div className="text-xs text-slate-400 text-center py-4">Conteúdo configurável diretamente no componente.</div>;
}