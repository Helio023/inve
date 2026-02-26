"use client";

import { Input } from "@/components/ui/input";
import { Search, Loader2, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useEffect, useState } from "react";

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  // Estado local para o input (permite digitação fluida)
  const [value, setValue] = useState(searchParams.get("q")?.toString() || "");

  // Debounce: Só dispara a busca após o usuário parar de digitar por 400ms
  useEffect(() => {
    const timer = setTimeout(() => {
      // Se o valor for diferente do que está na URL, dispara a busca
      if (value !== (searchParams.get("q") || "")) {
        handleSearch(value);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [value]);

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    params.set("page", "1");

    // O startTransition ativa o isPending até o servidor devolver a nova página
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  }

  return (
    <div className="relative w-full max-w-sm">
      {/* Barra de progresso animada (Tailwind puro) */}
      <div className="absolute -top-[2px] left-1 right-1 h-[2px] overflow-hidden rounded-full">
        <div 
          className={cn(
            "h-full bg-blue-600 transition-all duration-500 ease-in-out",
            isPending ? "w-full opacity-100 animate-pulse" : "w-0 opacity-0"
          )} 
        />
      </div>

      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10">
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
        ) : (
          <Search className="h-4 w-4" />
        )}
      </div>

      <Input
        placeholder="Buscar convite..."
        className={cn(
          "pl-9 pr-10 h-11 bg-white border-slate-200 transition-all",
          isPending && "opacity-70 ring-1 ring-blue-100"
        )}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      {value && !isPending && (
        <button 
          onClick={() => { setValue(""); handleSearch(""); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

// Função auxiliar cn se você não tiver importado
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}