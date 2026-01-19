"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db";
import { Agency } from "@/lib/models/Agency";
import { Transaction } from "@/lib/models/Finance";

export async function updateAgencyStatus(
  agencyId: string,
  status: "APPROVED" | "REJECTED"
) {
  try {
    await connectDB();

    const agency = await Agency.findByIdAndUpdate(
      agencyId,
      {
        verificationStatus: status,
        isActive: status === "APPROVED",
      },
      { new: true }
    );

    if (!agency) {
      return { error: "Agência não encontrada." };
    }

    // Revalida a página do admin para sumir com o item da lista instantaneamente
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar agência:", error);
    return { error: "Erro interno no servidor." };
  }
}

export async function updateTransactionStatus(
  txId: string,
  status: "APPROVED" | "REJECTED"
) {
  try {
    await connectDB();

    const tx = await Transaction.findById(txId);
    if (!tx) return { error: "Transação não encontrada." };

    if (tx.status !== "PENDING")
      return { error: "Esta transação já foi processada." };

    if (status === "APPROVED") {
      const agency = await Agency.findById(tx.agencyId);
      if (!agency) return { error: "Agência da transação não existe." };

      const creditsToAdd = tx.creditsSnapshot;

      if (creditsToAdd) {
        if (creditsToAdd instanceof Map) {
          for (const [type, amount] of creditsToAdd) {
            const currentAmount = agency.credits.get(type) || 0;
            agency.credits.set(type, currentAmount + Number(amount));
          }
        } else {
          for (const [type, amount] of Object.entries(creditsToAdd)) {
            if (type.startsWith("$")) continue;

            const currentAmount = agency.credits.get(type) || 0;
            agency.credits.set(type, currentAmount + Number(amount));
          }
        }
      }

      await agency.save();
    }

    tx.status = status;
    tx.approvedAt = new Date();
    await tx.save();

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Erro na transação:", error);
    return { error: "Erro ao processar pagamento." };
  }
}
