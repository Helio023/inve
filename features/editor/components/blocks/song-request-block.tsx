// "use client";

// import { Music, Send, Loader2, Check, Disc3 } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { getTypographyStyle } from "@/features/editor/utils";
// import { useEventInteraction } from "@/features/editor/components/event-interaction-context";
// import { cn } from "@/lib/utils";

// export function SongRequestBlock({ content, styles, isPreview }: any) {
//   const { songDraft, setSongDraft, isSongSent, setSongSent } = useEventInteraction();

//   // --- CAPTURA DE ESTILOS POR CAMADA ---
//   const titleStyle = getTypographyStyle(styles, "title");
//   const inputStyle = getTypographyStyle(styles, "input");
//   const btnStyle = getTypographyStyle(styles, "btn");

//   const radius = styles.inputBorderRadius ? `${styles.inputBorderRadius}px` : "12px";

//   return (
//     <div className="w-full flex flex-col p-6 gap-6">
//       {/* HEADER DINÂMICO */}
//       <div className={cn("flex items-center gap-3", styles.textAlign === 'right' ? 'flex-row-reverse' : 'flex-row', (styles.textAlign === 'center' || !styles.textAlign) && 'justify-center')}>
//         <div className="p-2 bg-slate-900 rounded-full text-white shadow-lg flex shrink-0">
//           <Disc3 className="w-5 h-5 animate-[spin_3s_linear_infinite]" />
//         </div>
//         <h3 style={titleStyle}>{content.title || "Sugira uma Música"}</h3>
//       </div>

//       <AnimatePresence mode="wait">
//         {isSongSent ? (
//           <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4 space-y-3">
//             <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner"><Check className="w-6 h-6" /></div>
//             <p className="text-sm font-bold opacity-60">Pedido enviado com sucesso!</p>
//             <button onClick={() => setSongSent(false)} className="text-[10px] font-black uppercase tracking-widest underline">Pedir outra</button>
//           </motion.div>
//         ) : (
//           <form className="flex flex-col gap-4">
//             <div className="relative group">
//               <input
//                 type="text"
//                 placeholder={content.placeholder || "Nome da música ou artista..."}
//                 value={songDraft}
//                 onChange={(e) => setSongDraft(e.target.value)}
//                 readOnly={!isPreview && isPreview !== undefined}
//                 className="w-full px-5 transition-all outline-none border-2"
//                 style={{
//                   ...inputStyle, // Fonte, cor, tamanho da camada 'input'
//                   height: styles.inputHeight ? `${styles.inputHeight}px` : "56px",
//                   backgroundColor: styles.inputBackgroundColor || "#f8fafc",
//                   borderColor: styles.inputBorderColor || "transparent",
//                   borderRadius: radius,
//                 }}
//               />
//             </div>

//             <button
//               type="button"
//               onClick={() => !isPreview && setSongSent(true)}
//               className="w-full flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl"
//               style={{
//                 ...btnStyle, // Fonte, cor, tamanho da camada 'btn'
//                 backgroundColor: styles.btnBackgroundColor || "#000",
//                 color: styles.btnColor || "#fff",
//                 borderRadius: styles.btnBorderRadius ? `${styles.btnBorderRadius}px` : radius,
//                 height: styles.btnHeight ? `${styles.btnHeight}px` : "56px",
//               }}
//             >
//               <span>{content.buttonText || "Enviar para o DJ"}</span>
//               <Music className="w-4 h-4 opacity-50" />
//             </button>
//           </form>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Music, Send, Loader2, Check, Disc3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getTypographyStyle } from "@/features/editor/utils";
import { useEventInteraction } from "@/features/editor/components/event-interaction-context";
import { submitSongRequestAction } from "@/features/guests/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function SongRequestBlock({ content, styles, isPreview }: any) {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("c");
  const { songDraft, setSongDraft, isSongSent, setSongSent } = useEventInteraction();

  const titleStyle = getTypographyStyle(styles, "title");
  const inputStyle = getTypographyStyle(styles, "input");
  const btnStyle = getTypographyStyle(styles, "btn");
  const radius = styles.inputBorderRadius ? `${styles.inputBorderRadius}px` : "12px";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!songDraft.trim()) return;

    if (isPreview) {
      toast.success("Modo Editor: Pedido simulado!");
      setSongSent(true);
      return;
    }

    if (!token) {
      toast.error("Acesse pelo link do convite.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("token", token);
    formData.append("song", songDraft);

    const res = await submitSongRequestAction(formData);
    if (res.error) {
      toast.error(res.error);
    } else {
      setSongSent(true);
      setSongDraft("");
      toast.success("Música enviada!");
    }
    setLoading(false);
  };

  return (
    <div className="w-full flex flex-col p-6 gap-6 pointer-events-auto">
      <div className={cn("flex items-center gap-3", (styles.textAlign === 'center' || !styles.textAlign) && 'justify-center')}>
        <div className="p-2 bg-slate-900 rounded-full text-white shadow-lg flex shrink-0">
          <Disc3 className={cn("w-5 h-5", loading ? "animate-spin" : "animate-[spin_4s_linear_infinite]")} />
        </div>
        <h3 style={titleStyle}>{content.title || "Sugira uma Música"}</h3>
      </div>

      <AnimatePresence mode="wait">
        {isSongSent ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4 space-y-3">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto"><Check className="w-6 h-6" /></div>
            <p className="text-sm font-bold opacity-60">Pedido enviado!</p>
            <button onClick={() => setSongSent(false)} className="text-[10px] font-black uppercase underline">Pedir outra</button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder={content.placeholder || "Nome da música..."}
                value={songDraft}
                onChange={(e) => setSongDraft(e.target.value)}
                // CORREÇÃO: No editor é readOnly. No real, é editável.
                readOnly={isPreview} 
                className="w-full px-5 h-14 outline-none border-2 transition-all focus:border-blue-400"
                style={{
                  ...inputStyle,
                  backgroundColor: styles.inputBackgroundColor || "#f8fafc",
                  borderColor: styles.inputBorderColor || "transparent",
                  borderRadius: radius,
                }}
              />
            </div>

            <button
              type="submit" 
              disabled={loading || !songDraft.trim()}
              className="w-full flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl disabled:opacity-50"
              style={{
                ...btnStyle,
                backgroundColor: styles.btnBackgroundColor || "#000",
                color: styles.btnColor || "#fff",
                borderRadius: styles.btnBorderRadius ? `${styles.btnBorderRadius}px` : radius,
                height: "56px",
              }}
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                <>
                  <span>{content.buttonText || "Enviar para o DJ"}</span>
                  <Send className="w-4 h-4 opacity-50" />
                </>
              )}
            </button>
          </form>
        )}
      </AnimatePresence>
    </div>
  );
}