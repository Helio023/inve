import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CalendarDays, ArrowRight } from "lucide-react"
import Link from "next/link"

interface EventSummary {
  id: string;
  title: string;
  date: string;
  type: string;
  confirmed: number;
  totalGuests: number; // Confirmados + Pendentes + Recusados
}

export function RecentEvents({ events }: { events: EventSummary[] }) {
  if (events.length === 0) {
    return (
      <div className="space-y-8 text-center p-8">
        <p className="text-sm text-muted-foreground">Nenhum evento recente.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {events.map((event) => {
        // Cálculo de porcentagem seguro
        const percentage = event.totalGuests > 0 
          ? Math.round((event.confirmed / event.totalGuests) * 100) 
          : 0;

        return (
          <div key={event.id} className="flex items-center">
            {/* Ícone ou Avatar do Evento */}
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-blue-50 text-blue-700 font-bold">
                {event.title.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            {/* Info Principal */}
            <div className="ml-4 space-y-1 flex-1">
              <p className="text-sm font-medium leading-none">{event.title}</p>
              <div className="flex items-center gap-2">
                 <span className="text-xs text-muted-foreground">{event.date}</span>
                 <Badge variant="secondary" className="text-[10px] px-1 py-0 h-5">
                    {event.type}
                 </Badge>
              </div>
            </div>

            {/* Barra de Progresso RSVP */}
            <div className="hidden md:block w-[120px] mr-6 text-right">
                <div className="text-xs font-medium mb-1">
                    {event.confirmed} <span className="text-muted-foreground">/ {event.totalGuests}</span>
                </div>
                <Progress value={percentage} className="h-2" />
            </div>

            {/* Ação */}
            <div className="text-sm text-blue-600 font-medium hover:underline cursor-pointer">
               <Link href={`/dashboard/events/${event.id}/editor`}>
                 Editar
               </Link>
            </div>
          </div>
        )
      })}
      
      <div className="pt-4 border-t">
          <Link href="/dashboard/events" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
             Ver todos os eventos <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
      </div>
    </div>
  )
}