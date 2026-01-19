'use server';

import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Event } from "@/lib/models/Event";
import { revalidatePath } from "next/cache";

export async function unpublishEventAction(eventId: string) {
  const session = await auth();
  if (!session?.user) return { error: "Não autorizado" };

  try {
    await connectDB();

    const event = await Event.findById(eventId);
    if (!event) return { error: "Evento não encontrado." };

    // Atualiza status para RASCUNHO
    event.status = 'DRAFT';
    await event.save();

    revalidatePath(`/dashboard/events/${eventId}/editor`);
    
    return { success: true };

  } catch (error) {
    console.error("Erro ao despublicar:", error);
    return { error: "Erro interno no servidor." };
  }
}