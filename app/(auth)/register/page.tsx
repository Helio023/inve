
import { Metadata } from 'next';
import Link from 'next/link';
import { RegisterWizard } from '@/features/auth/components/RegisterWizard';

export const metadata: Metadata = {
  title: 'Criar Conta | QVite Moçambique',
  description: 'Registe a sua agência na QVite e comece a criar convites profissionais.',
};

export default function RegisterPage() {
  return (
   
    <main className="block min-h-screen-safe bg-slate-50 w-full py-12 px-4">
      <div className="max-w-lg mx-auto">
        
        {/* Cabeçalho que flui no topo */}
        <header className="mb-10 text-center">
          <div className="mb-4">
             <span className="text-5xl font-black tracking-tighter text-slate-900">
               Q<span className="text-blue-600">Vite</span>
             </span>
          </div>
          
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Crie a sua conta de agência
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Já faz parte da QVite?{' '}
            <Link 
              href="/login" 
              className="font-bold text-blue-600 hover:underline"
            >
              Inicie sessão aqui
            </Link>
          </p>
        </header>

        {/* O Wizard agora define a altura da página */}
        <section className="w-full">
          <RegisterWizard />
        </section>

        {/* Rodapé que aparece APÓS o formulário */}
        <footer className="mt-5 mb-2 text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
            © {new Date().getFullYear()} QVite • 
          </p>
        </footer>
      </div>
    </main>
  );
}