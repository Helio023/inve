"use client";

import { useEffect, useState } from "react";

interface ClientDateProps {
  date: string | null;
  className?: string;
}

export function ClientDate({ date, className }: ClientDateProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !date) {
    return <span className={className}>--:--</span>;
  }

  return (
    <span className={className}>
      {new Date(date).toLocaleTimeString("pt-MZ", {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </span>
  );
}