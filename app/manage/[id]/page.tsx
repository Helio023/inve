// import connectDB from "@/lib/db";
// import { Event } from "@/lib/models/Event";
// import { Guest } from "@/lib/models/Guest";
// import { notFound } from "next/navigation";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   CheckCircle2,
//   XCircle,
//   Clock,
//   Users,
//   Utensils,
//   Building2,
//   Phone,
//   UserCheck,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { CheckInButton } from "../_components/check-in-button";

// interface PageProps {
//   params: Promise<{ id: string }>;
//   searchParams: Promise<{ key: string }>;
// }

// export default async function HostDashboardPage({
//   params,
//   searchParams,
// }: PageProps) {
//   const { id } = await params;
//   const { key } = await searchParams;

//   await connectDB();

//   // 1. Validar Token e Buscar Evento + Agência
//   const event = await Event.findOne({ _id: id, managementToken: key })
//     .populate("agencyId")
//     .lean();

//   if (!event) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
//         <div className="bg-red-100 p-4 rounded-full mb-4">
//           <XCircle className="w-8 h-8 text-red-600" />
//         </div>
//         <h1 className="text-xl font-bold text-slate-900">Acesso Negado</h1>
//         <p className="text-slate-500">
//           O link que usou é inválido ou o evento não existe.
//         </p>
//       </div>
//     );
//   }

//   const agency = event.agencyId as any;

//   // 2. Buscar Convidados
//   const guests = await Guest.find({ eventId: id })
//     .sort({ updatedAt: -1 })
//     .lean();

//   // 3. Serializar Dados para o Client Component
//   const serializedGuests = JSON.parse(JSON.stringify(guests));

//   // 4. Calcular Estatísticas de RSVP
//   const confirmed = guests.filter((g: any) => g.status === "CONFIRMED");
//   const declined = guests.filter((g: any) => g.status === "DECLINED");
//   const pending = guests.filter((g: any) => g.status === "PENDING");

//   const totalAdults = confirmed.reduce(
//     (acc: number, curr: any) => acc + (curr.confirmedAdults || 0),
//     0,
//   );
//   const totalKids = confirmed.reduce(
//     (acc: number, curr: any) => acc + (curr.confirmedKids || 0),
//     0,
//   );

//   // 5. Calcular Estatísticas de Check-in (Portaria)
//   const guestsPresent = confirmed.filter((g: any) => g.checkedIn).length;
//   const peopleInside = confirmed
//     .filter((g: any) => g.checkedIn)
//     .reduce(
//       (acc: number, curr: any) =>
//         acc + (curr.confirmedAdults || 0) + (curr.confirmedKids || 0),
//       0,
//     );

//   return (
//     <div className="min-h-screen bg-slate-50/50 pb-20">
//       {/* Header Fixo */}
//       <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
//         <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
//           <div>
//             <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
//               Painel do Anfitrião
//             </p>
//             <h1 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">
//               {event.title}
//             </h1>
//           </div>
//           <div className="bg-slate-100 px-3 py-1 rounded-full text-xs font-medium text-slate-600">
//             {new Date(event.date).toLocaleDateString("pt-BR")}
//           </div>
//         </div>
//       </header>

