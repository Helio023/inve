// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { toast } from "sonner";
// import { saveEventDesignAction } from "../actions";

// type SaveStatus = "saved" | "saving" | "unsaved" | "error";

// export function useAutoSave(eventId: string, dataToSave: any) {
//   const [status, setStatus] = useState<SaveStatus>("saved");
//   const [lastSaved, setLastSaved] = useState<Date | null>(null);

//   const performSave = useCallback(async () => {
//     setStatus("saving");
//     try {
//       const result = await saveEventDesignAction(eventId, dataToSave);

//       if (result.error) {
//         setStatus("error");
//         toast.error("Erro ao salvar automaticamente");
//       } else {
//         setStatus("saved");
//         setLastSaved(new Date());
//       }
//     } catch (err) {
//       setStatus("error");
//     }
//   }, [eventId, dataToSave]);

//   useEffect(() => {
//     setStatus("unsaved");

//     const timer = setTimeout(() => {
//       performSave();
//     }, 7000);

//     return () => clearTimeout(timer);
//   }, [dataToSave, performSave]);

//   return { status, lastSaved, performSave };
// }

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { saveEventDesignAction } from "../actions";

type SaveStatus = "saved" | "saving" | "unsaved" | "error";

export function useAutoSave(eventId: string, dataToSave: any) {
  const [status, setStatus] = useState<SaveStatus>("saved");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // 1. Ref para impedir o save automático ao abrir a página
  const isFirstRender = useRef(true);
  
  // 2. Ref para guardar o timer e poder cancelar
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // A função que vai ao servidor
  const performSave = useCallback(async () => {
    setStatus("saving");
    try {
      const result = await saveEventDesignAction(eventId, dataToSave);

      if (result.error) {
        setStatus("error");
        toast.error("Erro ao salvar automaticamente");
      } else {
        setStatus("saved");
        setLastSaved(new Date());
      }
    } catch (err) {
      setStatus("error");
      toast.error("Erro de conexão");
    }
  }, [eventId, dataToSave]);

  // O Efeito que vigia as mudanças
  useEffect(() => {
    // 3. Se for a primeira vez que o componente monta, NÃO faz nada.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Se chegou aqui, é porque o 'dataToSave' mudou
    setStatus("unsaved");

    // 4. Limpa o timer anterior (Debounce)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 5. Inicia um novo timer de 10 segundos (10000ms)
    timeoutRef.current = setTimeout(() => {
      performSave();
    }, 10000);

    // Limpeza ao desmontar
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [dataToSave, performSave]); 

  return { status, lastSaved, performSave };
}