"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db";
import { Agency } from "@/lib/models/Agency";

export async function toggleAgencyAccess(agencyId: string, action: "BLOCK" | "UNBLOCK") {
  try {
    await connectDB();
    
    // Status SUSPENDED bloqueia acesso real na lógica de middleware ou layout
    const status = action === "BLOCK" ? "SUSPENDED" : "APPROVED";
    
    await Agency.findByIdAndUpdate(agencyId, {
      verificationStatus: status,
      isActive: action === "UNBLOCK"
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Erro interno" };
  }
}