//       <main className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
//         {/* --- NOVO: RESUMO DE PORTARIA --- */}
//         <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
//           <div>
//             <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
//               Controlo de Portaria
//             </p>
//             <h2 className="text-3xl font-black">
//               {guestsPresent}{" "}
//               <span className="text-lg font-normal text-slate-400">
//                 / {confirmed.length} famílias presentes
//               </span>
//             </h2>
//           </div>
//           <div className="bg-white/10 px-6 py-3 rounded-xl border border-white/10 backdrop-blur-md w-full sm:w-auto">
//             <p className="text-[10px] uppercase font-bold text-slate-300 mb-1">
//               Pessoas no Local (Real)
//             </p>
//             <p className="text-2xl font-bold">
//               {peopleInside}{" "}
//               <span className="text-xs font-normal opacity-70">físicas</span>
//             </p>
//           </div>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-6">
//           {/* Card Esquerda: Info da Agência e Contagem Pessoas */}
//           <div className="lg:col-span-1 space-y-4">
//             <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm">
//               <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
//                 <Building2 className="w-4 h-4 text-blue-600" />
//                 Gestão do Evento
//               </h3>
//               <div className="space-y-3">
//                 <div>
//                   <p className="text-xs text-slate-400 font-medium uppercase">
//                     Agência / Designer
//                   </p>
//                   <p className="text-sm font-semibold text-slate-700">
//                     {agency?.name || "Agência"}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-slate-400 font-medium uppercase">
//                     Suporte / Contacto
//                   </p>
//                   <div className="flex items-center gap-2 mt-0.5">
//                     <Phone className="w-3 h-3 text-slate-400" />
//                     <p className="text-sm font-mono text-slate-700">
//                       {agency?.phone || "-"}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
//               <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
//                 <Users className="w-4 h-4 text-slate-800" /> Esperados
//                 (Confirmados)
//               </h3>
//               <div className="flex justify-between items-center text-sm border-b pb-2 mb-2">
//                 <span className="text-slate-500">Adultos</span>
//                 <span className="font-bold">{totalAdults}</span>
//               </div>
//               <div className="flex justify-between items-center text-sm">
//                 <span className="text-slate-500">Crianças</span>
//                 <span className="font-bold">{totalKids}</span>
//               </div>
//             </div>
//           </div>

//           {/* Card Direita: Métricas de Status RSVP */}
//           <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3 content-start">
//             <MetricBox
//               label="Vão (Sim)"
//               value={confirmed.length}
//               color="text-green-600 bg-white border-green-200 shadow-sm"
//             />
//             <MetricBox
//               label="Não Vão"
//               value={declined.length}
//               color="text-red-600 bg-white border-red-200 shadow-sm"
//             />
//             <MetricBox
//               label="Pendentes"
//               value={pending.length}
//               color="text-amber-600 bg-white border-amber-200 shadow-sm"
//             />
//             <MetricBox
//               label="Total Lista"
//               value={guests.length}
//               color="text-slate-700 bg-white border-slate-200 shadow-sm"
//             />
//           </div>
//         </div>

//         {/* SECÇÃO 2: TABELA DE CONVIDADOS COM CHECK-IN */}
//         <div className="space-y-4">
//           <div className="flex items-center justify-between px-1">
//             <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
//               Lista de Convidados
//             </h2>
//           </div>

//           <Card className="overflow-hidden border-slate-200 shadow-sm">
//             <CardContent className="p-0">
//               <div className="overflow-x-auto">
//                 <Table>
//                   <TableHeader className="bg-slate-50/50">
//                     <TableRow>
//                       <TableHead className="pl-6 min-w-[180px]">
//                         Convidado
//                       </TableHead>
//                       <TableHead className="min-w-[100px]">RSVP</TableHead>
//                       <TableHead className="min-w-[140px]">
//                         Portaria (Check-in)
//                       </TableHead>
//                       <TableHead className="min-w-[100px]">Pessoas</TableHead>
//                       <TableHead className="min-w-[200px]">
//                         Escolhas / Mensagem
//                       </TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {serializedGuests.length === 0 ? (
//                       <TableRow>
//                         <TableCell
//                           colSpan={5}
//                           className="h-32 text-center text-slate-500"
//                         >
//                           Nenhum convidado registado.
//                         </TableCell>
//                       </TableRow>
//                     ) : (
//                       serializedGuests.map((guest: any) => (
//                         <TableRow
//                           key={guest._id}
//                           className={cn(
//                             "hover:bg-slate-50/50 transition-colors",
//                             guest.checkedIn &&
//                               "bg-green-50/40 hover:bg-green-50/60",
//                           )}
//                         >
//                           <TableCell className="font-medium pl-6 text-slate-900">
//                             {guest.name}
//                             {guest.checkedInAt && (
//                               <div className="text-[9px] text-green-600 font-bold uppercase mt-1 flex items-center gap-1">
//                                 <Clock className="w-2.5 h-2.5" />
//                                 Entrou às{" "}
//                                 {new Date(guest.checkedInAt).toLocaleTimeString(
//                                   "pt-MZ",
//                                   { hour: "2-digit", minute: "2-digit" },
//                                 )}
//                               </div>
//                             )}
//                           </TableCell>

