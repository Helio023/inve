// import { DEFAULT_STYLES } from "./types";
// import { CSSProperties } from "react";

// export const getBackgroundStyle = (value?: string): CSSProperties => {
//   if (!value) return {};

//   // Correção: Garante que "none" limpe estilos residuais
//   if (value === "none")
//     return { backgroundColor: "transparent", backgroundImage: "none" };

//   if (value.includes("gradient") || value.includes("url")) {
//     return {
//       backgroundImage: value,
//       backgroundColor: "transparent",
//       backgroundSize: "cover",
//       backgroundPosition: "center",
//       backgroundRepeat: "no-repeat",
//     };
//   }

//   return { backgroundColor: value, backgroundImage: "none" };
// };

// export const getTypographyStyle = (
//   styles: any,
//   prefix: string = "",
// ): CSSProperties => {
//   // 1. O "s" agora é a fonte da verdade (Defaults + User Styles)
//   const s = { ...DEFAULT_STYLES, ...styles };

//   // Helper para adicionar "px" apenas se o valor for numérico e existir
//   const px = (val: any) =>
//     val !== undefined && val !== null && val !== "" ? `${val}px` : undefined;

//   // Helper de busca de propriedade (Inheritance Logic)
//   const p = (prop: string, allowInheritance = true) => {
//     // Ex: prefix="title", prop="fontSize" -> busca "titleFontSize"
//     const specificKey = prefix
//       ? `${prefix}${prop.charAt(0).toUpperCase() + prop.slice(1)}`
//       : prop;

//     // Tenta valor específico da camada (ex: titleFontSize)
//     const specificValue = s[specificKey];

//     // Se achou, retorna
//     if (specificValue !== undefined && specificValue !== "") {
//       return specificValue;
//     }

//     // Se não achou e a herança é permitida, usa o valor global (ex: fontSize)
//     // Isso conserta o seu problema: se não tiver titleLineHeight, usa o lineHeight global
//     if (allowInheritance) {
//       return s[prop];
//     }

//     return undefined;
//   };

//   return {
//     // Propriedades que DEVEM herdar do global se não existirem no específico
//     color: p("color"),
//     fontFamily: p("fontFamily"),
//     fontSize: px(p("fontSize")),
//     fontWeight: p("fontWeight"),
//     fontStyle: p("fontStyle"),
//     textTransform: p("textTransform"),
//     textDecoration: p("textDecoration"),
//     lineHeight: p("lineHeight"),
//     letterSpacing: px(p("letterSpacing")),
//     textAlign: p("textAlign"),

//     // --- NOVAS ADIÇÕES IMPORTANTES ---

//     // Margens Específicas:
//     // Passamos 'false' no 2º argumento porque NÃO queremos que o título herde
//     // a margem do container principal (margin do bloco != margin do título)
//     marginTop: px(p("marginTop", false)),
//     marginBottom: px(p("marginBottom", false)),
//     marginLeft: px(p("marginLeft", false)),
//     marginRight: px(p("marginRight", false)),

//     // Opacidade (Útil para descrições/subtítulos)
//     opacity: p("opacity", false),
//   };
// };

// export const getContainerStyle = (
//   styles: any,
//   prefix: string = "",
// ): CSSProperties => {
//   const s = { ...DEFAULT_STYLES, ...styles };
//   const px = (val: any) => (val !== undefined ? `${val}px` : undefined);

//   const get = (k: string) => {
//     const key = prefix
//       ? `${prefix}${k.charAt(0).toUpperCase() + k.slice(1)}`
//       : k;
//     return s[key];
//   };

//   return {
//     backgroundColor: get("backgroundColor") || "transparent",
//     borderRadius: px(get("borderRadius")),
//     borderWidth: px(get("borderWidth")),
//     borderColor: get("borderColor") || "transparent",
//     borderStyle: get("borderStyle") || "solid",
//     boxShadow:
//       get("shadow") === "none"
//         ? "none"
//         : get("shadow") === "sm"
//           ? "0 1px 2px rgba(0,0,0,0.05)"
//           : get("shadow") === "md"
//             ? "0 4px 6px rgba(0,0,0,0.1)"
//             : get("shadow") === "lg"
//               ? "0 10px 15px rgba(0,0,0,0.1)"
//               : undefined,
//     // Espaçamento interno (Padding do botão/input)
//     paddingTop: px(get("paddingTop")),
//     paddingBottom: px(get("paddingBottom")),
//     paddingLeft: px(get("paddingLeft")),
//     paddingRight: px(get("paddingRight")),
//   };
// };

