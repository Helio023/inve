'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ImageUpload } from "@/components/image-upload"; 
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2, Save } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { updateEventAction } from "@/features/events/actions";

export function EditEventForm({ event }: { event: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(event.date);
  const [coverImage, setCoverImage] = useState(event.coverImage);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append('eventId', event._id);
    
    // Adiciona campos controlados manualmente
    if (date) formData.append('date', format(date, 'yyyy-MM-dd'));
    if (coverImage) formData.append('coverImage', coverImage);

    const res = await updateEventAction(formData);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Evento atualizado com sucesso!");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalhes Gerais</CardTitle>
        <CardDescription>Estas informações aparecem quando o link é compartilhado.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Coluna 1: Textos */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Título do Evento</Label>
                <Input name="title" defaultValue={event.title} required />
              </div>

              <div className="space-y-2">
                <Label>Descrição (WhatsApp)</Label>
                <Textarea 
                  name="description" 
                  defaultValue={event.description} 
                  placeholder="Ex: Junte-se a nós neste dia especial..." 
                  rows={3}
                />
              </div>

              <div className="space-y-2 flex flex-col">
                <Label>Data do Evento</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("pl-3 text-left font-normal", !date && "text-muted-foreground")}>
                      {date ? format(date, "PPP", { locale: pt }) : "Selecione a data"}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Coluna 2: Imagem */}
            <div className="space-y-2">
              <Label>Imagem de Capa (Thumbnail)</Label>
              <ImageUpload 
                value={coverImage}
                onChange={(url) => setCoverImage(url)}
              />
              <p className="text-[10px] text-slate-500">
                Esta imagem aparecerá no preview do link no WhatsApp e Facebook.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end">
            <Button type="submit" disabled={loading} className="min-w-[120px]">
              {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
              Salvar Alterações
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}