//                           <TableCell>
//                             <StatusBadge status={guest.status} />
//                           </TableCell>

//                           <TableCell>
//                             {guest.status === "CONFIRMED" ? (
//                               <CheckInButton
//                                 guestId={guest._id}
//                                 eventId={id}
//                                 initialValue={guest.checkedIn}
//                               />
//                             ) : (
//                               <span className="text-[10px] text-slate-400 italic">
//                                 Requer confirmar RSVP
//                               </span>
//                             )}
//                           </TableCell>

//                           <TableCell>
//                             {guest.status === "CONFIRMED" ? (
//                               <div className="text-xs">
//                                 <span className="font-bold">
//                                   {guest.confirmedAdults}A
//                                 </span>
//                                 {guest.confirmedKids > 0 && (
//                                   <span className="text-slate-400 ml-1">
//                                     +{guest.confirmedKids}C
//                                   </span>
//                                 )}
//                               </div>
//                             ) : (
//                               <span className="text-slate-300">-</span>
//                             )}
//                           </TableCell>

//                           <TableCell>
//                             <div className="space-y-2">
//                               {guest.menuChoices &&
//                                 guest.menuChoices.length > 0 && (
//                                   <div className="flex flex-wrap gap-1.5">
//                                     {guest.menuChoices.map(
//                                       (choice: any, i: number) => (
//                                         <span
//                                           key={i}
//                                           className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[9px] border border-amber-100 font-bold uppercase"
//                                         >
//                                           <Utensils className="w-2 h-2" />{" "}
//                                           {choice.item}
//                                         </span>
//                                       ),
//                                     )}
//                                   </div>
//                                 )}
//                               {guest.messageToHosts && (
//                                 <p
//                                   className="text-[11px] text-slate-500 italic truncate max-w-[220px] border-l-2 border-slate-200 pl-2"
//                                   title={guest.messageToHosts}
//                                 >
//                                   "{guest.messageToHosts}"
//                                 </p>
//                               )}
//                             </div>
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </main>
//     </div>
//   );
// }

// function MetricBox({ label, value, color }: any) {
//   return (
//     <div
//       className={cn(
//         "p-4 rounded-xl border flex flex-col items-center justify-center transition-all",
//         color,
//       )}
//     >
//       <span className="text-2xl font-black">{value}</span>
//       <span className="text-[10px] uppercase font-bold opacity-70 mt-1">
//         {label}
//       </span>
//     </div>
//   );
// }

// function StatusBadge({ status }: { status: string }) {
//   const styles = {
//     CONFIRMED: "bg-green-100 text-green-700 border-green-200",
//     DECLINED: "bg-red-100 text-red-700 border-red-200",
//     PENDING: "bg-slate-100 text-slate-600 border-slate-200",
//   };
//   const labels = {
//     CONFIRMED: "Confirmou",
//     DECLINED: "Recusou",
//     PENDING: "Pendente",
//   };
//   return (
//     <span
//       className={cn(
//         "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border",
//         (styles as any)[status],
//       )}
//     >
//       {(labels as any)[status]}
//     </span>
//   );
// }

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
  UserCheck,
  FileDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Componentes Interativos
