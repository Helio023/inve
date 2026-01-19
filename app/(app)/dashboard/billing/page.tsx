import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Agency } from "@/lib/models/Agency";
import { Package, Transaction } from "@/lib/models/Finance";
import { User } from "@/lib/models/User";
import { redirect } from "next/navigation";
import { SITE_CONFIG } from "@/config/plans";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, History, Clock, AlertCircle } from "lucide-react";
import { PlansSection } from "./_components/plans-section";

export const metadata = { title: "Financeiro | Invite SaaS" };
export const dynamic = "force-dynamic";

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

  // Cálculo de Créditos
  const creditValues = agency.credits ? Object.values(agency.credits) : [];
  // @ts-ignore
  const totalCredits = creditValues.reduce(
    (acc: number, val: any) => acc + (Number(val) || 0),
    0
  );

  // Busca Pacotes
  const rawPackages = await Package.find({ isActive: true })
    .sort({ price: 1 })
    .lean();
  const packages = rawPackages.map((p: any) => ({
    ...p,
    _id: p._id.toString(),
  }));

  // Busca Histórico
  const transactions = await Transaction.find({ agencyId: agency._id })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  return (
    <div className="space-y-8">
      {/* --- HEADER E SALDO --- */}
      {/* Flex-col no mobile para empilhar, Row no desktop */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-xl border md:border-none border-slate-200">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Financeiro
          </h1>
          <p className="text-sm text-slate-500">
            Gerencie seus créditos e recargas.
          </p>
        </div>

        {/* Card Saldo: Largura total no mobile para alinhar bem */}
        <Card className="bg-slate-900 text-white border-none shadow-lg w-full md:w-auto">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-full shrink-0">
              <Wallet className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-slate-300 font-medium uppercase tracking-wider">
                Saldo Disponível
              </p>
              <div className="text-3xl font-bold leading-none">
                {totalCredits}{" "}
                <span className="text-sm font-normal text-slate-400">
                  créditos
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- SEÇÃO DE PLANOS (ANIMADA) --- */}
      <PlansSection packages={packages} />

      {/* --- HISTÓRICO --- */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <History className="w-5 h-5" /> Histórico
        </h2>

        <Card className="overflow-hidden border-slate-200 shadow-sm">
          {/* Container com Scroll para garantir responsividade da tabela */}
          <div className="overflow-x-auto w-full max-w-[calc(100vw-2.5rem)] md:max-w-full">
            <table className="w-full text-sm text-left min-w-[600px]">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
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
                {transactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-slate-400"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AlertCircle className="w-6 h-6 opacity-20" />
                        <p>Nenhuma compra realizada ainda.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx: any) => (
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
                        {new Date(tx.createdAt).toLocaleDateString("pt-MZ", {
                          day: "2-digit",
                          month: "short",
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
        </Card>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "APPROVED") {
    return (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none shadow-none px-3">
        Pago
      </Badge>
    );
  }
  if (status === "REJECTED") {
    return (
      <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none shadow-none px-3">
        Cancelado
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="text-yellow-700 border-yellow-200 bg-yellow-50 px-3 whitespace-nowrap"
    >
      <Clock className="w-3 h-3 mr-1" /> Pendente
    </Badge>
  );
}
