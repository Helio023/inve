import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Agency } from "@/lib/models/Agency";
import { Package, Transaction } from "@/lib/models/Finance";
import { User } from "@/lib/models/User";
import { redirect } from "next/navigation";
import { SITE_CONFIG } from "@/config/plans";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

import { Card, CardContent } from "@/components/ui/card";
import {
  Wallet,
  History,
  Clock,
  AlertCircle,
  Heart,
  Cake,
  Building2,
  Calendar,
} from "lucide-react";
import { PlansSection } from "./_components/plans-section";
import { cn } from "@/lib/utils";

export const metadata = { title: "Financeiro | Qonvip SaaS" };
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

export default async function BillingPage() {
  const session = await auth();
  if (!session) redirect("/login");

  await connectDB();

  const user = await User.findOne({ email: session.user?.email });
  if (!user?.agencyId)
    return <div className="p-4">Agência não encontrada.</div>;

  const agency = await Agency.findById(user.agencyId).lean();
  if (!agency)
    return <div className="p-4">Dados da agência indisponíveis.</div>;

  const creditsMap = agency.credits || {};
  const totalCredits = Object.values(creditsMap).reduce(
    (acc: number, val: any) => acc + (Number(val) || 0),
    0,
  );

  const rawPackages = await Package.find({ isActive: true })
    .sort({ price: 1 })
    .lean();
  const packages = rawPackages.map((p: any) => ({
    ...p,
    _id: p._id.toString(),
  }));

  const transactions = await Transaction.find({ agencyId: agency._id })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  // Serialização para evitar erros
  const serializedTransactions = JSON.parse(JSON.stringify(transactions));

  return (
    <div className="space-y-8 pb-24 p-4 md:p-0 w-full max-w-[100vw] overflow-x-hidden">
      {/* --- 1. HEADER E SALDO --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Financeiro
          </h1>
          <p className="text-sm text-slate-500">
            Gerencie seus créditos e recargas.
          </p>
        </div>

        {/* Card Saldo Total */}
        <Card className="bg-slate-900 text-white border-none shadow-lg w-full md:w-auto md:min-w-[260px]">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-full shrink-0">
              <Wallet className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-slate-300 font-medium uppercase tracking-wider">
                Total Disponível
              </p>
              <div className="text-3xl font-bold leading-none mt-1">
                {totalCredits}{" "}
                <span className="text-sm font-normal text-slate-400">
                  créditos
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- 2. DETALHE POR CATEGORIA --- */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 pl-1">
          Por Categoria
        </h3>
        {/* Mobile: Flex Col (empilhado). Desktop: Grid */}
        <div className="flex flex-col md:grid md:grid-cols-3 gap-3">
          {Object.keys(CATEGORY_CONFIG).map((key) => {
            const config = CATEGORY_CONFIG[key];
            const amount = (creditsMap as any)[key] || 0;

            return (
              <div
                key={key}
                className={`flex items-center justify-between p-4 bg-white border rounded-xl shadow-sm transition-all ${config.border}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${config.color}`}>
                    <config.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-600">
                    {config.label}
                  </span>
                </div>
                <div className="text-xl font-black text-slate-900">
                  {amount}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- 3. SEÇÃO DE COMPRA --- */}
      <div className="border-t pt-8">
        <h2 className="text-lg font-bold text-slate-800 mb-6">
          Planos Disponíveis
        </h2>
        <PlansSection packages={packages} />
      </div>

      {/* --- 4. HISTÓRICO --- */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <History className="w-5 h-5" /> Histórico de Transações
        </h2>

        {/* --- CORREÇÃO DE RESPONSIVIDADE (Table -> Cards) --- */}

        {/* Lista de Cards para Mobile */}
        <div className="md:hidden flex flex-col gap-3">
          {serializedTransactions.length === 0 ? (
            <EmptyHistory />
          ) : (
            serializedTransactions.map((tx: any) => (
              <div
                key={tx._id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-4"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800">
                    {tx.packageName}
                  </span>
                  <span className="text-xs text-slate-400 font-mono mt-1">
                    #{tx._id.toString().slice(-6).toUpperCase()}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-700 font-mono">
                    {tx.amount.toLocaleString()} {SITE_CONFIG.currency}
                  </p>
                  <StatusBadge status={tx.status} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Tabela para Desktop */}
        <div className="hidden md:block rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Pacote</th>
                <th className="px-6 py-4 whitespace-nowrap">Valor</th>
                <th className="px-6 py-4 whitespace-nowrap">Data</th>
                <th className="px-6 py-4 text-right whitespace-nowrap">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {serializedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <EmptyHistory />
                  </td>
                </tr>
              ) : (
                serializedTransactions.map((tx: any) => (
                  <tr
                    key={tx._id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {tx.packageName}
                      <div className="text-xs text-slate-400 font-normal mt-0.5 font-mono">
                        #{tx._id.toString().slice(-6).toUpperCase()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-mono whitespace-nowrap">
                      {tx.amount.toLocaleString()} {SITE_CONFIG.currency}
                    </td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      {format(new Date(tx.createdAt), "dd MMM, yyyy", {
                        locale: pt,
                      })}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
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

// -- Componentes Auxiliares --

function EmptyHistory() {
  return (
    <div className="text-center py-10 text-slate-400">
      <AlertCircle className="w-8 h-8 mx-auto opacity-30 mb-2" />
      <p className="font-medium text-sm text-slate-500">
        Nenhuma transação encontrada
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "APPROVED") {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-green-100 text-green-700">
        Pago
      </span>
    );
  }
  if (status === "REJECTED") {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-red-100 text-red-700">
        Cancelado
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-yellow-100 text-yellow-700">
      Pendente
    </span>
  );
}
