import connectDB from "@/lib/db";
import { Event } from "@/lib/models/Event";
import { Guest } from "@/lib/models/Guest";
import mongoose from "mongoose";
import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  XCircle,
  Clock,
  Users,
  Building2,
  Phone,
  UserCheck,
  CheckCircle2,
  Music,
  ExternalLink,
  Disc,
  Utensils,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { CheckInDialog } from "../_components/check-in-dialog";
import { ExportButton } from "@/app/(app)/dashboard/guests/_components/export-button";
import { Badge } from "@/components/ui/badge";
import { ClientDate } from "../_components/client-date";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ key: string }>;
}

const isValidUrl = (string: string) => {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
};

export default async function HostDashboardPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const { key } = await searchParams;

  if (!mongoose.Types.ObjectId.isValid(id)) return notFound();

  try {
    await connectDB();
    const eventDoc = await Event.findOne({ _id: id, managementToken: key })
      .populate("agencyId")
      .lean();
    if (!eventDoc) return notFound();

    const rawGuests = await Guest.find({ eventId: id })
      .sort({ name: 1 })
      .lean();

    /**
     * ESTRATÉGIA DE SERIALIZAÇÃO PROFUNDA (Deep Serialization)
     * Isso converte ObjectIds, Dates e Buffers em strings/objetos puros.
     * Resolve o erro: "Only plain objects can be passed to Client Components"
     */
    const guests = JSON.parse(JSON.stringify(rawGuests));
    const event = JSON.parse(JSON.stringify(eventDoc));
    const agency = event.agencyId;

    const confirmedRSVP = guests.filter((g: any) => g.status === "CONFIRMED");
    const presentFamilies = confirmedRSVP.filter((g: any) => g.checkedIn);
    const totalPeopleInside = presentFamilies.reduce(
      (acc: number, g: any) =>
        acc + (g.arrivedAdults || 0) + (g.arrivedKids || 0),
      0,
    );
    const progressPercentage =
      confirmedRSVP.length > 0
        ? (presentFamilies.length / confirmedRSVP.length) * 100
        : 0;

    const allSongRequests = guests.flatMap((guest: any) =>
      (guest.songRequests || []).map((song: string) => ({
        song,
        guestName: guest.name,
        isUrl: isValidUrl(song),
      })),
    );

    return (
      <div className="min-h-screen bg-slate-50/50 pb-20 font-sans overflow-x-hidden">
        {/* HEADER */}
        <header className="bg-white border-b sticky top-0 z-40 shadow-sm backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
                <Building2 className="w-3 h-3" /> Painel do Anfitrião
              </span>
              <h1 className="text-lg md:text-xl font-bold text-slate-900 truncate">
                {event.title}
              </h1>
            </div>
            <ExportButton
              filters={{ eventId: id }}
              eventName={`${event.title}_RSVP`}
            />
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-slate-900 text-white border-none shadow-xl relative overflow-hidden">
              <CardContent className="p-6 md:p-8 relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Famílias no Local
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-black">
                    {presentFamilies.length}
                  </span>
                  <span className="text-slate-400 text-sm">
                    / {confirmedRSVP.length} confirmadas
                  </span>
                </div>
                <div className="mt-4 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-1000"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-lg border-l-4 border-l-green-500">
              <CardContent className="p-6 md:p-8 flex justify-between items-center">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Pessoas Presentes
                  </p>
                  <div className="text-4xl md:text-5xl font-black text-slate-900 tabular-nums">
                    {totalPeopleInside}
                  </div>
                </div>
                <Users className="text-green-600/20 w-12 h-12 shrink-0" />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              label="Vai"
              value={confirmedRSVP.length}
              icon={CheckCircle2}
              color="text-green-600"
              bg="bg-green-50"
            />
            <StatCard
              label="Não"
              value={guests.filter((g: any) => g.status === "DECLINED").length}
              icon={XCircle}
              color="text-red-500"
              bg="bg-red-50"
            />
            <StatCard
              label="Pendente"
              value={guests.filter((g: any) => g.status === "PENDING").length}
              icon={Clock}
              color="text-amber-500"
              bg="bg-amber-50"
            />
            <StatCard
              label="Total"
              value={guests.length}
              icon={Users}
              color="text-slate-600"
              bg="bg-slate-50"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-sm font-black uppercase text-slate-500 tracking-widest flex items-center gap-2 px-1">
                <Users className="w-4 h-4" /> Gestão de Convidados
              </h2>

              {/* MOBILE CARDS */}
              <div className="grid grid-cols-1 gap-3 md:hidden">
                {guests.map((guest: any) => (
                  <Card
                    key={guest._id}
                    className={cn(
                      "border-slate-200 shadow-sm",
                      guest.checkedIn && "bg-green-50/50 border-green-100",
                    )}
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-900 truncate">
                            {guest.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {guest.phone || "Sem contacto"}
                          </p>
                        </div>
                        <StatusBadge status={guest.status} />
                      </div>

                      <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-100">
                        <div className="flex-1 min-w-0">
                          {guest.checkedIn ? (
                            <div className="text-[10px] font-bold text-green-700 uppercase truncate">
                              {guest.arrivedAdults}A + {guest.arrivedKids}C •{" "}
                              <ClientDate
                                date={guest.checkedInAt}
                                mode="time"
                              />
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-300 uppercase font-bold tracking-tighter">
                              Sem entrada
                            </span>
                          )}
                        </div>
                        <CheckInDialog guest={guest} eventId={id} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* DESKTOP TABLE */}
              <div className="hidden md:block bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="pl-6">Convidado</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-center">Ação</TableHead>
                      <TableHead>Entrada</TableHead>
                      <TableHead>Menu</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guests.map((guest: any) => (
                      <TableRow
                        key={guest._id}
                        className={cn(guest.checkedIn ? "bg-green-50/30" : "")}
                      >
                        <TableCell className="pl-6 py-4">
                          <p className="font-bold text-slate-900 text-sm leading-none mb-1">
                            {guest.name}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            {guest.phone}
                          </span>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={guest.status} />
                        </TableCell>
                        <TableCell className="text-center">
                          <CheckInDialog guest={guest} eventId={id} />
                        </TableCell>
                        <TableCell>
                          {guest.checkedIn ? (
                            <div className="flex flex-col text-[10px] font-bold leading-tight">
                              <span className="text-green-700">
                                {guest.arrivedAdults}A + {guest.arrivedKids}C
                              </span>
                              <span className="text-slate-300 font-mono mt-0.5">
                                <ClientDate
                                  date={guest.checkedInAt}
                                  mode="time"
                                />
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-200">--</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {(guest.menuChoices || []).map(
                              (c: any, i: number) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="text-[8px] bg-amber-50 text-amber-700 uppercase font-black px-1 border-amber-200"
                                >
                                  {c.item}
                                </Badge>
                              ),
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* BARRA LATERAL (MÚSICAS) */}
            <div className="space-y-6">
              <Card className="border-purple-100 shadow-lg overflow-hidden bg-white">
                <CardHeader className="bg-linear-to-r from-purple-50 to-white pb-3 border-b border-purple-100">
                  <CardTitle className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-purple-900">
                    <span className="flex items-center gap-2">
                      <Disc className="w-4 h-4 text-purple-600 animate-spin-slow" />{" "}
                      Músicas
                    </span>
                    <Badge className="bg-purple-600 text-white text-[10px]">
                      {allSongRequests.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {allSongRequests.length > 0 ? (
                    <div className="max-h-100 overflow-y-auto divide-y divide-purple-50">
                      {allSongRequests.map((req: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-4 hover:bg-purple-50/30 flex items-start gap-3 min-w-0"
                        >
                          <Music className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                          <div className="min-w-0 flex-1">
                            {req.isUrl ? (
                              <a
                                href={req.song}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-bold text-blue-600 hover:underline break-all flex items-center gap-1"
                              >
                                Ver Link{" "}
                                <ExternalLink className="w-3 h-3 shrink-0" />
                              </a>
                            ) : (
                              <p className="text-xs font-bold text-slate-800 wrap-break-word leading-tight">
                                {req.song}
                              </p>
                            )}
                            <p className="text-[9px] text-slate-400 mt-1 font-medium">
                              De: {req.guestName}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-10 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                      Sem pedidos
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* SUPORTE */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-black text-slate-800 text-[10px] uppercase border-b pb-2 tracking-widest">
                  Suporte
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">
                      Agência Responsável
                    </p>
                    <p className="text-xs font-bold text-slate-800">
                      {agency?.name || "Suporte"}
                    </p>
                  </div>
                  {agency?.phone && (
                    <a
                      href={`https://wa.me/${agency.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      className="text-xs font-bold flex items-center justify-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg border border-green-100 w-full"
                    >
                      <Phone size={14} /> WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function StatCard({ label, value, icon: Icon, color, bg }: any) {
  return (
    <Card className="bg-white border border-slate-200 shadow-sm overflow-hidden">
      <CardContent className="p-3 md:p-5 flex flex-col items-center justify-center text-center text-balance">
        <div className={cn("p-2 rounded-full mb-1.5", bg)}>
          <Icon className={cn("w-4 h-4 md:w-5 md:h-5", color)} />
        </div>
        <p className="text-[8px] md:text-[9px] font-black uppercase text-slate-400 tracking-tighter leading-none">
          {label}
        </p>
        <p
          className={cn(
            "text-lg md:text-2xl font-black mt-1 leading-none",
            color,
          )}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    CONFIRMED: "bg-green-50 text-green-600 border-green-200",
    DECLINED: "bg-red-50 text-red-600 border-red-200",
    PENDING: "bg-slate-50 text-slate-400 border-slate-200",
  };
  const labels: any = { CONFIRMED: "VAI", DECLINED: "NÃO", PENDING: "---" };
  return (
    <span
      className={cn(
        "px-1.5 py-0.5 rounded text-[8px] font-black border tracking-tighter inline-block shrink-0",
        styles[status],
      )}
    >
      {labels[status]}
    </span>
  );
}
