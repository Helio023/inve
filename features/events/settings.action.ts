"use server";

import connectDB from "@/lib/db";
import { Event } from "@/lib/models/Event";
import { revalidatePath } from "next/cache";

export async function updateEventSettingsAction(eventId: string, settings: any) {
  try {
    await connectDB();

    await Event.findByIdAndUpdate(eventId, {
      $set: { settings: settings }
    });

    revalidatePath(`/dashboard/events/${eventId}/editor`);
    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar configurações:", error);
    return { error: "Falha ao salvar configurações" };
  }
}