import { CheckInDialog } from "../_components/check-in-dialog";
import { ExportButton } from "@/app/(app)/dashboard/guests/_components/export-button";
import { Badge } from "@/components/ui/badge";

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

  // 1. Validar Acesso e Buscar Evento
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
        <p className="text-slate-500">O link é inválido ou o evento expirou.</p>
      </div>
    );
  }

  const agency = event.agencyId as any;

  // 2. Buscar Todos os Convidados
  const guests = await Guest.find({ eventId: id }).sort({ name: 1 }).lean();
  const serializedGuests = JSON.parse(JSON.stringify(guests));

  // 3. Cálculos de RSVP (Promessa)
  const confirmedRSVP = guests.filter((g: any) => g.status === "CONFIRMED");
  const declinedRSVP = guests.filter((g: any) => g.status === "DECLINED");
  const pendingRSVP = guests.filter((g: any) => g.status === "PENDING");

  const adultsExpected = confirmedRSVP.reduce(
    (acc, g) => acc + (g.confirmedAdults || 0),
    0,
  );
  const kidsExpected = confirmedRSVP.reduce(
    (acc, g) => acc + (g.confirmedKids || 0),
    0,
  );

  // 4. Cálculos de Portaria (Realidade)
  const presentFamilies = confirmedRSVP.filter((g: any) => g.checkedIn);
  const totalPeopleInside = presentFamilies.reduce(
    (acc, g) => acc + (g.arrivedAdults || 0) + (g.arrivedKids || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24 font-sans">
      {/* HEADER */}
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

          {/* BOTÕES DE EXPORTAÇÃO RÁPIDA */}
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <ExportButton
              filters={{ eventId: id }}
              eventName={`${event.title}_Confirmados_RSVP`}
              // Aqui o componente ExportButton ja filtra internamente pela Action se passarmos o ID
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        {/* DASHBOARD DE PORTARIA (REAL-TIME) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-slate-900 text-white border-none shadow-xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-0 transition-transform">
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
                  style={{
                    width: `${(presentFamilies.length / confirmedRSVP.length) * 100}%`,
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-lg overflow-hidden border-l-4 border-l-green-500">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
                  Total de Pessoas (Real)
                </p>
                <div className="text-4xl font-black text-slate-900">
                  {totalPeopleInside}
                </div>
                <p className="text-xs text-slate-400 mt-1 italic">
                  Soma de Adultos e Crianças que entraram
                </p>
              </div>
              <div className="h-14 w-14 bg-green-50 rounded-full flex items-center justify-center">
                <Users className="text-green-600 w-8 h-8" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* MÉTRICAS DE RSVP E SUPORTE */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            {/* Suporte Agência */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b pb-2">
                <Building2 className="w-4 h-4 text-blue-600" /> Suporte
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">
                    Agência
                  </p>
                  <p className="text-sm font-semibold">{agency?.name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">
                    WhatsApp Suporte
                  </p>
                  <p className="text-sm font-mono flex items-center gap-2">
                    <Phone size={12} className="text-slate-400" />{" "}
                    {agency?.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Resumo esperado */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4">
                Expectativa (RSVP)
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Adultos Esperados</span>
                  <span className="font-bold">{adultsExpected}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Crianças Esperadas</span>
                  <span className="font-bold">{kidsExpected}</span>
                </div>
                <div className="pt-2 border-t flex justify-between font-bold text-blue-600">
                  <span>Total de Lugares</span>
                  <span>{adultsExpected + kidsExpected}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Grid de Status */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              label="Confirmados"
              value={confirmedRSVP.length}
              icon={CheckCircle2}
              color="text-green-600 border-green-100"
            />
            <StatCard
              label="Recusados"
              value={declinedRSVP.length}
              icon={XCircle}
              color="text-red-500 border-red-100"
            />
            <StatCard
              label="Pendentes"
              value={pendingRSVP.length}
              icon={Clock}
              color="text-amber-500 border-amber-100"
            />
            <StatCard
              label="Total Lista"
              value={guests.length}
              icon={Users}
              color="text-slate-600 border-slate-200"
            />
          </div>
        </div>

        {/* TABELA PRINCIPAL */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-1">
            <h2 className="text-xl font-bold text-slate-900">
              Lista Geral de Convidados
            </h2>
            <div className="flex gap-2 w-full sm:w-auto">
              {/* Podemos adicionar um filtro de busca aqui se necessário */}
            </div>
          </div>

          <Card className="overflow-hidden border-slate-200 shadow-xl">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/80 backdrop-blur-sm">
                    <TableRow>
                      <TableHead className="pl-6 py-4 min-w-[200px]">
                        Convidado
                      </TableHead>
                      <TableHead className="min-w-[100px]">
                        Status RSVP
                      </TableHead>
                      <TableHead className="min-w-[160px]">
                        Portaria (Check-in)
                      </TableHead>
                      <TableHead className="min-w-[120px]">Qtd. Real</TableHead>
                      <TableHead className="min-w-[220px]">
                        Escolhas do Menu
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {serializedGuests.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="h-40 text-center text-slate-400"
                        >
                          Nenhum convidado encontrado para este evento.
                        </TableCell>
                      </TableRow>
                    ) : (
                      serializedGuests.map((guest: any) => (
                        <TableRow
                          key={guest._id}
                          className={cn(
                            "transition-colors",
                            guest.checkedIn
                              ? "bg-green-50/50 hover:bg-green-50/80"
                              : "hover:bg-slate-50/50",
                          )}
                        >
                          <TableCell className="pl-6 py-4">
                            <p className="font-bold text-slate-900">
                              {guest.name}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {guest.phone && (
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {guest.phone}
                                </span>
                              )}
                              {guest.checkedInAt && (
                                <Badge
                                  variant="outline"
                                  className="text-[9px] py-0 h-4 bg-green-100 text-green-700 border-green-200"
                                >
                                  Entrou{" "}
                                  {new Date(
                                    guest.checkedInAt,
                                  ).toLocaleTimeString("pt-MZ", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
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
                                Aguardando RSVP
                              </span>
                            )}
                          </TableCell>

                          <TableCell>
                            {guest.checkedIn ? (
                              <div className="flex flex-col">
                                <span className="text-sm font-black text-green-700">
                                  {guest.arrivedAdults + guest.arrivedKids}{" "}
                                  pessoas
                                </span>
                                <span className="text-[9px] text-slate-400 uppercase font-bold">
                                  {guest.arrivedAdults}A + {guest.arrivedKids}C
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
                          </TableCell>

                          <TableCell>
                            <div className="space-y-2">
                              {guest.menuChoices &&
                              guest.menuChoices.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                  {guest.menuChoices.map(
                                    (choice: any, i: number) => (
                                      <span
                                        key={i}
                                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] border border-amber-100 font-bold uppercase"
                                      >
                                        <Utensils className="w-2.5 h-2.5" />{" "}
                                        {choice.item}
                                      </span>
                                    ),
                                  )}
                                </div>
                              ) : null}
                              {guest.messageToHosts && (
                                <p
                                  className="text-[11px] text-slate-500 italic border-l-2 border-slate-200 pl-2 line-clamp-1 hover:line-clamp-none transition-all cursor-help"
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

// --- COMPONENTES AUXILIARES ---

function StatCard({ label, value, icon: Icon, color }: any) {
  const textColor = color.split(" ")[0];
  const borderColor = color.split(" ")[1] || "";

  const bgColor = textColor
    .replace("text-", "bg-")
    .replace("600", "100")
    .replace("500", "100");

  return (
    <Card className={cn("bg-white border-2 shadow-sm", borderColor)}>
      <CardContent className="p-4 flex flex-col items-center justify-center text-center">
        <div className={cn("p-2 rounded-full mb-2", bgColor)}>
          {Icon && <Icon className={cn("w-4 h-4", textColor)} />}
        </div>
        <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400">
          {label}
        </p>
        <p className={cn("text-2xl font-black", textColor)}>{value}</p>
      </CardContent>
    </Card>
  );
}

function MetricBox({ label, value, color }: any) {
  return (
    <div
      className={cn(
        "p-4 rounded-xl border flex flex-col items-center justify-center transition-all",
        color,
      )}
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
    DECLINED: "bg-red-50 text-red-700 border-red-200",
    PENDING: "bg-slate-100 text-slate-600 border-slate-200",
  };
  const labels = {
    CONFIRMED: "Sim, Vai",
    DECLINED: "Não vai",
    PENDING: "Pendente",
  };
  return (
    <span
      className={cn(
        "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border",
        (styles as any)[status],
      )}
    >
      {(labels as any)[status]}
    </span>
  );
}
