

import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Event } from "@/lib/models/Event";
import { Guest } from "@/lib/models/Guest";
import { Agency } from "@/lib/models/Agency";
import { redirect } from "next/navigation";

import { AddGuestForm } from "./_components/add-guest-form";
import { GuestList } from "./_components/guest-list";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EventGuestsPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  if (!session) redirect("/login");

  await connectDB();

  // 1. Buscar Dados do Evento e Agência
  const event = await Event.findById(id).lean();
  if (!event) return <div>Evento não encontrado</div>;

  const agency = await Agency.findById(event.agencyId).lean();
  if (!agency) return <div>Agência não encontrada</div>;

  // 2. Buscar Lista de Convidados
  const guests = await Guest.find({ eventId: id })
    .sort({ createdAt: -1 })
    .lean();

  // 3. Montar URL Base
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
  const isLocalhost = rootDomain.includes("localhost");
  const protocol = isLocalhost ? "http" : "https";

  let baseUrl = "";
  if (isLocalhost) {
    baseUrl = `${protocol}://${rootDomain}/sites/${agency.slug}/${event.slug}`;
  } else {
    baseUrl = `${protocol}://${agency.slug}.${rootDomain}/${event.slug}`;
  }

  // --- CORREÇÃO DE SERIALIZAÇÃO AQUI ---
  const serializedGuests = guests.map((g: any) => ({
    ...g,
    _id: g._id.toString(),
    eventId: g.eventId.toString(),
    agencyId: g.agencyId.toString(),
    createdAt: g.createdAt
      ? g.createdAt.toISOString()
      : new Date().toISOString(),
    updatedAt: g.updatedAt
      ? g.updatedAt.toISOString()
      : new Date().toISOString(),
    // Limpeza profunda do menuChoices para evitar erros de objeto
    menuChoices: g.menuChoices ? JSON.parse(JSON.stringify(g.menuChoices)) : [],
  }));
  // --------------------------------------

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/events">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Lista de Convidados
            </h1>
            <p className="text-slate-500 text-sm">
              Gerencie quem vai receber o convite para{" "}
              <strong>{event.title}</strong>
            </p>
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="flex gap-4 text-sm">
          <div className="bg-white px-4 py-2 rounded-lg border shadow-sm">
            <span className="block text-slate-400 text-xs uppercase font-bold">
              Total
            </span>
            <span className="text-xl font-bold">{guests.length}</span>
          </div>
          <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-100">
            <span className="block text-green-600 text-xs uppercase font-bold">
              Confirmados
            </span>
            <span className="text-xl font-bold text-green-700">
              {guests.filter((g: any) => g.status === "CONFIRMED").length}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <AddGuestForm eventId={id} />
        </div>

        <div className="lg:col-span-2">
          <GuestList
            guests={serializedGuests}
            eventId={id}
            baseUrl={baseUrl}
            eventDescription={event.description}
          />
        </div>
      </div>
    </div>
  );
}
