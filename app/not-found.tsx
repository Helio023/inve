import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, Home, LayoutDashboard } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
      {/* Ícone Animado */}
      <div className="bg-white p-6 rounded-full shadow-sm mb-6 animate-in zoom-in duration-500">
        <FileQuestion className="w-16 h-16 text-slate-300" />
      </div>

      <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
        404
      </h1>
      
      <h2 className="text-xl font-semibold text-slate-700 mb-4">
        Página não encontrada
      </h2>

      <p className="text-slate-500 max-w-md mb-8 leading-relaxed">
        O link que tentou aceder pode estar incorreto, ter sido removido ou o convite expirou.
      </p>

      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        {/* Opção para Convidados/Público */}
        <Button asChild variant="default" className="bg-slate-900 hover:bg-slate-800">
          <Link href="/">
            <Home className="w-4 h-4 mr-2" />
            Ir para o Início
          </Link>
        </Button>

        {/* Opção para Agências (caso estejam logadas) */}
        <Button asChild variant="outline" className="border-slate-200 bg-white">
          <Link href="/dashboard">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Meu Dashboard
          </Link>
        </Button>
      </div>

      {/* Rodapé discreto */}
      <div className="mt-12 text-xs text-slate-300 font-mono">
        Qonvip &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}