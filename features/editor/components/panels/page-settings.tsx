// "use client";

// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Slider } from "@/components/ui/slider";
// import { ImageUpload } from "@/components/image-upload";
// import { Palette, ImageIcon, Type, Square } from "lucide-react";

// export function PageSettingsPanel({ activePage, onUpdate }: any) {
//   const styles = activePage.styles || {};

//   // Helper para atualizar um campo de estilo específico da página
//   const handleStyleUpdate = (key: string, value: any) => {
//     onUpdate({ styles: { ...styles, [key]: value } });
//   };

//   return (
//     <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300 pb-10">
      
//       <div className="space-y-2">
//         <Label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-2">
//           <Type className="w-3 h-3" /> Nome do Slide (Interno)
//         </Label>
//         <Input
//           value={activePage.title}
//           onChange={(e) => onUpdate({ title: e.target.value })}
//           placeholder="Ex: Localização, Nossa História..."
//           className="h-9"
//         />
//       </div>

//       {/* Cor de Fundo */}
//       <div className="space-y-3 pt-4 border-t">
//         <Label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-2">
//           <Palette className="w-3 h-3" /> Cor de Fundo
//         </Label>
//         <div className="flex items-center gap-3">
//           <input
//             type="color"
//             value={styles.backgroundColor || "#ffffff"}
//             className="w-10 h-10 rounded-md border cursor-pointer overflow-hidden"
//             onChange={(e) =>
//               handleStyleUpdate("backgroundColor", e.target.value)
//             }
//           />
//           <span className="text-xs font-mono uppercase text-slate-500">
//             {styles.backgroundColor}
//           </span>
//         </div>
//       </div>

//       {/* Imagem de Fundo */}
//       <div className="space-y-3 pt-4 border-t">
//         <Label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-2">
//           <ImageIcon className="w-3 h-3" /> Papel de Parede
//         </Label>
//         <ImageUpload
//           value={styles.backgroundImage}
//           onChange={(url: string) => handleStyleUpdate("backgroundImage", url)}
//         />

//         {styles.backgroundImage && (
//           <div className="space-y-4 pt-2 animate-in zoom-in-95 duration-200">
//             <div className="flex justify-between items-center">
//               <Label className="text-[10px] font-bold uppercase text-slate-400">
//                 Escurecer Imagem
//               </Label>
//               <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded">
//                 {Math.round((styles.backgroundOpacity || 0) * 100)}%
//               </span>
//             </div>
//             <Slider
//               value={[styles.backgroundOpacity || 0]}
//               min={0}
//               max={0.9}
//               step={0.1}
//               onValueChange={([v]) => handleStyleUpdate("backgroundOpacity", v)}
//             />
//           </div>
//         )}
//       </div>

//       {/* CONTROLO DE PADDING DA PÁGINA */}
//       <div className="space-y-3 pt-4 border-t">
//         <Label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-2">
//           <Square className="w-3 h-3" /> Margens Internas da Página
//         </Label>
//         <div className="grid grid-cols-2 gap-3">
//           {[
//             { l: "Superior", k: "paddingTop" },
//             { l: "Inferior", k: "paddingBottom" },
//             { l: "Esquerda (E)", k: "paddingLeft" },
//             { l: "Direita (D)", k: "paddingRight" },
//           ].map((s) => (
//             <div key={s.k} className="space-y-1">
//               <span className="text-[9px] text-slate-400 font-bold uppercase">
//                 {s.l}
//               </span>
//               <Input
//                 type="number"
//                 min={0}
//                 className="h-8 text-xs bg-slate-50"
//                 value={styles[s.k] || 0}
//                 onChange={(e) => handleStyleUpdate(s.k, Number(e.target.value))}
//               />
//             </div>
//           ))}
//         </div>
//         <p className="text-[9px] text-slate-400 italic">
//           Controla o espaço entre a borda do ecrã e o início dos seus blocos.
//         </p>
//       </div>
//     </div>
//   );
// }


'use client';

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ImageUpload } from "@/components/image-upload";
import { Palette, ImageIcon, Type, Square } from "lucide-react";
import { DEFAULT_PAGE_STYLES } from "../../types"; 

export function PageSettingsPanel({ activePage, onUpdate }: any) {
  const styles = { ...DEFAULT_PAGE_STYLES, ...activePage.styles };

  const handleStyleUpdate = (key: string, value: any) => {
    onUpdate({ styles: { ...activePage.styles, [key]: value } });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300 pb-10">
      
      <div className="space-y-2">
        <Label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-2">
          <Type className="w-3 h-3" /> Nome do Slide (Interno)
        </Label>
        <Input
          value={activePage.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Ex: Localização, Nossa História..."
          className="h-9"
        />
      </div>

      {/* Cor de Fundo */}
      <div className="space-y-3 pt-4 border-t">
        <Label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-2">
          <Palette className="w-3 h-3" /> Cor de Fundo
        </Label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={styles.backgroundColor}
            className="w-10 h-10 rounded-md border cursor-pointer overflow-hidden"
            onChange={(e) =>
              handleStyleUpdate("backgroundColor", e.target.value)
            }
          />
          <span className="text-xs font-mono uppercase text-slate-500">
            {styles.backgroundColor}
          </span>
        </div>
      </div>

      {/* Imagem de Fundo */}
      <div className="space-y-3 pt-4 border-t">
        <Label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-2">
          <ImageIcon className="w-3 h-3" /> Papel de Parede
        </Label>
        <ImageUpload
          value={styles.backgroundImage}
          onChange={(url: string) => handleStyleUpdate("backgroundImage", url)}
        />

        {styles.backgroundImage && (
          <div className="space-y-4 pt-2 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center">
              <Label className="text-[10px] font-bold uppercase text-slate-400">
                Escurecer Imagem
              </Label>
              <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                {Math.round((styles.backgroundOpacity) * 100)}%
              </span>
            </div>
            <Slider
              value={[styles.backgroundOpacity]}
              min={0}
              max={0.9}
              step={0.1}
              onValueChange={([v]) => handleStyleUpdate("backgroundOpacity", v)}
            />
          </div>
        )}
      </div>

      {/* CONTROLO DE PADDING DA PÁGINA */}
      <div className="space-y-3 pt-4 border-t">
        <Label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-2">
          <Square className="w-3 h-3" /> Margens Internas da Página
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { l: "Superior", k: "paddingTop" },
            { l: "Inferior", k: "paddingBottom" },
            { l: "Esquerda (E)", k: "paddingLeft" },
            { l: "Direita (D)", k: "paddingRight" },
          ].map((s) => (
            <div key={s.k} className="space-y-1">
              <span className="text-[9px] text-slate-400 font-bold uppercase">
                {s.l}
              </span>
              <Input
                type="number"
                min={0}
                className="h-8 text-xs bg-slate-50"
                value={styles[s.k]}
                onChange={(e) => {
                   const val = Number(e.target.value);
                   if(val >= 0) handleStyleUpdate(s.k, val);
                }}
              />
            </div>
          ))}
        </div>
        <p className="text-[9px] text-slate-400 italic">
          Defina como 0 para que o conteúdo encoste nas bordas.
        </p>
      </div>
    </div>
  );
}