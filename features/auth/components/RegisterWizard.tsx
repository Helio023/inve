"use client";

import { useState } from "react";
import { useForm, FieldErrors } from "react-hook-form"; // Importar FieldErrors
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
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
import { Check, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { useRegister } from "../hooks/useRegister";
import { toast } from "sonner"; // Para avisar que houve erro

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
  const [direction, setDirection] = useState(0);
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
        return; // Não avança
      }
    }

    if (isValid) {
      setDirection(1);
      setCurrentStep((p) => p + 1);
    }
  };

  const prevStep = () => {
    setDirection(-1);
    setCurrentStep((p) => p - 1);
  };

  const onSubmit = async (data: RegisterInput) => {
    await submitRegister(data);
  };

  // --- NOVA FUNÇÃO: Gerencia Erros no Finalizar ---
  const onError = (errors: FieldErrors<RegisterInput>) => {
    // Procura o índice do primeiro passo que contém um campo com erro
    const stepWithErrors = STEP_FIELDS.findIndex((fields) =>
      fields.some((field) => errors[field])
    );

    if (stepWithErrors !== -1 && stepWithErrors !== currentStep) {
      // Determina a direção da animação
      setDirection(stepWithErrors < currentStep ? -1 : 1);
      // Move para o passo com erro
      setCurrentStep(stepWithErrors);

      toast.error("Verifique os erros antes de continuar.", {
        description: `Existem problemas no passo: ${STEPS[stepWithErrors].title}`,
      });
    }
  };

  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? 20 : -20, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? 20 : -20, opacity: 0 }),
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl border-slate-200">
      <CardHeader>
        <div className="flex justify-between items-center mb-4 px-2">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center gap-1">
              <div
                className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                        ${
                          index <= currentStep
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "bg-muted text-muted-foreground"
                        }
                    `}
              >
                {index < currentStep ? <Check className="w-4 h-4" /> : step.id}
              </div>
              <span
                className={`text-[10px] uppercase tracking-wider font-semibold transition-colors ${
                  index <= currentStep
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>

        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="space-y-1 text-center pt-4">
          <CardTitle className="text-xl">{STEPS[currentStep].title}</CardTitle>
          <CardDescription>
            Passo {currentStep + 1} de {STEPS.length}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="min-h-85 overflow-hidden relative">
        <Form {...form}>
          {/* Adicionado onError ao handleSubmit */}
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="space-y-6"
          >
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentStep}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="w-full px-1"
              >
                {currentStep === 0 && <StepCredentials form={form} />}
                {currentStep === 1 && <StepPersonal form={form} />}
                {currentStep === 2 && <StepProfile form={form} />}
              </motion.div>
            </AnimatePresence>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-6 bg-slate-50/50">
        <Button
          type="button" // Importante ser type="button" para não submeter form
          variant="ghost"
          onClick={prevStep}
          disabled={currentStep === 0 || isLoading}
          className="hover:bg-slate-100"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>

        {currentStep === STEPS.length - 1 ? (
          <Button
            onClick={form.handleSubmit(onSubmit, onError)}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 min-w-35"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                Finalizar
                <Check className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        ) : (
          <Button type="button" onClick={nextStep} className="min-w-30">
            Próximo <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
