// import { auth } from "@/lib/auth";
// import connectDB from "@/lib/db";
// import { Event } from "@/lib/models/Event";
// import { redirect } from "next/navigation";
// import { EditorClient } from "./_components/editor-client";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { ArrowLeft, AlertCircle } from "lucide-react";
// import mongoose from "mongoose";

// interface PageProps {
//   params: Promise<{ id: string }>;
// }

// export default async function EditorPage({ params }: PageProps) {
//   const resolvedParams = await params;
//   const eventId = resolvedParams.id;

//   const session = await auth();
//   if (!session) redirect("/login");

//   if (!mongoose.Types.ObjectId.isValid(eventId)) {
//     return <ErrorState message="O ID do evento é inválido." />;
//   }

//   await connectDB();

//   try {
//     // 3. Busca no Banco
//     const event = await Event.findById(eventId).lean();

//     if (!event) {
//       return <ErrorState message="Este evento não existe ou foi apagado." />;
//     }

//     const initialData = {
//       ...event,
//       _id: event._id.toString(),
//       designContent:
//         event.designContent &&
//         Array.isArray(event.designContent) &&
//         event.designContent.length > 0
//           ? event.designContent
//           : undefined,
//     };

//     return (
//       <EditorClient eventId={eventId} initialData={initialData.designContent} eventType={event.eventType}   currentStatus={event.status}/>
//     );
//   } catch (error) {
//     console.error("Erro ao carregar editor:", error);
//     return <ErrorState message="Erro interno ao carregar o evento." />;
//   }
// }

// function ErrorState({ message }: { message: string }) {
//   return (
//     <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
//       <div className="bg-red-100 p-4 rounded-full">
//         <AlertCircle className="w-10 h-10 text-red-600" />
//       </div>
//       <h1 className="text-xl font-bold text-slate-800">
//         Não foi possível carregar
//       </h1>
//       <p className="text-slate-500">{message}</p>
//       <Button asChild variant="outline">
//         <Link href="/dashboard/events">
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Voltar para Meus Eventos
//         </Link>
//       </Button>
//     </div>
//   );
// }


import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Event } from "@/lib/models/Event";
import { User } from "@/lib/models/User";   // <--- Importar
import { Agency } from "@/lib/models/Agency"; // <--- Importar
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
    // 1. Buscar dados completos (User -> Agency -> Event)
    const user = await User.findOne({ email: session.user.email });
    const event = await Event.findById(id).lean();
    
    // Se não tiver evento ou agência, erro
    if (!event) return <ErrorState message="Evento não encontrado." />;
    
    // Precisamos da agência para pegar o SLUG correto para o link público
    const agency = await Agency.findById(event.agencyId).select('slug').lean();
    if (!agency) return <ErrorState message="Agência vinculada não encontrada." />;

    // 2. Serialização
    const initialData = {
      ...event,
      _id: event._id.toString(),
      designContent: (event.designContent && Array.isArray(event.designContent) && event.designContent.length > 0)
        ? event.designContent 
        : undefined
    };

    return (
      <EditorClient 
        eventId={id} 
        initialData={initialData.designContent}
        eventType={event.eventType}
        currentStatus={event.status}
       
        eventSlug={event.slug} 
        agencySlug={agency.slug}
      />
    );

  } catch (error) {
    console.error("Erro:", error);
    return <ErrorState message="Erro interno." />;
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