import type { Metadata } from "next";
import { Inter, Playfair_Display, Dancing_Script, Montserrat, Great_Vibes } from "next/font/google";
import "./globals.css";
import AppProvider from "@/providers/AppProvider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const dancing = Dancing_Script({ subsets: ["latin"], variable: "--font-dancing" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const vibes = Great_Vibes({ weight: "400", subsets: ["latin"], variable: "--font-vibes" });

export const metadata: Metadata = {
  title: "Invite SaaS",
  description: "Plataforma de convites digitais",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-mz" className={cn(
      inter.variable, 
      playfair.variable, 
      dancing.variable, 
      montserrat.variable, 
      vibes.variable
    )}>
      <body className="font-sans antialiased min-h-screen">
        <AppProvider>{children}</AppProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}