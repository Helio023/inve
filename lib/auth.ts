import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import { User as UserModel } from "@/lib/models/User";
import { Agency } from "@/lib/models/Agency";
import bcrypt from "bcryptjs";
import { z } from "zod";

const AuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = AuthSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          await connectDB();

          // 1. Busca usuário
          const userDoc = await UserModel.findOne({ email }).select(
            "+password",
          );

          if (!userDoc || !userDoc.password) return null;

          // 2. Verifica senha
          const passwordsMatch = await bcrypt.compare(
            password,
            userDoc.password,
          );

          if (passwordsMatch) {
            // 3. Verificações de Agência
            if (userDoc.role !== "SUPER_ADMIN") {
              const agency = await Agency.findById(userDoc.agencyId);

              if (!agency) throw new Error("Agência não encontrada.");

              if (agency.verificationStatus === "PENDING") {
                throw new Error("Sua conta ainda está em análise.");
              }

              if (
                agency.verificationStatus === "SUSPENDED" ||
                agency.verificationStatus === "REJECTED"
              ) {
                throw new Error("Conta suspensa ou rejeitada.");
              }
            }

            return {
              id: userDoc._id.toString(),
              name: userDoc.name,
              email: userDoc.email,
              role: userDoc.role,
              agencyId: userDoc.agencyId?.toString(),
            };
          }
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      
      if (user) {
        token.role = user.role;
        token.agencyId = user.agencyId;
      }
      return token;
    },
    async session({ session, token }) {
   
      if (session.user) {
        session.user.id = token.sub as string;
        // @ts-ignore
        session.user.role = token.role;
        // @ts-ignore
        session.user.agencyId = token.agencyId;
      }
      return session;
    },
  },
});