import { CSSProperties } from "react";
import { DEFAULT_STYLES } from "./types";

export const getBackgroundStyle = (styles: any): CSSProperties => {
  if (!styles) return { backgroundColor: "transparent", backgroundImage: "none" };

  return {
    backgroundColor: styles.backgroundColor || "transparent",
    backgroundImage: styles.backgroundImage || "none",
    backgroundSize: styles.backgroundSize || "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };
};

export const getTypographyStyle = (styles: any, prefix: string = ""): CSSProperties => {
  const s = { ...DEFAULT_STYLES, ...styles };
  
  const px = (val: any) => (val !== undefined && val !== null && val !== "" ? `${val}px` : undefined);

  const get = (prop: string) => {
    // 1. Tenta valor específico (ex: descTextTransform)
    const specificKey = prefix 
      ? `${prefix}${prop.charAt(0).toUpperCase() + prop.slice(1)}` 
      : prop;
    
    const val = s[specificKey];
    if (val !== undefined && val !== null && val !== "") return val;

    // 2. Herança Global (ex: fontFamily)
    // textTransform NÃO deve herdar automaticamente, a não ser que queiramos forçar
    const inheritable = ["fontFamily", "color", "textAlign", "lineHeight"];
    if (inheritable.includes(prop)) return s[prop];

    return undefined;
  };

  return {
    color: get("color"),
    fontFamily: get("fontFamily"),
    fontSize: px(get("fontSize")),
    fontWeight: get("fontWeight"),
    fontStyle: get("fontStyle"),
    textTransform: get("textTransform") as any, // Garante que descTextTransform seja lido
    textDecoration: get("textDecoration"),
    lineHeight: get("lineHeight"),
    letterSpacing: px(get("letterSpacing")),
    textAlign: get("textAlign") as any,
    
    // Propriedades de Layout e Decoração Específicas
    marginTop: px(s[`${prefix}MarginTop`]),
    marginBottom: px(s[`${prefix}MarginBottom`]),
    marginLeft: px(s[`${prefix}MarginLeft`]),
    marginRight: px(s[`${prefix}MarginRight`]),
    paddingTop: px(s[`${prefix}PaddingTop`]),
    paddingBottom: px(s[`${prefix}PaddingBottom`]),
    
    opacity: s[`${prefix}Opacity`],
    
    // Bordas (Para linhas decorativas acima/abaixo do texto)
    borderTopWidth: px(s[`${prefix}BorderTopWidth`]),
    borderBottomWidth: px(s[`${prefix}BorderBottomWidth`]),
    borderColor: s[`${prefix}BorderColor`] || s.borderColor || s.color,
    
    // Largura (Para forçar quebra de linha ou sublinhado curto)
    width: s[`${prefix}Width`] || undefined,
    display: s[`${prefix}Width`] || s[`${prefix}BorderTopWidth`] ? "inline-block" : "block"
  };
};

export const getContainerStyle = (styles: any, prefix: string = ""): CSSProperties => {
  const s = { ...DEFAULT_STYLES, ...styles };
  
  const get = (k: string) => {
    const key = prefix ? `${prefix}${k.charAt(0).toUpperCase() + k.slice(1)}` : k;
    return s[key];
  };

  const px = (val: any) => (val !== undefined && val !== null && val !== "" ? `${val}px` : undefined);

  return {
    backgroundColor: get("backgroundColor") || "transparent",
    width: get("width"),
    height: get("height"),
    paddingTop: px(get("paddingTop")),
    paddingBottom: px(get("paddingBottom")),
    paddingLeft: px(get("paddingLeft")),
    paddingRight: px(get("paddingRight")),
    marginTop: px(get("marginTop")),
    marginBottom: px(get("marginBottom")),
    marginLeft: px(get("marginLeft")),
    marginRight: px(get("marginRight")),
    borderRadius: px(get("borderRadius")),
    borderWidth: px(get("borderWidth")),
    borderColor: get("borderColor") || "transparent",
    borderStyle: get("borderStyle") || "solid",
    boxShadow: get("shadow") === "none" ? "none" : 
               get("shadow") === "sm" ? "0 1px 2px rgba(0,0,0,0.05)" :
               get("shadow") === "md" ? "0 4px 6px rgba(0,0,0,0.1)" :
               get("shadow") === "lg" ? "0 10px 15px rgba(0,0,0,0.1)" : 
               get("shadow") === "xl" ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" : undefined,
  };
};