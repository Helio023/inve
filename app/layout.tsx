import type { Metadata } from "next";
// 1. Importar as novas fontes
import {
  Inter,
  Playfair_Display,
  Dancing_Script,
  Montserrat,
  Great_Vibes,
  Cinzel,
  Cormorant_Garamond,
  Parisienne,
  Allura,
  Lato,
} from "next/font/google";
import "./globals.css";
import AppProvider from "@/providers/AppProvider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

// 2. Configurar as instâncias
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});
const dancing = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
});
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});
const vibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vibes",
});

// Novas Fontes
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });
const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "600"],
  subsets: ["latin"],
  variable: "--font-cormorant",
});
const parisienne = Parisienne({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-parisienne",
});
const allura = Allura({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-allura",
});
const lato = Lato({
  weight: ["100", "300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "Invite SaaS",
  description: "Plataforma de convites digitais",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-mz"
      className={cn(
        inter.variable,
        playfair.variable,
        dancing.variable,
        montserrat.variable,
        vibes.variable,
        cinzel.variable,
        cormorant.variable,
        parisienne.variable,
        allura.variable,
        lato.variable,
      )}
    >
      <body className="font-sans antialiased min-h-screen">
        <AppProvider>{children}</AppProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
