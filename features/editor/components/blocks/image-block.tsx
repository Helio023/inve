"use client";
import { ImageIcon } from "lucide-react";
import { getContainerStyle } from "../../utils";

export const ImageBlock = ({ block, styles: s }: any) => {
   const content = block.content; 
  return (
    <div
      style={getContainerStyle(s)}
      className="overflow-hidden group/img relative w-full"
    >
      {content?.url ? (
        <img
          src={block.content.url}
          className="w-full h-full"
          style={{
            objectFit: s.objectFit || "cover",
            minHeight: s.height === "auto" ? "150px" : "100%",
          }}
          alt={block.content.alt || ""}
        />
      ) : (
        <div className="w-full h-full min-h-[200px] bg-slate-50 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-200 text-slate-400 p-8 transition-colors group-hover/img:bg-slate-100 group-hover/img:border-blue-200">
          <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 transition-transform group-hover/img:scale-110">
            <ImageIcon className="w-8 h-8 text-blue-500 opacity-40" />
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Espaço de Imagem</p>
            <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Carregue no painel lateral</p>
          </div>
        </div>
      )}
    </div>
  );
};