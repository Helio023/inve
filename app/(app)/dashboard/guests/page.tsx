import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Guest } from "@/lib/models/Guest";
import { Event } from "@/lib/models/Event";
import { User } from "@/lib/models/User";
import { redirect } from "next/navigation";
import Link from "next/link";

import { ExportButton } from "@/app/(app)/dashboard/guests/_components/export-button";
import { GlobalAddGuest } from "./_components/global-add-guest";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Phone,
  CalendarDays,
  Filter,
  User as UserIcon,
  Utensils, // <--- NOVO ÍCONE
} from "lucide-react";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gestão de Convidados | Invite SaaS",
};

export default async function AllGuestsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const params = await searchParams;
  const query = params.q || "";

  await connectDB();

  const user = await User.findOne({ email: session.user?.email });
  if (!user?.agencyId) return <div className="p-6">Agência não encontrada</div>;

  const activeEvents = await Event.find({ agencyId: user.agencyId })
    .select("title _id")
    .lean();

  const formattedEvents = activeEvents.map((e: any) => ({
    id: e._id.toString(),
    title: e.title,
  }));

  const filter: any = { agencyId: user.agencyId };
  if (query) {
    filter.name = { $regex: query, $options: "i" };
  }

  const rawGuests = await Guest.find(filter)
    .sort({ createdAt: -1 })
    .limit(50)
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
    // --- ALTERAÇÃO CIRÚRGICA 1: GARANTIR QUE MENU CHOICES É LIMPO ---
    menuChoices: guest.menuChoices ? JSON.parse(JSON.stringify(guest.menuChoices)) : [],
    // ----------------------------------------------------------------
  }));

  const totalGuests = await Guest.countDocuments({ agencyId: user.agencyId });
  const confirmedGuests = await Guest.countDocuments({
    agencyId: user.agencyId,
    status: "CONFIRMED",
  });

  return (
    <div className="space-y-8 p-4 md:p-0 pb-24 w-full max-w-[100vw] overflow-x-hidden">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Convidados
          </h1>
          <p className="text-slate-500 mt-1">
            CRM de convidados e controle de presença.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="w-full sm:w-auto [&>button]:w-full">
            <ExportButton
              guests={serializedGuests}
              eventName="Todos os Eventos"
            />
          </div>
          <div className="w-full sm:w-auto [&>button]:w-full">
            <GlobalAddGuest events={formattedEvents} />
          </div>
        </div>
      </div>

      {/* --- MÉTRICAS --- */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-white border border-slate-100 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <div className="p-1.5 bg-slate-100 rounded-md">
              <Users className="w-4 h-4 text-slate-600" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wide">
              Total
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 ml-1">
            {totalGuests}
          </p>
        </Card>
        <Card className="p-4 bg-white border border-slate-100 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 text-green-600 mb-1">
            <div className="p-1.5 bg-green-50 rounded-md">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wide">
              Confirmados
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 ml-1">
            {confirmedGuests}
          </p>
        </Card>
      </div>

      {/* --- BARRA DE BUSCA --- */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            name="q"
            placeholder="Buscar por nome..."
            className="pl-9 bg-white border-slate-200 shadow-sm h-11"
            defaultValue={query}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 h-11 w-11 border-slate-200"
        >
          <Filter className="h-4 w-4 text-slate-600" />
        </Button>
      </div>

      {/* VISÃO MOBILE */}
      <div className="flex flex-col gap-3 md:hidden">
        {serializedGuests.length === 0 ? (
          <EmptyState />
        ) : (
          serializedGuests.map((guest: any) => (
            <div
              key={guest._id}
              className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-start justify-between gap-3 active:scale-[0.99] transition-transform"
            >
              {/* Esquerda: Avatar e Infos */}
              <div className="flex items-start gap-3 min-w-0">
                <Avatar className="h-10 w-10 border border-slate-100 bg-slate-50 shrink-0 mt-1">
                  <AvatarFallback className="text-slate-600 font-bold text-sm">
                    {guest.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                     <p className="font-semibold text-slate-900 text-base leading-tight truncate">
                        {guest.name}
                     </p>
                     {/* --- ALTERAÇÃO 2: Ícone se tiver escolhido menu --- */}
                     {guest.menuChoices && guest.menuChoices.length > 0 && (
                        <Utensils className="w-3 h-3 text-amber-500" />
                     )}
                  </div>

                  <div className="flex flex-col gap-1 mt-1.5">
                    <div className="flex items-center text-xs text-slate-500">
                      <CalendarDays className="w-3 h-3 mr-1.5 text-slate-400 shrink-0" />
                      <span className="truncate">
                        {guest.eventId
                          ? guest.eventId.title
                          : "Evento excluído"}
                      </span>
                    </div>
                    {guest.phone && (
                      <div className="flex items-center text-xs text-slate-500">
                        <Phone className="w-3 h-3 mr-1.5 text-slate-400 shrink-0" />
                        {guest.phone}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Direita: Status e Botão */}
              <div className="flex flex-col items-end justify-between self-stretch gap-2">
                <StatusDot status={guest.status} />

                {guest.eventId && (
                  <Link href={`/dashboard/events/${guest.eventId._id}/guests`}>
                    <div className="p-2 rounded-full bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </div>
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* VISÃO DESKTOP */}
      <div className="hidden md:block border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6 h-12">Convidado</TableHead>
              <TableHead>Evento</TableHead>
              {/* --- ALTERAÇÃO 3: Coluna Menu --- */}
              <TableHead>Menu</TableHead>
              {/* -------------------------------- */}
              <TableHead>Contato</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right pr-6">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {serializedGuests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <EmptyState />
                </TableCell>
              </TableRow>
            ) : (
              serializedGuests.map((guest: any) => (
                <TableRow
                  key={guest._id}
                  className="group hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0"
                >
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-slate-200 bg-white">
                        <AvatarFallback className="bg-slate-100 text-slate-600 text-xs font-bold">
                          {guest.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-slate-900">
                        {guest.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {guest.eventId ? (
                      <div className="flex items-center text-sm text-slate-600">
                        <span className="truncate max-w-[150px]">
                          {guest.eventId.title}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-red-400">Excluído</span>
                    )}
                  </TableCell>

                  {/* --- ALTERAÇÃO 4: Exibir escolhas do menu --- */}
                  <TableCell className="max-w-[200px]">
                     {guest.menuChoices && guest.menuChoices.length > 0 ? (
                       <div className="flex flex-col gap-1">
                          {guest.menuChoices.map((c: any, i: number) => (
                            <div key={i} className="flex items-center gap-1.5">
                               <Utensils className="w-3 h-3 text-slate-400 shrink-0" />
                               <span className="text-xs text-slate-600 truncate" title={c.item}>{c.item}</span>
                            </div>
                          ))}
                       </div>
                     ) : (
                       <span className="text-xs text-slate-300">-</span>
                     )}
                  </TableCell>
                  {/* ------------------------------------------- */}

                  <TableCell className="text-sm text-slate-500 font-mono">
                    {guest.phone || "-"}
                  </TableCell>
                  <TableCell>
                    <StatusPill status={guest.status} />
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    {guest.eventId && (
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="text-xs h-8"
                      >
                        <Link
                          href={`/dashboard/events/${guest.eventId._id}/guests`}
                        >
                          Gerenciar
                        </Link>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
      <div className="bg-slate-50 p-4 rounded-full mb-3">
        <UserIcon className="h-6 w-6 text-slate-300" />
      </div>
      <p className="text-slate-600 font-medium">Nenhum convidado encontrado</p>
    </div>
  );
}

// Badge mais elegante para Desktop
function StatusPill({ status }: { status: string }) {
  if (status === "CONFIRMED") {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
        Confirmado
      </span>
    );
  }
  if (status === "DECLINED") {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10">
        Recusado
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-500/10">
      Pendente
    </span>
  );
}


function StatusDot({ status }: { status: string }) {
  if (status === "CONFIRMED") {
    return (
      <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded-lg">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <span className="text-[10px] font-bold text-emerald-700 uppercase">
          Sim
        </span>
      </div>
    );
  }
  if (status === "DECLINED") {
    return (
      <div className="flex items-center gap-1.5 bg-red-50 px-2 py-1 rounded-lg">
        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
        <span className="text-[10px] font-bold text-red-700 uppercase">
          Não
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
      <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
      <span className="text-[10px] font-bold text-slate-500 uppercase">
        Pend.
      </span>
    </div>
  );
}