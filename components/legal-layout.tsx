"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Clock } from "lucide-react";

interface LegalContainerProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalContainer({ title, lastUpdated, children }: LegalContainerProps) {
  return (
    <div className="bg-white min-h-screen pt-32 pb-20 selection:bg-indigo-100">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Badge de Documento Oficial */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Documento Oficial Qonvip</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6">
            {title.split(".")[0]}<span className="text-slate-400">.{title.split(".")[1] || ""}</span>
          </h1>
          
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-16 border-l-2 border-slate-100 pl-4">
            <Clock className="w-3 h-3" />
            <span>Última atualização: {lastUpdated}</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="space-y-12"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}