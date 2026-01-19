import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
// Imports Corrigidos (.model)
import { Agency } from "@/lib/models/Agency";
import { User } from "@/lib/models/User";
import { Transaction } from "@/lib/models/Finance";

// Componentes UI
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, CreditCard, ShieldAlert, Banknote } from "lucide-react";
import { AgencyApprovalList } from "./_components/agency-approval-list";
import { TransactionApprovalList } from "./_components/transaction-approval-list";

// Força a página a não fazer cache
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const session = await auth();

  // 1. Verificação de Segurança
  // @ts-ignore
  if (session?.user?.role !== "SUPER_ADMIN") {
    return redirect("/dashboard");
  }

  await connectDB();

  // 2. BUSCAR DADOS (Paralelo para performance)
  const [pendingAgencies, pendingTransactions, stats] = await Promise.all([
    // A. Agências Pendentes
    Agency.find({ verificationStatus: 'PENDING' }).sort({ createdAt: -1 }).lean(),
    
    // B. Transações Pendentes (Com populate para saber o nome da agência)
    Transaction.find({ status: 'PENDING' }).sort({ createdAt: -1 }).populate('agencyId', 'name').lean(),

    // C. Estatísticas Gerais
    (async () => {
      const users = await User.countDocuments();
      const agencies = await Agency.countDocuments({ verificationStatus: 'APPROVED' });
      // Soma de todas as transações aprovadas
      const revenue = await Transaction.aggregate([
        { $match: { status: 'APPROVED' } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);
      return { users, agencies, revenue: revenue[0]?.total || 0 };
    })()
  ]);

  // 3. Serialização (Converter ObjectIds e Dates para string)
  const serializedAgencies = pendingAgencies.map((agency: any) => ({
    ...agency,
    _id: agency._id.toString(),
    createdAt: agency.createdAt?.toISOString(),
    updatedAt: agency.updatedAt?.toISOString(),
  }));

  const serializedTransactions = pendingTransactions.map((tx: any) => ({
    _id: tx._id.toString(),
    packageName: tx.packageName,
    amount: tx.amount,
    paymentMethod: tx.paymentMethod,
    agencyName: tx.agencyId?.name || "Agência Desconhecida", // Populate field
    createdAt: tx.createdAt?.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
               <div className="flex items-center gap-2 mb-1">
                 <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-900 text-white">
                   SUPER ADMIN
                 </span>
               </div>
               <h1 className="text-2xl font-bold text-slate-900">Visão Global</h1>
            </div>
            
            <Button asChild variant="outline" size="sm">
                <Link href="/dashboard">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar para Meus Eventos
                </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Cards de KPIs */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-l-4 border-l-yellow-500 shadow-sm">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-xs uppercase font-bold text-slate-500 tracking-wider">Aprovações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-yellow-500" />
                <div className="text-2xl font-bold text-slate-800">{pendingAgencies.length}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 shadow-sm">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-xs uppercase font-bold text-slate-500 tracking-wider">Pagamentos Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Banknote className="h-5 w-5 text-orange-500" />
                <div className="text-2xl font-bold text-slate-800">{pendingTransactions.length}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500 shadow-sm">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-xs uppercase font-bold text-slate-500 tracking-wider">Agências Ativas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                <div className="text-2xl font-bold text-slate-800">{stats.agencies}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 shadow-sm">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-xs uppercase font-bold text-slate-500 tracking-wider">Receita Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-green-500" />
                <div className="text-2xl font-bold text-slate-800">
                  {stats.revenue.toLocaleString()} <span className="text-sm font-normal text-slate-400">MT</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Coluna 1: Pagamentos (Prioridade) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Banknote className="w-5 h-5 text-orange-600" />
                Pagamentos para Aprovar
              </h2>
            </div>
            <TransactionApprovalList transactions={serializedTransactions} />
          </div>

          {/* Coluna 2: Cadastros */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-yellow-600" />
                Solicitações de Cadastro
              </h2>
            </div>
            <AgencyApprovalList agencies={serializedAgencies} />
          </div>

        </div>
      </div>
    </div>
  );
}