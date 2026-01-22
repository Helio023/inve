// "use client";

// import { useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Loader2, CheckCircle2, XCircle, Send } from "lucide-react";
// import { toast } from "sonner";
// import { submitRsvpAction } from "@/features/guests/actions";
// import { DEFAULT_STYLES } from "@/features/editor/types";

// interface RsvpBlockProps {
//   content: any;
//   styles: any;
//   isEditorPreview?: boolean;
// }

// export function RsvpBlock({
//   content,
//   styles,
//   isEditorPreview,
// }: RsvpBlockProps) {
//   const searchParams = useSearchParams();
//   const token = searchParams.get("c");
//   const [status, setStatus] = useState<"PENDING" | "CONFIRMED" | "DECLINED">(
//     "PENDING",
//   );
//   const [loading, setLoading] = useState(false);
//   const [isDone, setIsDone] = useState(false);

//   const s = { ...DEFAULT_STYLES, ...styles };

//   // Helper de sombra
//   const getShadow = (shadowType: string) => {
//     if (shadowType === "sm") return "0 1px 2px rgba(0,0,0,0.05)";
//     if (shadowType === "md") return "0 4px 6px -1px rgba(0,0,0,0.1)";
//     if (shadowType === "lg") return "0 10px 15px -3px rgba(0,0,0,0.1)";
//     return "none";
//   };

//   const inputStyle = {
//     backgroundColor: s.inputBackgroundColor,
//     color: s.inputTextColor,
//     borderColor: s.inputBorderColor,
//     borderWidth: "1px",
//     borderRadius: "8px",
//     boxShadow: getShadow(s.inputShadow), // Aplica sombra configurada
//   };

