"use client";

import { motion } from "framer-motion";
import { MapPin, Music, Check, Battery, Signal, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

export function InteractiveDemo() {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Elementos de Fundo Estilo Linear */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-50 rounded-full blur-[120px] opacity-50 -z-10" />

      <div className="container mx-auto px-6 flex flex-col items-center relative">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-indigo-600 font-black uppercase tracking-[0.3em] text-[10px]"
          >
            A Experiência do Convidado
          </motion.span>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mt-4 tracking-tighter">
            Beleza em cada <span className="text-slate-400">pixel.</span>
          </h2>
          <p className="mt-6 text-slate-500 max-w-xl text-lg font-medium">
            Seus clientes entregam mais que um link. Eles entregam uma
            experiência imersiva que funciona perfeitamente em qualquer
            dispositivo.
          </p>
        </div>

        <div className="relative group">
          {/* ELEMENTOS FLUTUANTES (Social Proof & Context) */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -left-20 top-20 hidden lg:flex items-center gap-3 bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 z-30"
          >
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-200">
              <Check className="w-5 h-5 stroke-[3px]" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 leading-none">
                Status
              </p>
              <p className="text-sm font-bold text-slate-900">
                Família Silva Confirmada!
              </p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              repeat: Infinity,
              duration: 5,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute -right-24 bottom-40 hidden lg:flex items-center gap-3 bg-slate-900 p-4 rounded-2xl shadow-2xl z-30"
          >
            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-indigo-300 leading-none">
                Novo Pedido
              </p>
              <p className="text-sm font-bold text-white">
                Coldplay - Yellow 🎵
              </p>
            </div>
          </motion.div>

          {/* IPHONE MOCKUP FRAME */}
          <div className="relative w-[340px] h-[680px] border-[12px] border-slate-950 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] bg-slate-100 overflow-hidden outline outline-4 outline-slate-800/50">
            {/* iPhone Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-8 z-40 bg-white/10 backdrop-blur-sm">
              <span className="text-[12px] font-bold">9:41</span>
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-950 rounded-2xl flex items-center justify-center" />
              <div className="flex items-center gap-1.5">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <Battery className="w-4 h-4" />
              </div>
            </div>

            {/* Scrollable Content Container */}
            <div className="absolute inset-0 bg-white pt-12 overflow-hidden">
              <motion.div
                animate={{ y: ["0%", "-65%", "0%"] }}
                transition={{
                  repeat: Infinity,
                  duration: 20,
                  ease: "easeInOut",
                }}
                className="w-full flex flex-col"
              >
                {/* SIMULAÇÃO DO CONVITE (DESIGN PREMIUM) */}

                {/* HERO SECTION */}
                <div className="relative w-full h-[450px] flex flex-col items-center justify-center text-center p-6 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?q=80')] bg-cover bg-center">
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                  <div className="relative z-10 space-y-2">
                    <span className="text-white/60 uppercase tracking-[0.4em] text-[8px] font-bold">
                      Save the Date
                    </span>
                    <h3 className="text-4xl font-serif text-white italic">
                      Ana & João
                    </h3>
                    <div className="h-px w-8 bg-white/40 mx-auto mt-4" />
                    <p className="text-white/80 text-[10px] tracking-widest mt-2 uppercase">
                      24 de Junho, 2026
                    </p>
                  </div>
                </div>

                {/* COUNTDOWN SECTION */}
                <div className="bg-slate-50 py-10 px-6">
                  <div className="grid grid-cols-4 gap-2">
                    {["02", "14", "35", "12"].map((n, i) => (
                      <div
                        key={i}
                        className="aspect-square bg-white rounded-xl border border-slate-100 flex flex-col items-center justify-center shadow-sm"
                      >
                        <span className="text-sm font-black text-slate-900">
                          {n}
                        </span>
                        <span className="text-[6px] uppercase font-bold text-slate-400 tracking-tighter">
                          {["Dias", "Hrs", "Min", "Seg"][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* MAP SECTION */}
                <div className="p-6 space-y-4">
                  <div className="w-full h-40 bg-slate-100 rounded-2xl overflow-hidden relative grayscale opacity-80 border border-slate-200">
                    <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-38.5,12.9,12/400x300?access_token=pk.xxx')] bg-cover" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <MapPin className="w-8 h-8 text-rose-500 fill-rose-500/20" />
                    </div>
                  </div>
                  <div className="text-center">
                    <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest">
                      Palácio Real
                    </h4>
                    <p className="text-[9px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">
                      Avenida Marginal, 1200 • Maputo
                    </p>
                  </div>
                </div>

                {/* RSVP SECTION */}
                <div className="p-8 bg-slate-950 text-white flex flex-col items-center text-center gap-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-serif italic text-indigo-300">
                      Contamos consigo?
                    </h3>
                    <p className="text-[9px] text-white/50 uppercase tracking-widest">
                      Confirmação obrigatória até 15 de Maio
                    </p>
                  </div>
                  <div className="w-full py-4 border-2 border-indigo-500/30 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] text-indigo-300">
                    Sim, eu vou!
                  </div>
                  <div className="w-full py-4 border border-white/10 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] text-white/40">
                    Não posso ir
                  </div>
                </div>
              </motion.div>

              {/* Barra de navegação do convite simulada */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1 z-30">
                <div className="w-4 h-1 bg-white rounded-full" />
                <div className="w-1 h-1 bg-white/40 rounded-full" />
                <div className="w-1 h-1 bg-white/40 rounded-full" />
              </div>
            </div>
          </div>

          {/* Cursor de Toque Realista */}
          <motion.div
            animate={{
              y: [450, 250, 450],
              opacity: [0, 1, 0],
              scale: [0.8, 1, 0.8],
            }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute bottom-20 left-1/2 w-14 h-14 bg-indigo-500/20 border-2 border-indigo-500/40 rounded-full z-50 pointer-events-none backdrop-blur-[2px]"
          />
        </div>

        <p className="mt-16 text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em] flex items-center gap-3">
          <span className="w-8 h-[1px] bg-slate-200" />
          Powered by Qonvip 
          <span className="w-8 h-[1px] bg-slate-200" />
        </p>
      </div>
    </section>
  );
}
