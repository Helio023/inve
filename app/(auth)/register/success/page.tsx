import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, MessageCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Conta Criada | Invite SaaS",
};

// Número do Admin (Substitua pelo seu número real)
const ADMIN_PHONE = "258841234567"; // Exemplo: 84... ou 82...
const PRE_FILLED_MESSAGE = encodeURIComponent(
  "Olá! Acabei de criar uma conta de Agência no Invite SaaS e gostaria de agilizar a verificação."
);

export default function RegisterSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-slate-200 text-center">
        <CardHeader className="flex flex-col items-center space-y-4 pb-2">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2 animate-in zoom-in duration-500">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            Registo Efetuado!
          </CardTitle>
          <CardDescription className="text-base">
            A sua conta foi criada e está atualmente com o status:{" "}
            <span className="font-semibold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded border border-yellow-200">
              Pendente
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-slate-600">
          <p>
            Para garantir a segurança da plataforma, analisamos manualmente cada
            nova agência ou freelancer.
          </p>
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-sm text-blue-800">
            <p className="font-semibold mb-1">Quer ser aprovado agora?</p>
            Envie uma mensagem para o nosso suporte no WhatsApp confirmando a
            sua identidade.
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-2">
          {/* Botão do WhatsApp */}
          <Button
            asChild
            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold h-12 shadow-md transition-all hover:scale-[1.02]"
          >
            <a
              href={`https://wa.me/${ADMIN_PHONE}?text=${PRE_FILLED_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Verificar no WhatsApp
            </a>
          </Button>

          {/* Link secundário para Login */}
          <Button asChild variant="ghost" className="w-full text-slate-500">
            <Link href="/login">
              Ir para o Login <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}