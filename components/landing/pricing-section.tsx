"use client";

import { PLANS } from "@/config/plans";
import { Check, Sparkles, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from "@/components/ui/card";

export function PricingSection() {
  const { data: session } = useSession();

  return (
    <section id="pricing" className="py-32 bg-white relative overflow-hidden">
      {/* Grid Pattern de Fundo Estilo GitHub/Linear */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="container mx-auto px-6 relative">
        {/* Header da Seção */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
          >
            <Zap className="w-3 h-3 fill-current" />
            <span>Escalabilidade para Agências</span>
          </motion.div>
          
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]">
            Invista no seu <br />
            <span className="text-slate-400">crescimento.</span>
          </h2>
          
          <p className="text-slate-500 text-lg md:text-xl max-w-xl mx-auto font-medium leading-relaxed">
            Sem taxas mensais. Compre créditos sob demanda e mantenha margens de lucro de até 80% por projeto.
          </p>
        </div>

        {/* Grid de Planos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-0 max-w-6xl mx-auto items-stretch border-slate-200 md:border rounded-[2.5rem] overflow-hidden bg-white/50 backdrop-blur-md shadow-2xl shadow-slate-200/50">
          {PLANS.map((plan, index) => {
            const billingUrl = `/dashboard/billing?select=${plan.key}`;
            const targetUrl = session 
              ? billingUrl 
              : `/register?callbackUrl=${encodeURIComponent(billingUrl)}`;

            return (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={cn(
                  "flex flex-col p-8 lg:p-12 transition-all duration-500 relative",
                  index !== 0 && "md:border-l border-slate-100",
                  plan.isPopular && "bg-slate-50/50"
                )}
              >
                {plan.isPopular && (
                  <div className="absolute top-8 right-8">
                    <span className="bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-blue-200">
                      Recomendado
                    </span>
                  </div>
                )}

                <div className="space-y-6 flex-1">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-600 mb-4">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-6xl font-black text-slate-900 tracking-tighter tabular-nums">
                        {plan.price}
                      </span>
                      <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Mzn</span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium mt-4 leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  {/* Lista de Features estilo Spec-Sheet */}
                  <div className="space-y-6 pt-8 border-t border-slate-100">
                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Volume de Convites</p>
                      
                      <div className="grid gap-3">
                        {[
                          { label: "Casamentos Premium", value: `${plan.credits.wedding}x` },
                          { label: "Eventos de Aniversário", value: `${plan.credits.birthday}x` },
                          { label: "Convites Corporativos", value: `${plan.credits.corporate}x` },
                        ].map((item, i) => (
                          <div key={i} className="flex justify-between items-center group/item">
                            <span className="text-sm font-bold text-slate-600 group-hover/item:text-slate-900 transition-colors">{item.label}</span>
                            <span className="text-sm font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Incluso no Plano</p>
                      <ul className="space-y-3">
                        {[
                          "Domínio de Agência Customizado",
                          "Painel de Gestão Vitalício",
                          "Suporte Prioritário via WhatsApp",
                          "Remoção de marca Qonvip"
                        ].map((feat, i) => (
                          <li key={i} className="flex items-center gap-3 text-[13px] font-bold text-slate-500">
                            <Check className="w-4 h-4 text-blue-500 stroke-[3px] shrink-0" />
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                  <Link href={targetUrl} className="w-full">
                    <Button 
                      className={cn(
                        "w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all active:scale-95 group/btn shadow-sm",
                        plan.isPopular 
                          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200" 
                          : "bg-slate-900 hover:bg-black text-white"
                      )}
                    >
                      {session ? "Comprar Agora" : "Get Started"}
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

      
      </div>
    </section>
  );
}