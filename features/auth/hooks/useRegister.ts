"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { registerAction } from "../actions/register";
import { RegisterInput } from "../schemas";

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const submitRegister = async (data: RegisterInput) => {
    setIsLoading(true);
    const toastId = toast.loading("Criando a sua conta...");

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "logo" && value instanceof FileList) {
          if (value.length > 0) formData.append(key, value[0]);
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      const result = await registerAction(formData);

      if (result?.error) {
        toast.error("Erro no registo", {
          id: toastId,
          description: result.error,
        });
        return false;
      } else {
        toast.success("Sucesso!", {
          id: toastId,
          description: "Redirecionando para verificação...",
        });

        router.push("/register/success");
        return true;
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro inesperado", {
        id: toastId,
        description: "Não foi possível conectar ao servidor.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submitRegister,
    isLoading,
  };
}
