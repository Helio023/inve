'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deleteEventAction } from "@/features/events/actions";

export function DeleteEventArea({ eventId, eventTitle }: { eventId: string, eventTitle: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    const res = await deleteEventAction(eventId);
    
    if (res.error) {
      toast.error(res.error);
      setDeleting(false);
    } else {
      toast.success("Evento excluído permanentemente.");
      router.push("/dashboard/events");
    }
  };

  return (
    <Card className="border-red-100 bg-red-50/30">
      <CardHeader>
        <CardTitle className="text-red-600 flex items-center gap-2">
          <Trash2 className="w-5 h-5" /> Zona de Perigo
        </CardTitle>
        <CardDescription>
          Ações irreversíveis. Tenha cuidado.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="text-sm text-slate-600">
          <p>Excluir este evento apagará:</p>
          <ul className="list-disc list-inside mt-1 ml-1 text-slate-500">
            <li>O site do convite</li>
            <li>A lista de convidados</li>
            <li>Todas as confirmações (RSVP)</li>
          </ul>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Excluir Evento</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Isso excluirá permanentemente o evento 
                <strong> "{eventTitle}"</strong> e todos os dados associados.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700" disabled={deleting}>
                {deleting ? <Loader2 className="animate-spin w-4 h-4" /> : "Sim, excluir tudo"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}