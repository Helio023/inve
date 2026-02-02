import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Event } from "@/lib/models/Event";
import { redirect } from "next/navigation";
import { EditEventForm } from "./_components/edit-event-form";
import { DeleteEventArea } from "./_components/delete-event-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EventSettingsPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  if (!session) redirect("/login");

  await connectDB();

  const event = await Event.findById(id).lean();
  if (!event) return <div>Evento não encontrado</div>;

  const plainEvent = JSON.parse(JSON.stringify(event));

  const serializedEvent = {
    ...plainEvent,

    date: event.date ? new Date(event.date) : undefined,
    coverImage: event.coverImage || "",
    description: event.description || "",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/events">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Configurações do Evento
          </h1>
          <p className="text-slate-500 text-sm">
            Gerencie as informações principais e aparência no WhatsApp.
          </p>
        </div>
      </div>

      {/* Formulário Principal */}
      <EditEventForm event={serializedEvent} />

      {/* Zona de Perigo */}
      <DeleteEventArea eventId={id} eventTitle={event.title} />
    </div>
  );
}


