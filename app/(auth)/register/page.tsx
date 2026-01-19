import { Metadata } from 'next';
import { RegisterWizard } from '@/features/auth/components/RegisterWizard';

export const metadata: Metadata = {
  title: 'Registo de Agência | Invite SaaS Moçambique',
  description: 'Crie sua conta para começar a vender convites digitais profissionais para casamentos e eventos em Moçambique.',
  openGraph: {
    title: 'Junte-se à melhor plataforma de eventos',
    description: 'Ferramenta para designers e agências de eventos.',
    type: 'website',
    locale: 'pt_MZ',
  },
  robots: {
    index: true,
    follow: true, 
  }
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <header className="sm:mx-auto sm:w-full sm:max-w-md mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Crie a sua conta
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Comece a criar experiências digitais inesquecíveis.
        </p>
      </header>

      <section aria-label="Formulário de Registo">
        <RegisterWizard />
      </section>
    </main>
  );
}