'use server';

import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Event } from "@/lib/models/Event";
import { revalidatePath } from "next/cache";

export async function saveEventDesignAction(eventId: string, designContent: any) {
  const session = await auth();
  if (!session?.user) return { error: "Não autorizado" };

  try {
    await connectDB();

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { 
        designContent: designContent,
        updatedAt: new Date() 
      },
      { new: true }
    );

    if (!updatedEvent) return { error: "Evento não encontrado" };

    revalidatePath(`/dashboard/events/${eventId}/editor`);
    return { success: true, lastSaved: new Date().toISOString() };

  } catch (error) {
    console.error("Erro ao salvar design:", error);
    return { error: "Falha ao salvar alterações." };
  }
}