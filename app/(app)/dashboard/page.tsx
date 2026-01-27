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

export const metadata: Metadata = {
  title: "Visão Geral | Invite SaaS",
};

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user?.email) return null;

  await connectDB();

  // 1. Buscar Agência (Usamos .lean() para performance, o que retorna objetos planos, não Documents do Mongoose)
  const agency = await Agency.findOne({ emailContact: session.user.email }).lean();
  
  // Se não tiver agência (edge case), não quebra a UI
  if (!agency) {
    return <div className="p-8">Agência não encontrada. Entre em contato com o suporte.</div>;
  }

  const agencyId = agency._id;

  // 2. Buscar KPIs Reais em Paralelo
  const [eventCount, totalGuestsDb, confirmedCount] = await Promise.all([
    Event.countDocuments({ agencyId }),
    Guest.countDocuments({ agencyId }),
    Guest.countDocuments({ agencyId, status: 'CONFIRMED' })
  ]);

  // Evita divisão por zero
  const responseRate = totalGuestsDb > 0 
    ? Math.round((confirmedCount / totalGuestsDb) * 100) 
    : 0;

 
  let totalCredits = 0;
  
  if (agency.credits) {
   
     const creditValues = Object.values(agency.credits);
     
     totalCredits = creditValues.reduce((sum: number, val: any) => {
       return sum + (Number(val) || 0);
     }, 0);
  }

  // 4. Buscar Eventos Recentes Reais
  const recentEventsDocs = await Event.find({ agencyId })
    .sort({ updatedAt: -1 })
    .limit(5)
    .lean();

 
  const recentEventsData = await Promise.all(
    recentEventsDocs.map(async (ev) => {
      const confirmed = await Guest.countDocuments({ eventId: ev._id, status: 'CONFIRMED' });
      const total = await Guest.countDocuments({ eventId: ev._id });
      
      return {
        id: ev._id.toString(),
        title: ev.title,
        date: ev.date ? new Date(ev.date).toLocaleDateString('pt-MZ') : 'Data não definida',
        type: ev.eventType || 'Evento',
        confirmed: confirmed,
        totalGuests: total
      };
    })
  );

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Visão Geral</h2>
          <p className="text-muted-foreground">
            Bem-vindo de volta, {session.user.name?.split(" ")[0]}.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild className="shadow-md bg-primary hover:bg-primary/90">
            <Link href="/dashboard/events/new">
                <Plus className="mr-2 h-4 w-4" /> Novo Evento
            </Link>
          </Button>
        </div>
      </div>

      {/* KPIs (Grid de 4) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Eventos */}
        <Card className="shadow-sm border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos Ativos</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventCount}</div>
            <p className="text-xs text-muted-foreground">
              Projetos em andamento
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Convidados */}
        <Card className="shadow-sm border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{confirmedCount}</div>
            <p className="text-xs text-muted-foreground">
              Pessoas garantidas
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Taxa de Resposta */}
        <Card className="shadow-sm border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Resposta</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{responseRate}%</div>
            <p className="text-xs text-muted-foreground">
              Engajamento médio
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Créditos */}
        <Card className="shadow-sm border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Créditos</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCredits}</div>
            <Link href="/dashboard/billing" className="text-xs text-blue-600 hover:underline">
              Recarregar carteira
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos e Listas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Coluna Principal (Gráfico) */}
        {/* Passamos dados reais ou mockados para o gráfico */}
        <OverviewChart chartData={recentEventsData.map(e => ({ name: e.title.substring(0, 10), confirmados: e.confirmed, pendentes: e.totalGuests - e.confirmed }))} />
        
        {/* Coluna Lateral (Lista Recente) */}
        <Card className="col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle>Eventos Recentes</CardTitle>
            <CardDescription>
              Acompanhe o status dos últimos convites.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentEvents events={recentEventsData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}