import Link from "next/link";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Event } from "@/lib/models/Event";
import { Agency } from "@/lib/models/Agency";
import { User } from "@/lib/models/User";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarDays, Edit, Eye, Plus, Settings, Users, 
  ChevronLeft, ChevronRight, Inbox
} from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

import { ClientAccessPopover } from "./_components/client-access-popover";
import { SearchInput } from "./_components/search-input";

export const dynamic = 'force-dynamic';


type SearchParams = Promise<{ q?: string; page?: string }>;

export default async function EventsListPage({ searchParams }: { searchParams: SearchParams }) {

  const params = await searchParams;
  const q = params.q || "";
  const page = Number(params.page) || 1;
  
  
  const limit = 8; 
  const skip = (page - 1) * limit;

  await connectDB();
  const session = await auth();
  
  const user = await User.findOne({ email: session?.user?.email });
  if (!user?.agencyId) return <div className="p-8 text-center font-bold">Agência não vinculada ao usuário.</div>;

  const agency = await Agency.findById(user.agencyId).lean() as any;

 
  const filter: any = { agencyId: user.agencyId };
  if (q) {
    
    const escapedQuery = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.title = { $regex: escapedQuery, $options: "i" };
  }

  
  const [events, totalEvents] = await Promise.all([
    Event.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Event.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(totalEvents / limit);

  return (
    <div className="space-y-6 p-2 sm:p-0 pb-20">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
           <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Meus Eventos</h1>
           <p className="text-sm sm:text-base text-slate-500">Gerencie e acompanhe seus convites.</p>
        </div>
        <Button asChild className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 shadow-md">
          <Link href="/dashboard/events/new">
            <Plus className="mr-2 h-4 w-4" /> Novo Evento
          </Link>
        </Button>
      </div>

      {/* FERRAMENTAS: BUSCA E CONTADOR */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
        <SearchInput />
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
          {totalEvents} {totalEvents === 1 ? 'Evento' : 'Eventos'} Encontrados
        </div>
      </div>

      {/* LISTAGEM DE CARDS */}
      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
           <Inbox className="h-12 w-12 text-slate-300 mb-4" />
           <h3 className="text-lg font-semibold text-slate-900">
             {q ? `Nenhuma correspondência para "${q}"` : "Sua lista está vazia"}
           </h3>
           <p className="text-slate-500 text-sm mb-6">Tente ajustar sua busca ou crie um novo convite.</p>
           {q && <Button asChild variant="outline"><Link href="/dashboard/events">Limpar Filtros</Link></Button>}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {events.map((event: any) => (
              <Card key={event._id.toString()} className="group flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-slate-200/60 overflow-hidden bg-white">
                <CardHeader className="pb-3 bg-slate-50/50">
                  <div className="flex justify-between items-start mb-2">
                    <Badge 
                      variant={event.status === 'PUBLISHED' ? 'default' : 'secondary'} 
                      className={event.status === 'PUBLISHED' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
                    >
                      {event.status === 'PUBLISHED' ? 'Publicado' : 'Rascunho'}
                    </Badge>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{event.eventType}</span>
                  </div>
                  <CardTitle className="text-lg leading-tight line-clamp-2 min-h-[3rem] font-bold text-slate-800">
                    {event.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1 pt-4 pb-4">
                   <div className="flex items-center text-sm text-slate-600 mb-4">
                     <CalendarDays className="mr-2 h-4 w-4 text-blue-500" />
                     <span className="font-medium">
                       {event.date ? format(new Date(event.date), "dd 'de' MMMM", { locale: pt }) : "Data a definir"}
                     </span>
                   </div>
                   <div className="bg-slate-100/50 p-2.5 rounded-lg text-[11px] font-mono text-slate-500 truncate border border-slate-200/50">
                     <span className="opacity-50 mr-1">URL:</span>/{event.slug}
                   </div>
                </CardContent>
                
                <CardFooter className="pt-0 flex flex-col gap-2 bg-slate-50/30 border-t border-slate-100 p-4">
                  <div className="grid grid-cols-4 gap-2 w-full">
                    <Button asChild variant="default" className="bg-slate-900 hover:bg-blue-600 transition-colors p-0" title="Editor">
                      <Link href={`/dashboard/events/${event._id}/editor`}><Edit className="h-4 w-4" /></Link>
                    </Button>
                    <Button asChild variant="outline" className="p-0 hover:border-blue-200 hover:bg-blue-50" title="Convidados">
                      <Link href={`/dashboard/events/${event._id}/guests`}><Users className="h-4 w-4" /></Link>
                    </Button>
                    <Button asChild variant="outline" className="p-0" title="Configurações">
                      <Link href={`/dashboard/events/${event._id}/settings`}><Settings className="h-4 w-4" /></Link>
                    </Button>
                    <Button asChild variant="outline" className="p-0" title="Visualizar">
                      <Link href={`/sites/${agency.slug}/${event.slug}`} target="_blank"><Eye className="h-4 w-4" /></Link>
                    </Button>
                  </div>
                  <ClientAccessPopover eventId={event._id.toString()} managementToken={event.managementToken} />
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* BARRA DE PAGINAÇÃO (Responsiva) */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm w-fit mx-auto">
              <Button
                variant="ghost"
                size="sm"
                disabled={page <= 1}
                asChild={page > 1}
                className="hover:bg-slate-100 disabled:opacity-30 px-2 sm:px-4"
              >
                {page > 1 ? (
                  <Link href={`?q=${q}&page=${page - 1}`} className="flex items-center gap-2">
                    <ChevronLeft className="h-4 w-4" /> 
                    <span className="hidden sm:inline">Anterior</span>
                  </Link>
                ) : (
                  <div className="flex items-center gap-2">
                    <ChevronLeft className="h-4 w-4" /> 
                    <span className="hidden sm:inline">Anterior</span>
                  </div>
                )}
              </Button>

              <div className="flex items-center gap-1 font-mono">
                <span className="text-sm font-bold text-slate-900 px-3 py-1 bg-slate-100 rounded-md">{page}</span>
                <span className="text-sm text-slate-400 font-medium">/ {totalPages}</span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                disabled={page >= totalPages}
                asChild={page < totalPages}
                className="hover:bg-slate-100 disabled:opacity-30 px-2 sm:px-4"
              >
                {page < totalPages ? (
                  <Link href={`?q=${q}&page=${page + 1}`} className="flex items-center gap-2">
                    <span className="hidden sm:inline">Próximo</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline">Próximo</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}