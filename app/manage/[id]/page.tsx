import connectDB from "@/lib/db";
import { Event } from "@/lib/models/Event";
import { Guest } from "@/lib/models/Guest";
import mongoose from "mongoose";
import { notFound } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
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
  Utensils,
  Building2,
  Phone,
  UserCheck,
  CheckCircle2,
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

// Helper para serialização segura
const safeISO = (date: any) => {
  if (!date) return null;
  const d = new Date(date);
  return isNaN(d.getTime()) ? null : d.toISOString();
};

export default async function HostDashboardPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const { key } = await searchParams;


  if (!mongoose.Types.ObjectId.isValid(id)) {
    return notFound();
  }

  try {
    await connectDB();
    const event = await Event.findOne({ _id: id, managementToken: key })
      .populate("agencyId")
      .lean();

    if (!event) {
      return (
        <div className="h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
          <div className="bg-red-100 p-4 rounded-full mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Acesso Negado</h1>
          <p className="text-slate-500">
            O link é inválido ou o acesso expirou.
          </p>
        </div>
      );
    }

    const agency = event.agencyId as any;
    const rawGuests = await Guest.find({ eventId: id })
      .sort({ name: 1 })
      .lean();

    // 2. Serialização Manual e Segura (Evitando stringify/parse em loop)
    const guests = rawGuests.map((g: any) => ({
      ...g,
      _id: g._id.toString(),
      eventId: g.eventId.toString(),
      agencyId: g.agencyId?.toString() || null,
      checkedInAt: safeISO(g.checkedInAt),
      createdAt: safeISO(g.createdAt),
      updatedAt: safeISO(g.updatedAt),
      // Garantir fallbacks para números
      confirmedAdults: g.confirmedAdults || 0,
      confirmedKids: g.confirmedKids || 0,
      arrivedAdults: g.arrivedAdults || 0,
      arrivedKids: g.arrivedKids || 0,
      menuChoices: Array.isArray(g.menuChoices) ? g.menuChoices : [],
    }));

    // 3. Cálculos
    const confirmedRSVP = guests.filter((g) => g.status === "CONFIRMED");
    const declinedRSVP = guests.filter((g) => g.status === "DECLINED");
    const pendingRSVP = guests.filter((g) => g.status === "PENDING");

    const adultsExpected = confirmedRSVP.reduce(
      (acc, g) => acc + g.confirmedAdults,
      0,
    );
    const kidsExpected = confirmedRSVP.reduce(
      (acc, g) => acc + g.confirmedKids,
      0,
    );

    const presentFamilies = confirmedRSVP.filter((g) => g.checkedIn);
    const totalPeopleInside = presentFamilies.reduce(
      (acc, g) => acc + (g.arrivedAdults || 0) + (g.arrivedKids || 0),
      0,
    );

    const progressPercentage =
      confirmedRSVP.length > 0
        ? (presentFamilies.length / confirmedRSVP.length) * 100
        : 0;

    return (
      <div className="min-h-screen bg-slate-50/50 pb-24 font-sans">
        <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                Painel do Anfitrião
              </span>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">
                {event.title}
              </h1>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <ExportButton
                filters={{ eventId: id }}
                eventName={`${event.title}_RSVP`}
              />
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-slate-900 text-white border-none shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                <UserCheck size={80} />
              </div>
              <CardContent className="p-6 relative z-10">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Famílias no Local
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black">
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
              <CardContent className="p-6 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
                    Total de Pessoas (Real)
                  </p>
                  <div className="text-4xl font-black text-slate-900">
                    {totalPeopleInside}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 italic">
                    Adultos e Crianças que entraram
                  </p>
                </div>
                <div className="h-14 w-14 bg-green-50 rounded-full flex items-center justify-center">
                  <Users className="text-green-600 w-8 h-8" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b pb-2 mb-3">
                  <Building2 className="w-4 h-4 text-blue-600" /> Suporte
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                      Agência
                    </p>
                    <p className="text-sm font-semibold">
                      {agency?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                      WhatsApp Suporte
                    </p>
                    <p className="text-sm font-mono flex items-center gap-2">
                      <Phone size={12} className="text-slate-400" />{" "}
                      {agency?.phone || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard
                label="Confirmados"
                value={confirmedRSVP.length}
                icon={CheckCircle2}
                color="text-green-600"
              />
              <StatCard
                label="Recusados"
                value={declinedRSVP.length}
                icon={XCircle}
                color="text-red-500"
              />
              <StatCard
                label="Pendentes"
                value={pendingRSVP.length}
                icon={Clock}
                color="text-amber-500"
              />
              <StatCard
                label="Total Lista"
                value={guests.length}
                icon={Users}
                color="text-slate-600"
              />
            </div>
          </div>

          <Card className="overflow-hidden border-slate-200 shadow-xl">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/80">
                    <TableRow>
                      <TableHead className="pl-6 py-4">Convidado</TableHead>
                      <TableHead>RSVP</TableHead>
                      <TableHead>Check-in</TableHead>
                      <TableHead>Qtd. Real</TableHead>
                      <TableHead>Menu / Mensagem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guests.map((guest) => (
                      <TableRow
                        key={guest._id}
                        className={cn(guest.checkedIn ? "bg-green-50/40" : "")}
                      >
                        <TableCell className="pl-6 py-4">
                          <p className="font-bold text-slate-900">
                            {guest.name}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400">
                              {guest.phone}
                            </span>
                            {guest.checkedInAt && (
                              <Badge
                                variant="outline"
                                className="text-[9px] bg-green-100"
                              >
                                <ClientDate date={guest.checkedInAt} />
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={guest.status} />
                        </TableCell>
                        <TableCell>
                          {guest.status === "CONFIRMED" ? (
                            <CheckInDialog guest={guest} eventId={id} />
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">
                              Aguardando
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {guest.checkedIn ? (
                            <div className="flex flex-col">
                              <span className="text-sm font-black text-green-700">
                                {guest.arrivedAdults + guest.arrivedKids}
                              </span>
                              <span className="text-[9px] text-slate-400">
                                {guest.arrivedAdults}A + {guest.arrivedKids}C
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 mb-1">
                            {guest.menuChoices?.map((c: any, i: number) => (
                              <span
                                key={i}
                                className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[9px] border border-amber-100 font-bold uppercase"
                              >
                                {c.item}
                              </span>
                            ))}
                          </div>
                          {guest.messageToHosts && (
                            <p className="text-[10px] text-slate-400 italic line-clamp-1">
                              {guest.messageToHosts}
                            </p>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  } catch (error) {
    console.error("Dashboard Error:", error);
    throw error; // Deixa o Next.js tratar ou mostra o erro correto
  }
}

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <Card className="bg-white border shadow-sm">
      <CardContent className="p-4 flex flex-col items-center justify-center text-center">
        <div className={cn("p-2 rounded-full mb-2 bg-slate-50")}>
          <Icon className={cn("w-4 h-4", color)} />
        </div>
        <p className="text-[10px] font-black uppercase text-slate-400">
          {label}
        </p>
        <p className={cn("text-2xl font-black", color)}>{value}</p>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    CONFIRMED: "bg-green-100 text-green-700 border-green-200",
    DECLINED: "bg-red-50 text-red-700 border-red-200",
    PENDING: "bg-slate-100 text-slate-600 border-slate-200",
  };
  const labels: any = {
    CONFIRMED: "Confirmado",
    DECLINED: "Recusado",
    PENDING: "Pendente",
  };
  return (
    <span
      className={cn(
        "px-2 py-1 rounded text-[9px] font-bold uppercase border",
        styles[status],
      )}
    >
      {labels[status]}
    </span>
  );
}
