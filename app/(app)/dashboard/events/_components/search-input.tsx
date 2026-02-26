"use client";

import { Input } from "@/components/ui/input";
import { Search, Loader2, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useEffect, useState } from "react";

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(searchParams.get("q")?.toString() || "");

  // Sincroniza o input se a URL mudar externamente
  useEffect(() => {
    setValue(searchParams.get("q")?.toString() || "");
  }, [searchParams]);

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    params.set("page", "1"); 

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  }

  return (
    <div className="relative w-full max-w-sm">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10">
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
      </div>
      <Input
        placeholder="Buscar pelo título..."
        className="pl-9 pr-10 h-11 bg-white border-slate-200 shadow-sm focus-visible:ring-blue-500"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          handleSearch(e.target.value);
        }}
      />
      {value && (
        <button 
          onClick={() => { setValue(""); handleSearch(""); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}