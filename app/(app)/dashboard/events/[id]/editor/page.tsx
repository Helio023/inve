import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Event } from "@/lib/models/Event";
import { Agency } from "@/lib/models/Agency"; 
import { redirect } from "next/navigation";
import { EditorClient } from "./_components/editor-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import mongoose from "mongoose";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditorPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return <ErrorState message="O ID do evento é inválido." />;
  }

  await connectDB();

  try {
    // 1. Busca o Evento (Lean para ser mais rápido)
    const event = await Event.findById(id).lean();
    
    if (!event) return <ErrorState message="Evento não encontrado." />;
    
   
    const agency = await Agency.findById(event.agencyId).select('slug').lean();
    if (!agency) return <ErrorState message="Agência vinculada não encontrada." />;

  
    const serializedEvent = JSON.parse(JSON.stringify(event));

    if (!serializedEvent.settings) {
      serializedEvent.settings = { music: { isEnabled: false, url: "", autoPlay: false } };
    }
    if (!serializedEvent.designContent || !Array.isArray(serializedEvent.designContent)) {
      serializedEvent.designContent = [];
    }

    return (
      <EditorClient 
        eventId={id} 
        
        initialData={serializedEvent}
        eventType={event.eventType}
        currentStatus={event.status}
        eventSlug={event.slug} 
        agencySlug={agency.slug}
      />
    );

  } catch (error) {
    console.error("Erro:", error);
    return <ErrorState message="Erro interno ao carregar o editor." />;
  }
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <div className="bg-red-100 p-4 rounded-full"><AlertCircle className="w-10 h-10 text-red-600" /></div>
      <p className="text-slate-500">{message}</p>
      <Button asChild variant="outline"><Link href="/dashboard/events"><ArrowLeft className="mr-2 h-4 w-4" />Voltar</Link></Button>
    </div>
  );
}