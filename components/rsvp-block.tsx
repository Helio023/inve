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
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { submitRsvpAction } from "@/features/guests/actions";
import { DEFAULT_STYLES } from "@/features/editor/types";
import { useEventInteraction } from "@/features/editor/components/event-interaction-context";
import { getBackgroundStyle } from "@/features/editor/utils";

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
    guest?.status || "PENDING",
  );
  const [loading, setLoading] = useState(false);
  const [isDone, setIsDone] = useState(
    !isEditorPreview && guest && guest.status !== "PENDING",
  );

  let menuSelections: any[] = [];
  try {
    const ctx = useEventInteraction();
    menuSelections = ctx.menuSelections;
  } catch (e) {}

  const s = { ...DEFAULT_STYLES, ...styles };

  const getShadow = (shadowType: string) => {
    if (shadowType === "sm") return "0 1px 2px rgba(0,0,0,0.05)";
    if (shadowType === "md") return "0 4px 6px -1px rgba(0,0,0,0.1)";
    if (shadowType === "lg") return "0 10px 15px -3px rgba(0,0,0,0.1)";
    return "none";
  };

  // --- ESTILOS DE CAMADAS (ATUALIZADO) ---

  // 1. Estilo dos Campos (Inputs)
  const inputBg = getBackgroundStyle(s.inputBackgroundColor);
  const inputStyle = {
    ...inputBg,
    color: s.inputTextColor || s.inputColor, // Suporte legado
    borderColor: s.inputBorderColor,
    borderRadius: `${s.inputBorderRadius || 8}px`,
    boxShadow: getShadow(s.inputShadow),
    fontSize: `${s.fontSize}px`,
    borderWidth: `${s.inputBorderWidth ?? 1}px`,
    borderStyle: s.inputBorderStyle || "solid",
    fontFamily: s.fontFamily, // Herda a fonte global
  };

  // 2. Estilo do Botão (Btn)
  const btnBg = getBackgroundStyle(s.btnBackgroundColor);
  const btnStyle = {
    ...btnBg,
    color: s.btnColor || s.btnTextColor,
    borderRadius: `${s.btnBorderRadius || s.btnRadius}px`,
    boxShadow: getShadow(s.btnShadow),
    fontSize: s.btnFontSize ? `${s.btnFontSize}px` : `${s.fontSize * 1.1}px`,
    fontWeight: s.btnFontWeight || "bold",
    fontFamily: s.btnFontFamily || s.fontFamily,
    borderWidth: `${s.btnBorderWidth || 0}px`,
    borderColor: s.btnBorderColor || "transparent",
    borderStyle: s.btnBorderStyle || "solid",
    paddingTop: s.btnPaddingTop ? `${s.btnPaddingTop}px` : undefined,
    paddingBottom: s.btnPaddingBottom ? `${s.btnPaddingBottom}px` : undefined,
  };

  // 3. Estilo das Etiquetas (Labels)
  const labelStyle = {
    color: s.labelColor || s.color,
    fontFamily: s.fontFamily, // Labels geralmente herdam
    fontSize: s.labelFontSize ? `${s.labelFontSize}px` : `${s.fontSize * 0.85}px`,
    fontWeight: s.labelFontWeight || "bold",
    textTransform: (s.labelTextTransform || "uppercase") as any,
    display: "block",
    marginBottom: "0.25rem"
  };

  // 4. Estilo do Título Principal
  const titleStyle = {
    color: s.titleColor || s.color,
    fontFamily: s.titleFontFamily || s.fontFamily,
    fontSize: s.titleFontSize ? `${s.titleFontSize}px` : `${s.fontSize * 1.5}px`,
    fontWeight: s.titleFontWeight || "bold",
    textTransform: (s.titleTextTransform || "none") as any,
    textAlign: s.titleTextAlign ? (s.titleTextAlign as any) : (s.textAlign as any),
    marginBottom: "1.5rem",
    lineHeight: s.titleLineHeight || 1.2,
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token && !isEditorPreview) {
      toast.error("Link inválido.");
      return;
    }
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("token", token || "");
    formData.append("status", status);
    if (menuSelections.length > 0) {
      formData.append("menuChoices", JSON.stringify(menuSelections));
    }
    const res = await submitRsvpAction(formData);
    if (res.error) {
      toast.error(res.error);
    } else {
      setIsDone(true);
    }
    setLoading(false);
  };

  if (isDone && !isEditorPreview) {
    const isConfirmed = status === "CONFIRMED";
    return (
      <div
        className="p-8 text-center backdrop-blur rounded-xl shadow-sm border animate-in zoom-in"
        style={{
          backgroundColor: isConfirmed ? "#f0fdf4" : "#fef2f2",
          borderColor: isConfirmed ? "#bbf7d0" : "#fecaca",
        }}
      >
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isConfirmed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
        >
          {isConfirmed ? (
            <CheckCircle2 className="w-10 h-10" />
          ) : (
            <XCircle className="w-10 h-10" />
          )}
        </div>
        <h3 className="text-xl font-bold text-slate-800">
          {isConfirmed ? "Presença Confirmada!" : "Resposta Registada"}
        </h3>
        <p className="text-slate-600 mt-2 text-sm">
          {guest?.name
            ? isConfirmed
              ? `Obrigado por confirmar, ${guest.name.split(" ")[0]}.`
              : "Lamentamos que não possa vir."
            : "A sua resposta foi enviada com sucesso."}
        </p>
        <button
          onClick={() => setIsDone(false)}
          className="text-xs underline text-slate-400 mt-4 hover:text-slate-600"
        >
          Alterar resposta
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col">
        <h2 style={titleStyle}>
          {content.title || "Confirme sua Presença"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* OPÇÃO SIM */}
            <label
              style={{
                ...inputStyle,
                textAlign: "center",
                cursor: "pointer",
                borderColor:
                  status === "CONFIRMED" ? "#22c55e" : s.inputBorderColor,
              }}
              className={`p-4 flex flex-col items-center gap-2 transition-all ${status === "CONFIRMED" ? "ring-2 ring-green-500 ring-offset-1" : "hover:brightness-95"}`}
            >
              <input
                type="radio"
                name="attendance"
                className="hidden"
                onClick={() => setStatus("CONFIRMED")}
              />
              <CheckCircle2
                className="w-8 h-8"
                style={{
                  color: status === "CONFIRMED" ? "#16a34a" : s.inputTextColor,
                  opacity: status === "CONFIRMED" ? 1 : 0.5,
                }}
              />
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: `${s.fontSize * 0.9}px`,
                  color: status === "CONFIRMED" ? "#15803d" : s.inputTextColor,
                }}
              >
                Sim, vou
              </span>
            </label>

            {/* OPÇÃO NÃO */}
            <label
              style={{
                ...inputStyle,
                textAlign: "center",
                cursor: "pointer",
                borderColor:
                  status === "DECLINED" ? "#ef4444" : s.inputBorderColor,
              }}
              className={`p-4 flex flex-col items-center gap-2 transition-all ${status === "DECLINED" ? "ring-2 ring-red-500 ring-offset-1" : "hover:brightness-95"}`}
            >
              <input
                type="radio"
                name="attendance"
                className="hidden"
                onClick={() => setStatus("DECLINED")}
              />
              <XCircle
                className="w-8 h-8"
                style={{
                  color: status === "DECLINED" ? "#dc2626" : s.inputTextColor,
                  opacity: status === "DECLINED" ? 1 : 0.5,
                }}
              />
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: `${s.fontSize * 0.9}px`,
                  color: status === "DECLINED" ? "#b91c1c" : s.inputTextColor,
                }}
              >
                Não poderei
              </span>
            </label>
          </div>

          {status === "CONFIRMED" && (
            <div className="space-y-4 animate-in slide-in-from-top-2 fade-in">
              {guest?.maxAllowedGuests > 0 && (
                <div className="text-xs text-center p-2 bg-blue-50 text-blue-600 rounded border border-blue-100 flex items-center justify-center gap-2">
                  <AlertCircle className="w-3 h-3" />
                  Convite válido para <b>{guest.maxAllowedGuests} pessoas</b>.
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="text-left">
                  <Label style={labelStyle}>Adultos</Label>
                  <Input
                    type="number"
                    name="adults"
                    min="1"
                    max={guest ? guest.maxAllowedGuests : 10}
                    defaultValue={guest?.confirmedAdults || 1}
                    className="text-center text-lg"
                    style={inputStyle}
                  />
                </div>

                <div className="text-left">
                  <Label style={labelStyle}>Crianças</Label>
                  <Input
                    type="number"
                    name="kids"
                    min="0"
                    max={guest ? guest.maxAllowedChildren : 0}
                    defaultValue={guest?.confirmedKids || 0}
                    className="text-center text-lg"
                    style={inputStyle}
                    disabled={guest?.maxAllowedChildren === 0}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="text-left">
            <Label style={labelStyle}>Mensagem (Opcional)</Label>
            <Textarea
              name="message"
              placeholder="Deixe uma mensagem..."
              rows={3}
              style={inputStyle}
              defaultValue={guest?.messageToHosts || ""}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 transition-transform active:scale-95 hover:brightness-110"
            disabled={loading || status === "PENDING"}
            style={btnStyle}
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <Send className="mr-2 w-5 h-5" />
            )}
            Enviar Resposta
          </Button>
        </form>
      </div>
    </div>
  );
}