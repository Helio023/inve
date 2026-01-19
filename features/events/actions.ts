'use server';

import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Event } from "@/lib/models/Event";
import { User } from "@/lib/models/User";
import { CreateEventSchema } from "./schemas";
import { UpdateEventSchema } from "./schemas";
import { revalidatePath } from "next/cache";

export async function createEventAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) return { error: "Não autorizado" };

  // 1. Resgatar valores
  const dateString = formData.get('date') as string;
  
  
  const dateObj = dateString ? new Date(dateString) : undefined;

  const rawData = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    eventType: formData.get('eventType'),
    date: dateObj, 
  };

  // 3. Validação
  const validated = CreateEventSchema.safeParse(rawData);
  
  if (!validated.success) {
    // Retorna a mensagem definida no invalid_type_error
    return { error: validated.error.issues[0].message };
  }
  
  const data = validated.data;

  try {
    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user?.agencyId) {
        return { error: "Usuário não possui agência vinculada." };
    }

    const existingEvent = await Event.findOne({ slug: data.slug });
    if (existingEvent) {
      return { error: "Esta URL já está em uso." };
    }

    const newEvent = await Event.create({
      agencyId: user.agencyId,
      title: data.title,
      slug: data.slug,
      eventType: data.eventType,
      date: data.date,
      status: 'DRAFT',
      designContent: [], 
      timeline: [],
    });

    revalidatePath("/dashboard/events");
    return { success: true, eventId: newEvent._id.toString() };

  } catch (error) {
    console.error(error);
    return { error: "Erro interno ao criar evento." };
  }
}


export async function updateEventAction(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { error: "Não autorizado" };

  const dateString = formData.get('date') as string;
  
  const rawData = {
    eventId: formData.get('eventId'),
    title: formData.get('title'),
    description: formData.get('description'),
    coverImage: formData.get('coverImage'),
    date: dateString ? new Date(dateString) : undefined,
  };

  const validated = UpdateEventSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { eventId, ...updateData } = validated.data;

  try {
    await connectDB();
    
   
    const event = await Event.findById(eventId);
    if (!event) return { error: "Evento não encontrado" };

    await Event.findByIdAndUpdate(eventId, updateData);

    revalidatePath(`/dashboard/events/${eventId}/settings`);
    return { success: true };

  } catch (error) {
    return { error: "Erro ao atualizar evento." };
  }
}

// --- APAGAR EVENTO ---
export async function deleteEventAction(eventId: string) {
  const session = await auth();
  if (!session?.user) return { error: "Não autorizado" };

  try {
    await connectDB();
    await Event.findByIdAndDelete(eventId);
    
    
    revalidatePath("/dashboard/events");
    return { success: true };
  } catch (error) {
    return { error: "Erro ao apagar evento." };
  }
}