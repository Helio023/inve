"use client";

import { useState } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { RegisterSchema, RegisterInput } from "../schemas";
import { StepCredentials } from "./steps/StepCredentials";
import { StepPersonal } from "./steps/StepPersonal";
import { StepProfile } from "./steps/StepProfile";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { useRegister } from "../hooks/useRegister";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, title: "Acesso" },
  { id: 2, title: "Pessoal" },
  { id: 3, title: "Perfil" },
];

type FieldName = keyof RegisterInput;
const STEP_FIELDS: FieldName[][] = [
  ["email", "password", "confirmPassword"],
  ["name", "phone"],
  ["accountType", "province", "district"],
];

export function RegisterWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const { submitRegister, isLoading } = useRegister();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      phone: "",
      accountType: "FREELANCER",
      province: "",
      district: "",
    },
  });

  const nextStep = async () => {
    const fields = STEP_FIELDS[currentStep];
    const isValid = await form.trigger(fields);

    if (currentStep === 0 && isValid) {
      const { password, confirmPassword } = form.getValues();
      if (password !== confirmPassword) {
        form.setError("confirmPassword", {
          type: "manual",
          message: "As senhas não coincidem.",
        });
        return;
      }
    }

    if (isValid) {
      setCurrentStep((p) => p + 1);
      // Rola a página para o topo para o usuário ver o início do novo passo
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep((p) => p - 1);
    window.scrollTo(0, 0);
  };

  const onSubmit = async (data: RegisterInput) => {
    await submitRegister(data);
  };

  const onError = (errors: FieldErrors<RegisterInput>) => {
    toast.error("Preencha os campos corretamente.");
  };

  return (
    <div className="w-full space-y-6">
      <Card className="w-full shadow-2xl border-slate-200 bg-white rounded-2xl overflow-visible">
        <CardHeader className="pb-6 border-b bg-slate-50/50 rounded-t-2xl">
          <div className="flex justify-between items-center mb-6">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all",
                    index <= currentStep
                      ? "bg-blue-600 text-white shadow-md scale-110"
                      : "bg-white text-slate-300 border border-slate-200",
                  )}
                >
                  {index < currentStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={cn(
                    "text-[9px] uppercase font-black",
                    index <= currentStep ? "text-blue-600" : "text-slate-400",
                  )}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <CardTitle className="text-2xl font-bold text-slate-900">
              {STEPS[currentStep].title}
            </CardTitle>
            <CardDescription className="text-xs font-medium uppercase tracking-widest text-slate-400">
              Passo {currentStep + 1} de 3
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="py-8 px-6 sm:px-10">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onError)}
              className="space-y-6"
            >
              <div className="w-full">
                {currentStep === 0 && <StepCredentials form={form} />}
                {currentStep === 1 && <StepPersonal form={form} />}
                {currentStep === 2 && <StepProfile form={form} />}
              </div>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex justify-between border-t p-6 bg-slate-50/50 rounded-b-2xl">
          <Button
            type="button"
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 0 || isLoading}
            className="font-bold text-slate-500"
          >
            Anterior
          </Button>

          {currentStep === STEPS.length - 1 ? (
            <Button
              onClick={form.handleSubmit(onSubmit, onError)}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 min-w-[130px] font-black h-12 shadow-lg"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Finalizar"}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={nextStep}
              className="bg-slate-900 hover:bg-slate-800 font-bold h-12 min-w-[110px]"
            >
              Próximo <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Link de Suporte WhatsApp (TOTALMENTE FORA DO CARD) */}
      <div className="w-full">
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_PHONE || "845031480"}`}
          target="_blank"
          className="flex items-center justify-center gap-3 bg-white text-slate-600 p-5 rounded-2xl text-xs font-bold border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
        >
          <MessageCircle className="w-5 h-5 text-emerald-500" />
          Dúvidas no registo? Suporte QVite
        </a>
      </div>
    </div>
  );
}
