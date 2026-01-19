'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { forgotPasswordAction, resetPasswordAction } from "../actions/passwordActions";
import { ForgotPasswordInput, ResetPasswordInput } from "../schemas";

export function useForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);

  const requestReset = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    const toastId = toast.loading("Enviando solicitação...");

    try {
      const formData = new FormData();
      formData.append("email", data.email);
      
      await forgotPasswordAction(formData);

      toast.success("Verifique seu e-mail", {
        id: toastId,
        description: "Se a conta existir, enviamos um link de recuperação.",
        duration: 5000,
      });
      return true;
    } catch (error) {
      toast.error("Erro inesperado", { id: toastId });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { requestReset, isLoading };
}

export function useResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const performReset = async (data: ResetPasswordInput) => {
    setIsLoading(true);
    const toastId = toast.loading("Atualizando senha...");

    try {
      const formData = new FormData();
      formData.append("token", data.token);
      formData.append("password", data.password);
      formData.append("confirmPassword", data.confirmPassword);

      const result = await resetPasswordAction(formData);

      if (result?.error) {
        toast.error("Erro", { id: toastId, description: result.error });
        return false;
      }

      toast.success("Senha alterada!", { id: toastId, description: "Faça login com a nova senha." });
      router.push("/login");
      return true;
    } catch (error) {
      toast.error("Erro inesperado", { id: toastId });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { performReset, isLoading };
}