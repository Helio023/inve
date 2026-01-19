"use server";

import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import { User } from "@/lib/models/User";
import { Package, Transaction } from "@/lib/models/Finance";
import { revalidatePath } from "next/cache";
import { SITE_CONFIG } from "@/config/plans";

export async function createPurchaseAction(packageId: string) {
  const session = await auth();

  if (!session?.user?.email) {
    return { error: "Sessão expirada. Faça login novamente." };
  }

  try {
    await connectDB();

    const [user, pkg] = await Promise.all([
      User.findOne({ email: session.user.email }).select("agencyId"),
      Package.findById(packageId),
    ]);

    if (!pkg) return { error: "Pacote não encontrado ou desativado." };
    if (!user?.agencyId) return { error: "Usuário sem agência vinculada." };

    // 2. Criar Transação
    const newTransaction = await Transaction.create({
      agencyId: user.agencyId,
      packageId: pkg._id,
      packageName: pkg.name,
      amount: pkg.price,
      creditsSnapshot: pkg.credits,
      status: "PENDING",
      paymentMethod: "MPESA",
    });

    // 3. Gerar Link do WhatsApp
    const shortId = newTransaction._id.toString().slice(-6).toUpperCase();

    const message =
      `Olá! Gostaria de efectuar o pagamento do pedido *#${shortId}*.\n\n` +
      `📦 Pacote: *${pkg.name}*\n` +
      `💰 Valor: *${pkg.price.toLocaleString()} ${SITE_CONFIG.currency}*\n\n` +
      `Aguardo as instruções do M-Pesa.`;

    const whatsappUrl = `https://wa.me/${
      SITE_CONFIG.adminPhone
    }?text=${encodeURIComponent(message)}`;

    revalidatePath("/dashboard/billing");

    return { success: true, redirectUrl: whatsappUrl };
  } catch (error) {
    console.error("[PURCHASE_ERROR]:", error);
    return { error: "Não foi possível processar o pedido. Tente novamente." };
  }
}
