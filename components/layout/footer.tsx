
"use client";

import Link from "next/link";
import {
  ArrowRight,
  Instagram,
  Linkedin,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { Logo } from "../logo";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-24 pb-12">
      <div className="container mx-auto px-6">
        {/* --- SECTION: PRE-FOOTER CTA --- */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 md:p-16 text-center mb-24 shadow-2xl">
          {/* Efeito de luz de fundo */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15),transparent_70%)] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-none">
              Pronto para elevar o nível dos seus eventos?
            </h2>
            <p className="text-slate-400 text-lg font-medium">
              Junte-se a dezenas de agências que já estão a lucrar mais com
              convites digitais de luxo.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full h-14 px-10 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                >
                  Criar conta gratuita
                </Button>
              </Link>
             
            </div>
          </div>
        </div>

        {/* --- SECTION: FOOTER LINKS --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
          {/* Coluna Marca (Mais larga no Desktop) */}
          <div className="col-span-2 lg:col-span-2 space-y-6">
            <Logo />
            <p className="text-slate-500 text-sm max-w-xs leading-relaxed font-medium">
              A plataforma definitiva para profissionais de eventos que buscam
              design, interatividade e gestão de convidados em um só lugar.
            </p>
           
          </div>

          {/* Coluna Produto */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">
              Plataforma
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="#features"
                  className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
                >
                  Funcionalidades
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
                >
                  Preços
                </Link>
              </li>
              {/* <li><Link href="#" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Demonstração</Link></li> */}
            </ul>
          </div>

          {/* Coluna Legal */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">
              Legal
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/terms"
                  className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
                >
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
                >
                  Privacidade
                </Link>
              </li>
              {/* <li><Link href="/cookies" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Cookies</Link></li> */}
            </ul>
          </div>

          {/* Coluna Suporte */}
          <div className="space-y-6 col-span-2 md:col-span-1">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">
              Contacto
            </h4>
            <div className="space-y-2">
              {/* <p className="text-sm font-bold text-slate-500">Matola, Moçambique</p> */}
              <p className="text-sm font-black text-slate-900">
                +258 87 639 7558
              </p>
              {/* <p className="text-xs font-medium text-blue-600 underline">suporte@qonvip.com</p> */}
            </div>
          </div>
        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            © {new Date().getFullYear()} Qonvip. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <Sparkles className="w-3 h-3 fill-current text-blue-500" />
            Orgulhosamente feito em Moçambique
          </div>
        </div>
      </div>
    </footer>
  );
}
