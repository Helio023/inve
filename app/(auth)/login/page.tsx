import { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  title: "Login | Qonvip",
  description: "Acesse o painel administrativo para gerenciar seus convites digitais.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-xl font-semibold text-slate-800">
          <Logo />
        </h1>
      </div>

      <LoginForm />
    </main>
  );
}