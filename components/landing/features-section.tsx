"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { 
  BarChart3, Check, Globe, Layout, Utensils, 
  Zap, MousePointer2, Smartphone, Music 
} from "lucide-react";
import React from "react";

export function FeaturesSection() {
  const features = [
    {
      title: "Editor No-Code de Elite",
      desc: "Clique e personalize cada pixel. Controle tipografia, cores e camadas com precisão cirúrgica.",
      icon: Layout,
      size: "large",
      color: "bg-indigo-600",
      demo: <EditorDemo />,
    },
    {
      title: "RSVP de Próxima Geração",
      desc: "Confirmações inteligentes com gestão de acompanhantes e integração direta ao WhatsApp.",
      icon: Check,
      size: "medium",
      color: "bg-rose-500",
      demo: <RSVPDemo />,
    },
    {
      title: "Experiência Gastronômica",
      desc: "Menu interativo onde o convidado seleciona restrições e preferências antes do evento.",
      icon: Utensils,
      size: "medium",
      color: "bg-teal-500",
      demo: <MenuDemo />,
    },
    {
      title: "White Label & Domínios",
      desc: "Sua agência, suas regras. Convites em subdomínios profissionais sem menção ao Qonvip.",
      icon: Globe,
      size: "small",
      color: "bg-amber-500",
      demo: <DomainDemo />,
    },
    {
      title: "Analytics Predictivo",
      desc: "Monitore visualizações e intenção de presença em tempo real com dashboards limpos.",
      icon: BarChart3,
      size: "small",
      color: "bg-blue-500",
      demo: <AnalyticsDemo />,
    },
  ];

  return (
    <section id="features" className="py-32 bg-slate-50/50 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-xl"
          >
            <Zap className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>Engenharia No-Code</span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9]">
            Tecnologia complexa. <br />
            <span className="text-slate-400">Interface invisível.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={cn(
                "group relative rounded-[2.5rem] bg-white border border-slate-200 overflow-hidden shadow-sm transition-all duration-500 hover:shadow-2xl hover:border-slate-300",
                f.size === "large" ? "md:col-span-2 md:row-span-2" : "",
                f.size === "medium" ? "md:col-span-1 md:row-span-2" : "",
              )}
            >
              <div className="p-8 h-full flex flex-col relative z-20">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg transition-transform group-hover:scale-110 duration-500", f.color)}>
                  <f.icon className="w-6 h-6" />
                </div>
                <div className="max-w-xs">
                  <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                    {f.title}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">
                    {f.desc}
                  </p>
                </div>

                {/* AREA DA DEMONSTRAÇÃO ANIMADA */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                  {f.demo}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- COMPONENTES DE DEMONSTRAÇÃO (O SEGREDO DO NÍVEL PREMIUM) ---

function EditorDemo() {
  return (
    <div className="absolute bottom-[-20px] right-[-20px] w-3/5 h-3/5 bg-slate-900 rounded-tl-3xl border-t border-l border-white/10 shadow-3xl p-4 overflow-hidden hidden md:block">
      <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
        <div className="w-2 h-2 rounded-full bg-red-500" />
        <div className="w-2 h-2 rounded-full bg-amber-500" />
        <div className="w-2 h-2 rounded-full bg-green-500" />
      </div>
      <div className="space-y-3">
        <div className="h-1.5 w-full bg-white/10 rounded" />
        <motion.div 
          animate={{ width: ["20%", "80%", "20%"] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="h-1.5 bg-indigo-500 rounded" 
        />
        <div className="h-1.5 w-2/3 bg-white/10 rounded" />
        <div className="pt-2 flex gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
             <MousePointer2 className="w-3 h-3 text-indigo-400" />
          </div>
          <div className="flex-1 space-y-1.5 pt-1">
             <div className="h-1 w-full bg-white/5 rounded" />
             <div className="h-1 w-full bg-white/5 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

function RSVPDemo() {
  return (
    <div className="absolute bottom-4 right-4 w-24 h-40 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 hidden md:flex flex-col gap-2 overflow-hidden scale-110 origin-bottom-right">
       <div className="w-full h-8 bg-slate-50 rounded-lg" />
       <motion.div 
         animate={{ scale: [1, 1.05, 1], backgroundColor: ['#f8fafc', '#ecfdf5', '#f8fafc'] }}
         transition={{ repeat: Infinity, duration: 2 }}
         className="w-full h-12 border border-dashed border-slate-200 rounded-lg flex items-center justify-center"
       >
         <Check className="w-4 h-4 text-emerald-500" />
       </motion.div>
       <div className="w-full h-12 bg-slate-900 rounded-lg flex items-center justify-center">
         <div className="w-8 h-1 bg-white/20 rounded-full" />
       </div>
    </div>
  );
}

function MenuDemo() {
  return (
    <div className="absolute -right-4 bottom-8 flex flex-col gap-2 scale-90 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
      {[1, 2, 3].map((i) => (
        <motion.div 
          key={i}
          animate={{ x: i % 2 === 0 ? [0, 10, 0] : [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, delay: i * 0.5 }}
          className="bg-white border border-slate-100 p-3 rounded-xl shadow-lg flex items-center gap-3 w-48"
        >
          <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
            <Utensils className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="h-2 w-16 bg-slate-100 rounded" />
            <div className="h-1.5 w-10 bg-slate-50 rounded" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function DomainDemo() {
  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-12 bg-white border border-b-0 border-slate-200 rounded-t-xl shadow-2xl p-2 flex items-center gap-3">
       <div className="flex gap-1 px-2">
         <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
         <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
       </div>
       <div className="flex-1 bg-slate-50 h-6 rounded-md flex items-center px-3 border border-slate-100">
          <Globe className="w-2.5 h-2.5 text-slate-400 mr-2" />
          <span className="text-[8px] font-mono text-slate-400 truncate">convite.sua-agencia.com/evento-vip</span>
       </div>
    </div>
  );
}

function AnalyticsDemo() {
  return (
    <div className="absolute bottom-0 right-8 flex items-end gap-1.5 h-20">
      {[40, 70, 45, 90, 65].map((h, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          whileInView={{ height: `${h}%` }}
          transition={{ duration: 1, delay: i * 0.1, ease: "circOut" }}
          className="w-3 bg-blue-500/20 rounded-t-sm relative overflow-hidden"
        >
           <div className="absolute bottom-0 w-full bg-blue-500 h-1/2" />
        </motion.div>
      ))}
    </div>
  );
}