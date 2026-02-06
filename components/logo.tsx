"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  variant?: "default" | "white" | "dark";
}

export function Logo({
  className,
  iconOnly = false,
  variant = "default",
}: LogoProps) {
  const colorClass = {
    default: "text-slate-900",
    white: "text-white",
    dark: "text-slate-950",
  }[variant];

  const brandColor = "text-blue-600";

  return (
    <div
      className={cn("flex items-center gap-2.5 select-none group", className)}
    >
      {/* Ícone Qonvip */}
      <div className="relative flex items-center justify-center h-10 w-10 shrink-0">
        {/* Background do ícone com gradiente premium */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 to-blue-500 rounded-xl rotate-3 group-hover:rotate-6 transition-transform shadow-lg shadow-blue-200/50" />

        {/* Símbolo "Q" estilizado em SVG */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative h-6 w-6 text-white"
        >
          <path d="M12 2a10 10 0 1 0 10 10V2h-10z" />
          <path d="M12 12l8 8" />
          <circle
            cx="16"
            cy="8"
            r="2"
            fill="currentColor"
            stroke="none"
            className="animate-pulse"
          />
        </svg>
      </div>

      {!iconOnly && (
        <div className="flex flex-col">
          <span
            className={cn(
              "text-2xl font-black tracking-tighter leading-none",
              colorClass,
            )}
          >
            Qon<span className="text-blue-600">vip</span>
          </span>
          <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-1">
            Convite inteligente
          </span>
        </div>
      )}
    </div>
  );
}
