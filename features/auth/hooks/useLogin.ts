"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginAction } from "../actions/login";
import { LoginInput } from "../schemas";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const submitLogin = async (data: LoginInput) => {
    setIsLoading(true);
    const toastId = toast.loading("Verificando credenciais...");

    try {
      const result = await loginAction(data);

      if (result?.error) {
        toast.error("Falha no login", {
          id: toastId,
          description: result.error,
        });
        return false;
      }

      toast.success("Login efetuado!", {
        id: toastId,
        description: "Redirecionando...",
      });

      router.refresh(); 
      
      router.push("/dashboard"); 
      
      return true;

    } catch (error) {
      console.error(error);
      toast.error("Erro inesperado", {
        id: toastId,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submitLogin,
    isLoading,
  };
}