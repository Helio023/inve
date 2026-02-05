import { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Agency } from "@/lib/models/Agency";
import { Event } from "@/lib/models/Event";
import { Guest } from "@/lib/models/Guest";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users, TrendingUp, Wallet, Plus } from "lucide-react";

import { OverviewChart } from "./_components/overview-chart";
import { RecentEvents } from "./_components/recent-events";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Visão Geral | Invite SaaS",
};


export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.email) return null;

  await connectDB();

  const agency = await Agency.findOne({ emailContact: session.user.email });
  if (!agency) {
    return <div className="p-8 text-center font-medium">Agência não encontrada.</div>;
  }

  const agencyId = agency._id;

  // 1. KPIs em paralelo para performance
  const [eventCount, totalGuestsDb, confirmedCount, recentEventsDocs] = await Promise.all([
    Event.countDocuments({ agencyId }),
    Guest.countDocuments({ agencyId }),
    Guest.countDocuments({ agencyId, status: 'CONFIRMED' }),
    Event.find({ agencyId }).sort({ updatedAt: -1 }).limit(5).lean()
  ]);

  const responseRate = totalGuestsDb > 0 
    ? Math.round((confirmedCount / totalGuestsDb) * 100) 
    : 0;

  // 2. Cálculo de Créditos (Usando iterador do Map)
  let totalCredits = 0;
  if (agency.credits) {
    totalCredits = Array.from(agency.credits.values()).reduce((a, b) => a + (b || 0), 0);
  }

  // 3. Processar Eventos Recentes
  // Dica: Para dashboards de larga escala, o ideal é salvar o 'totalConfirmed' 
  // direto no modelo do Evento sempre que um Guest confirmar.
  const recentEventsData = await Promise.all(
    recentEventsDocs.map(async (ev: any) => {
      const stats = await Guest.aggregate([
        { $match: { eventId: ev._id } },
        { $group: { 
            _id: null, 
            total: { $sum: 1 }, 
            confirmed: { $sum: { $cond: [{ $eq: ["$status", "CONFIRMED"] }, 1, 0] } } 
          } 
        }
      ]);

      return {
        id: ev._id.toString(),
        title: ev.title,
        date: ev.date ? new Date(ev.date).toLocaleDateString('pt-MZ') : 'A definir',
        type: ev.eventType || 'Evento',
        confirmed: stats[0]?.confirmed || 0,
        totalGuests: stats[0]?.total || 0
      };
    })
  );

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* ... Cabeçalho igual ... */}

      {/* KPIs com cores dinâmicas e badges */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard 
          title="Eventos Ativos" 
          value={eventCount} 
          icon={CalendarDays} 
          color="blue" 
          description="Projetos criados" 
        />
        <KPICard 
          title="Confirmados" 
          value={confirmedCount} 
          icon={Users} 
          color="emerald" 
          description={`${totalGuestsDb} convites totais`} 
        />
        <KPICard 
          title="Taxa de Resposta" 
          value={`${responseRate}%`} 
          icon={TrendingUp} 
          color="amber" 
          description="Engajamento geral" 
        />
        <KPICard 
          title="Créditos" 
          value={totalCredits} 
          icon={Wallet} 
          color="purple" 
          footer={<Link href="/dashboard/billing" className="text-blue-600 hover:underline">Recarregar</Link>} 
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <OverviewChart chartData={recentEventsData.map(e => ({ 
            name: e.title.length > 12 ? e.title.substring(0, 10) + '...' : e.title, 
            confirmados: e.confirmed, 
            pendentes: e.totalGuests - e.confirmed 
          }))} />
        </div>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Eventos Recentes</CardTitle>
            <CardDescription>Status dos últimos 5 convites.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentEvents events={recentEventsData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Sub-componente para limpar o código da página
function KPICard({ title, value, icon: Icon, color, description, footer }: any) {
  const colorMap: any = {
    blue: "border-l-blue-500",
    emerald: "border-l-emerald-500",
    amber: "border-l-amber-500",
    purple: "border-l-purple-500",
  };

  return (
    <Card className={cn("shadow-sm border-l-4", colorMap[color])}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground mt-1">
          {description} {footer}
        </div>
      </CardContent>
    </Card>
  );
}