//   const btnStyle = {
//     backgroundColor: s.btnBackgroundColor,
//     color: s.btnTextColor,
//     borderRadius: `${s.btnRadius}px`,
//     boxShadow: getShadow(s.btnShadow), // Aplica sombra configurada
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!token) {
//       // Se estiver no editor (sem token), apenas avisa
//       if (isEditorPreview) toast.info("No modo editor, o envio é simulado.");
//       else toast.error("Link inválido.");
//       return;
//     }
//     setLoading(true);
//     const formData = new FormData(e.currentTarget);
//     formData.append("token", token);
//     formData.append("status", status);
//     const res = await submitRsvpAction(formData);
//     if (res.error) toast.error(res.error);
//     else setIsDone(true);
//     setLoading(false);
//   };

//   if (isDone) {
//     return (
//       <div className="p-8 text-center bg-white/90 backdrop-blur rounded-xl shadow-sm animate-in zoom-in">
//         <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
//           <CheckCircle2 className="w-10 h-10" />
//         </div>
//         <h3 className="text-xl font-bold text-slate-800">Resposta Enviada!</h3>
//         <p className="text-slate-600 mt-2">Obrigado por confirmar.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full">
//       <div className="flex flex-col gap-6">
//         <h2 className="text-2xl font-serif font-bold text-center text-inherit">
//           {content.title || "Confirme sua Presença"}
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-2 gap-4">
//             <label
//               style={inputStyle}
//               className={`cursor-pointer border p-4 flex flex-col items-center gap-2 transition-all backdrop-blur-sm ${status === "CONFIRMED" ? "ring-2 ring-green-500 border-transparent" : "hover:brightness-95"}`}
//             >
//               <input
//                 type="radio"
//                 name="attendance"
//                 className="hidden"
//                 onClick={() => setStatus("CONFIRMED")}
//               />
//               <CheckCircle2
//                 className={`w-8 h-8 ${status === "CONFIRMED" ? "text-green-600" : "text-slate-300"}`}
//               />
//               <span
//                 className={`font-bold text-sm ${status === "CONFIRMED" ? "text-green-700" : "text-slate-500"}`}
//               >
//                 Sim, vou
//               </span>
//             </label>

//             <label
//               style={inputStyle}
//               className={`cursor-pointer border p-4 flex flex-col items-center gap-2 transition-all backdrop-blur-sm ${status === "DECLINED" ? "ring-2 ring-red-500 border-transparent" : "hover:brightness-95"}`}
//             >
//               <input
//                 type="radio"
//                 name="attendance"
//                 className="hidden"
//                 onClick={() => setStatus("DECLINED")}
//               />
//               <XCircle
//                 className={`w-8 h-8 ${status === "DECLINED" ? "text-red-600" : "text-slate-300"}`}
//               />
//               <span
//                 className={`font-bold text-sm ${status === "DECLINED" ? "text-red-700" : "text-slate-500"}`}
//               >
//                 Não poderei
//               </span>
//             </label>
//           </div>

//           {status === "CONFIRMED" && (
//             <div className="space-y-4 animate-in slide-in-from-top-2 fade-in">
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label className="text-inherit">Adultos</Label>
//                   <Input
//                     type="number"
//                     name="adults"
//                     min="1"
//                     defaultValue="1"
//                     className="text-center text-lg"
//                     style={inputStyle}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label className="text-inherit">Crianças</Label>
//                   <Input
//                     type="number"
//                     name="kids"
//                     min="0"
//                     defaultValue="0"
//                     className="text-center text-lg"
//                     style={inputStyle}
//                   />
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className="space-y-2">
//             <Label className="text-inherit">Mensagem (Opcional)</Label>
//             <Textarea
//               name="message"
//               placeholder="Deixe uma mensagem..."
//               rows={3}
//               style={inputStyle}
//             />
//           </div>

//           <Button
//             type="submit"
//             className="w-full h-12 text-lg font-bold transition-transform active:scale-95"
//             disabled={loading || status === "PENDING"}
//             style={btnStyle}
//           >
//             {loading ? (
//               <Loader2 className="animate-spin mr-2" />
//             ) : (
//               <Send className="mr-2 w-5 h-5" />
//             )}
//             Enviar Resposta
//           </Button>
//         </form>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle2, XCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { submitRsvpAction } from "@/features/guests/actions";
import { DEFAULT_STYLES } from "@/features/editor/types";

interface RsvpBlockProps {
  content: any;
  styles: any;
  isEditorPreview?: boolean;
}

export function RsvpBlock({
  content,
  styles,
  isEditorPreview,
}: RsvpBlockProps) {
  const searchParams = useSearchParams();
  const token = searchParams.get("c");
  const [status, setStatus] = useState<"PENDING" | "CONFIRMED" | "DECLINED">("PENDING");
  const [loading, setLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const s = { ...DEFAULT_STYLES, ...styles };

  const getShadow = (shadowType: string) => {
    if (shadowType === "sm") return "0 1px 2px rgba(0,0,0,0.05)";
    if (shadowType === "md") return "0 4px 6px -1px rgba(0,0,0,0.1)";
    if (shadowType === "lg") return "0 10px 15px -3px rgba(0,0,0,0.1)";
    return "none";
  };

  const inputStyle = {
    backgroundColor: s.inputBackgroundColor,
    color: s.inputTextColor,
    borderColor: s.inputBorderColor,
    borderWidth: "1px",
    borderRadius: "8px",
    boxShadow: getShadow(s.inputShadow),
    // --- ALTERAÇÃO AQUI ---
    fontSize: `${s.fontSize}px`, // Inputs também devem respeitar a fonte
  };

  const btnStyle = {
    backgroundColor: s.btnBackgroundColor,
    color: s.btnTextColor,
    borderRadius: `${s.btnRadius}px`,
    boxShadow: getShadow(s.btnShadow),
    // --- ALTERAÇÃO AQUI ---
    fontSize: `${s.fontSize * 1.1}px`, // Botão pode ter fonte ligeiramente maior
  };

  // --- ALTERAÇÕES AQUI ---
  const baseTextStyle = {
    color: s.color,
    fontFamily: s.fontFamily,
    fontSize: `${s.fontSize}px`,
    fontWeight: s.fontWeight,
    fontStyle: s.fontStyle,
  };

  const titleStyle = {
    ...baseTextStyle,
    fontSize: `${s.fontSize * 1.5}px`, // Título 50% maior que a fonte base
    textAlign: s.textAlign,
  };
  // -----------------------
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // ... (lógica do submit permanece inalterada)
    e.preventDefault();
    if (!token) {
      if (isEditorPreview) toast.info("No modo editor, o envio é simulado.");
      else toast.error("Link inválido.");
      return;
    }
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("token", token);
    formData.append("status", status);
    const res = await submitRsvpAction(formData);
    if (res.error) toast.error(res.error);
    else setIsDone(true);
    setLoading(false);
  };
  
  if (isDone) {
    // ... (tela de sucesso permanece inalterada)
  }

  return (
    // Aplica estilos de texto base ao container
    <div className="w-full" style={{ color: s.color, fontFamily: s.fontFamily, textAlign: s.textAlign }}>
      <div className="flex flex-col gap-6">
        <h2 
          // Classes de texto removidas: 'text-2xl', 'text-center', 'text-inherit'
          className="font-serif font-bold" 
          style={titleStyle}
        >
          {content.title || "Confirme sua Presença"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <label
              style={inputStyle}
              className={`cursor-pointer border p-4 flex flex-col items-center gap-2 transition-all backdrop-blur-sm ${status === "CONFIRMED" ? "ring-2 ring-green-500 border-transparent" : "hover:brightness-95"}`}
            >
              <input type="radio" name="attendance" className="hidden" onClick={() => setStatus("CONFIRMED")}/>
              <CheckCircle2 className={`w-8 h-8 ${status === "CONFIRMED" ? "text-green-600" : "text-slate-300"}`}/>
              <span
                // Classe 'text-sm' removida
                className={`font-bold ${status === "CONFIRMED" ? "text-green-700" : "text-slate-500"}`}
                style={{ fontSize: `${s.fontSize * 0.9}px` }} // Tamanho de fonte proporcional
              >
                Sim, vou
              </span>
            </label>

            <label
              style={inputStyle}
              className={`cursor-pointer border p-4 flex flex-col items-center gap-2 transition-all backdrop-blur-sm ${status === "DECLINED" ? "ring-2 ring-red-500 border-transparent" : "hover:brightness-95"}`}
            >
              <input type="radio" name="attendance" className="hidden" onClick={() => setStatus("DECLINED")}/>
              <XCircle className={`w-8 h-8 ${status === "DECLINED" ? "text-red-600" : "text-slate-300"}`}/>
              <span
                // Classe 'text-sm' removida
                className={`font-bold ${status === "DECLINED" ? "text-red-700" : "text-slate-500"}`}
                style={{ fontSize: `${s.fontSize * 0.9}px` }} // Tamanho de fonte proporcional
              >
                Não poderei
              </span>
            </label>
          </div>

          {status === "CONFIRMED" && (
            <div className="space-y-4 animate-in slide-in-from-top-2 fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 text-left">
                  <Label style={baseTextStyle}>Adultos</Label>
                  <Input type="number" name="adults" min="1" defaultValue="1" className="text-center text-lg" style={inputStyle}/>
                </div>
                <div className="space-y-2 text-left">
                  <Label style={baseTextStyle}>Crianças</Label>
                  <Input type="number" name="kids" min="0" defaultValue="0" className="text-center text-lg" style={inputStyle}/>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2 text-left">
            <Label style={baseTextStyle}>Mensagem (Opcional)</Label>
            <Textarea name="message" placeholder="Deixe uma mensagem..." rows={3} style={inputStyle}/>
          </div>

          <Button
            type="submit"
            className="w-full h-12 font-bold transition-transform active:scale-95"
            disabled={loading || status === "PENDING"}
            style={btnStyle}
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2 w-5 h-5" />}
            Enviar Resposta
          </Button>
        </form>
      </div>
    </div>
  );
}