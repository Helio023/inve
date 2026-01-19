import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* --- HEADER --- */}
      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
              I
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">
              Invite SaaS
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
            >
              Entrar
            </Link>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 font-bold shadow-md">
              <Link href="/register">
                Começar Grátis
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <main className="flex-1 flex flex-col justify-center items-center text-center px-4 py-20 md:py-32">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Sparkles className="w-3 h-3" /> Novo: Gestão de RSVP via WhatsApp
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mb-6 leading-tight animate-in fade-in slide-in-from-bottom-5 duration-700">
          Crie Convites Digitais que seus clientes vão <span className="text-blue-600">amar</span>.
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mb-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          A plataforma completa para Agências e Freelancers. Crie, distribua e gerencie convites de casamento, aniversários e eventos corporativos em minutos.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center animate-in fade-in zoom-in duration-1000">
          <Button asChild size="lg" className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-700 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
            <Link href="/register">
              Criar Minha Agência <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base border-slate-300 text-slate-700 hover:bg-white hover:text-blue-600">
            <Link href="/login">
              Acessar Painel
            </Link>
          </Button>
        </div>

        {/* --- FEATURES GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-6xl w-full text-left">
          <FeatureCard 
            title="Editor Visual" 
            desc="Arraste e solte elementos para criar designs incríveis sem programar."
          />
          <FeatureCard 
            title="Gestão de Convidados" 
            desc="Envie links únicos e controle quem confirmou presença em tempo real."
          />
          <FeatureCard 
            title="Links WhatsApp" 
            desc="Gere mensagens personalizadas para envio rápido e profissional."
          />
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        <p>© {new Date().getFullYear()} Invite SaaS Moçambique. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
        <CheckCircle className="w-5 h-5 text-blue-600" />
      </div>
      <h3 className="font-bold text-slate-900 text-lg mb-2">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}