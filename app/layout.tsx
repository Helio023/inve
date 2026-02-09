import type { Metadata, Viewport } from "next";
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
import { MobileNormalizer } from "@/components/mobile-normalizer";

// 1. Configuração de Fontes (com display: 'swap' para performance)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});
const dancing = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
  display: "swap",
});
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});
const vibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vibes",
  display: "swap",
});
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});
const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "600"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});
const parisienne = Parisienne({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-parisienne",
  display: "swap",
});
const allura = Allura({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-allura",
  display: "swap",
});
const lato = Lato({
  weight: ["100", "300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
});

// 2. Metadados
export const metadata: Metadata = {
  title: {
    template: "%s | Qonvip",
    default: "Qonvip - Convites Interativos",
  },
  description: "Convites inteligentes, Experiências VIP.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Qonvip",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: "resizes-content",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
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
      suppressHydrationWarning
    >
      <body className="font-sans antialiased min-h-safe bg-background text-foreground overflow-x-hidden selection:bg-primary/20">
        <MobileNormalizer />
        <AppProvider>{children}</AppProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
