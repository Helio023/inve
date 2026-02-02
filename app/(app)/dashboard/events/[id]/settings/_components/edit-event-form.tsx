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
import { CalendarIcon, Loader2, Save, Share2, Info } from "lucide-react"; // Share2 adicionado
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { updateEventAction } from "@/features/events/actions";

export function EditEventForm({ event }: { event: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(event.date ? new Date(event.date) : undefined);
  const [coverImage, setCoverImage] = useState(event.coverImage);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append('eventId', event._id);
    
    if (date) formData.append('date', format(date, 'yyyy-MM-dd'));
    if (coverImage) formData.append('coverImage', coverImage);

    const res = await updateEventAction(formData);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Configurações atualizadas!");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* 1. Dados Básicos */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
           <div className="space-y-2">
              <Label>Nome do Evento (Interno)</Label>
              <Input name="title" defaultValue={event.title} required placeholder="Ex: Casamento Ana e João" />
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
        </CardContent>
      </Card>

      {/* 2. Configurações de Partilha (WhatsApp / SEO) */}
      <Card className="border-blue-100 bg-blue-50/20">
        <CardHeader>
          <div className="flex items-center gap-2">
             <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Share2 className="w-5 h-5" /></div>
             <div>
               <CardTitle className="text-lg">Aparência na Partilha</CardTitle>
               <CardDescription>Como o link vai aparecer no WhatsApp, Facebook, etc.</CardDescription>
             </div>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8">
          
          {/* Coluna Imagem */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              Imagem de Capa (Thumbnail)
              <Info className="w-3 h-3 text-slate-400" />
            </Label>
            <div className="bg-white rounded-xl border border-slate-200 p-1">
               <ImageUpload 
                 value={coverImage}
                 onChange={(url) => setCoverImage(url)}
               />
            </div>
            <p className="text-[11px] text-slate-500">
              Recomendado: Formato Horizontal (1200x630px).
            </p>
          </div>

          {/* Coluna Texto */}
          <div className="space-y-4">
             <div className="space-y-2">
                <Label>Título na Partilha</Label>
                <Input disabled value={event.title} className="bg-slate-100 text-slate-500" />
                <p className="text-[10px] text-slate-400">O título é o mesmo do evento.</p>
             </div>

             <div className="space-y-2">
                <Label>Descrição Curta</Label>
                <Textarea 
                  name="description" 
                  defaultValue={event.description} 
                  placeholder="Ex: Estamos muito felizes em convidar-te para celebrar o nosso amor..." 
                  rows={4}
                  className="bg-white"
                />
                <p className="text-[10px] text-slate-500">
                  Esta mensagem aparece por baixo do título no WhatsApp.
                </p>
             </div>
          </div>

        </CardContent>
      </Card>

      {/* Botão Salvar Flutuante ou Fixo */}
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={loading} size="lg" className="min-w-[150px] shadow-lg bg-slate-900 hover:bg-slate-800">
          {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
          Salvar Configurações
        </Button>
      </div>
    </form>
  );
}