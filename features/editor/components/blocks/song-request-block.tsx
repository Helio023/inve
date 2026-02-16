"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Music, Send, Loader2, CheckCircle2, Disc3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getContainerStyle, getTypographyStyle } from "@/features/editor/utils";
import { submitSongRequestAction } from "@/features/guests/actions";
import { DEFAULT_STYLES } from "@/features/editor/types";
import { useEventInteraction } from "@/features/editor/components/event-interaction-context";

export function SongRequestBlock({ content, styles, isPreview }: any) {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("c");

  // CONSUMINDO O CONTEXTO GLOBAL
  const { songDraft, setSongDraft, isSongSent, setSongSent } =
    useEventInteraction();

  const s = { ...DEFAULT_STYLES, ...styles };
  const containerStyle = getContainerStyle(s, "container");
  const titleStyle = getTypographyStyle(s, "title");
  const radius = s.inputBorderRadius ? `${s.inputBorderRadius}px` : "50px";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!songDraft.trim()) return;

    if (isPreview) {
      toast.success("Modo Editor: Pedido simulado!");
      setSongSent(true);
      setSongDraft("");
      return;
    }

    if (!token) {
      toast.error("Acesse pelo link do convite para pedir música.");
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
      toast.success("Música enviada para o DJ!");
    }
    setLoading(false);
  };

  return (
    <div style={containerStyle} className="relative w-full">
      <div
        className="flex items-center gap-2 mb-3"
        style={{
          justifyContent:
            s.textAlign === "center"
              ? "center"
              : s.textAlign === "right"
                ? "flex-end"
                : "flex-start",
        }}
      >
        <div className="p-1.5 bg-white/20 rounded-full backdrop-blur-sm border border-white/10">
          <Disc3
            className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
            style={{ color: titleStyle.color }}
          />
        </div>
        <h3 style={{ ...titleStyle, marginBottom: 0 }}>
          {content.title || "Solta o Som"}
        </h3>
      </div>

      {isSongSent ? (
        <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex items-center gap-3 animate-in zoom-in">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <div className="flex-1">
            <p className="text-xs font-bold text-green-800">Anotado!</p>
            <button
              onClick={() => setSongSent(false)}
              className="text-[10px] underline text-green-600 font-bold"
            >
              Pedir outra música
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="relative shadow-sm transition-all focus-within:shadow-md"
          style={{ borderRadius: radius }}
        >
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
            <Music
              className="w-4 h-4 opacity-50"
              style={{ color: s.inputTextColor || "#000" }}
            />
          </div>

          <Input
            placeholder={content.placeholder || "Nome da música..."}
            value={songDraft}
            onChange={(e) => setSongDraft(e.target.value)}
            disabled={loading}
            className="w-full pl-9 pr-12 border-0 bg-white/90 backdrop-blur focus-visible:ring-0 placeholder:text-slate-400"
            style={{
              height: s.inputHeight ? `${s.inputHeight}px` : "48px",
              borderRadius: radius,
              backgroundColor: s.inputBackgroundColor || "#ffffff",
              color: s.inputTextColor || "#1e293b",
            }}
          />

          <div className="absolute inset-y-1 right-1 z-10">
            <Button
              type="submit"
              size="icon"
              disabled={loading || !songDraft}
              className="h-full aspect-square rounded-full transition-all hover:scale-105 active:scale-95"
              style={{
                backgroundColor: s.btnBackgroundColor || "#000",
                color: s.btnColor || "#fff",
                borderRadius: radius,
              }}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
