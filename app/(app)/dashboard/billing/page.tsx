import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Agency } from "@/lib/models/Agency";
import { Package, Transaction } from "@/lib/models/Finance";
import { User } from "@/lib/models/User";
import { redirect } from "next/navigation";
import { SITE_CONFIG } from "@/config/plans";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { CheckCircle2, XCircle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Wallet,
  History,
  Clock,
  AlertCircle,
  Heart,
  Cake,
  Building2,
} from "lucide-react";
import { PlansSection } from "./_components/plans-section";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const CATEGORY_CONFIG: Record<
  string,
  { label: string; icon: any; color: string; border: string }
> = {
  wedding: {
    label: "Casamentos",
    icon: Heart,
    color: "text-pink-600 bg-pink-50",
    border: "border-pink-100",
  },
  birthday: {
    label: "Aniversários",
    icon: Cake,
    color: "text-orange-600 bg-orange-50",
    border: "border-orange-100",
  },
  corporate: {
    label: "Corporativo",
    icon: Building2,
    color: "text-blue-600 bg-blue-50",
    border: "border-blue-100",
  },
};

interface PageProps {
  searchParams: Promise<{ select?: string }>;
}

export default async function BillingPage({ searchParams }: PageProps) {
  // 1. Extração do parâmetro vindo da Landing Page (Next.js 15 obriga await)
  const { select } = await searchParams;

  const session = await auth();
  if (!session) redirect("/login");

  await connectDB();

  const user = await User.findOne({ email: session.user?.email });
  if (!user?.agencyId)
    return <div className="p-8 text-center">Erro: Agência não encontrada.</div>;

  const agency = await Agency.findById(user.agencyId).lean();
  if (!agency)
    return <div className="p-8 text-center">Dados da agência indisponíveis.</div>;

  // Cálculos de Créditos
  const creditsMap = agency.credits || {};
  const totalCredits = Object.values(creditsMap).reduce(
    (acc: number, val: any) => acc + (Number(val) || 0),
    0,
  );

  // Busca de Pacotes Ativos
  const rawPackages = await Package.find({ isActive: true })
    .sort({ price: 1 })
    .lean();
    
  const packages = rawPackages.map((p: any) => ({
    ...p,
    _id: p._id.toString(),
  }));

  // Histórico de Transações
  const transactions = await Transaction.find({ agencyId: agency._id })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  const serializedTransactions = JSON.parse(JSON.stringify(transactions));

  return (
    <div className="space-y-10 pb-24 p-4 md:p-0 w-full max-w-7xl mx-auto overflow-x-hidden animate-in fade-in duration-700">
      
      {/* --- 1. HEADER E SALDO --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter md:text-4xl">
            Financeiro
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Gestão de créditos e histórico de recargas da agência.
          </p>
        </div>

        <Card className="bg-slate-900 text-white border-none shadow-2xl w-full md:w-auto md:min-w-[300px] overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
             <Wallet className="w-20 h-20 rotate-12" />
          </div>
          <CardContent className="p-6 flex items-center gap-5 relative z-10">
            <div className="p-4 bg-white/10 rounded-2xl shrink-0 backdrop-blur-md">
              <Wallet className="w-7 h-7 text-yellow-400" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                Saldo Disponível
              </p>
              <div className="text-4xl font-black leading-none mt-1 flex items-baseline gap-2">
                {totalCredits}
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  créditos
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- 2. DETALHE POR CATEGORIA --- */}
      <div className="space-y-4">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
          <div className="h-px w-4 bg-slate-300" /> Distribuição por Nicho
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.keys(CATEGORY_CONFIG).map((key) => {
            const config = CATEGORY_CONFIG[key];
            const amount = (creditsMap as any)[key] || 0;

            return (
              <div
                key={key}
                className={cn(
                  "flex items-center justify-between p-5 bg-white border rounded-[20px] shadow-sm transition-all hover:shadow-md",
                  config.border
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn("p-3 rounded-xl shadow-inner", config.color)}>
                    <config.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-700">
                    {config.label}
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-900 tabular-nums">
                  {amount}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- 3. SEÇÃO DE COMPRA (INTEGRAÇÃO COM O FUNIL) --- */}
      <div className="pt-4">
        <PlansSection 
          packages={packages} 
          selectedPackageKey={select} 
        />
      </div>

      {/* --- 4. HISTÓRICO DE TRANSAÇÕES --- */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <History className="w-5 h-5 text-slate-400" /> Histórico de Transações
        </h2>

        {/* Mobile View: Cards */}
        <div className="md:hidden flex flex-col gap-4">
          {serializedTransactions.length === 0 ? (
            <EmptyHistory />
          ) : (
            serializedTransactions.map((tx: any) => (
              <div
                key={tx._id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between"
              >
                <div className="space-y-1">
                  <span className="font-bold text-slate-800 block">
                    {tx.packageName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono uppercase">
                    ID: {tx._id.toString().slice(-8)}
                  </span>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {format(new Date(tx.createdAt), "dd/MM/yyyy HH:mm")}
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <p className="font-black text-slate-900 text-sm">
                    {tx.amount.toLocaleString()} {SITE_CONFIG.currency}
                  </p>
                  <StatusBadge status={tx.status} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Elegant Table */}
        <div className="hidden md:block rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-[0.15em]">
              <tr>
                <th className="px-8 py-5">Pacote Escolhido</th>
                <th className="px-8 py-5">Investimento</th>
                <th className="px-8 py-5">Data do Pedido</th>
                <th className="px-8 py-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {serializedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-20"><EmptyHistory /></td>
                </tr>
              ) : (
                serializedTransactions.map((tx: any) => (
                  <tr key={tx._id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6 font-bold text-slate-800">
                      {tx.packageName}
                      <div className="text-[9px] text-slate-400 font-mono font-normal mt-1">
                        REF_{tx._id.toString().slice(-12).toUpperCase()}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-slate-900 font-black tabular-nums">
                      {tx.amount.toLocaleString()} {SITE_CONFIG.currency}
                    </td>
                    <td className="px-8 py-6 text-slate-500 font-medium">
                      {format(new Date(tx.createdAt), "PPP", { locale: pt })}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <StatusBadge status={tx.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// -- Componentes Internos de Apoio --

function EmptyHistory() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-slate-400 gap-2">
      <div className="p-4 bg-slate-100 rounded-full">
        <Clock className="w-8 h-8 opacity-20" />
      </div>
      <p className="font-bold text-xs uppercase tracking-widest">Sem movimentações recentes</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; className: string; icon: any }> = {
    APPROVED: { label: "Pagamento Confirmado", className: "bg-emerald-50 text-emerald-700 border-emerald-100", icon: CheckCircle2 },
    REJECTED: { label: "Cancelado", className: "bg-red-50 text-red-700 border-red-100", icon: XCircle },
    PENDING: { label: "Aguardando Pagamento", className: "bg-amber-50 text-amber-700 border-amber-100", icon: Clock },
  };

  const config = configs[status] || configs.PENDING;
  
  return (
    <span className={cn(
      "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border shadow-sm",
      config.className
    )}>
      {config.label}
    </span>
  );
}

