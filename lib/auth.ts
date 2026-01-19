import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import { User } from "@/lib/models/User";
import { Agency } from "@/lib/models/Agency";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Schema simples para validar dentro do Authorize
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
          
          // Busca usuário e inclui a senha (que está escondida por padrão)
          const user = await User.findOne({ email }).select("+password");

          if (!user || !user.password) return null;

          // Verifica senha
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            // VERIFICAÇÃO EXTRA: O usuário tem uma agência? Ela está aprovada?
            // Se for SUPER_ADMIN, passa direto
            if (user.role !== 'SUPER_ADMIN') {
               const agency = await Agency.findById(user.agencyId);
               
               if (!agency) throw new Error("Agência não encontrada.");
               
               if (agency.verificationStatus === 'PENDING') {
                 // Truque: lançar erro aqui fará o login falhar
                 throw new Error("Sua conta ainda está em análise.");
               }
               
               if (agency.verificationStatus === 'SUSPENDED' || agency.verificationStatus === 'REJECTED') {
                 throw new Error("Conta suspensa ou rejeitada.");
               }
            }

            return user;
          }
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login", // Página customizada de login
  },
  callbacks: {
    // Adiciona o ID e Role à sessão para usar no Frontend
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        // @ts-ignore
        session.user.role = token.role; // Precisará estender tipos do NextAuth
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    }
  }
});