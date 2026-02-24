import { Metadata } from "next";
import { LegalContainer } from "@/components/legal-layout";
import {
  Scale,
  ShieldAlert,
  Ban,
  Info,
  Globe,
  Database,
  Zap,
} from "lucide-react";
import { Logo } from "@/components/logo";


export const metadata: Metadata = {
  title: "Termos de Serviço",
  description: "Contrato de utilização da plataforma Qonvip. Regras de créditos, banimento por fraude e diretrizes white-label",
};

export default function TermsPage() {
  const lastUpdated = "24 de Fevereiro de 2026";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Termos de Uso Qonvip",
    description:
      "Termos de serviço e regras de utilização de créditos por categoria.",
    publisher: { "@type": "Organization", name: "Qonvip" },
    dateModified: "2026-02-24",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LegalContainer title="Termos de Uso" lastUpdated={lastUpdated}>
        <div className="space-y-16">
          {/* 1. OBJETO E ACEITAÇÃO */}
          <section className="space-y-4">
            <h2 className="flex items-center gap-3 text-slate-900">
              <Scale className="w-6 h-6 text-blue-600" /> 1. Objeto e Aceitação
            </h2>
            <p>
              A Qonvip fornece uma plataforma de software como serviço (SaaS)
              que permite a Agências de Eventos e Freelancers a criação, gestão
              e distribuição de convites digitais interativos.
            </p>
            <p>
              Ao criar uma conta ou utilizar qualquer funcionalidade da
              plataforma, o utilizador declara ter plena capacidade jurídica e
              aceita, sem reservas, todos os termos aqui descritos. O uso
              comercial por parte de agências implica a responsabilidade
              solidária sobre o conteúdo entregue aos seus clientes finais.
            </p>
          </section>

          {/* 2. CLÁUSULA NUCLEAR: SEGMENTAÇÃO DE CRÉDITOS E FRAUDE */}
          <section className="p-8 bg-red-50 border border-red-100 rounded-[2.5rem] relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Ban className="w-40 h-40 text-red-600" />
            </div>

            <h2 className="flex items-center gap-3 text-red-900 mt-0">
              <ShieldAlert className="w-6 h-6 text-red-600" /> 2. Política
              Estrita de Créditos
            </h2>
            <p className="text-red-800 font-bold">
              O modelo de negócio da Qonvip baseia-se na venda de créditos
              segmentados por nicho (Casamento, Aniversário e Corporativo).
            </p>

            <div className="mt-8 space-y-6 text-sm text-red-900/80 leading-relaxed relative z-10 font-medium">
              <div className="bg-white/50 p-4 rounded-xl border border-red-200">
                <p>
                  <strong>2.1 Proibição de Cruzamento de Categorias:</strong> É
                  terminantemente proibido utilizar créditos de uma categoria
                  para a execução de eventos de natureza distinta. Exemplo:
                  utilizar um crédito adquirido como "Casamento" para criar um
                  convite de "Aniversário".
                </p>
              </div>

              <div className="bg-white/50 p-4 rounded-xl border border-red-200">
                <p>
                  <strong>2.2 Detecção e Bloqueio Manual:</strong> O sistema
                  Qonvip monitoriza o conteúdo (palavras-chave, templates e ativos).
                  Qualquer convite sinalizado passará por uma{" "}
                  <strong>revisão manual periódica</strong> pela nossa equipa de
                  auditoria.
                </p>
              </div>

              <div className="bg-red-600 text-white p-6 rounded-2xl shadow-xl">
                <p className="font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 fill-current" /> Penalização Imediata
                </p>
                <p>
                  Confirmada a fraude de categoria, o convite será{" "}
                  <strong>BLOQUEADO IMEDIATAMENTE</strong>. O utilizador perderá
                  a conta até regularizar a sua conta.
                </p>
              </div>

              <div className="border-t border-red-200 pt-4">
                <p className="font-black text-red-700 uppercase tracking-tighter">
                  2.3 Regra de Banimento Definitivo: O sistema regista cada
                  tentativa de violação. À terceira infração (3ª sinalização
                  confirmada), a conta da agência será banida permanentemente do
                  ecossistema Qonvip, resultando na perda total de saldo de
                  créditos e acesso ao painel de gestão.
                </p>
              </div>
            </div>
          </section>

          {/* 3. WHITE-LABEL E RESPONSABILIDADE DA AGÊNCIA */}
          <section className="space-y-4">
            <h2 className="flex items-center gap-3">
              <Globe className="w-6 h-6 text-blue-600" /> 3. Identidade
              White-Label
            </h2>
            <p>
              A funcionalidade White-Label permite que os convites sejam
              entregues sob a marca da Agência do utilizador. A Qonvip atua
              apenas como infraestrutura "invisível".
            </p>
            <ul className="list-disc pl-5 space-y-3 text-sm">
              <li>
                <strong>Marca:</strong> A agência deve garantir que possui
                direitos de uso sobre as logos e nomes inseridos como identidade
                visual do convite.
              </li>
              
              <li>
                <strong>Propriedade:</strong> O código-fonte e as ferramentas de
                edição são propriedade intelectual exclusiva da Qonvip. Qualquer
                tentativa de engenharia reversa resultará em processo judicial.
              </li>
            </ul>
          </section>

          {/* 4. CONTEÚDO E CONDUTA */}
          <section className="space-y-4">
            <h2 className="flex items-center gap-3">
              <Info className="w-6 h-6 text-blue-600" /> 4. Diretrizes de
              Conteúdo
            </h2>
            <p>
              A Qonvip não pré-aprova o conteúdo dos convites, mas reserva-se o
              direito de remover (sem aviso prévio) qualquer material que
              contenha:
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-xs font-bold uppercase tracking-widest text-slate-500">
              <div className="p-3 border rounded-lg">
                • Nudez ou pornografia
              </div>
              <div className="p-3 border rounded-lg">
                • Discurso de ódio ou racismo
              </div>
              <div className="p-3 border rounded-lg">
                • Promoção de atividades ilegais
              </div>
              <div className="p-3 border rounded-lg">
                • Violação de direitos de autor
              </div>
            </div>
          </section>

          {/* 5. FINANCEIRO E PAGAMENTOS */}
          <section className="space-y-4">
            <h2 className="flex items-center gap-3">
              <Database className="w-6 h-6 text-blue-600" /> 5. Transações e
              Reembolsos
            </h2>
            <p>
              Os pagamentos são processados via M-Pesa ou Gateways parceiros.
              Pela natureza digital do serviço (entrega imediata de
              ferramentas), <strong>não existem reembolsos</strong> após o
              consumo de créditos no editor.
            </p>
            <p>
              Créditos não utilizados expiram apenas se a conta permanecer
              inativa por mais de 24 meses consecutivos.
            </p>
          </section>

          {/* RODAPÉ JURÍDICO */}
          <section className="pt-20 border-t border-slate-100 flex flex-col items-center gap-8">
            <div className="text-center space-y-2">
              <p className="text-sm font-black text-slate-900">
                Dúvidas sobre os Termos?
              </p>
              <p className="text-2xl font-black text-blue-600">
                +258 87 639 7558
              </p>
            
            </div>
            <div className="grayscale opacity-20">
              <Logo />
            </div>
          </section>
        </div>
      </LegalContainer>
    </>
  );
}
