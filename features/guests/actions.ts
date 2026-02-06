"use server";

import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Guest } from "@/lib/models/Guest";
import { Event } from "@/lib/models/Event";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { User } from "@/lib/models/User";

// Helper para validar se quem está editando é o dono do evento (Agência)
async function validateOwnership(eventId: string) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Não autorizado");

  await connectDB();
  const event = await Event.findOne({
    _id: eventId,
    agencyId: (session.user as any).agencyId,
  });
  if (!event) throw new Error("Evento não encontrado ou acesso negado.");

  return event;
}

export async function addGuestAction(formData: FormData) {
  try {
    await connectDB();
    const eventId = formData.get("eventId") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const maxAdults = Number(formData.get("maxAdults") || 1);
    const maxKids = Number(formData.get("maxKids") || 0);
    const validUntilString = formData.get("validUntil") as string;
    const validUntil = validUntilString
      ? new Date(validUntilString)
      : undefined;
    const tableName = formData.get("tableName") as string;
    const sessionLabel = formData.get("sessionLabel") as string;

    const event = await validateOwnership(eventId);

    const newGuest = await Guest.create({
      eventId,
      agencyId: event.agencyId,
      name,
      phone,
      inviteToken: uuidv4().slice(0, 8),
      status: "PENDING",
      confirmedAdults: 0,
      maxAllowedChildren: maxKids,
      tableName: tableName || undefined,
      sessionLabel: sessionLabel || undefined,
      maxAllowedGuests: maxAdults,
      validUntil: validUntil,
    });

    revalidatePath(`/dashboard/events/${eventId}/guests`);
    return { success: true, guest: JSON.parse(JSON.stringify(newGuest)) };
  } catch (error: any) {
    console.error(error);
    return { error: error.message || "Erro ao adicionar convidado." };
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
    return { error: "Erro ao remover convidado." };
  }
}

export async function submitRsvpAction(formData: FormData) {
  try {
    await connectDB();

    const token = formData.get("token") as string;
    const status = formData.get("status") as
      | "CONFIRMED"
      | "DECLINED"
      | "PENDING";
    const adults = Number(formData.get("adults") || 1);
    const kids = Number(formData.get("kids") || 0);
    const message = formData.get("message") as string;
    const menuChoicesRaw = formData.get("menuChoices") as string;
    const menuChoices = menuChoicesRaw ? JSON.parse(menuChoicesRaw) : [];

    const guest = await Guest.findOne({ inviteToken: token });
    if (!guest) return { error: "Convite inválido ou expirado." };

    guest.status = status;
    guest.confirmedAdults = status === "CONFIRMED" ? adults : 0;
    guest.confirmedKids = status === "CONFIRMED" ? kids : 0;
    guest.messageToHosts = message;
    guest.hasOpened = true;

    if (menuChoices && menuChoices.length > 0) {
      guest.menuChoices = menuChoices;
    }

    await guest.save();

    revalidatePath(`/dashboard/guests`);
    if (guest.eventId) {
      revalidatePath(`/dashboard/events/${guest.eventId}/guests`);
      revalidatePath(`/host/${guest.eventId}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Erro no RSVP:", error);
    return { error: "Erro ao enviar resposta." };
  }
}

export async function toggleCheckInAction(guestId: string, eventId: string) {
  try {
    await connectDB();
    const guest = await Guest.findById(guestId);
    if (!guest) return { error: "Convidado não encontrado" };

    const newState = !guest.checkedIn;
    guest.checkedIn = newState;
    guest.checkedInAt = newState ? new Date() : undefined;

    if (newState && guest.arrivedAdults === 0) {
      guest.arrivedAdults = guest.confirmedAdults || guest.maxAllowedGuests;
      guest.arrivedKids = guest.confirmedKids || guest.maxAllowedChildren;
    }

    await guest.save();

    // Revalida a página onde o check-in é feito (Painel do Anfitrião)
    revalidatePath(`/host/${eventId}`);
    revalidatePath(`/dashboard/events/${eventId}/guests`);

    return { success: true, checkedIn: newState };
  } catch (error) {
    return { error: "Erro ao processar entrada." };
  }
}

export async function processCheckInAction(
  guestId: string,
  eventId: string,
  data: { adults: number; kids: number; isCheckingIn: boolean },
) {
  try {
    await connectDB();
    const guest = await Guest.findById(guestId);
    if (!guest) return { error: "Convidado não encontrado" };

    if (data.isCheckingIn) {
      guest.checkedIn = true;
      guest.checkedInAt = new Date();
      guest.arrivedAdults = data.adults;
      guest.arrivedKids = data.kids;
    } else {
      guest.checkedIn = false;
      guest.checkedInAt = undefined;
      guest.arrivedAdults = 0;
      guest.arrivedKids = 0;
    }

    await guest.save();

    // Revalida as rotas do anfitrião e da agência
    revalidatePath(`/host/${eventId}`);
    revalidatePath(`/dashboard/events/${eventId}/guests`);

    return { success: true };
  } catch (error) {
    return { error: "Erro ao processar check-in." };
  }
}

export async function getAllGuestsForExportAction(filters: {
  q?: string;
  eventId?: string;
  checkedInOnly?: boolean;
}) {
  try {
    const session = await auth();
    if (!session?.user?.email) return { error: "Não autorizado" };

    await connectDB();
    const query: any = { agencyId: (session.user as any).agencyId };

    if (filters.q) query.name = { $regex: filters.q, $options: "i" };
    if (filters.eventId && filters.eventId !== "all")
      query.eventId = filters.eventId;
    if (filters.checkedInOnly) query.checkedIn = true;

    const guests = await Guest.find(query)
      .sort({ name: 1 })
      .populate("eventId", "title")
      .lean();

    return { success: true, data: JSON.parse(JSON.stringify(guests)) };
  } catch (error) {
    return { error: "Erro ao buscar dados para exportação" };
  }
}
