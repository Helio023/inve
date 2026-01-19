"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { AlignLeft, AlignCenter, AlignRight, Bold, Italic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEFAULT_STYLES } from "../../types";

export const TypographyControls = ({ styles, onUpdate }: any) => {
  const fonts = [
    { name: "Padrão (Sans)", value: "var(--font-inter)" },
    { name: "Elegante (Serif)", value: "var(--font-playfair)" },
    { name: "Cursiva Moderna", value: "var(--font-dancing)" },
    { name: "Cursiva Clássica", value: "var(--font-vibes)" },
    { name: "Moderna Bold", value: "var(--font-montserrat)" },
  ];

  const fontSize = styles.fontSize ?? DEFAULT_STYLES.fontSize;
  const textAlign = styles.textAlign ?? DEFAULT_STYLES.textAlign;

  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-2">
        <Label className="text-[10px] font-bold uppercase text-slate-400">
          Tipo de Letra
        </Label>
        <select
          className="w-full bg-white border border-slate-200 rounded-md text-xs p-2 outline-none"
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

      <div className="flex justify-between items-center">
        <Label className="text-[10px] font-bold uppercase text-slate-400">
          Tamanho
        </Label>
        <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded">
          {fontSize}px
        </span>
      </div>
      <Slider
        value={[fontSize]}
        min={10}
        max={100}
        step={1}
        onValueChange={([v]) => onUpdate({ fontSize: v })}
      />

      <div className="flex gap-2">
        <div className="flex border rounded-md overflow-hidden flex-1">
          <button
            onClick={() =>
              onUpdate({
                fontWeight: styles.fontWeight === "bold" ? "normal" : "bold",
              })
            }
            className={cn(
              "flex-1 py-2 flex justify-center",
              (styles.fontWeight ?? DEFAULT_STYLES.fontWeight) === "bold"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-400"
            )}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() =>
              onUpdate({
                fontStyle: styles.fontStyle === "italic" ? "normal" : "italic",
              })
            }
            className={cn(
              "flex-1 py-2 border-l flex justify-center",
              (styles.fontStyle ?? DEFAULT_STYLES.fontStyle) === "italic"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-400"
            )}
          >
            <Italic className="w-4 h-4" />
          </button>
        </div>
        <div className="flex border rounded-md overflow-hidden flex-1">
          {(["left", "center", "right"] as const).map((a) => (
            <button
              key={a}
              onClick={() => onUpdate({ textAlign: a })}
              className={cn(
                "flex-1 py-2 flex justify-center border-l first:border-0",
                textAlign === a
                  ? "bg-slate-100 text-blue-600"
                  : "text-slate-400"
              )}
            >
              {a === "left" ? (
                <AlignLeft className="w-4 h-4" />
              ) : a === "center" ? (
                <AlignCenter className="w-4 h-4" />
              ) : (
                <AlignRight className="w-4 h-4" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const BoxModelControls = ({ styles, onUpdate }: any) => {
  const getVal = (key: string) => styles[key] ?? (DEFAULT_STYLES as any)[key];

  return (
    <div className="space-y-6 pt-2 border-t">
      <div className="space-y-3">
        <Label className="text-[10px] font-bold uppercase text-slate-400">
          Espaçamento Interno (Padding)
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
                className="h-8 text-xs bg-slate-50 border-slate-100"
                value={getVal(s.k)}
                onChange={(e) => onUpdate({ [s.k]: Number(e.target.value) })}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <Label className="text-[10px] font-bold uppercase text-slate-400">
          Margem Vertical (Margin)
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { l: "Superior", k: "marginTop" },
            { l: "Inferior", k: "marginBottom" },
          ].map((s) => (
            <div key={s.k} className="space-y-1">
              <span className="text-[9px] text-slate-400 font-bold uppercase">
                {s.l}
              </span>
              <Input
                type="number"
                className="h-8 text-xs bg-slate-50 border-slate-100"
                value={getVal(s.k)}
                onChange={(e) => onUpdate({ [s.k]: Number(e.target.value) })}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ColorControls = ({ styles, onUpdate }: any) => (
  <div className="space-y-4 pt-2">
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label className="text-[10px] font-bold uppercase text-slate-400">
          Cor do Texto
        </Label>
        <input
          type="color"
          value={styles.color ?? DEFAULT_STYLES.color}
          className="w-full h-8 rounded cursor-pointer border"
          onChange={(e) => onUpdate({ color: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-[10px] font-bold uppercase text-slate-400">
          Fundo do Bloco
        </Label>
        <input
          type="color"
          value={styles.backgroundColor ?? DEFAULT_STYLES.backgroundColor}
          className="w-full h-8 rounded cursor-pointer border"
          onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
        />
      </div>
    </div>
  </div>
);

export const DecorationControls = ({ styles, onUpdate }: any) => {
  const currentShadow = styles.shadow ?? DEFAULT_STYLES.shadow;

  return (
    <div className="space-y-4 pt-2 border-t">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold uppercase text-slate-400">
            Arredondamento
          </Label>
          <Input
            type="number"
            value={styles.borderRadius ?? DEFAULT_STYLES.borderRadius}
            onChange={(e) => onUpdate({ borderRadius: Number(e.target.value) })}
            className="h-9"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold uppercase text-slate-400">
            Borda (px)
          </Label>
          <Input
            type="number"
            value={styles.borderWidth ?? DEFAULT_STYLES.borderWidth}
            onChange={(e) => onUpdate({ borderWidth: Number(e.target.value) })}
            className="h-9"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
          Sombra do Bloco
        </Label>
        <div className="flex gap-1.5">
          {["none", "sm", "md", "lg"].map((s) => (
            <button
              key={s}
              onClick={() => onUpdate({ shadow: s })}
              className={cn(
                "flex-1 py-1.5 text-[9px] border rounded-md font-bold uppercase transition-all",
                currentShadow === s
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
              )}
            >
              {s === "none" ? "Sem" : s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
