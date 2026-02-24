"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Plus, ChevronUp, AlertCircle, Sparkles } from "lucide-react";
import { PurchaseButton } from "./purchase-button";
import { SITE_CONFIG } from "@/config/plans";
import { cn } from "@/lib/utils";

interface PlansSectionProps {
  packages: any[];
  selectedPackageKey?: string;
}

export function PlansSection({ packages, selectedPackageKey }: PlansSectionProps) {

  const [isOpen, setIsOpen] = useState(!!selectedPackageKey);


  useEffect(() => {
    if (selectedPackageKey) {
      const timer = setTimeout(() => {
        const element = document.getElementById(`pkg-${selectedPackageKey}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 500); 
      return () => clearTimeout(timer);
    }
  }, [selectedPackageKey]);

  return (
    <div className="space-y-4">
      {/* Botão de Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          Disponíveis para Compra
        </h2>

        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant={isOpen ? "outline" : "default"}
          className={cn(
            "w-full sm:w-auto transition-all duration-300",
            !isOpen ? "bg-blue-600 hover:bg-blue-700 shadow-md" : ""
          )}
        >
          {isOpen ? (
            <>
              <ChevronUp className="mr-2 h-4 w-4" /> Ocultar Planos
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" /> Comprar Créditos
            </>
          )}
        </Button>
      </div>

      {/* Área Expansível com Animação */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-8 pb-4 px-1">
              {packages.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed rounded-xl bg-slate-50 text-slate-500">
                  <AlertCircle className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p>Nenhum pacote configurado.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {packages.map((pkg: any) => {
                    // Verifica se este é o pacote selecionado pela URL
                    const isSelected = pkg.key === selectedPackageKey;
                    const isPopular = pkg.isPopular;

                    return (
                      <Card
                        key={pkg._id}
                        id={`pkg-${pkg.key}`} // Adicionado para o auto-scroll
                        className={cn(
                          "relative flex flex-col transition-all duration-500",
                          // DESTAQUE DE SELEÇÃO: Se for o da URL, ganha borda forte e escala
                          isSelected 
                            ? "border-blue-600 border-2 shadow-2xl scale-[1.05] z-20 bg-blue-50/5" 
                            : isPopular 
                              ? "border-blue-400 border-2 shadow-xl md:-mt-2 md:mb-2 z-10 scale-[1.01]" 
                              : "border-slate-200 shadow-sm opacity-90 hover:opacity-100 hover:border-slate-300"
                        )}
                      >
                        {/* Selo Informativo */}
                        {(isPopular || isSelected) && (
                          <div className={cn(
                            "absolute -top-4 left-1/2 -translate-x-1/2 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-lg whitespace-nowrap z-20 flex items-center gap-1",
                            isSelected ? "bg-emerald-600 animate-bounce" : "bg-blue-600"
                          )}>
                            {isSelected ? (
                              <><Check className="w-3 h-3" /> Sua Escolha</>
                            ) : (
                              <><Sparkles className="w-3 h-3" /> Mais Popular</>
                            )}
                          </div>
                        )}

                        <CardHeader className="pb-4">
                          <CardTitle className="text-xl font-bold text-slate-800">
                            {pkg.name}
                          </CardTitle>
                          <CardDescription className="min-h-[40px] text-xs leading-relaxed">
                            {pkg.description}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="flex-1">
                          <div className="flex items-baseline gap-1 mb-6 border-b border-slate-100 pb-4">
                            <span className="text-4xl font-black text-slate-900 tracking-tighter">
                              {pkg.price.toLocaleString("pt-MZ")}
                            </span>
                            <span className="text-sm font-bold text-slate-400 uppercase">
                              {SITE_CONFIG.currency}
                            </span>
                          </div>

                          <div className="space-y-3">
                            {Object.entries(pkg.credits || {}).map(
                              ([type, amount]: any) =>
                                amount > 0 && (
                                  <div key={type} className="flex items-center text-sm">
                                    <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center mr-3 shrink-0">
                                      <Check className="w-3 h-3 text-green-600 stroke-[3px]" />
                                    </div>
                                    <span className="font-bold text-slate-900 mr-1">
                                      {amount}x
                                    </span>
                                    <span className="text-slate-500 capitalize">
                                      {type === "wedding"
                                        ? "Casamentos"
                                        : type === "birthday"
                                        ? "Aniversários"
                                        : "Eventos Corporativos"}
                                    </span>
                                  </div>
                                )
                            )}
                            
                            <div className="h-px bg-slate-50 my-2" />
                            
                            <div className="flex items-center text-xs text-slate-400">
                              <Check className="w-3.5 h-3.5 mr-3 text-slate-200" />
                              Painel de Gestão Vitalício
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="pt-2">
                          <PurchaseButton
                            packageId={pkg._id.toString()}
                            packageName={pkg.name}
                            price={pkg.price}
                       
                            variant={isSelected ? "default" : "outline"}
                          />
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}