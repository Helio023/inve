"use client";
import { PlayCircle } from "lucide-react";
import { getContainerStyle, formatVideoUrl } from "../../utils";
import { cn } from "@/lib/utils";

export const VideoBlock = ({ block, styles: s }: any) => {
  const content = block.content;
  const videoSrc = formatVideoUrl(content?.url);

  // LÓGICA DE ALTURA SEGURA (Senior Tip)
  // Se o usuário não definiu uma altura (auto), usamos 300px como base para o player
  const heightStyle = s.height && s.height !== "auto" ? s.height : "300px";

  return (
    <div
      style={{
        ...getContainerStyle(s),
        height: heightStyle,
        minHeight: "200px",
      }}
      className="w-full relative overflow-hidden group/video shadow-inner bg-black"
    >
      {videoSrc ? (
        <iframe
          src={videoSrc}
          className="w-full h-full absolute inset-0 z-10"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-white/10 text-slate-400 p-8 transition-colors group-hover/video:bg-slate-800">
          <div className="p-4 bg-white/5 rounded-2xl shadow-sm border border-white/10 transition-transform group-hover/video:scale-110 duration-300">
            <PlayCircle className="w-8 h-8 text-red-500 opacity-80" />
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
              Player de Vídeo
            </p>
            <p className="text-[9px] text-white/40 font-bold uppercase mt-1 tracking-tight">
              Insira o link do YouTube no painel lateral
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
