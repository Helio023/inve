'use server';

import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcryptjs"; 
import connectDB from "@/lib/db";
import { User } from "@/lib/models/User";
import { ResetToken } from "@/lib/models/ResetToken";
import { sendPasswordResetEmail } from "@/lib/mail";
import { ForgotPasswordSchema, ResetPasswordSchema } from "../schemas";

// --- AÇÃO 1: Solicitar Reset ---
export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get('email') as string;
  
  const validated = ForgotPasswordSchema.safeParse({ email });
  if (!validated.success) return { error: "Email inválido." };

  await connectDB();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hora

    await ResetToken.deleteMany({ email });
    await ResetToken.create({
      email,
      token,
      expires
    });

    await sendPasswordResetEmail(email, token);
  }

  return { success: true };
}

// --- AÇÃO 2: Efetuar Reset ---
export async function resetPasswordAction(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const validated = ResetPasswordSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { token, password } = validated.data;

  try {
    await connectDB();

    const existingToken = await ResetToken.findOne({ token });
    
    if (!existingToken) {
      return { error: "Link inválido ou expirado. Solicite novamente." };
    }

    if (new Date() > existingToken.expires) {
      await ResetToken.deleteOne({ _id: existingToken._id });
      return { error: "O link expirou." };
    }

   
    const userEmail = existingToken.email.toLowerCase();

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      { $set: { password: hashedPassword } },
      { new: true } 
    );

    if (!updatedUser) {
      return { error: "Usuário associado a este email não foi encontrado." };
    }

    await ResetToken.deleteOne({ _id: existingToken._id });

    return { success: true };

  } catch (error) {
    console.error("Erro no reset de senha:", error);
    return { error: "Erro interno ao atualizar senha." };
  }
}