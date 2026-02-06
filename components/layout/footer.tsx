import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Logo } from "../logo";

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-12 mt-20">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Coluna 1: Marca */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 font-bold text-lg text-slate-900">
            <Logo />
          </div>

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Todos os direitos reservados.
          </p>
        </div>

        {/* Coluna 2: Produto */}
        <div>
          <h4 className="font-bold text-slate-900 mb-4">Produto</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>
              <Link href="#features" className="hover:text-blue-600">
                Funcionalidades
              </Link>
            </li>
            <li>
              <Link href="#pricing" className="hover:text-blue-600">
                Preços
              </Link>
            </li>
            <li>
              <Link href="/templates" className="hover:text-blue-600">
                Templates
              </Link>
            </li>
          </ul>
        </div>

        {/* Coluna 3: Legal */}
        <div>
          <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>
              <Link href="/terms" className="hover:text-blue-600">
                Termos de Uso
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-blue-600">
                Privacidade
              </Link>
            </li>
          </ul>
        </div>

        {/* Coluna 4: Contacto */}
        <div>
          <h4 className="font-bold text-slate-900 mb-4">Contacto</h4>
          <p className="text-sm text-slate-600 mb-2">
            suporte@invitesaas.co.mz
          </p>
          <p className="text-sm text-slate-600">+258 84 000 0000</p>
        </div>
      </div>
    </footer>
  );
}
