import { Metadata } from "next";
import { LegalContainer } from "@/components/legal-layout";
import { 
  Database, Lock, Eye, 
  MessageSquare, ShieldCheck 
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacidade e Proteção de Dados | Qonvip",
  description: "Entenda como a Qonvip usa e protege as informações da sua agência e dos seus convidados.",
};

export default function PrivacyPage() {
  const lastUpdated = "24 de Fevereiro de 2026";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Política de Privacidade Qonvip",
    "publisher": { "@type": "Organization", "name": "Qonvip" },
    "dateModified": "2026-02-24"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LegalContainer title="Privacidade" lastUpdated={lastUpdated}>
        <div className="space-y-16">
          
          {/* 1. CATEGORIAS DE DADOS */}
          <section className="space-y-4 text-slate-700">
            <h2 className="flex items-center gap-3 text-slate-900"><Database className="w-6 h-6 text-blue-600" /> 1. Dados que Processamos</h2>
            <p>A Qonvip recolhe o mínimo de dados necessários para garantir a excelência do serviço:</p>
            <div className="grid gap-6 mt-6">
              <div className="border-l-4 border-blue-500 pl-6 space-y-2">
                <h4 className="font-black text-sm uppercase tracking-widest text-slate-900">Dados da Agência</h4>
                <p className="text-sm">Nomes, emails e tokens de autenticação usados para gerir o painel e faturamento.</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-6 space-y-2">
                <h4 className="font-black text-sm uppercase tracking-widest text-slate-900">Dados do Convidado</h4>
                <p className="text-sm">Nomes, números de telefone e escolhas de menu (RSVP) inseridos pela Agência ou pelo próprio convidado.</p>
              </div>
            </div>
          </section>

          {/* 2. HIERARQUIA DE RESPONSABILIDADE */}
          <section className="p-10 bg-slate-900 text-white rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute bottom-0 right-0 p-10 opacity-5"><ShieldCheck className="w-40 h-40" /></div>
            
            <h2 className="text-blue-400 mt-0 mb-8">Compromisso com a Propriedade</h2>
            <div className="space-y-6 font-medium text-slate-300">
              <p>A Qonvip reconhece que a Agência é a <strong>Controladora dos Dados</strong>. Nós somos apenas a <strong>Operadora Técnica</strong>.</p>
              <p>Isto significa que:</p>
              <ul className="space-y-4 text-sm">
                <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" /> Nunca utilizaremos os dados dos convidados para marketing próprio.</li>
                <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" /> Nunca venderemos as suas listas de convidados a terceiros.</li>
                <li className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" /> A Agência tem o poder de deletar permanentemente qualquer dado a qualquer momento.</li>
              </ul>
            </div>
          </section>

          {/* 3. SEGURANÇA E COOKIES */}
          <section className="space-y-8">
            <div className="space-y-4">
              <h2 className="flex items-center gap-3 text-slate-900"><Lock className="w-6 h-6 text-blue-600" /> 2. Proteção Técnica</h2>
              <p className="text-sm">Utilizamos criptografia ponta-a-ponta em todas as comunicações via SSL. Os convites são gerados com <strong>Tokens Únicos</strong> de 8 dígitos, impedindo o acesso de curiosos ou a indexação por motores de busca (Google) de forma pública.</p>
            </div>
            
            <div className="space-y-4">
              <h2 className="flex items-center gap-3 text-slate-900"><Eye className="w-6 h-6 text-blue-600" /> 3. Transparência de Cookies</h2>
              <p className="text-sm">Utilizamos apenas cookies funcionais. Estes pequenos ficheiros servem exclusivamente para manter a sua sessão de agência aberta e para nos ajudar a identificar erros técnicos de navegação.</p>
            </div>
          </section>

          {/* 4. COMPARTILHAMENTO NECESSÁRIO */}
          <section className="space-y-6">
            <h2 className="flex items-center gap-3 text-slate-900"><MessageSquare className="w-6 h-6 text-blue-600" /> 4. Integrações Externas</h2>
            <p className="text-sm italic">Para que o convite funcione, partilhamos dados estritamente necessários com:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h5 className="font-black text-xs uppercase mb-2">WhatsApp / Meta</h5>
                <p className="text-xs text-slate-500">O número de telefone do convidado é usado para disparar a janela de conversa oficial.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h5 className="font-black text-xs uppercase mb-2">Faturamento M-Pesa</h5>
                <p className="text-xs text-slate-500">Dados de transação são processados por gateways certificados, sem armazenamento de PINs nos nossos servidores.</p>
              </div>
            </div>
          </section>

          {/* 5. DIREITOS DO UTILIZADOR */}
          <section className="space-y-4 pt-10 border-t border-slate-100">
            <h2 className="text-xl font-black uppercase text-slate-900 italic">5. Direito ao Esquecimento</h2>
            <p className="text-sm font-medium">Sempre que uma conta de agência é encerrada, todos os convites, metadados e listas de convidados associadas são <strong>expurgados definitivamente</strong> dos nossos servidores num prazo máximo de 30 dias.</p>
          </section>
        </div>
      </LegalContainer>
    </>
  );
}