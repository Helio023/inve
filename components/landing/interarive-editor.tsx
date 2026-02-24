"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  Type,
  Palette,
  Check,
  ArrowRight,
  Zap,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function InteractiveEditor() {
  const [demoState, setDemoState] = useState({
    title: "Ana & João",
    themeName: "Modern",
    color: "#2563eb",
    font: "sans",
    status: "PENDING",
  });

  const themes = [
    { name: "Luxury", color: "#c5a059", font: "serif" },
    { name: "Modern", color: "#2563eb", font: "sans" },
    { name: "Romantic", color: "#db2777", font: "serif" },
    { name: "Minimal", color: "#0f172a", font: "sans" },
  ];

  return (
    <section className="py-32 bg-white overflow-hidden relative">
      {/* Background Decorativo sutil */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-72 h-72 bg-blue-50 blur-[100px] rounded-full" />
      </div>

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* LADO ESQUERDO: EDITOR SIMPLIFICADO */}
          <div className="space-y-12">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em]"
              >
                <Zap className="w-3 h-3 fill-current" />
                <span>Interface No-Code</span>
              </motion.div>

              <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[0.9]">
                Sinta o controle na <br />
                <span className="text-slate-400">ponta dos dedos.</span>
              </h2>

              <p className="text-slate-500 text-lg font-medium max-w-lg leading-relaxed">
                Personalize cada detalhe. Nossa tecnologia de sincronização em
                tempo real permite que você veja o resultado final enquanto
                cria.
              </p>
            </div>

            {/* Painel de Controle Estilo "Dashboard" */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] space-y-8 relative">
              {/* Campo de Texto */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label icon={Type} label="Texto de Boas-vindas" />
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                    Amostra
                  </span>
                </div>
                <input
                  type="text"
                  value={demoState.title}
                  onChange={(e) =>
                    setDemoState({ ...demoState, title: e.target.value })
                  }
                  className="w-full h-14 px-5 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none font-bold text-slate-700 transition-all text-lg"
                />
              </div>

              {/* Seleção de Temas com Cards */}
              <div className="space-y-4">
                <Label icon={Palette} label="Temas de Curadoria" />
                <div className="grid grid-cols-2 gap-3">
                  {themes.map((t) => (
                    <button
                      key={t.name}
                      onClick={() =>
                        setDemoState({
                          ...demoState,
                          color: t.color,
                          font: t.font,
                          themeName: t.name,
                        })
                      }
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-2xl border transition-all duration-300 active:scale-95",
                        demoState.themeName === t.name
                          ? "bg-slate-900 border-slate-900 text-white shadow-xl"
                          : "bg-white border-slate-100 text-slate-400 hover:border-slate-200",
                      )}
                    >
                      <div
                        className="w-5 h-5 rounded-full shadow-inner"
                        style={{ backgroundColor: t.color }}
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {t.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button className="w-full h-16 rounded-3xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-[0.2em] gap-3 shadow-xl shadow-blue-200 transition-all active:scale-95">
                  Salvar este design <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* LADO DIREITO: O MOCKUP PREMIUM */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Status de Sincronismo Estilo "SaaS" */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              className="absolute -top-6 right-10 bg-white border border-slate-100 p-3 rounded-2xl shadow-2xl flex items-center gap-3 z-50"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">
                Sincronizado com o Canvas
              </span>
            </motion.div>

            {/* IPHONE FRAME: Mais escuro e metálico */}
            <div className="relative w-[320px] h-[640px] border-[12px] border-slate-950 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] bg-slate-900 overflow-hidden outline outline-4 outline-slate-200/50">
              {/* Notch (Ilha Dinâmica) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-slate-950 rounded-b-2xl z-40" />

              {/* CONTEÚDO DO CONVITE */}
              <div
                className="h-full flex flex-col bg-white transition-all duration-1000"
                style={{
                  fontFamily:
                    demoState.font === "serif" ? "serif" : "sans-serif",
                }}
              >
                {/* Hero Demo */}
                <div className="relative h-[380px] flex items-center justify-center p-8 text-center overflow-hidden">
                  <motion.div
                    key={demoState.color}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.08 }}
                    className="absolute inset-0"
                    style={{ backgroundColor: demoState.color }}
                  />
                  <div className="relative z-10 space-y-4">
                    <motion.div
                      key={`icon-${demoState.color}`}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-12 h-12 rounded-full border border-slate-100 bg-white mx-auto flex items-center justify-center shadow-sm"
                    >
                      <Sparkles
                        className="w-5 h-5"
                        style={{ color: demoState.color }}
                      />
                    </motion.div>

                    <div className="space-y-1">
                      <span
                        className="text-[9px] font-black uppercase tracking-[0.4em]"
                        style={{ color: demoState.color }}
                      >
                        Casamento de
                      </span>
                      <h3 className="text-4xl font-serif text-slate-900 leading-tight">
                        {demoState.title}
                      </h3>
                    </div>

                    <div className="h-px w-8 bg-slate-200 mx-auto" />
                    <p className="text-slate-400 text-[9px] font-bold tracking-[0.2em] uppercase italic">
                      Guardar a data
                    </p>
                  </div>
                </div>

                {/* RSVP Demo Section */}
                <div className="flex-1 bg-slate-50/50 p-8 flex flex-col justify-end gap-3 border-t border-slate-100">
                  <div className="space-y-1 mb-4">
                    <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Podes vir?
                    </p>
                    <div className="h-px w-full bg-slate-100" />
                  </div>

                  <button
                    onClick={() =>
                      setDemoState({ ...demoState, status: "CONFIRMED" })
                    }
                    className={cn(
                      "w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border-2",
                      demoState.status === "CONFIRMED"
                        ? "bg-slate-900 border-slate-900 text-white shadow-xl scale-[0.98]"
                        : "bg-white border-white text-slate-400 shadow-sm",
                    )}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {demoState.status === "CONFIRMED" && (
                        <Check className="w-4 h-4 text-emerald-400" />
                      )}
                      {demoState.status === "CONFIRMED"
                        ? "ESTAREI LÁ"
                        : "CONFIRMAR"}
                    </div>
                  </button>

                  <div className="w-full py-3 text-[9px] font-bold text-slate-300 text-center uppercase tracking-[0.2em]">
                    NÃO PODEREI IR
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Label({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center gap-2 text-slate-400">
      <Icon className="w-4 h-4" />
      <span className="text-[11px] font-black uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}
