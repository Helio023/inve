"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ArrowRight,
  Layout,
  Type,
  Columns,
  ChevronLeft,
  ChevronRight,
  Undo2,
  Redo2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-white">
      {/* Background Decorativo - Estilo Linear/Stripe */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-indigo-100 blur-[120px] rounded-full opacity-50" />
      <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[50%] bg-rose-50 blur-[100px] rounded-full opacity-50" />

      <div className="container mx-auto px-6 flex flex-col items-center text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8"
        >
          <Sparkles className="w-3 h-3 fill-indigo-500 text-indigo-500" />
          <span>A plataforma nº1 para Agências de Eventos</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.85]"
        >
          Convites que <br />
          <span className="text-slate-400">viram experiência.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl text-lg md:text-xl text-slate-500 mb-10 leading-relaxed font-medium"
        >
          A ferramenta No-Code definitiva para agências criarem convites
          interativos, luxuosos e totalmente gerenciáveis em minutos.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mb-20"
        >
          <Link
            href="/register"
            className="inline-flex items-center justify-center h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-blue-200 transition-all active:scale-95 group"
          >
            <span>Começar Grátis</span>
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* --- REPLICAÇÃO DA INTERFACE (O MOCKUP 3D) --- */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-6xl mx-auto group"
        >
          {/* Janela do Editor Simulada */}
          <div className="relative rounded-[2rem] border border-slate-200 bg-slate-50/50 backdrop-blur-md shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col h-[600px] md:h-[700px]">
            {/* Header do Editor */}
            <div className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
              <div className="flex items-center gap-4">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                </div>
                <div className="h-4 w-px bg-slate-200" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  PÁG 2 - EDITANDO
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 mr-2 opacity-40">
                  <Undo2 className="w-3.5 h-3.5" />
                  <Redo2 className="w-3.5 h-3.5" />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-[9px] font-bold"
                >
                  Preview
                </Button>
                <Button
                  size="sm"
                  className="h-7 text-[9px] font-bold bg-emerald-500 hover:bg-emerald-600 border-none"
                >
                  NO AR
                </Button>
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Sidebar Esquerda (Biblioteca) */}
              <div className="w-48 bg-white border-r border-slate-100 hidden lg:flex flex-col p-4 gap-4">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                  Biblioteca
                </p>
                <div className="grid grid-cols-1 gap-2">
                  <div className="p-3 rounded-xl border border-rose-100 bg-rose-50/30 flex flex-col items-center gap-2">
                    <Layout className="w-4 h-4 text-rose-500" />
                    <span className="text-[8px] font-black text-rose-500 uppercase">
                      Capa
                    </span>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-100 bg-white flex flex-col items-center gap-2">
                    <Type className="w-4 h-4 text-blue-500" />
                    <span className="text-[8px] font-black text-slate-400 uppercase">
                      Texto
                    </span>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-100 bg-white flex flex-col items-center gap-2">
                    <Columns className="w-4 h-4 text-slate-400" />
                    <span className="text-[8px] font-black text-slate-400 uppercase">
                      Colunas
                    </span>
                  </div>
                </div>
              </div>

              {/* Área Central (O Mockup do Smartphone) */}
              <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
                {/* O Smartphone Realista */}
                <div className="w-[280px] h-[540px] bg-slate-900 rounded-[3rem] p-2.5 shadow-2xl border-4 border-slate-800 relative z-20">
                  <div className="w-full h-full bg-white rounded-[2.2rem] overflow-hidden relative flex flex-col">
                    <img
                      src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070"
                      className="absolute inset-0 w-full h-full object-cover grayscale"
                      alt="Convite Demo"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-white text-center p-6">
                      <span className="text-[8px] uppercase tracking-[0.4em] font-light mb-2">
                        Save the Date
                      </span>
                      <h4 className="text-3xl font-serif italic mb-1">
                        Ana & João
                      </h4>
                      <p className="text-lg font-light tracking-widest">
                        02.05.2026
                      </p>
                      <div className="mt-8 px-4 py-2 border border-white/30 rounded-full text-[7px] uppercase tracking-widest backdrop-blur-md">
                        Adicionar ao Calendário
                      </div>
                    </div>
                  </div>
                </div>

                {/* Paginação Flutuante do Mockup */}
                <div className="mt-6 flex items-center gap-2 bg-white/80 backdrop-blur-md p-1.5 rounded-full border border-slate-200 shadow-lg">
                  <ChevronLeft className="w-3 h-3 text-slate-400" />
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold",
                          i === 2
                            ? "bg-slate-900 text-white"
                            : "text-slate-400",
                        )}
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                </div>
              </div>

              {/* Sidebar Direita (Propriedades) */}
              <div className="w-64 bg-white border-l border-slate-100 hidden xl:flex flex-col p-5 gap-6">
                <div className="flex gap-2 p-1 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex-1 py-1 text-center bg-white shadow-sm rounded-md text-[8px] font-black uppercase text-slate-900">
                    Elemento
                  </div>
                  <div className="flex-1 py-1 text-center text-[8px] font-black uppercase text-slate-400">
                    Página
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                    Estilo do Bloco
                  </p>
                  <div className="space-y-3">
                    <div className="h-8 w-full rounded-lg bg-slate-50 border border-slate-100 flex items-center px-3 justify-between">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">
                        Cor do Texto
                      </span>
                      <div className="w-4 h-4 rounded-full bg-white border border-slate-200" />
                    </div>
                    <div className="h-8 w-full rounded-lg bg-slate-50 border border-slate-100 flex items-center px-3 justify-between">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">
                        Arredondamento
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        24px
                      </span>
                    </div>
                    <div className="pt-2 space-y-2">
                      <div className="flex justify-between text-[8px] font-bold text-slate-400 uppercase">
                        <span>Sombra</span>
                        <span>XL</span>
                      </div>
                      <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-3/4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
