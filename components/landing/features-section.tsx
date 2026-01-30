"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  Palette, 
  Smartphone, 
  Share2, 
  LayoutTemplate, 
  CreditCard 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Editor No-Code Poderoso",
    desc: "Construa convites complexos com mapas, música e formulários arrastando blocos. Sem tocar em código.",
    icon: Palette,
    colSpan: "md:col-span-2",
    bg: "bg-blue-50 text-blue-700"
  },
  {
    title: "Painel do Anfitrião",
    desc: "Gere um link mágico para o seu cliente acompanhar os RSVPs em tempo real sem precisar de conta.",
    icon: Users,
    colSpan: "md:col-span-1",
    bg: "bg-purple-50 text-purple-700"
  },
  {
    title: "Gestão Centralizada",
    desc: "Todos os seus eventos, clientes e listas de convidados organizados num único dashboard.",
    icon: LayoutTemplate,
    colSpan: "md:col-span-1",
    bg: "bg-slate-100 text-slate-700"
  },
  {
    title: "Design Mobile-First",
    desc: "Convites que parecem apps nativas. Navegação vertical estilo TikTok e carregamento instantâneo.",
    icon: Smartphone,
    colSpan: "md:col-span-2",
    bg: "bg-slate-900 text-white"
  },
  {
    title: "Partilha Inteligente",
    desc: "Links otimizados para WhatsApp com imagem de capa e descrição personalizada para cada evento.",
    icon: Share2,
    colSpan: "md:col-span-2",
    bg: "bg-green-50 text-green-700"
  },
  {
    title: "Margem de Lucro",
    desc: "Compre créditos com desconto e venda o convite ao preço que quiser.",
    icon: CreditCard,
    colSpan: "md:col-span-1",
    bg: "bg-amber-50 text-amber-700"
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            A ferramenta secreta das melhores agências.
          </h2>
          <p className="text-slate-500 text-lg">
            Você foca no design e na relação com o cliente. Nós cuidamos da infraestrutura, alojamento e tecnologia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={f.colSpan}
            >
              <Card className="h-full border-slate-200 hover:shadow-lg transition-all duration-300 group overflow-hidden">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.bg}`}>
                    <f.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl font-bold">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-500 leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}