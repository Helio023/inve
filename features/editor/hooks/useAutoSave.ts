"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { saveEventDesignAction } from "../actions";

type SaveStatus = "saved" | "saving" | "unsaved" | "error";

export function useAutoSave(eventId: string, dataToSave: any) {
  const [status, setStatus] = useState<SaveStatus>("saved");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

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
    }
  }, [eventId, dataToSave]);

  useEffect(() => {
    setStatus("unsaved");

    const timer = setTimeout(() => {
      performSave();
    }, 7000);

    return () => clearTimeout(timer);
  }, [dataToSave, performSave]);

  return { status, lastSaved, performSave };
}
