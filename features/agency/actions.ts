"use server";

import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Agency } from "@/lib/models/Agency";
import { User } from "@/lib/models/User";
import { UpdateAgencySchema } from "./schemas";
import { revalidatePath } from "next/cache";

export async function updateAgencyAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) return { error: "Não autorizado" };

  const rawData = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    emailContact: formData.get("emailContact"),
    logoUrl: formData.get("logoUrl"),
    description: formData.get("description"),
    province: formData.get("province"),
    district: formData.get("district"),
  };

  const validated = UpdateAgencySchema.safeParse(rawData);

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  try {
    await connectDB();
    
    // 1. Encontrar o user para saber qual é a agência
    const user = await User.findOne({ email: session.user.email });
    if (!user?.agencyId) return { error: "Agência não encontrada." };

    // 2. Atualizar a Agência
    await Agency.findByIdAndUpdate(user.agencyId, {
      $set: {
        name: validated.data.name,
        phone: validated.data.phone,
        emailContact: validated.data.emailContact,
        logoUrl: validated.data.logoUrl,
        description: validated.data.description,
        location: {
            province: validated.data.province,
            district: validated.data.district
        }
      }
    });

    revalidatePath("/dashboard/settings");
    return { success: true };

  } catch (error) {
    console.error("Erro update agency:", error);
    return { error: "Erro ao atualizar perfil." };
  }
}