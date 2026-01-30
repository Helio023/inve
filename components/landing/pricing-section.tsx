"use client";

import { PLANS } from "@/config/plans";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Planos de Crédito
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Sem subscrições mensais obrigatórias. Compre pacotes de créditos e
            use quando tiver clientes. Quanto maior o pacote, maior a sua margem
            de lucro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PLANS.map((plan) => (
            <Card
              key={plan.key}
              className={`relative flex flex-col ${plan.isPopular ? "border-2 border-blue-600 shadow-2xl scale-105 z-10" : "border-slate-200"}`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Mais Popular
                </div>
              )}

              <CardHeader className="text-center pb-2">
                <h3 className="text-lg font-bold text-slate-900">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1 mt-4 mb-2">
                  <span className="text-4xl font-black text-slate-900">
                    {plan.price}
                  </span>
                  <span className="text-sm text-slate-500">MZN</span>
                </div>
                <p className="text-sm text-slate-500">{plan.description}</p>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="space-y-3 mt-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>{plan.credits.wedding} Convites de Casamento</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>{plan.credits.birthday} Convites de Aniversário</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>{plan.credits.corporate} Convites Corporativos</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Acesso Vitalício ao Painel</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Link href="/register" className="w-full">
                  <Button
                    className={`w-full ${plan.isPopular ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-900"}`}
                  >
                    Começar Agora
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
