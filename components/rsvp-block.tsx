"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Send,
  Users,
  MessageSquare,
  Baby,
  PartyPopper,
  Utensils
} from "lucide-react";
import { toast } from "sonner";
import { submitRsvpAction } from "@/features/guests/actions";
import { DEFAULT_STYLES } from "@/features/editor/types";
import { useEventInteraction } from "@/features/editor/components/event-interaction-context";
import { getContainerStyle, getTypographyStyle } from "@/features/editor/utils";

interface RsvpBlockProps {
  content: any;
  styles: any;
  isEditorPreview?: boolean;
  guest?: any;
}

export function RsvpBlock({
  content,
  styles,
  isEditorPreview,
  guest,
}: RsvpBlockProps) {
  const searchParams = useSearchParams();
  const token = searchParams.get("c");

  const [status, setStatus] = useState<"PENDING" | "CONFIRMED" | "DECLINED">(
    guest?.status || "PENDING"
  );
  const [loading, setLoading] = useState(false);
  const [isDone, setIsDone] = useState(
    !isEditorPreview && guest && guest.status !== "PENDING"
  );

  // 1. CAPTURA O MENU DO CONTEXTO
  const { menuSelections } = useEventInteraction();

  const s = { ...DEFAULT_STYLES, ...styles };

  const containerStyle = getContainerStyle(s, "container");
  const titleStyle = getTypographyStyle(s, "title");
  const descStyle = getTypographyStyle(s, "desc");
  const labelStyle = getTypographyStyle(s, "label");

  // Estilos Dinâmicos
  const selectionStyle = {
    backgroundColor: s.inputBackgroundColor || "#fff",
    borderRadius: s.inputBorderRadius ? `${s.inputBorderRadius}px` : "12px",
    borderColor: s.inputBorderColor || "#e2e8f0",
  };

  const activeColor = s.btnBackgroundColor || "#000";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isEditorPreview) {
        toast.success("Modo Editor: Resposta simulada!");
        setIsDone(true);
        return;
    }

    if (!token) {
      toast.error("Link de convite inválido.");
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("token", token);
    formData.append("status", status);
    
    // 2. ANEXA O MENU NO ENVIO
    if (menuSelections.length > 0) {
      formData.append("menuChoices", JSON.stringify(menuSelections));
    }

    const res = await submitRsvpAction(formData);
    
    if (res.error) {
      toast.error(res.error);
    } else {
      setIsDone(true);
      toast.success("Resposta enviada!");
    }
    setLoading(false);
  };

  if (isDone && !isEditorPreview) {
    const isConfirmed = status === "CONFIRMED";
    return (
      <div className="p-8 text-center bg-white/95 backdrop-blur rounded-2xl shadow-xl border border-white/50 animate-in zoom-in mx-auto max-w-md mt-8">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isConfirmed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
          {isConfirmed ? <PartyPopper className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
        </div>
        <h3 className="text-xl font-bold text-slate-800">Resposta Recebida!</h3>
        <p className="text-slate-500 mt-2 text-sm">{isConfirmed ? "Estamos ansiosos para te ver!" : "Sentiremos sua falta."}</p>
        <button onClick={() => setIsDone(false)} className="text-xs underline text-slate-400 mt-6 hover:text-slate-600">Alterar resposta</button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto" style={containerStyle}>
      <div className="text-center mb-8">
          <h2 style={{ ...titleStyle, marginBottom: "0.5rem" }}>{content.title || "R.S.V.P"}</h2>
          <p style={{ ...descStyle, opacity: 0.8 }}>{content.description || "Por favor, confirme sua presença."}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* CARDS DE SIM / NÃO */}
        <div className="grid grid-cols-2 gap-4">
            <label className={`relative cursor-pointer p-4 flex flex-col items-center gap-3 border-2 transition-all ${status === "CONFIRMED" ? "scale-[1.02] shadow-md" : "hover:bg-slate-50 opacity-70 hover:opacity-100"}`}
                style={{ 
                    ...selectionStyle,
                    borderColor: status === "CONFIRMED" ? activeColor : selectionStyle.borderColor,
                    color: status === "CONFIRMED" ? activeColor : "#64748b"
                }}
            >
                <input type="radio" name="status" value="CONFIRMED" className="hidden" onClick={() => setStatus("CONFIRMED")} />
                <div className="p-2 rounded-full bg-slate-100"><CheckCircle2 className="w-6 h-6" /></div>
                <span className="font-bold text-sm">Eu vou!</span>
            </label>

            <label className={`relative cursor-pointer p-4 flex flex-col items-center gap-3 border-2 transition-all ${status === "DECLINED" ? "scale-[1.02] shadow-md border-red-200 text-red-600" : "hover:bg-slate-50 opacity-70 hover:opacity-100"}`}
                style={{ ...selectionStyle }}
            >
                <input type="radio" name="status" value="DECLINED" className="hidden" onClick={() => setStatus("DECLINED")} />
                <div className="p-2 rounded-full bg-slate-100"><XCircle className="w-6 h-6" /></div>
                <span className="font-bold text-sm">Não posso</span>
            </label>
        </div>

        {/* CAMPOS DE QUANTIDADE (Com Limites Visíveis) */}
        {status === "CONFIRMED" && (
            <div className="space-y-5 animate-in slide-in-from-top-2 fade-in bg-white/60 p-5 rounded-xl border border-white/50 shadow-sm">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 text-slate-500">
                            <Users className="w-3 h-3" /> Adultos
                        </Label>
                        <Input
                            type="number" name="adults" min="1"
                            max={guest ? guest.maxAllowedGuests : 5}
                            defaultValue={guest?.confirmedAdults || 1}
                            className="text-center font-bold text-lg h-12 bg-white"
                            style={selectionStyle}
                        />
                        <p className="text-[9px] text-center text-slate-400">Máx: {guest?.maxAllowedGuests || 5}</p>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 text-slate-500">
                             <Baby className="w-3 h-3" /> Crianças
                        </Label>
                        <Input
                            type="number" name="kids" min="0"
                            max={guest ? guest.maxAllowedChildren : 0}
                            defaultValue={guest?.confirmedKids || 0}
                            disabled={guest?.maxAllowedChildren === 0}
                            className="text-center font-bold text-lg h-12 bg-white disabled:opacity-50"
                            style={selectionStyle}
                        />
                        <p className="text-[9px] text-center text-slate-400">Máx: {guest?.maxAllowedChildren || 0}</p>
                    </div>
                </div>

                {/* Feedback do Menu Escolhido */}
                {menuSelections.length > 0 && (
                    <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg text-amber-700 text-xs border border-amber-100">
                        <Utensils className="w-4 h-4 shrink-0" />
                        <span>{menuSelections.length} opções de menu selecionadas.</span>
                    </div>
                )}
            </div>
        )}

        <div className="space-y-1.5">
            <Label style={labelStyle} className="text-xs opacity-70 flex items-center gap-1">
                <MessageSquare className="w-3 h-3" /> Mensagem (Opcional)
            </Label>
            <Textarea
                name="message"
                placeholder="Deixe um recado para os noivos..."
                rows={2}
                className="bg-white/80"
                style={{ ...selectionStyle, fontFamily: s.fontFamily }}
                defaultValue={guest?.messageToHosts || ""}
            />
        </div>

        <Button
            type="submit"
            className="w-full h-12 text-base font-bold shadow-lg transition-transform active:scale-95"
            disabled={loading || status === "PENDING"}
            style={{
                backgroundColor: s.btnBackgroundColor || "#000",
                color: s.btnColor || "#fff",
                borderRadius: s.btnBorderRadius ? `${s.btnBorderRadius}px` : "12px",
                fontFamily: s.fontFamily
            }}
        >
            {loading ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2 w-4 h-4" />}
            {content.buttonText || "Enviar Resposta"}
        </Button>
      </form>
    </div>
  );
}