import connectDB from "@/lib/db";
import { Event } from "@/lib/models/Event";
import { Guest } from "@/lib/models/Guest";

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
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Utensils,
  Building2,
  Phone,
} from "lucide-react";



interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ key: string }>;
}

export default async function HostDashboardPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const { key } = await searchParams;

  await connectDB();

  // 1. Validar Token e Buscar Evento + Agência
  const event = await Event.findOne({ _id: id, managementToken: key })
    .populate("agencyId") // Popula os dados da agência
    .lean();

  if (!event) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <div className="bg-red-100 p-4 rounded-full mb-4">
          <XCircle className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Acesso Negado</h1>
        <p className="text-slate-500">
          O link que usou é inválido ou o evento não existe.
        </p>
      </div>
    );
  }

  // Extrair dados da Agência com segurança
  const agency = event.agencyId as any;

  // 2. Buscar Convidados
  const guests = await Guest.find({ eventId: id })
    .sort({ updatedAt: -1 })
    .lean();

  // 3. Serializar Dados
  const serializedGuests = JSON.parse(JSON.stringify(guests));

  // 4. Calcular Estatísticas
  const confirmed = guests.filter((g: any) => g.status === "CONFIRMED");
  const declined = guests.filter((g: any) => g.status === "DECLINED");
  const pending = guests.filter((g: any) => g.status === "PENDING");

  const totalAdults = confirmed.reduce(
    (acc: number, curr: any) => acc + (curr.confirmedAdults || 0),
    0,
  );
  const totalKids = confirmed.reduce(
    (acc: number, curr: any) => acc + (curr.confirmedKids || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header Fixo */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Painel do Anfitrião
            </p>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">
              {event.title}
            </h1>
          </div>
          <div className="bg-slate-100 px-3 py-1 rounded-full text-xs font-medium text-slate-600">
            {new Date(event.date).toLocaleDateString("pt-BR")}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
        {/* SECÇÃO 1: MÉTRICAS E AGÊNCIA */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Card Esquerda: Info da Agência (Suporte) */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
                <Building2 className="w-4 h-4 text-blue-600" />
                Gestão do Evento
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase">
                    Agência / Designer
                  </p>
                  <p className="text-sm font-semibold text-slate-700">
                    {agency?.name || "Agência"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase">
                    Suporte / Contacto
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <p className="text-sm font-mono text-slate-700">
                      {agency?.phone || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumo Rápido */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Users className="w-4 h-4" /> Contagem Final
              </h3>
              <div className="flex justify-between items-center text-sm border-b pb-2 mb-2">
                <span className="text-slate-500">Adultos Confirmados</span>
                <span className="font-bold">{totalAdults}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Crianças Confirmadas</span>
                <span className="font-bold">{totalKids}</span>
              </div>
            </div>
          </div>

          {/* Card Direita: Métricas Grandes */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3 content-start">
            <MetricBox
              label="Confirmados"
              value={confirmed.length}
              color="text-green-600 bg-white border-green-200 shadow-sm"
            />
            <MetricBox
              label="Recusados"
              value={declined.length}
              color="text-red-600 bg-white border-red-200 shadow-sm"
            />
            <MetricBox
              label="Pendentes"
              value={pending.length}
              color="text-amber-600 bg-white border-amber-200 shadow-sm"
            />
            <MetricBox
              label="Total Convidados"
              value={guests.length}
              color="text-slate-700 bg-white border-slate-200 shadow-sm"
            />
          </div>
        </div>

        {/* SECÇÃO 2: TABELA DE CONVIDADOS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">
              Lista de Respostas
            </h2>
          </div>

          <Card className="overflow-hidden border-slate-200 shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow>
                      <TableHead className="pl-6 min-w-[150px]">Nome</TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                      <TableHead className="min-w-[120px]">Pessoas</TableHead>
                      <TableHead className="min-w-[200px]">Detalhes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {serializedGuests.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="h-32 text-center text-slate-500"
                        >
                          Ainda ninguém respondeu ao convite.
                        </TableCell>
                      </TableRow>
                    ) : (
                      serializedGuests.map((guest: any) => (
                        <TableRow
                          key={guest._id}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <TableCell className="font-medium pl-6 text-slate-900">
                            {guest.name}
                            {guest.phone && (
                              <div className="text-xs text-slate-400 font-mono font-normal mt-0.5">
                                {guest.phone}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={guest.status} />
                          </TableCell>
                          <TableCell>
                            {guest.status === "CONFIRMED" ? (
                              <span className="text-xs font-medium bg-slate-100 px-2 py-1 rounded">
                                {guest.confirmedAdults} Ad{" "}
                                {guest.confirmedKids > 0 &&
                                  `+ ${guest.confirmedKids} Cr`}
                              </span>
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              {/* Menu Choices */}
                              {guest.menuChoices &&
                                guest.menuChoices.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5">
                                    {guest.menuChoices.map(
                                      (choice: any, i: number) => (
                                        <span
                                          key={i}
                                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] border border-amber-100"
                                        >
                                          <Utensils className="w-2 h-2" />{" "}
                                          {choice.item}
                                        </span>
                                      ),
                                    )}
                                  </div>
                                )}
                              {/* Mensagem */}
                              {guest.messageToHosts && (
                                <p
                                  className="text-xs text-slate-500 italic truncate max-w-[200px] border-l-2 border-slate-200 pl-2"
                                  title={guest.messageToHosts}
                                >
                                  "{guest.messageToHosts}"
                                </p>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function MetricBox({ label, value, color }: any) {
  return (
    <div
      className={`p-4 rounded-xl border flex flex-col items-center justify-center ${color}`}
    >
      <span className="text-2xl font-black">{value}</span>
      <span className="text-[10px] uppercase font-bold opacity-70 mt-1">
        {label}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    CONFIRMED: "bg-green-100 text-green-700 border-green-200",
    DECLINED: "bg-red-100 text-red-700 border-red-200",
    PENDING: "bg-slate-100 text-slate-600 border-slate-200",
  };
  const labels = {
    CONFIRMED: "Vai",
    DECLINED: "Não vai",
    PENDING: "Pendente",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border ${(styles as any)[status]}`}
    >
      {(labels as any)[status]}
    </span>
  );
}
