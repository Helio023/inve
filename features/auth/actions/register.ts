'use server';

import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import { RegisterSchema } from "../schemas";
import { User } from "@/lib/models/User";
import { Agency } from "@/lib/models/Agency";

export async function registerAction(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    
    // --- CORREÇÃO AQUI ---
    const validatedFields = RegisterSchema.safeParse(rawData);

    if (!validatedFields.success) {
      // Usamos .issues[0] em vez de .errors[0] para agradar o TypeScript estrito
      // Ou usamos flatten() se quisermos todos os erros
      return { 
        error: validatedFields.error.issues[0].message 
      };
    }

    const data = validatedFields.data;
    // ---------------------

    await connectDB();

    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return { error: "Este email já está associado a uma conta." };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const baseSlug = data.name.toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
      
    const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;

    const newAgency = await Agency.create({
      name: data.name,
      slug: uniqueSlug,
      emailContact: data.email,
      phone: data.phone,
      type: data.accountType,
      location: {
        province: data.province,
        district: data.district
      },
      verificationStatus: 'PENDING',
      credits: {},
    });

    await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: 'AGENCY_OWNER',
      agencyId: newAgency._id,
    });

    return { success: true };

  } catch (error) {
    console.error("[REGISTER_ACTION_ERROR]:", error);
    return { error: "Ocorreu um erro interno. Por favor, tente novamente mais tarde." };
  }
}