"use client";

import { cn } from "@/lib/utils";
import { Utensils, CheckCircle2, Circle } from "lucide-react";
import { useEventInteraction } from "../event-interaction-context";
import { getTypographyStyle } from "@/features/editor/utils"; // <--- Importar

export function MenuRenderer({ content, styles, isPreview }: { content: any; styles: any; isPreview?: boolean }) {
  const sections = content.sections || [];
  const isInteractive = content.isInteractive || false;

  let interaction: any = { menuSelections: [], toggleMenuSelection: () => {} };
  try { interaction = useEventInteraction(); } catch (e) {}
  const { menuSelections, toggleMenuSelection } = interaction;

  const isSelected = (sectionTitle: string, itemName: string) => {
    return menuSelections.some((s: any) => s.section === sectionTitle && s.item === itemName);
  };


  const sectionTitleStyle = {
    ...getTypographyStyle(styles, "title"), 
    borderBottomWidth: "1px",
    borderColor: styles.borderColor || styles.color,
    width: "100%",
    marginBottom: "1rem",
    paddingBottom: "0.5rem",
  };


  const itemTitleStyle = {
    ...getTypographyStyle(styles, ""), 
    fontWeight: "bold", 
  };

  const descStyle = {
    ...getTypographyStyle(styles, "desc"),
    opacity: styles.descColor ? 1 : 0.8,
    marginTop: "0.25rem",
  };

  // 4. Preço (Usa base mas com ajuste)
  const priceStyle = {
    ...getTypographyStyle(styles, ""),
    fontSize: "0.8em",
    opacity: 0.7,
    fontFamily: "monospace"
  };

  // Define alinhamento do container para Flexbox
  const align = styles.textAlign || "center";
  const alignmentClass = align === "left" ? "items-start text-left" : align === "right" ? "items-end text-right" : "items-center text-center";

  return (
    <div className="w-full flex flex-col gap-8 py-4">
      {sections.map((section: any, idx: number) => (
        <div key={idx} className={cn("w-full flex flex-col", alignmentClass)}>
          <h3 style={sectionTitleStyle}>{section.title}</h3>

          <div className={cn("space-y-4 w-full flex flex-col", alignmentClass)}>
            {section.items.map((item: any, i: number) => {
              const selected = isInteractive && !isPreview && isSelected(section.title, item.name);
              return (
                <div
                  key={i}
                  onClick={() => { if (isInteractive && !isPreview) toggleMenuSelection(section.title, item.name); }}
                  className={cn(
                    "flex flex-col relative p-3 rounded-lg transition-all w-full border",
                    alignmentClass,
                    selected ? "bg-black/5 border-black/20" : "border-transparent hover:border-black/5",
                    isInteractive && !isPreview ? "cursor-pointer" : "",
                  )}
                >
                  <div className={cn("flex w-full gap-3 items-center", align === "right" ? "flex-row-reverse" : "flex-row")}>
                    {isInteractive && (
                      <div className="shrink-0">
                        {selected ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <Circle className="w-5 h-5 opacity-30" style={{ color: styles.color }} />}
                      </div>
                    )}

                    <div className={cn("flex-1 flex flex-col", alignmentClass)}>
                      <h4 style={itemTitleStyle}>{item.name}</h4>
                      {item.description && <p style={descStyle}>{item.description}</p>}
                      {item.price && <span style={priceStyle}>{item.price}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      
      {sections.length === 0 && (
        <div className="text-center p-6 border border-dashed border-slate-300 rounded-xl text-slate-400 text-sm w-full">
          <Utensils className="w-8 h-8 mx-auto mb-2 opacity-50" />
          Adicione secções e pratos
        </div>
      )}
    </div>
  );
}