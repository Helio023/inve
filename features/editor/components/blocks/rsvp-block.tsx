"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Check,
  X,
  Send,
  Users,
  MessageSquare,
  Baby,
  PartyPopper,
  Utensils,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { submitRsvpAction } from "@/features/guests/actions";
import { DEFAULT_STYLES } from "@/features/editor/types";
import { useEventInteraction } from "@/features/editor/components/event-interaction-context";
import { getTypographyStyle } from "@/features/editor/utils";
import { cn } from "@/lib/utils";

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

  const { menuSelections } = useEventInteraction();
  const s = { ...DEFAULT_STYLES, ...styles };

  // --- CAPTURA DE ESTILOS ---
  const titleStyle = getTypographyStyle(s, "title");
  const descStyle = getTypographyStyle(s, "desc");
  const labelStyle = getTypographyStyle(s, "label");

  const inputBaseStyle = {
    backgroundColor: s.inputBackgroundColor || "#fff",
    borderRadius: s.inputBorderRadius ? `${s.inputBorderRadius}px` : "12px",
    borderColor: s.inputBorderColor || "#e2e8f0",
    color: s.inputTextColor || "#1e293b",
  };

  const activeColor = s.btnBackgroundColor || "#0f172a";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEditorPreview) {
      toast.success("Modo Editor: Resposta simulada!");
      setIsDone(true);
      return;
    }
    if (!token) {
      toast.error("Acesse pelo link do convite.");
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("token", token);
    formData.append("status", status);
    if (menuSelections.length > 0) {
      formData.append("menuChoices", JSON.stringify(menuSelections));
    }

    const res = await submitRsvpAction(formData);
    if (res.error) toast.error(res.error);
    else {
      setIsDone(true);
      toast.success("Confirmado!");
    }
    setLoading(false);
  };

  if (isDone && !isEditorPreview) {
    const isConfirmed = status === "CONFIRMED";
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full p-10 text-center bg-white rounded-[2.5rem] shadow-xl border border-slate-100"
      >
        <div
          className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6",
            isConfirmed
              ? "bg-green-50 text-green-600"
              : "bg-red-50 text-red-600",
          )}
        >
          {isConfirmed ? (
            <PartyPopper className="w-10 h-10" />
          ) : (
            <X className="w-10 h-10" />
          )}
        </div>
        <h3 style={titleStyle} className="text-2xl mb-2">
          Resposta Recebida!
        </h3>
        <p style={descStyle} className="mb-8">
          {isConfirmed ? "Presença confirmada!" : "Sentiremos sua falta."}
        </p>
        <button
          onClick={() => setIsDone(false)}
          className="text-[10px] font-black uppercase tracking-widest text-slate-400 underline"
        >
          Alterar
        </button>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col h-auto flex-shrink-0 py-8 px-4 sm:px-6">
      <div className="text-center mb-10">
        <h2
          style={{ ...titleStyle, marginBottom: "0.75rem" }}
          className="text-3xl md:text-4xl"
        >
          {content.title || "R.S.V.P"}
        </h2>
        <p style={descStyle}>
          {content.description || "Confirme sua presença abaixo."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              id: "CONFIRMED",
              label: "Sim, eu vou!",
              icon: Check,
              color: activeColor,
            },
            { id: "DECLINED", label: "Não posso", icon: X, color: "#ef4444" },
          ].map((item) => (
            <label
              key={item.id}
              className={cn(
                "relative cursor-pointer p-5 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3",
                status === item.id
                  ? "shadow-lg scale-[1.02]"
                  : "bg-white/50 border-transparent opacity-60 hover:opacity-100",
              )}
              style={{
                borderColor: status === item.id ? item.color : "transparent",
                backgroundColor:
                  status === item.id ? `${item.color}05` : "white",
              }}
            >
              <input
                type="radio"
                name="status"
                className="hidden"
                onClick={() => setStatus(item.id as any)}
              />
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                style={{
                  backgroundColor: status === item.id ? item.color : "#f1f5f9",
                  color: status === item.id ? "#fff" : "#94a3b8",
                }}
              >
                <item.icon className="w-6 h-6" />
              </div>
              <span
                className={cn(
                  "text-[10px] font-black uppercase tracking-widest",
                  status === item.id ? "text-slate-900" : "text-slate-400",
                )}
              >
                {item.label}
              </span>
            </label>
          ))}
        </div>

        <AnimatePresence>
          {status === "CONFIRMED" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6 overflow-hidden pt-2"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    style={labelStyle}
                    className="text-[10px] uppercase ml-1"
                  >
                    Adultos
                  </Label>
                  <Input
                    type="number"
                    name="adults"
                    min="1"
                    readOnly={isEditorPreview}
                    defaultValue={guest?.confirmedAdults || 1}
                    className={cn(
                      "min-h-[3.5rem] py-3 pl-6 text-lg font-bold shadow-sm transition-all",

                      isEditorPreview &&
                        "focus-visible:ring-0 focus-visible:ring-offset-0 outline-none cursor-default select-none",
                    )}
                    style={inputBaseStyle}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    style={labelStyle}
                    className="text-[10px] uppercase ml-1"
                  >
                    Crianças
                  </Label>
                  <Input
                    type="number"
                    name="kids"
                    min="0"
                    readOnly={isEditorPreview}
                    className={cn(
                      "min-h-[3.5rem] py-3 pl-6 text-lg font-bold shadow-sm transition-all",

                      isEditorPreview &&
                        "focus-visible:ring-0 focus-visible:ring-offset-0 outline-none cursor-default select-none",
                    )}
                    defaultValue={guest?.confirmedKids || 0}
                    style={inputBaseStyle}
                  />
                </div>
              </div>

              {menuSelections.length > 0 && (
                <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-2xl shadow-lg">
                  <div className="flex items-center gap-3">
                    <Utensils className="w-4 h-4 opacity-50" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      {menuSelections.length} Escolhas de Menu
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          <Label style={labelStyle} className="text-[10px] uppercase ml-1">
            Mensagem
          </Label>
          <Textarea
            name="message"
            readOnly={isEditorPreview}
            placeholder="Algum recado especial?"
            rows={3}
            className={cn(
              "p-5 text-sm resize-none shadow-sm transition-all",
              isEditorPreview &&
                "focus-visible:ring-0 focus-visible:ring-offset-0 outline-none cursor-default select-none",
            )}
            style={{ ...inputBaseStyle, fontFamily: s.fontFamily }}
          />
        </div>

        <Button
          type={isEditorPreview ? "button" : "submit"}
          disabled={loading || status === "PENDING"}
          className="w-full min-h-[4rem] text-sm font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all"
          style={{
            backgroundColor: activeColor,
            color: s.btnColor || "#fff",
            borderRadius: s.btnBorderRadius ? `${s.btnBorderRadius}px` : "16px",
            fontFamily: s.fontFamily,
          }}
        >
          {loading ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            content.buttonText || "Confirmar Agora"
          )}
        </Button>
      </form>
    </div>
  );
}
