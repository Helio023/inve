


"use client";

import { cn } from "@/lib/utils";
import { Utensils, CheckCircle2, Circle } from "lucide-react";
import { useEventInteraction } from "../event-interaction-context";

export function MenuRenderer({
  content,
  styles,
  isPreview,
}: {
  content: any;
  styles: any;
  isPreview?: boolean;
}) {
  const sections = content.sections || [];
  const isInteractive = content.isInteractive || false;


  let interaction: any = { menuSelections: [], toggleMenuSelection: () => {} };
  try {
    interaction = useEventInteraction();
  } catch (e) {
    // Ignora erro silenciosamente
  }

  const { menuSelections, toggleMenuSelection } = interaction;

  const isSelected = (sectionTitle: string, itemName: string) => {
    return menuSelections.some(
      (s: any) => s.section === sectionTitle && s.item === itemName,
    );
  };

  const alignmentClass =
    styles.textAlign === "left"
      ? "items-start text-left"
      : styles.textAlign === "right"
        ? "items-end text-right"
        : "items-center text-center";

  return (
    <div className="w-full flex flex-col gap-8 py-4">
      {sections.map((section: any, idx: number) => (
        <div key={idx} className={cn("w-full flex flex-col", alignmentClass)}>
          <h3
            className="text-lg font-bold uppercase tracking-widest mb-4 border-b pb-2 max-w-[80%]"
            style={{
              color: styles.color,
              fontFamily: styles.fontFamily,
              borderColor: styles.borderColor || styles.color,
              width: "100%",
            }}
          >
            {section.title}
          </h3>

          {/* Lista de Itens */}
          <div className={cn("space-y-4 w-full flex flex-col", alignmentClass)}>
            {section.items.map((item: any, i: number) => {
              // Verifica se este item está selecionado
              const selected =
                isInteractive &&
                !isPreview &&
                isSelected(section.title, item.name);

              return (
                <div
                  key={i}
                  // 2. AÇÃO DE CLIQUE (Toggle)
                  onClick={() => {
                    if (isInteractive && !isPreview) {
                      toggleMenuSelection(section.title, item.name);
                    }
                  }}
                  className={cn(
                    "flex flex-col relative p-3 rounded-lg transition-all w-full border",
                    alignmentClass,
                    // Estilos condicionais de seleção
                    selected
                      ? "bg-black/5 border-black/20"
                      : "border-transparent hover:border-black/5",
                    // Cursor pointer apenas se for interativo e não for preview do editor
                    isInteractive && !isPreview ? "cursor-pointer" : "",
                  )}
                >
                  <div
                    className={cn(
                      "flex w-full gap-3 items-center",
                      styles.textAlign === "right"
                        ? "flex-row-reverse"
                        : "flex-row",
                    )}
                  >
                    {/* UI DE SELEÇÃO (Check ou Círculo) */}
                    {isInteractive && (
                      <div className="shrink-0">
                        {selected ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <Circle
                            className="w-5 h-5 opacity-30"
                            style={{ color: styles.color }}
                          />
                        )}
                      </div>
                    )}

                    <div
                      className={cn("flex-1 flex flex-col", alignmentClass)}
                    >
                      <h4
                        className="font-bold text-base"
                        style={{
                          fontFamily: styles.fontFamily,
                          color: styles.color,
                        }}
                      >
                        {item.name}
                      </h4>
                      {item.description && (
                        <p
                          className="text-xs opacity-80 mt-1"
                          style={{
                            fontFamily: styles.fontFamily,
                            color: styles.color,
                          }}
                        >
                          {item.description}
                        </p>
                      )}
                      {item.price && (
                        <span className="text-xs font-mono opacity-60 mt-1">
                          {item.price}
                        </span>
                      )}
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
          Adicione secções e pratos ao menu
        </div>
      )}
    </div>
  );
}



