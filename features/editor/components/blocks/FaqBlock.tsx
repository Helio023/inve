"use client";

import { MessageSquare, HelpCircle, ChevronDown } from "lucide-react";
import { getTypographyStyle } from "@/features/editor/utils";
import { cn } from "@/lib/utils";

export function FaqBlock({ content, styles }: any) {
  const items = content.items || [];
  

  const blockTitleStyle = getTypographyStyle(styles, "title");   
  const questionStyle = getTypographyStyle(styles, "itemTitle"); 
  const answerStyle = getTypographyStyle(styles, "desc");        

  const align = styles.textAlign || "center";
  const alignmentClass = 
    align === "left" ? "items-start text-left" : 
    align === "right" ? "items-end text-right" : 
    "items-center text-center";

  return (
    <div className="w-full flex flex-col p-6 gap-10">
      
      {/* 1. CABEÇALHO DO BLOCO (O NOVO CAMPO QUE ADICIONAMOS) */}
      {content.title && (
        <div className={cn("flex flex-col gap-2 w-full", alignmentClass)}>
          <h2 style={blockTitleStyle}>
            {content.title}
          </h2>
          {/* Linha decorativa elegante */}
          <div 
            className="h-[1.5px] w-12 opacity-30" 
            style={{ 
              backgroundColor: blockTitleStyle.color || "currentColor",
              alignSelf: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start'
            }} 
          />
        </div>
      )}

      {/* 2. LISTA DE PERGUNTAS E RESPOSTAS */}
      <div className="space-y-4 w-full">
        {items.map((item: any, idx: number) => (
          <div 
            key={idx} 
            className="p-6 transition-all duration-300 border border-black/5 shadow-sm"
            style={{ 
              backgroundColor: "rgba(255,255,255,0.4)", // Fundo sutil para o cartão
              borderRadius: styles.borderRadius ? `${styles.borderRadius}px` : "24px",
            }}
          >
            <div className={cn("flex w-full gap-4", align === 'right' ? 'flex-row-reverse' : 'flex-row')}>
              <div className="mt-1 opacity-20 shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className={cn("flex-1 flex flex-col", alignmentClass)}>
                {/* PERGUNTA (Camada itemTitle) */}
                <h4 style={questionStyle} className="mb-3">
                  {item.q || "Pergunta?"}
                </h4>
                
                <div className="h-[1px] w-full opacity-5 mb-4 bg-current" />
                
                {/* RESPOSTA (Camada desc) */}
                <p style={answerStyle} className="opacity-70 leading-relaxed">
                  {item.a || "A resposta aparecerá aqui."}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder se não houver itens */}
      {items.length === 0 && (
        <div className="text-center p-12 border-2 border-dashed border-slate-100 rounded-[2.5rem] opacity-20">
          <HelpCircle className="w-8 h-8 mx-auto mb-2" />
          <p className="text-[10px] font-bold uppercase tracking-widest">Nenhuma dúvida adicionada</p>
        </div>
      )}
    </div>
  );
}