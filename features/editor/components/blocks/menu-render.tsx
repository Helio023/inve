"use client";

import { cn } from "@/lib/utils";
import { Utensils, Check } from "lucide-react";
import { useEventInteraction } from "../event-interaction-context";
import { getTypographyStyle } from "@/features/editor/utils";
import { motion } from "framer-motion";

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
    const context = useEventInteraction();
    if (context) interaction = context;
  } catch (e) {}

  const { menuSelections, toggleMenuSelection } = interaction;

  const isSelected = (sectionTitle: string, itemName: string) => {
    return (menuSelections || []).some(
      (s: any) => s.section === sectionTitle && s.item === itemName,
    );
  };

  const align = styles.textAlign || "center";
  const alignmentClass =
    align === "left"
      ? "items-start text-left"
      : align === "right"
        ? "items-end text-right"
        : "items-center text-center";

  // CAPTURA DE ESTILOS PUROS (Sem overrides manuais)
  const titleStyles = getTypographyStyle(styles, "title");
  const dishStyles = getTypographyStyle(styles, "itemTitle");
  const descStyles = getTypographyStyle(styles, "desc");

  return (
    <div className="w-full flex flex-col gap-12 py-8 px-4">
      {sections.map((section: any, sIdx: number) => (
        <div key={sIdx} className={cn("w-full flex flex-col", alignmentClass)}>
          {/* SECÇÃO: Título dinâmico */}
          <div className={cn("mb-8 w-full flex flex-col", alignmentClass)}>
            <h3 style={titleStyles} className="pb-2">
              {section.title || "Secção"}
            </h3>
            <div
              className="h-[1px] w-12 opacity-30"
              style={{
                backgroundColor:
                  titleStyles.color || styles.color || "currentColor",
              }}
            />
          </div>

          <div className="space-y-4 w-full flex flex-col">
            {section.items.map((item: any, iIdx: number) => {
              const selected =
                isInteractive &&
                !isPreview &&
                isSelected(section.title, item.name);

              return (
                <div
                  key={iIdx}
                  onClick={() => {
                    if (isInteractive && !isPreview && item.name) {
                      toggleMenuSelection(section.title, item.name);
                    }
                  }}
                  className={cn(
                    "group relative p-5 rounded-2xl transition-all duration-500 w-full border",
                    isInteractive && !isPreview
                      ? "cursor-pointer active:scale-[0.99]"
                      : "",
                    selected
                      ? "bg-white shadow-xl border-slate-200"
                      : "border-transparent hover:bg-slate-50/50",
                  )}
                >
                  <div
                    className={cn(
                      "flex w-full gap-5 items-start",
                      align === "right" ? "flex-row-reverse" : "flex-row",
                    )}
                  >
                    {/* CHECKBOX */}
                    {isInteractive && (
                      <div className="mt-1 shrink-0">
                        <div
                          className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                            selected
                              ? "bg-slate-900 border-slate-900"
                              : "border-slate-200",
                          )}
                        >
                          {selected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                            >
                              <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
                            </motion.div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* PRATO: Todo o estilo (fontSize, textTransform, letterSpacing) vem do dishStyles */}
                    <div className={cn("flex-1 flex flex-col", alignmentClass)}>
                      <div className="flex flex-col gap-1">
                        <h4 style={dishStyles}>
                          {item.name || "Nome do Prato"}
                        </h4>

                        {/* INGREDIENTES: Estilo dinâmico total */}
                        {item.description && (
                          <p style={descStyles}>{item.description}</p>
                        )}

                        {item.price && (
                          <span
                            style={{
                              ...dishStyles,
                              fontSize: "0.8em",
                              opacity: 0.7,
                            }}
                            className="mt-2 font-bold uppercase tracking-widest"
                          >
                            {item.price}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
