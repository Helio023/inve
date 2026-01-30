"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Zap, Layers, BarChart } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-24 pb-32 overflow-hidden bg-white">
      {/* Background Decorativo Suave */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-white to-white z-0" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-8"
          >
            <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            Para Designers & Agências de Eventos
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6"
          >
            A plataforma para escalar o seu <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Negócio de Convites.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto"
          >
            Deixe de lutar com código ou PDFs estáticos. Crie convites
            interativos, gira múltiplos clientes e ofereça um painel de RSVP
            profissional.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center"
          >
            <Link href="/register">
              <Button
                size="lg"
                className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white text-base font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all w-full sm:w-auto rounded-xl"
              >
                Criar Conta de Agência <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-base border-2 rounded-xl hover:bg-slate-50 w-full sm:w-auto"
              >
                Ver Demo do Painel
              </Button>
            </Link>
          </motion.div>

          <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-slate-500 font-medium">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" /> Sem
              mensalidades fixas
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" /> Marca
              White-label
            </span>
          </div>
        </div>

        {/* Visual Abstracto do Dashboard da Agência */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative max-w-6xl mx-auto"
        >
          {/* Mockup do Dashboard */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            {/* Simulação da interface interna */}
            <div className="grid grid-cols-12 h-[400px] md:h-[600px] bg-slate-50">
              {/* Sidebar */}
              <div className="hidden md:block col-span-2 border-r border-slate-200 bg-white p-4 space-y-4">
                <div className="h-8 w-32 bg-slate-100 rounded-md mb-8" />
                <div className="space-y-2">
                  <div className="h-2 w-full bg-slate-100 rounded" />
                  <div className="h-2 w-3/4 bg-slate-100 rounded" />
                  <div className="h-2 w-5/6 bg-slate-100 rounded" />
                </div>
              </div>
              {/* Conteúdo Principal (Lista de Eventos) */}
              <div className="col-span-12 md:col-span-10 p-8 grid gap-6 content-start">
                <div className="flex justify-between">
                  <div className="h-8 w-48 bg-slate-200 rounded" />
                  <div className="h-8 w-32 bg-blue-100 rounded" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Card de Evento 1 */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
                    <div className="h-32 bg-pink-50 rounded-lg flex items-center justify-center text-pink-200">
                      <Layers />
                    </div>
                    <div className="h-4 w-3/4 bg-slate-100 rounded" />
                    <div className="h-3 w-1/2 bg-slate-50 rounded" />
                  </div>
                  {/* Card de Evento 2 */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
                    <div className="h-32 bg-blue-50 rounded-lg flex items-center justify-center text-blue-200">
                      <BarChart />
                    </div>
                    <div className="h-4 w-3/4 bg-slate-100 rounded" />
                    <div className="h-3 w-1/2 bg-slate-50 rounded" />
                  </div>
                  {/* Card de Evento 3 */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
                    <div className="h-32 bg-amber-50 rounded-lg flex items-center justify-center text-amber-200">
                      <Zap />
                    </div>
                    <div className="h-4 w-3/4 bg-slate-100 rounded" />
                    <div className="h-3 w-1/2 bg-slate-50 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Elemento flutuante "Destaque" */}
          <div className="absolute -bottom-6 -right-6 md:bottom-10 md:-right-10 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-xs hidden md:block">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Painel do Cliente</p>
                <p className="text-xs text-slate-500">
                  Seu cliente vê os RSVPs
                </p>
              </div>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full w-[80%] bg-green-500 rounded-full" />
            </div>
            <p className="text-xs text-right mt-1 font-bold text-slate-400">
              80% Confirmados
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
