"use client";

import { useState } from "react";
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
import { Check, Plus, ChevronUp, ChevronDown, AlertCircle } from "lucide-react";
import { PurchaseButton } from "./purchase-button";
import { SITE_CONFIG } from "@/config/plans";

interface PlansSectionProps {
  packages: any[];
}

export function PlansSection({ packages }: PlansSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

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
          className={`w-full sm:w-auto transition-all duration-300 ${
            !isOpen ? "bg-blue-600 hover:bg-blue-700 shadow-md" : ""
          }`}
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
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {/* 
               CORREÇÃO AQUI: 
               Aumentei o pt-2 para pt-8. 
               Isso cria espaço suficiente para o badge "Mais Popular" (-top-3) não ser cortado.
               Adicionei px-1 para evitar cortes na sombra lateral.
            */}
            <div className="pt-8 pb-4 px-1">
              {packages.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed rounded-xl bg-slate-50 text-slate-500">
                  <AlertCircle className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p>Nenhum pacote configurado.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {packages.map((pkg: any) => (
                    <Card
                      key={pkg._id}
                      className={`relative flex flex-col transition-all duration-200 ${
                        pkg.isPopular
                          ? "border-blue-500 border-2 shadow-xl md:-mt-2 md:mb-2 z-10 scale-[1.01]"
                          : "border-slate-200 shadow-sm"
                      }`}
                    >
                      {pkg.isPopular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm whitespace-nowrap z-20">
                          Mais Popular
                        </div>
                      )}

                      <CardHeader>
                        <CardTitle className="text-xl font-bold text-slate-800">
                          {pkg.name}
                        </CardTitle>
                        <CardDescription className="min-h-[40px] text-sm">
                          {pkg.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="flex-1">
                        <div className="flex items-baseline gap-1 mb-6">
                          <span className="text-4xl font-bold text-slate-900">
                            {pkg.price.toLocaleString("pt-MZ")}
                          </span>
                          <span className="text-lg font-medium text-slate-500">
                            {SITE_CONFIG.currency}
                          </span>
                        </div>

                        <div className="space-y-3 text-sm text-slate-600">
                          {Object.entries(pkg.credits || {}).map(
                            ([type, amount]: any) =>
                              amount > 0 && (
                                <div key={type} className="flex items-center">
                                  <Check className="w-4 h-4 mr-2 text-green-500 shrink-0" />
                                  <span className="font-bold text-slate-800 mr-1">
                                    +{amount}
                                  </span>
                                  <span className="capitalize">
                                    {type === "wedding"
                                      ? "Casamentos"
                                      : type === "birthday"
                                      ? "Aniversários"
                                      : "Eventos"}
                                  </span>
                                </div>
                              )
                          )}
                          <div className="flex items-center text-slate-500">
                            <Check className="w-4 h-4 mr-2 text-slate-300 shrink-0" />
                            Suporte via WhatsApp
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter>
                        <PurchaseButton
                          packageId={pkg._id.toString()}
                          packageName={pkg.name}
                          price={pkg.price}
                        />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
