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

    if (!event.hasPaid) {
      const agency = await Agency.findOne({ emailContact: session.user.email });
      if (!agency) return { error: "Agência não encontrada." };

      const type = event.eventType;
      const currentBalance = agency.credits.get(type) || 0;

      if (currentBalance < 1) {
        return {
          error: "INSUFFICIENT_FUNDS",
          requiredType: type,
        };
      }

      agency.credits.set(type, currentBalance - 1);
      await agency.save();

      event.hasPaid = true;
    }

    event.status = "PUBLISHED";
    await event.save();

    revalidatePath(`/dashboard/events/${eventId}/editor`);

    return { success: true };
  } catch (error) {
    console.error("Erro ao publicar:", error);
    return { error: "Erro interno no servidor." };
  }
}
