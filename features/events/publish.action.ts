// "use server";

// import { auth } from "@/lib/auth";
// import connectDB from "@/lib/db";
// import { Agency } from "@/lib/models/Agency";
// import { Event } from "@/lib/models/Event";
// import { revalidatePath } from "next/cache";

// export async function publishEventAction(eventId: string) {
//   const session = await auth();
//   if (!session?.user) return { error: "Não autorizado" };

//   try {
//     await connectDB();

//     const event = await Event.findById(eventId);
//     if (!event) return { error: "Evento não encontrado." };

//     if (!event.hasPaid) {
//       const agency = await Agency.findOne({ emailContact: session.user.email });
//       if (!agency) return { error: "Agência não encontrada." };

//       const type = event.eventType;
//       const currentBalance = agency.credits.get(type) || 0;

//       if (currentBalance < 1) {
//         return {
//           error: "INSUFFICIENT_FUNDS",
//           requiredType: type,
//         };
//       }

//       agency.credits.set(type, currentBalance - 1);
//       await agency.save();

//       event.hasPaid = true;
//     }

//     event.status = "PUBLISHED";
//     await event.save();

//     revalidatePath(`/dashboard/events/${eventId}/editor`);

//     return { success: true };
//   } catch (error) {
//     console.error("Erro ao publicar:", error);
//     return { error: "Erro interno no servidor." };
//   }
// }


"use server";

import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Agency } from "@/lib/models/Agency";
import { Event } from "@/lib/models/Event";
import { revalidatePath } from "next/cache";

export async function publishEventAction(eventId: string) {
  const session = await auth();
  if (!session?.user) return { error: "Não autorizado" };

  try {
    await connectDB();

    const event = await Event.findById(eventId);
    if (!event) return { error: "Evento não encontrado." };

    // Só cobra se ainda não tiver pago
    if (!event.hasPaid) {
      // Melhoria: Busca a agência pelo ID que está no evento (mais seguro)
      const agency = await Agency.findById(event.agencyId);
      
      if (!agency) return { error: "Agência não encontrada." };

      const type = event.eventType; // 'wedding', 'birthday', etc.
      
      // Acessa o Map de créditos
      const currentBalance = agency.credits.get(type) || 0;

      if (currentBalance < 1) {
        return {
          error: "INSUFFICIENT_FUNDS",
          requiredType: type, // Retorna o tipo para o modal saber o que pedir
        };
      }

      // Desconta o crédito e salva a agência
      agency.credits.set(type, currentBalance - 1);
      await agency.save();

      // Marca o evento como pago
      event.hasPaid = true;
    }

    // Publica o evento
    event.status = "PUBLISHED";
    await event.save();

    revalidatePath(`/dashboard/events/${eventId}/editor`);

    return { success: true };
  } catch (error) {
    console.error("Erro ao publicar:", error);
    return { error: "Erro interno no servidor." };
  }
}