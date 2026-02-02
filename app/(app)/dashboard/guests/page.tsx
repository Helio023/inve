import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Guest } from "@/lib/models/Guest";
import { Event } from "@/lib/models/Event";
import { User } from "@/lib/models/User";
import { redirect } from "next/navigation";
import Link from "next/link";

import { ExportButton } from "@/app/(app)/dashboard/guests/_components/export-button";
import { GlobalAddGuest } from "./_components/global-add-guest";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  ExternalLink,
  Users,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  Utensils,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const GUESTS_PER_PAGE = 10;

export default async function AllGuestsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; eventId?: string; page?: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { q: query = "", eventId = "all", page = "1" } = await searchParams;
  const currentPage = Math.max(1, parseInt(page));

  await connectDB();

  const user = await User.findOne({ email: session.user?.email });
  if (!user?.agencyId) return <div className="p-6">Agência não encontrada</div>;

  // 1. Buscar todos os eventos para o filtro
  const activeEvents = await Event.find({ agencyId: user.agencyId })
    .select("title _id")
    .sort({ title: 1 })
    .lean();

  const formattedEvents = activeEvents.map((e: any) => ({
    id: e._id.toString(),
    title: e.title,
  }));

  // 2. Construir o Filtro
  const filter: any = { agencyId: user.agencyId };
  if (query) filter.name = { $regex: query, $options: "i" };
  if (eventId !== "all") filter.eventId = eventId;

  // 3. Consultas paginadas
  const totalFiltered = await Guest.countDocuments(filter);
  const totalPages = Math.ceil(totalFiltered / GUESTS_PER_PAGE);

  const rawGuests = await Guest.find(filter)
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * GUESTS_PER_PAGE)
    .limit(GUESTS_PER_PAGE)
    .populate("eventId", "title slug")
    .lean();

  const serializedGuests = rawGuests.map((guest: any) => ({
    ...guest,
    _id: guest._id.toString(),
    agencyId: guest.agencyId.toString(),
    eventId: guest.eventId
      ? { ...guest.eventId, _id: guest.eventId._id.toString() }
      : null,
    createdAt: guest.createdAt ? new Date(guest.createdAt).toISOString() : null,
    menuChoices: guest.menuChoices
      ? JSON.parse(JSON.stringify(guest.menuChoices))
      : [],
  }));

  const currentEventName =
    eventId === "all"
      ? "Todos os Eventos"
      : formattedEvents.find((e) => e.id === eventId)?.title || "Evento";

  return (
    <div className="space-y-6 p-4 md:p-0 pb-24 w-full max-w-[100vw] overflow-x-hidden">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Convidados
          </h1>
          <p className="text-sm text-slate-500 pr-10">
            Controle e exportação de listas por evento.
          </p>
        </div>

        <div className="flex justify-between  items-center">
          <div className="flex gap-2 flex-col md:flex-row">
            <ExportButton
              filters={{ q: query, eventId }}
              eventName={currentEventName}
            />
            <GlobalAddGuest events={formattedEvents} />
          </div>
        </div>
      </div>

      {/* BARRA DE BUSCA + FILTRO */}
      <Card className="p-2 border-slate-200 shadow-sm">
        <form className="flex flex-col md:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              name="q"
              placeholder="Buscar por nome..."
              className="pl-9 border-none shadow-none focus-visible:ring-0 h-10"
              defaultValue={query}
            />
          </div>

          <div className="h-px md:h-6 md:w-px bg-slate-200 my-auto" />

          <div className="w-full md:w-64">
            <Select name="eventId" defaultValue={eventId}>
              <SelectTrigger className="border-none shadow-none focus:ring-0 h-10">
                <SelectValue placeholder="Todos os eventos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Eventos</SelectItem>
                {formattedEvents.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="bg-slate-900 h-10 px-6">
            Filtrar
          </Button>
        </form>
      </Card>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* VISÃO DESKTOP */}
        <div className="hidden md:block">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="pl-6">Convidado</TableHead>
                <TableHead>Evento</TableHead>
                <TableHead>Menu</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Gerir</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {serializedGuests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="p-0">
                    <EmptyState />
                  </TableCell>
                </TableRow>
              ) : (
                serializedGuests.map((guest: any) => (
                  <TableRow key={guest._id} className="hover:bg-slate-50/30">
                    <TableCell className="pl-6 font-medium text-slate-900">
                      {guest.name}
                    </TableCell>
                    <TableCell className="text-xs text-blue-600 font-bold">
                      {guest.eventId?.title}
                    </TableCell>
                    <TableCell>
                      {guest.menuChoices.length > 0 && (
                        <Utensils className="w-3 h-3 text-amber-500" />
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusPill status={guest.status} />
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <Link
                          href={`/dashboard/events/${guest.eventId?._id}/guests`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* VISÃO MOBILE */}
        <div className="md:hidden divide-y divide-slate-100">
          {serializedGuests.length === 0 ? (
            <EmptyState />
          ) : (
            serializedGuests.map((guest: any) => (
              <div
                key={guest._id}
                className="p-4 flex justify-between items-center bg-white"
              >
                <div className="min-w-0 flex-1 pr-4">
                  <p className="font-bold text-slate-900 truncate">
                    {guest.name}
                  </p>
                  <p className="text-[10px] text-blue-500 uppercase font-bold">
                    {guest.eventId?.title}
                  </p>
                </div>
                <StatusDot status={guest.status} />
              </div>
            ))
          )}
        </div>

        {/* PAGINAÇÃO */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 border-t border-slate-200">
            <p className="text-xs text-slate-500 font-medium">
              Pág. {currentPage} de {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={currentPage === 1}
                asChild={currentPage !== 1}
              >
                {currentPage === 1 ? (
                  <ChevronLeft className="w-4 h-4" />
                ) : (
                  <Link
                    href={`?page=${currentPage - 1}&q=${query}&eventId=${eventId}`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Link>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={currentPage === totalPages}
                asChild={currentPage !== totalPages}
              >
                {currentPage === totalPages ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <Link
                    href={`?page=${currentPage + 1}&q=${query}&eventId=${eventId}`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// COMPONENTE EMPTY STATE INTERNO
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
      <div className="bg-slate-50 p-4 rounded-full mb-4">
        <UserIcon className="w-10 h-10 text-slate-200" />
      </div>
      <p className="text-slate-400 font-medium text-sm">
        Nenhum convidado encontrado.
      </p>
      <p className="text-slate-300 text-xs mt-1 px-10">
        Tente ajustar o filtro ou o termo de busca.
      </p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: any = {
    CONFIRMED: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    DECLINED: "bg-red-50 text-red-700 ring-red-600/10",
    PENDING: "bg-slate-50 text-slate-600 ring-slate-500/10",
  };
  const labels: any = {
    CONFIRMED: "Confirmado",
    DECLINED: "Recusado",
    PENDING: "Pendente",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase ring-1 ring-inset",
        styles[status],
      )}
    >
      {labels[status]}
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  const colors: any = {
    CONFIRMED: "bg-emerald-500",
    DECLINED: "bg-red-500",
    PENDING: "bg-slate-300",
  };
  return (
    <div
      className={cn(
        "h-2.5 w-2.5 rounded-full ring-4 ring-white shadow-sm",
        colors[status],
      )}
    />
  );
}
