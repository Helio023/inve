'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { CalendarIcon, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { CreateEventSchema, CreateEventInput } from "@/features/events/schemas";
import { createEventAction } from "@/features/events/actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function NewEventPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inicialização segura para o TypeScript
  const form = useForm<CreateEventInput>({
    resolver: zodResolver(CreateEventSchema),
    defaultValues: {
      title: "",
      slug: "",
      eventType: "wedding",
      // Cast para undefined ser aceito inicialmente como Date
      date: undefined as unknown as Date, 
    }
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue('title', title);
    
    // Slugify
    const slug = title
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
      
    form.setValue('slug', slug);
  };

  const onSubmit = async (data: CreateEventInput) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('slug', data.slug);
      formData.append('eventType', data.eventType);
      
      // Converte Date para String YYYY-MM-DD
      if (data.date) {
        formData.append('date', format(data.date, 'yyyy-MM-dd'));
      } else {
        toast.error("Por favor, selecione uma data.");
        return;
      }

      const result = await createEventAction(formData);

      if (result.error) {
        toast.error("Erro ao criar", { description: result.error });
      } else {
        toast.success("Evento criado com sucesso!");
        router.push(`/dashboard/events`); 
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro inesperado.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Card className="shadow-lg border-slate-200">
        <CardHeader className="bg-slate-50/50 border-b pb-6">
          <CardTitle className="text-xl text-slate-800">Criar Novo Convite</CardTitle>
          <CardDescription>Vamos configurar os detalhes básicos do evento.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* CAMPO TÍTULO */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Evento</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Casamento de Ana & João" 
                        {...field} 
                        onChange={handleTitleChange}
                        className="text-lg font-medium"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CAMPO TIPO DE EVENTO */}
                <FormField
                  control={form.control}
                  name="eventType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="wedding">💍 Casamento</SelectItem>
                          <SelectItem value="birthday">🎂 Aniversário</SelectItem>
                          <SelectItem value="baby_shower">👶 Chá de Bebê</SelectItem>
                          <SelectItem value="corporate">💼 Corporativo</SelectItem>
                          <SelectItem value="other">🎉 Outro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* CAMPO DATA */}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data Real</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: pt })
                              ) : (
                                <span>DD/MM/AAAA</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* CAMPO SLUG */}
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link Personalizado</FormLabel>
                    <div className="flex shadow-sm rounded-md">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm">
                        convite.app/
                      </span>
                      <FormControl>
                        <Input 
                          placeholder="ana-e-joao" 
                          className="rounded-l-none font-mono text-sm" 
                          {...field} 
                        />
                      </FormControl>
                    </div>
                    <FormDescription>
                      Este será o link que você enviará no WhatsApp.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4 border-t mt-4">
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary/90 font-bold min-w-40" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  ) : (
                    <>
                      Criar Convite <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}