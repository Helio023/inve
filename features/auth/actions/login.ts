'use server';

import { z } from "zod";
import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import { LoginSchema } from "../schemas";
import { User } from "@/lib/models/User"; // Importe o Model User
import connectDB from "@/lib/db";

export async function loginAction(data: z.infer<typeof LoginSchema>) {
  const validatedFields = LoginSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Credenciais inválidas." };
  }

  const { email, password } = validatedFields.data;

  try {
    // 1. Antes de chamar o signIn do NextAuth, vamos buscar a Role
    // Isso é seguro porque o signIn vai validar a senha logo depois de qualquer forma.
    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) return { error: "Usuário não encontrado." };

    // 2. Autentica
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    // 3. Retorna SUCESSO e a ROLE
    return { 
      success: true, 
      role: user.role // Aqui está o segredo (SUPER_ADMIN ou AGENCY_OWNER)
    };

  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Email ou senha incorretos." };
        case "AccessDenied":
          return { error: "Acesso negado. Conta pendente ou suspensa." };
        default:
          return { error: "Erro na autenticação." };
      }
    }
    throw error;
  }
}