"use server";

import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Guest } from "@/lib/models/Guest";
import { Event } from "@/lib/models/Event";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

async function validateOwnership(eventId: string) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Não autorizado");

  return true;
}

export async function addGuestAction(formData: FormData) {
  try {
    await connectDB();
    const eventId = formData.get("eventId") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const maxAdults = Number(formData.get("maxAdults") || 1);

    await validateOwnership(eventId);

    const event = await Event.findById(eventId).select("agencyId");
    if (!event) return { error: "Evento não encontrado" };

    const newGuest = await Guest.create({
      eventId,
      agencyId: event.agencyId,
      name,
      phone,

      inviteToken: uuidv4().slice(0, 8),
      status: "PENDING",
      confirmedAdults: 0,
      maxAllowedGuests: maxAdults,
    });

    revalidatePath(`/dashboard/events/${eventId}/guests`);
    return { success: true, guest: JSON.parse(JSON.stringify(newGuest)) };
  } catch (error) {
    console.error(error);
    return { error: "Erro ao adicionar convidado." };
  }
}

export async function deleteGuestAction(guestId: string, eventId: string) {
  try {
    await connectDB();
    await validateOwnership(eventId);
    await Guest.findByIdAndDelete(guestId);
    revalidatePath(`/dashboard/events/${eventId}/guests`);
    return { success: true };
  } catch (error) {
    return { error: "Erro ao remover." };
  }
}


// export async function submitRsvpAction(formData: FormData) {
//   try {
//     await connectDB();
    
//     const token = formData.get('token') as string;
//     const status = formData.get('status') as 'CONFIRMED' | 'DECLINED' | 'PENDING';
//     const adults = Number(formData.get('adults') || 1);
//     const kids = Number(formData.get('kids') || 0);
//     const message = formData.get('message') as string;

//     // 1. Validar Token
//     const guest = await Guest.findOne({ inviteToken: token });
    
//     if (!guest) {
//       return { error: "Convite inválido ou expirado." };
//     }

//     // 2. Atualizar Dados
//     guest.status = status;
//     guest.confirmedAdults = status === 'CONFIRMED' ? adults : 0;
//     guest.confirmedKids = status === 'CONFIRMED' ? kids : 0;
//     guest.messageToHosts = message;
//     guest.hasOpened = true; 
    
//     await guest.save();

 
//     revalidatePath(`/dashboard/guests`);

//     return { success: true };

//   } catch (error) {
//     console.error("Erro no RSVP:", error);
//     return { error: "Erro ao enviar resposta." };
//   }
// }


export async function submitRsvpAction(formData: FormData) {
  try {
    await connectDB();
    
    const token = formData.get('token') as string;
    const status = formData.get('status') as 'CONFIRMED' | 'DECLINED' | 'PENDING';
    const adults = Number(formData.get('adults') || 1);
    const kids = Number(formData.get('kids') || 0);
    const message = formData.get('message') as string;

    const menuChoicesRaw = formData.get('menuChoices') as string;
    const menuChoices = menuChoicesRaw ? JSON.parse(menuChoicesRaw) : [];

    const guest = await Guest.findOne({ inviteToken: token });
    
    if (!guest) {
      return { error: "Convite inválido ou expirado." };
    }

  
    guest.status = status;
    guest.confirmedAdults = status === 'CONFIRMED' ? adults : 0;
    guest.confirmedKids = status === 'CONFIRMED' ? kids : 0;
    guest.messageToHosts = message;
    guest.hasOpened = true; 
    

    if (menuChoices && menuChoices.length > 0) {
      guest.menuChoices = menuChoices;
    }
    
    
    await guest.save();

 
    revalidatePath(`/dashboard/guests`); 
    
    if (guest.eventId) {
        revalidatePath(`/dashboard/events/${guest.eventId}/guests`);
    }

    return { success: true };

  } catch (error) {
    console.error("Erro no RSVP:", error);
    return { error: "Erro ao enviar resposta." };
  }
}