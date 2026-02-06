"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  MessageCircle,
  Copy,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { deleteGuestAction } from "@/features/guests/actions";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface GuestListProps {
  guests: any[];
  eventId: string;
  baseUrl: string;
  eventDescription?: string;
}

export function GuestList({
  guests,
  eventId,
  baseUrl,
  eventDescription,
}: GuestListProps) {
  const [guestToDelete, setGuestToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Remove barra final da baseUrl se existir para evitar links como //evento
  const safeBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

  const generateMessage = (name: string, uniqueLink: string) => {
    if (eventDescription && eventDescription.trim() !== "") {
      return `Olá ${name}! 👋\n\n${eventDescription}\n\nLink do convite:\n${uniqueLink}`;
    }

    return (
      `Olá ${name}! 👋\n\n` +
      `Você foi convidado para um momento muito especial.\n` +
      `Toque no link abaixo para ver o convite e confirmar sua presença:\n\n` +
      `${uniqueLink}`
    );
  };

  const confirmDelete = async () => {
    if (!guestToDelete) return;
    setIsDeleting(true);
    const res = await deleteGuestAction(guestToDelete, eventId);
    if (res.error) {
      toast.error("Erro ao remover convidado.");
    } else {
      toast.success("Convidado removido com sucesso.");
    }
    setIsDeleting(false);
    setGuestToDelete(null);
  };

  const copyLink = (token: string, name: string) => {
    // Aqui usamos a safeBaseUrl que já não tem o /sites/
    const uniqueLink = `${safeBaseUrl}?c=${token}`;
    const message = generateMessage(name, uniqueLink);

    navigator.clipboard.writeText(message);
    toast.success("Mensagem copiada!", { description: "Pronto para colar." });
  };

  const openWhatsApp = (phone: string, token: string, name: string) => {
    const uniqueLink = `${safeBaseUrl}?c=${token}`;
    const text = generateMessage(name, uniqueLink);

    const message = encodeURIComponent(text);
    // Remove espaços ou caracteres do telefone se houver
    const cleanPhone = phone.replace(/\s+/g, "");
    window.open(`https://wa.me/258${cleanPhone}?text=${message}`, "_blank");
  };

  if (guests.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 bg-slate-50/50 rounded-xl border-2 border-dashed border-slate-200">
        <p className="text-sm font-medium">Sua lista está vazia.</p>
        <p className="text-xs mt-1">
          Use o formulário ao lado para adicionar o primeiro convidado.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {guests.map((guest) => (
          <Card
            key={guest._id}
            className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-slate-800 text-base">
                    {guest.name}
                  </p>
                  <StatusBadge status={guest.status} />
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                  <span className="bg-slate-100 px-2 py-0.5 rounded">
                    Token: {guest.inviteToken}
                  </span>
                  {guest.phone && <span>{guest.phone}</span>}
                </div>
              </div>

              <div className="flex items-center gap-2 justify-end">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 text-slate-600 hover:text-blue-600 hover:border-blue-200"
                  onClick={() => copyLink(guest.inviteToken, guest.name)}
                  title="Copiar mensagem"
                >
                  <Copy className="w-4 h-4" />
                </Button>

                {guest.phone && (
                  <Button
                    size="icon"
                    className="h-9 w-9 bg-[#25D366] hover:bg-[#128C7E] text-white border-none shadow-sm"
                    onClick={() =>
                      openWhatsApp(guest.phone, guest.inviteToken, guest.name)
                    }
                    title="Enviar no WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-red-400 hover:text-red-600 hover:bg-red-50"
                  onClick={() => setGuestToDelete(guest._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog
        open={!!guestToDelete}
        onOpenChange={() => !isDeleting && setGuestToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o
              convidado da lista e o link de convite deixará de funcionar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Removendo...
                </>
              ) : (
                "Sim, excluir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "CONFIRMED":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-2 font-medium">
          <CheckCircle2 className="w-3 h-3 mr-1" /> Vai ir
        </Badge>
      );
    case "DECLINED":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none px-2 font-medium">
          <XCircle className="w-3 h-3 mr-1" /> Recusou
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className="text-slate-500 border-slate-200 bg-slate-50 px-2 font-normal"
        >
          <Clock className="w-3 h-3 mr-1" /> Pendente
        </Badge>
      );
  }
}
