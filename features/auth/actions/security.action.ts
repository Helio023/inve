"use server";

import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import { User } from "@/lib/models/User";
import { compare, hash } from "bcryptjs"; // Certifique-se que tem bcryptjs instalado
import { revalidatePath } from "next/cache";

export async function changePasswordAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) return { error: "Não autorizado" };

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "Todos os campos são obrigatórios." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "A nova senha e a confirmação não coincidem." };
  }

  if (newPassword.length < 6) {
    return { error: "A nova senha deve ter pelo menos 6 caracteres." };
  }

  try {
    await connectDB();
    
    // 1. Buscar o utilizador com a senha (o select('+password') é necessário se o campo estiver hidden no schema)
    const user = await User.findOne({ email: session.user.email }).select("+password");

    if (!user || !user.password) {
      return { error: "Utilizador não encontrado ou conta Google (sem senha)." };
    }

    // 2. Verificar se a senha atual está correta
    const isValid = await compare(currentPassword, user.password);
    
    if (!isValid) {
      return { error: "A senha atual está incorreta." };
    }

    // 3. Encriptar e Salvar a nova senha
    const hashedPassword = await hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Erro ao atualizar a senha." };
  }
}