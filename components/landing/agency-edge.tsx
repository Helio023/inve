"use client";

import { motion } from "framer-motion";
import {
  Zap,
  ShieldCheck,
  BarChart3,
  Globe,
  Plus,
  ChevronRight,
  Clock8,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AgencyEdge() {
  const benefits = [
    {
      title: "White-Label Total",
      desc: "Sua marca, seu domínio, seu lucro.",
      icon: ShieldCheck,
    },
    {
      title: "Gestão Multitenant",
      desc: "Múltiplos clientes em um único dashboard.",
      icon: Globe,
    },
    {
      title: "Analytics em Tempo Real",
      desc: "Dados de conversão para seus clientes.",
      icon: BarChart3,
    },
  ];

  return (
    <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
      {/* Background Pro: Grid técnica e Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-rose-600/10 blur-[120px] rounded-full" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* LADO ESQUERDO: COPYWRITING ESTRATÉGICO */}
          <div className="space-y-12">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]"
              >
                <Zap className="w-3 h-3 fill-current" />
                <span>Alta Performance B2B</span>
              </motion.div>

              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
                Escala sem <br />
                <span className="text-slate-500">atrito.</span>
              </h2>

              <p className="text-slate-400 text-lg md:text-xl max-w-lg leading-relaxed font-medium">
                Transforme sua operação. Entregue convites de luxo com a
                velocidade de um clique e margens de lucro que o desenvolvimento
                tradicional não permite.
              </p>
            </div>

            {/* BENEFÍCIOS ESTILO LISTA TÉCNICA */}
            <div className="grid gap-8">
              {benefits.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4 group"
                >
                  <div className="mt-1 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-indigo-500/50 group-hover:bg-indigo-500/10 transition-all duration-500">
                    <b.icon className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-200 mb-1">
                      {b.title}
                    </h4>
                    <p className="text-slate-500 text-sm font-medium">
                      {b.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* LADO DIREITO: O WIDGET DE ROI (ESTILO LINEAR/DASHBOARD) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="bg-slate-900/50 backdrop-blur-3xl rounded-[3rem] border border-white/10 p-8 md:p-12 shadow-3xl relative overflow-hidden group">
              {/* Scanline effect */}
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(255,255,255,0.02)_50%)] bg-[size:100%_4px] pointer-events-none" />

              <div className="relative z-10 space-y-12">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">
                      Efeciência
                    </p>
                    <h3 className="text-2xl font-bold">Tempo de entrga</h3>
                  </div>
                  <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                    <Clock8 className="w-6 h-6 text-indigo-400" />
                  </div>
                </div>

                {/* GRÁFICO DE VELOCIDADE COMPARATIVO */}
                <div className="space-y-8">
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <span>Desenvolvimento Tradicional</span>
                      <span>~3 Dias</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-700 w-full opacity-30" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-indigo-400">
                      <span>Workflow Qonvip</span>
                      <span className="text-white">15 Minutos</span>
                    </div>
                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                      />
                    </div>
                  </div>
                </div>

                {/* KPI BOXES */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-1">
                    <p className="text-[32px] font-black text-white tracking-tighter">
                      12x
                    </p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                      Mais Rápido
                    </p>
                  </div>
                  <div className="p-6 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 space-y-1">
                    <p className="text-[32px] font-black text-indigo-400 tracking-tighter">
                      +80%
                    </p>
                    <p className="text-[9px] font-bold text-indigo-300 uppercase tracking-widest leading-none">
                      Margem de Lucro
                    </p>
                  </div>
                </div>

                <div className="pt-4 text-center">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                    Dados baseados em testes A/B com agências parceiras
                  </p>
                </div>
              </div>
            </div>

            {/* Elemento Decorativo: O "Code Snippet" flutuante */}
            <motion.div
              animate={{ x: [0, 5, 0], y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-6 hidden md:block bg-slate-800 border border-white/10 p-4 rounded-2xl shadow-3xl z-20 backdrop-blur-xl"
            >
              <div className="flex gap-1.5 mb-3">
                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                <div className="w-2 h-2 rounded-full bg-green-500/50" />
              </div>
              <code className="text-[10px] text-indigo-300 font-mono">
                {`{`} <br />
                &nbsp;&nbsp;"agency": "Premium", <br />
                &nbsp;&nbsp;"automation": true, <br />
                &nbsp;&nbsp;"revenue": "maximized" <br />
                {`}`}
              </code>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
