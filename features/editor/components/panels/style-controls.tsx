"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Sparkles,
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  FlipHorizontal,
  Ban,
  Maximize,
  Type,
  CaseUpper,
  CaseLower,
  CaseSensitive,
  MoveVertical,
  MoveHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEFAULT_STYLES, IBlockStyles } from "../../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { AdvancedColorPicker } from "../../components/inputs/advanced-color-picker";
import { SpacingControl } from "../../components/inputs/spacing-control";

// --- 1. Tipografia (Profissional) ---
export const TypographyControls = ({
  styles = {},
  onUpdate,
}: {
  styles: Partial<IBlockStyles>;
  onUpdate: (s: any) => void;
}) => {
  const fonts = [
    { name: "Padrão (Inter)", value: "var(--font-inter)" },
    { name: "Moderna (Montserrat)", value: "var(--font-montserrat)" },
    { name: "Clean (Lato)", value: "var(--font-lato)" },
    { name: "Editorial (Playfair)", value: "var(--font-playfair)" },
    { name: "Luxo (Cormorant)", value: "var(--font-cormorant)" },
    { name: "Imperial (Cinzel)", value: "var(--font-cinzel)" },
    { name: "Romântica (Great Vibes)", value: "var(--font-vibes)" },
    { name: "Descontraída (Dancing)", value: "var(--font-dancing)" },
    { name: "Parisiense (Parisienne)", value: "var(--font-parisienne)" },
    { name: "Fluída (Allura)", value: "var(--font-allura)" },
  ];

  
  const fontSize = styles.fontSize ?? DEFAULT_STYLES.fontSize ?? 16;
  const textAlign = styles.textAlign ?? DEFAULT_STYLES.textAlign;

  
  const isBold =
    styles.fontWeight === "bold" ||
    styles.fontWeight === 700 ||
    styles.fontWeight === "700";
  const isItalic = styles.fontStyle === "italic";

  return (
    <div className="space-y-6 pt-2">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase text-slate-400">
            Tipo de Letra
          </Label>
          <select
            className="w-full bg-white border border-slate-200 rounded-md text-xs p-2 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            value={styles.fontFamily || ""}
            onChange={(e) => onUpdate({ fontFamily: e.target.value })}
          >
            {fonts.map((f) => (
              <option key={f.value} value={f.value}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-[10px] font-bold uppercase text-slate-400">
              Tamanho
            </Label>
            <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
              {fontSize}px
            </span>
          </div>
          <Slider
            value={[fontSize]}
            min={10}
            max={120}
            step={1}
            onValueChange={([v]) => onUpdate({ fontSize: v })}
            className="cursor-pointer"
          />
        </div>
      </div>

      {/* Estilos Básicos */}
      <div className="flex gap-2">
        <div className="flex border rounded-lg overflow-hidden flex-1 shadow-sm">
          {/* BOTÃO NEGRITO ATUALIZADO */}
          <button
            onClick={() => onUpdate({ fontWeight: isBold ? "normal" : "bold" })}
            className={cn(
              "flex-1 py-2 flex justify-center transition-all",
              isBold
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-400 hover:bg-slate-50",
            )}
            title="Negrito"
          >
            <Bold className="w-4 h-4" />
          </button>

          {/* BOTÃO ITÁLICO ATUALIZADO */}
          <button
            onClick={() =>
              onUpdate({ fontStyle: isItalic ? "normal" : "italic" })
            }
            className={cn(
              "flex-1 py-2 border-l flex justify-center transition-all",
              isItalic
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-400 hover:bg-slate-50",
            )}
            title="Itálico"
          >
            <Italic className="w-4 h-4" />
          </button>
        </div>

        {/* Alinhamento */}
        <div className="flex border rounded-lg overflow-hidden flex-1 shadow-sm">
          {(["left", "center", "right", "justify"] as const).map((a) => (
            <button
              key={a}
              onClick={() => onUpdate({ textAlign: a })}
              className={cn(
                "flex-1 py-2 flex justify-center border-l first:border-0 transition-all",
                textAlign === a
                  ? "bg-slate-100 text-blue-600 font-bold"
                  : "bg-white text-slate-400 hover:bg-slate-50",
              )}
            >
              {a === "left" && <AlignLeft className="w-4 h-4" />}
              {a === "center" && <AlignCenter className="w-4 h-4" />}
              {a === "right" && <AlignRight className="w-4 h-4" />}
              {a === "justify" && <AlignJustify className="w-4 h-4" />}
            </button>
          ))}
        </div>
      </div>

      {/* --- TIPOGRAFIA AVANÇADA (NOVO) --- */}
      <div className="pt-4 border-t border-slate-100 space-y-4">
        <Label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-2">
          <Type className="w-3 h-3" /> Avançado
        </Label>

        <div className="grid grid-cols-2 gap-4">
          {/* Altura da Linha */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-[9px] font-bold uppercase text-slate-400 flex items-center gap-1">
                <MoveVertical className="w-3 h-3" /> Altura Linha
              </Label>
              <span className="text-[9px] text-slate-500">
                {styles.lineHeight || 1.5}
              </span>
            </div>
            <Slider
              value={[styles.lineHeight || 1.5]}
              min={0.8}
              max={3}
              step={0.1}
              onValueChange={([v]) => onUpdate({ lineHeight: v })}
            />
          </div>

          {/* Espaçamento Letras */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-[9px] font-bold uppercase text-slate-400 flex items-center gap-1">
                <MoveHorizontal className="w-3 h-3" /> Espaçamento
              </Label>
              <span className="text-[9px] text-slate-500">
                {styles.letterSpacing || 0}px
              </span>
            </div>
            <Slider
              value={[styles.letterSpacing || 0]}
              min={-5}
              max={20}
              step={1}
              onValueChange={([v]) => onUpdate({ letterSpacing: v })}
            />
          </div>
        </div>

        {/* Transformação de Texto */}
        <div className="space-y-2">
          <Label className="text-[9px] font-bold uppercase text-slate-400">
            Transformação
          </Label>
          <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100">
            {[
              { v: "none", i: CaseSensitive, t: "Normal" },
              { v: "uppercase", i: CaseUpper, t: "MAIÚSCULAS" },
              { v: "lowercase", i: CaseLower, t: "minúsculas" },
              { v: "capitalize", i: Type, t: "Capitalizado" },
            ].map((opt) => (
              <button
                key={opt.v}
                onClick={() => onUpdate({ textTransform: opt.v })}
                className={cn(
                  "flex-1 flex justify-center py-1.5 rounded-md transition-all",
                  (styles.textTransform || "none") === opt.v
                    ? "bg-white shadow text-slate-900"
                    : "text-slate-400 hover:text-slate-600",
                )}
                title={opt.t}
              >
                <opt.i className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 2. Cores (AGORA USA O NOVO COMPONENTE) ---
export const ColorControls = ({
  styles,
  onUpdate,
  showTextColor = true,
}: any) => (
  <div className="space-y-4 pt-2">
    <div className="grid grid-cols-1 gap-4">
      {showTextColor && (
        <AdvancedColorPicker
          label="Cor do Texto"
          value={styles.color ?? DEFAULT_STYLES.color}
          onChange={(val) => onUpdate({ color: val })}
        />
      )}
      <AdvancedColorPicker
        label="Cor de Fundo"
        value={styles.backgroundColor ?? DEFAULT_STYLES.backgroundColor}
        onChange={(val) => onUpdate({ backgroundColor: val })}
      />
    </div>
  </div>
);

// --- 3. Tamanho e Ajuste (SizeControls) ---
export const SizeControls = ({
  styles,
  onUpdate,
  showObjectFit = false,
}: any) => {
  return (
    <div className="space-y-4 pt-2 border-t border-slate-100">
      <Label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-2">
        <Maximize className="w-3 h-3" /> Dimensões
      </Label>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <span className="text-[9px] font-bold uppercase text-slate-400">
            Largura
          </span>
          <Input
            className="h-8 text-xs bg-slate-50 border-slate-100 focus:bg-white transition-colors"
            placeholder="100%, 300px"
            value={styles.width ?? "100%"}
            onChange={(e) => onUpdate({ width: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <span className="text-[9px] font-bold uppercase text-slate-400">
            Altura
          </span>
          <Input
            className="h-8 text-xs bg-slate-50 border-slate-100 focus:bg-white transition-colors"
            placeholder="auto, 200px"
            value={styles.height ?? "auto"}
            onChange={(e) => onUpdate({ height: e.target.value })}
          />
        </div>
      </div>

      {showObjectFit && (
        <div className="space-y-1.5">
          <span className="text-[9px] font-bold uppercase text-slate-400">
            Ajuste da Imagem
          </span>
          <Select
            value={styles.objectFit ?? "cover"}
            onValueChange={(value) => onUpdate({ objectFit: value })}
          >
            <SelectTrigger className="w-full h-8 text-xs bg-slate-50 border-slate-100">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cover">Cobrir (Cover)</SelectItem>
              <SelectItem value="contain">Conter (Contain)</SelectItem>
              <SelectItem value="fill">Esticar (Fill)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

// --- 4. Espaçamento (AGORA USA O NOVO COMPONENTE DE LINK) ---
export const BoxModelControls = ({ styles, onUpdate }: any) => {
  return (
    <div className="space-y-6 pt-2 border-t border-slate-100">
      <SpacingControl
        label="Padding (Interno)"
        values={{
          top: styles.paddingTop || 0,
          right: styles.paddingRight || 0,
          bottom: styles.paddingBottom || 0,
          left: styles.paddingLeft || 0,
        }}
        onChange={(newVals) => {
          const updateObj: any = {};
          if (newVals.top !== undefined) updateObj.paddingTop = newVals.top;
          if (newVals.right !== undefined)
            updateObj.paddingRight = newVals.right;
          if (newVals.bottom !== undefined)
            updateObj.paddingBottom = newVals.bottom;
          if (newVals.left !== undefined) updateObj.paddingLeft = newVals.left;
          onUpdate(updateObj);
        }}
      />

      <SpacingControl
        label="Margin (Externo)"
        values={{
          top: styles.marginTop || 0,
          right: styles.marginRight || 0,
          bottom: styles.marginBottom || 0,
          left: styles.marginLeft || 0,
        }}
        onChange={(newVals) => {
          const updateObj: any = {};
          if (newVals.top !== undefined) updateObj.marginTop = newVals.top;
          if (newVals.right !== undefined)
            updateObj.marginRight = newVals.right;
          if (newVals.bottom !== undefined)
            updateObj.marginBottom = newVals.bottom;
          if (newVals.left !== undefined) updateObj.marginLeft = newVals.left;
          onUpdate(updateObj);
        }}
      />
    </div>
  );
};

// --- 5. Decoração (Atualizado com Color Picker Avançado) ---
export const DecorationControls = ({ styles, onUpdate }: any) => {
  const currentShadow = styles.shadow ?? DEFAULT_STYLES.shadow;
  const borderStyles = [
    { value: "solid", label: "Sólida" },
    { value: "dashed", label: "Tracejada" },
    { value: "dotted", label: "Pontilhada" },
    { value: "double", label: "Dupla" },
  ];
  return (
    <div className="space-y-6 pt-2 border-t border-slate-100">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold uppercase text-slate-400">
            Arredondamento
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={0}
              value={styles.borderRadius ?? DEFAULT_STYLES.borderRadius}
              onChange={(e) =>
                onUpdate({ borderRadius: Number(e.target.value) })
              }
              className="h-9 bg-slate-50 border-slate-100"
            />
            <span className="text-[10px] text-slate-400">px</span>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold uppercase text-slate-400">
            Espessura Borda
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={0}
              value={styles.borderWidth ?? DEFAULT_STYLES.borderWidth}
              onChange={(e) =>
                onUpdate({ borderWidth: Number(e.target.value) })
              }
              className="h-9 bg-slate-50 border-slate-100"
            />
            <span className="text-[10px] text-slate-400">px</span>
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[10px] font-bold uppercase text-slate-400">
          Cor da Borda
        </Label>
        <AdvancedColorPicker
          value={styles.borderColor || "transparent"}
          onChange={(val) => onUpdate({ borderColor: val })}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-[10px] font-bold uppercase text-slate-400">
          Estilo da Borda
        </Label>
        <Select
          value={styles.borderStyle ?? DEFAULT_STYLES.borderStyle}
          onValueChange={(value) => onUpdate({ borderStyle: value as any })}
        >
          <SelectTrigger className="w-full h-9 bg-slate-50 border-slate-100 text-xs">
            <SelectValue placeholder="Escolha um estilo..." />
          </SelectTrigger>
          <SelectContent>
            {borderStyles.map((style) => (
              <SelectItem
                key={style.value}
                value={style.value}
                className="text-xs"
              >
                {style.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
          Sombra
        </Label>
        <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100">
          {["none", "sm", "md", "lg"].map((s) => (
            <button
              key={s}
              onClick={() => onUpdate({ shadow: s })}
              className={cn(
                "flex-1 py-1.5 text-[9px] rounded-md font-bold uppercase transition-all",
                currentShadow === s
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-400 hover:text-slate-600",
              )}
            >
              {s === "none" ? "Não" : s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- 6. Animações (Mantém igual) ---
export const AnimationControls = ({ styles, onUpdate }: any) => {
  const animations = [
    { label: "Nenhuma", value: "none", icon: Ban },
    { label: "Surgir", value: "fade", icon: Sparkles },
    { label: "Subir", value: "slide-up", icon: ArrowUp },
    { label: "Descer", value: "slide-down", icon: ArrowDown },
    { label: "Esq.", value: "slide-left", icon: ArrowLeft },
    { label: "Dir.", value: "slide-right", icon: ArrowRight },
    { label: "Zoom In", value: "zoom-in", icon: ZoomIn },
    { label: "Girar", value: "flip", icon: FlipHorizontal },
  ];
  return (
    <div className="space-y-4 pt-4 border-t border-slate-100">
      <Label className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-2">
        <Sparkles className="w-3 h-3 text-blue-500" /> Animação de Entrada
      </Label>
      <div className="grid grid-cols-3 gap-2">
        {animations.map((a) => (
          <button
            key={a.value}
            onClick={() => onUpdate({ animation: a.value })}
            className={cn(
              "flex flex-col items-center gap-1.5 p-2 border rounded-xl text-xs transition-all",
              (styles.animation || "none") === a.value
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-white text-slate-400 border-slate-100 hover:border-blue-100 hover:text-slate-600",
            )}
          >
            <a.icon className="w-4 h-4" />
            <span className="text-[9px] font-bold uppercase">{a.label}</span>
          </button>
        ))}
      </div>
      {styles.animation && styles.animation !== "none" && (
        <div className="grid grid-cols-2 gap-3 animate-in fade-in">
          <div className="space-y-1">
            <span className="text-[9px] font-bold uppercase text-slate-400">
              Duração (s)
            </span>
            <Input
              type="number"
              step="0.1"
              min={0.1}
              value={styles.animationDuration ?? 0.5}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val > 0) onUpdate({ animationDuration: val });
              }}
              className="h-8 bg-slate-50 border-slate-100"
            />
          </div>
          <div className="space-y-1">
            <span className="text-[9px] font-bold uppercase text-slate-400">
              Atraso (s)
            </span>
            <Input
              type="number"
              step="0.1"
              min={0}
              value={styles.animationDelay ?? 0}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val >= 0) onUpdate({ animationDelay: val });
              }}
              className="h-8 bg-slate-50 border-slate-100"
            />
          </div>
        </div>
      )}
    </div>
  );
};
