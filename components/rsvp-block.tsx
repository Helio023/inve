"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { submitRsvpAction } from "@/features/guests/actions";

export function RsvpBlock({ content, styles }: any) {
  const searchParams = useSearchParams();
  const token = searchParams.get("c"); // Pega o ?c=TOKEN da URL

  const [status, setStatus] = useState<"PENDING" | "CONFIRMED" | "DECLINED">(
    "PENDING"
  );
  const [loading, setLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      toast.error("Link inválido. Use o link recebido no WhatsApp.");
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("token", token);
    formData.append("status", status);

    const res = await submitRsvpAction(formData);

    if (res.error) {
      toast.error(res.error);
    } else {
      setIsDone(true);
    }
    setLoading(false);
  };

  // Se não tiver token, mostra aviso (modo preview ou link errado)
  if (!token) {
    return (
      <div className="p-6 text-center bg-yellow-50 text-yellow-800 rounded-xl border border-yellow-200 mx-4">
        <p className="font-bold">Modo de Visualização</p>
        <p className="text-sm mt-1">
          Para testar o RSVP, você precisa acessar através de um link de
          convidado real (Dashboard - Convidados).
        </p>
      </div>
    );
  }

  // Tela de Sucesso
  if (isDone) {
    return (
      <div className="p-8 text-center bg-white/90 backdrop-blur rounded-2xl shadow-lg mx-4 animate-in zoom-in">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Resposta Enviada!</h3>
        <p className="text-slate-600 mt-2">
          Obrigado por confirmar. Os noivos ficarão felizes em saber.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 w-full">
      <Card className="p-6 bg-white/95 backdrop-blur shadow-xl border-0 rounded-2xl">
        <h2 className="text-2xl font-serif font-bold text-center mb-6 text-slate-800">
          {content.title || "Confirme sua Presença"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seleção Sim/Não */}
          <div className="grid grid-cols-2 gap-4">
            <label
              className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${
                status === "CONFIRMED"
                  ? "border-green-500 bg-green-50"
                  : "border-slate-200 hover:border-green-200"
              }`}
            >
              <input
                type="radio"
                name="attendance"
                className="hidden"
                onClick={() => setStatus("CONFIRMED")}
              />
              <CheckCircle2
                className={`w-8 h-8 ${
                  status === "CONFIRMED" ? "text-green-600" : "text-slate-300"
                }`}
              />
              <span
                className={`font-bold text-sm ${
                  status === "CONFIRMED" ? "text-green-700" : "text-slate-500"
                }`}
              >
                Sim, eu vou
              </span>
            </label>

            <label
              className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${
                status === "DECLINED"
                  ? "border-red-500 bg-red-50"
                  : "border-slate-200 hover:border-red-200"
              }`}
            >
              <input
                type="radio"
                name="attendance"
                className="hidden"
                onClick={() => setStatus("DECLINED")}
              />
              <XCircle
                className={`w-8 h-8 ${
                  status === "DECLINED" ? "text-red-600" : "text-slate-300"
                }`}
              />
              <span
                className={`font-bold text-sm ${
                  status === "DECLINED" ? "text-red-700" : "text-slate-500"
                }`}
              >
                Não poderei
              </span>
            </label>
          </div>

          {/* Detalhes (Só aparece se confirmar) */}
          {status === "CONFIRMED" && (
            <div className="space-y-4 animate-in slide-in-from-top-2 fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Adultos</Label>
                  <Input
                    type="number"
                    name="adults"
                    min="1"
                    defaultValue="1"
                    className="text-center text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Crianças</Label>
                  <Input
                    type="number"
                    name="kids"
                    min="0"
                    defaultValue="0"
                    className="text-center text-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Mensagem (Sempre visível) */}
          <div className="space-y-2">
            <Label>Mensagem aos Noivos (Opcional)</Label>
            <Textarea
              name="message"
              placeholder="Deixe uma mensagem de carinho..."
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-lg font-bold bg-slate-900 hover:bg-slate-800"
            disabled={loading || status === "PENDING"}
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <Send className="mr-2 w-5 h-5" />
            )}
            Enviar Resposta
          </Button>
        </form>
      </Card>
    </div>
  );
}
