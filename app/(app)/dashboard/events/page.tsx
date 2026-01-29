import Link from "next/link";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Event } from "@/lib/models/Event";
import { Agency } from "@/lib/models/Agency";
import { User } from "@/lib/models/User";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Edit, Eye, Plus, Settings, Users } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

// Importar o novo componente
import { ClientAccessPopover } from "./_components/client-access-popover";

export const dynamic = 'force-dynamic';

export default async function EventsListPage() {
  const session = await auth();
  await connectDB();

  const user = await User.findOne({ email: session?.user?.email });
  if (!user?.agencyId) return <div className="p-4">Erro: Agência não encontrada</div>;

  const agency = await Agency.findById(user.agencyId).lean();
  if (!agency) return <div className="p-4">Erro: Dados da agência incompletos</div>;

  const events = await Event.find({ agencyId: user.agencyId })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="space-y-6 p-2 sm:p-0">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
             Meus Eventos
           </h1>
           <p className="text-sm sm:text-base text-slate-500">
             Gerencie seus convites digitais.
           </p>
        </div>
        <Button asChild className="w-full sm:w-auto shadow-md">
          <Link href="/dashboard/events/new">
            <Plus className="mr-2 h-4 w-4" /> Novo Evento
          </Link>
        </Button>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-16 sm:py-20 border-2 border-dashed rounded-xl bg-slate-50 mx-auto max-w-lg sm:max-w-none">
           <div className="bg-white p-4 rounded-full inline-block mb-4 shadow-sm">
             <CalendarDays className="h-8 w-8 text-slate-400" />
           </div>
           <h3 className="text-lg font-medium text-slate-900">Nenhum evento criado</h3>
           <p className="text-slate-500 mb-6 max-w-xs sm:max-w-sm mx-auto px-4">
             Comece a criar convites incríveis para seus clientes agora mesmo.
           </p>
           <Button asChild variant="outline">
              <Link href="/dashboard/events/new">Criar Primeiro Evento</Link>
           </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {events.map((event) => (
            <Card key={event._id.toString()} className="flex flex-col hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge variant={event.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                    {event.status === 'PUBLISHED' ? 'Publicado' : 'Rascunho'}
                  </Badge>
                  <div className="text-[10px] sm:text-xs text-slate-400 uppercase font-semibold tracking-wider">
                    {event.eventType}
                  </div>
                </div>
                <CardTitle className="text-lg pt-2 leading-tight line-clamp-2 min-h-[3rem]">
                  {event.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 pb-4">
                 <div className="flex items-center text-sm text-slate-500 mb-2">
                   <CalendarDays className="mr-2 h-4 w-4 shrink-0" />
                   <span className="truncate">
                     {event.date ? format(new Date(event.date), "PPP", { locale: pt }) : "Sem data"}
                   </span>
                 </div>
                 
                 <div className="flex items-center w-full bg-slate-50 p-2 rounded text-xs text-slate-500 border border-slate-100">
                   <span className="shrink-0 text-slate-400 select-none">/</span>
                   <span className="truncate min-w-0 font-mono ml-1">
                     {event.slug}
                   </span>
                 </div>
              </CardContent>
              
              {/* --- FOOTER REORGANIZADO --- */}
              <CardFooter className="pt-0 flex flex-col gap-2">
                
                {/* Linha 1: Botões de Ação Rápida */}
                <div className="grid grid-cols-4 gap-2 w-full">
                  <Button asChild variant="default" className="bg-blue-600 hover:bg-blue-700 p-0" title="Editar Design">
                    <Link href={`/dashboard/events/${event._id}/editor`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="p-0" title="Gerenciar Convidados">
                    <Link href={`/dashboard/events/${event._id}/guests`}>
                      <Users className="h-4 w-4 text-slate-600" />
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="p-0" title="Configurações">
                    <Link href={`/dashboard/events/${event._id}/settings`}>
                      <Settings className="h-4 w-4 text-slate-600" />
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="p-0" title="Ver Site">
                    <Link 
                      href={`/sites/${agency.slug}/${event.slug}`} 
                      target="_blank"
                    >
                      <Eye className="h-4 w-4 text-slate-600" />
                    </Link>
                  </Button>
                </div>

                {/* Linha 2: Botão para o Cliente (Full Width) */}
                <ClientAccessPopover 
                  eventId={event._id.toString()} 
                  managementToken={event.managementToken} 
                />

              </CardFooter>
              {/* --------------------------- */}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}