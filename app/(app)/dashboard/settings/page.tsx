import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import { User } from "@/lib/models/User";
import { Agency } from "@/lib/models/Agency";
import { redirect } from "next/navigation";
import { AgencySettingsForm } from "./_components/agency-settings-form";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SecurityForm } from "@/features/auth/components/security-form";

export const metadata = {
  title: "Configurações | Invite SaaS",
};

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  await connectDB();

  const user = await User.findOne({ email: session.user?.email });
  if (!user?.agencyId) return <div>Erro: Sem agência associada.</div>;

  const agency = await Agency.findById(user.agencyId).lean();
  
  const serializedAgency = JSON.parse(JSON.stringify(agency));

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4 md:p-0 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Configurações
        </h1>
        <p className="text-slate-500 mt-1">
          Gerencie o perfil da agência e a segurança da conta.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="profile">Perfil da Agência</TabsTrigger>
          <TabsTrigger value="security">Segurança e Login</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4 animate-in fade-in">
          <AgencySettingsForm agency={serializedAgency} />
        </TabsContent>

        <TabsContent value="security" className="space-y-4 animate-in fade-in">
        
          <SecurityForm userEmail={user.email} />
        </TabsContent>
      </Tabs>
    </div>
  );
}