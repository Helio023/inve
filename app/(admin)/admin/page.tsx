import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Agency } from "@/lib/models/Agency";
import { Transaction } from "@/lib/models/Finance";
import { Event } from "@/lib/models/Event";

// UI
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Users, 
  CreditCard, 
  ShieldAlert, 
  Banknote, 
  BarChart3, 
  AlertTriangle, 
  History, 
  ShoppingBag,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

// Componentes
import { AgencyApprovalList } from "./_components/agency-approval-list";
import { TransactionApprovalList } from "./_components/transaction-approval-list";
import { AgencyStatusToggle } from "./_components/agency-actions";
import { ComparisonChart } from "./_components/audit-charts"; 

export const dynamic = "force-dynamic";

// Helper de Tradução
const translateType = (type: string) => {
  const map: Record<string, string> = {
    wedding: "Casamento",
    corporate: "Corporativo",
    birthday: "Aniversário",
    generic: "Geral",
    party: "Festa",
  };
  return map[type.toLowerCase()] || type;
};

export default async function AdminDashboard() {
  const session = await auth();
  
  // @ts-ignore
  if (session?.user?.role !== "SUPER_ADMIN") return redirect("/dashboard");

  await connectDB();

  // 1. BUSCA DE DADOS
  const [pendingAgenciesRaw, pendingTransactionsRaw, agenciesAuditRaw, globalStats] = await Promise.all([
    Agency.find({ verificationStatus: "PENDING" }).sort({ createdAt: -1 }).lean(),
    Transaction.find({ status: "PENDING" }).populate("agencyId", "name").lean(),
    
    Agency.aggregate([
      {
        $lookup: {
          from: "events",
          localField: "_id",
          foreignField: "agencyId",
          as: "events",
        },
      },
      {
        $lookup: {
          from: "transactions",
          let: { agencyId: "$_id" },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ["$agencyId", "$$agencyId"] }, { $eq: ["$status", "APPROVED"] }] } } },
            { $sort: { createdAt: -1 } }
          ],
          as: "history",
        },
      },
      {
        $project: {
          name: 1, emailContact: 1, credits: 1, isActive: 1, verificationStatus: 1,
          totalEvents: { $size: "$events" },
          history: 1,
          eventBreakdown: {
            $arrayToObject: {
              $map: {
                input: { $setUnion: "$events.eventType" },
                as: "type",
                in: {
                  k: "$$type",
                  v: { $size: { $filter: { input: "$events", as: "e", cond: { $eq: ["$$e.eventType", "$$type"] } } } }
                }
              }
            }
          }
        }
      },
      { $sort: { totalEvents: -1 } }
    ]),

    (async () => {
      const totalEvents = await Event.countDocuments();
      const revenue = await Transaction.aggregate([
        { $match: { status: "APPROVED" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);
      return { totalEvents, revenue: revenue[0]?.total || 0 };
    })()
  ]);

  // 2. SERIALIZAÇÃO REFORMULADA (Resolvendo erro de null e de plain objects)
  
  // Agências Pendentes
  const serializedAgencies = JSON.parse(JSON.stringify(pendingAgenciesRaw));
  
  // Transações Pendentes (Mapeamento manual rigoroso)
  const serializedTransactions = pendingTransactionsRaw.map((tx: any) => ({
    _id: tx._id.toString(),
    packageName: tx.packageName || "Pacote Desconhecido",
    amount: tx.amount || 0,
    status: tx.status || "PENDING",
    paymentMethod: tx.paymentMethod || "TRANSFER",
    agencyName: tx.agencyId?.name || "Agência Desconhecida",
    // FIX: Garante que sempre retorne uma string, nunca null
    createdAt: tx.createdAt ? new Date(tx.createdAt).toISOString() : new Date().toISOString(),
  }));

  // Auditoria Geral
  const agenciesAudit = JSON.parse(JSON.stringify(agenciesAuditRaw));

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* KPIs GLOBAIS */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <StatCard title="Receita Total" value={`${globalStats.revenue.toLocaleString()} MT`} icon={Banknote} color="green" />
          <StatCard title="Convites Criados" value={globalStats.totalEvents} icon={BarChart3} color="blue" />
          <StatCard title="Transações" value={pendingTransactionsRaw.length} icon={CreditCard} color="orange" />
          <StatCard title="Aprovações" value={pendingAgenciesRaw.length} icon={ShieldAlert} color="yellow" />
        </div>

        <Tabs defaultValue="audit" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-8 bg-slate-200/50 p-1">
            <TabsTrigger value="audit" className="font-bold tracking-tight">Auditoria e Agências</TabsTrigger>
            <TabsTrigger value="requests" className="font-bold tracking-tight">Pedidos Pendentes</TabsTrigger>
          </TabsList>

          {/* ABA 1: PEDIDOS PENDENTES */}
          <TabsContent value="requests" className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
            <div className="grid md:grid-cols-2 gap-8">
              <section className="space-y-4">
                <h2 className="text-sm font-black uppercase text-slate-500 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                   Validação de Pagamentos
                </h2>
                <TransactionApprovalList transactions={serializedTransactions} />
              </section>
              <section className="space-y-4">
                <h2 className="text-sm font-black uppercase text-slate-500 flex items-center gap-2">
                   <Users className="w-4 h-4"/> Novos Cadastros
                </h2>
                <AgencyApprovalList agencies={serializedAgencies} />
              </section>
            </div>
          </TabsContent>

          {/* ABA 2: AUDITORIA GERAL */}
          <TabsContent value="audit" className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
            
            {/* Gráfico de Performance */}
            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-white border-b border-slate-100">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" /> Especialidades por Agência
                </CardTitle>
                <CardDescription>Visualização da produção por categoria de convite.</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px] pt-6 bg-white">
                <ComparisonChart data={agenciesAudit.slice(0, 5).map((a: any) => ({
                  name: a.name,
                  casamentos: a.eventBreakdown?.wedding || 0,
                  corporativo: a.eventBreakdown?.corporate || 0,
                  aniversarios: a.eventBreakdown?.birthday || 0,
                }))} />
              </CardContent>
            </Card>

            {/* Listagem de Auditoria das Agências */}
            <div className="grid gap-6">
              {agenciesAudit.map((agency: any) => {
                const isSuspended = agency.verificationStatus === 'SUSPENDED';
                
                return (
                  <Card key={agency._id} className={cn(
                    "overflow-hidden border-slate-200 transition-all",
                    isSuspended && "bg-slate-100/50 border-dashed border-slate-300"
                  )}>
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-xl text-slate-900">{agency.name}</h3>
                            <Badge className={cn(
                              isSuspended ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
                            )}>
                              {isSuspended ? 'SUSPENSA' : 'ACTIVA'}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-500 font-medium">{agency.emailContact}</p>
                        </div>
                        
                        <AgencyStatusToggle 
                          agencyId={agency._id} 
                          isActive={!isSuspended} 
                          name={agency.name} 
                        />
                      </div>

                      <div className="grid md:grid-cols-3 gap-10">
                        {/* Monitor de Créditos vs Uso */}
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
                            <BarChart3 className="w-3 h-3"/> Créditos vs Realidade
                          </h4>
                          <div className="grid gap-3">
                            {Object.entries(agency.credits).map(([type, bal]: any) => {
                              if (type.startsWith('$')) return null;
                              const used = agency.eventBreakdown?.[type] || 0;
                              return (
                                <div key={type} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                  <span className="text-xs font-bold text-slate-600">{translateType(type)}</span>
                                  <div className="text-right">
                                    <div className={cn("text-sm font-black tabular-nums", Number(bal) <= 0 ? "text-red-500" : "text-blue-600")}>
                                      {bal} <span className="text-[10px] text-slate-400 font-normal">restantes</span>
                                    </div>
                                    <div className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">
                                      Produziu: {used}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Histórico de Compras (Pacotes) */}
                        <div className="space-y-4 md:col-span-2 border-l pl-10 border-slate-100">
                          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
                            <ShoppingBag className="w-3 h-3"/> Histórico de Investimento
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {agency.history.length > 0 ? agency.history.map((tx: any) => (
                              <div key={tx._id} className="bg-white border border-slate-100 rounded-xl p-4 flex justify-between items-center shadow-sm">
                                <div>
                                  <p className="text-xs font-black text-slate-800 line-clamp-1">{tx.packageName}</p>
                                  <p className="text-[9px] text-slate-400 mt-1 font-medium italic">
                                    {new Date(tx.createdAt).toLocaleDateString('pt-MZ')}
                                  </p>
                                </div>
                                <div className="text-right font-black text-emerald-600 text-sm">
                                  {tx.amount} <span className="text-[9px]">MT</span>
                                </div>
                              </div>
                            )) : (
                              <div className="col-span-2 py-10 text-center border-2 border-dashed rounded-2xl border-slate-100">
                                <p className="text-xs text-slate-400 font-medium">Sem histórico de compras aprovadas.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  const colorStyles: Record<string, string> = {
    green: "border-l-emerald-500 text-emerald-600 bg-emerald-50/20",
    blue: "border-l-blue-500 text-blue-600 bg-blue-50/20",
    orange: "border-l-orange-500 text-orange-600 bg-orange-50/20",
    yellow: "border-l-amber-500 text-amber-600 bg-amber-50/20",
  };

  return (
    <Card className={cn("border-none border-l-4 shadow-sm", colorStyles[color])}>
      <CardHeader className="pb-1 pt-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500">{title}</CardTitle>
          <Icon className="w-3.5 h-3.5 opacity-60" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-xl md:text-2xl font-black tabular-nums tracking-tighter">{value}</div>
      </CardContent>
    </Card>
  );
}