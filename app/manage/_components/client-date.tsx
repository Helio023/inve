"use client";

import { useEffect, useState } from "react";

interface ClientDateProps {
  date: string | null;
  className?: string;
  // Adicionada a propriedade que faltava para corrigir o erro de TypeScript
  mode?: "time" | "date" | "full"; 
}

export function ClientDate({ date, className, mode = "time" }: ClientDateProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !date) {
    return <span className={className}>--:--</span>;
  }

  const d = new Date(date);
  
 

  let formattedDate = "";

  if (mode === "time") {
   
    formattedDate = d.toLocaleTimeString("pt-MZ", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (mode === "date") {
  
    formattedDate = d.toLocaleDateString("pt-MZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } else {
   
    formattedDate = d.toLocaleString("pt-MZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <span className={className}>
      {formattedDate}
    </span>
  );
}