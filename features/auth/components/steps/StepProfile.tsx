"use client";

import { UseFormReturn } from "react-hook-form";
import { RegisterInput } from "../../schemas";
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Briefcase, Users, MapPin } from "lucide-react";
import { ImageUpload } from "@/components/image-upload"; 

interface StepProps {
  form: UseFormReturn<RegisterInput>;
}

const PROVINCIAS = [
  "Cabo Delgado",
  "Gaza",
  "Inhambane",
  "Manica",
  "Maputo Cidade",
  "Maputo Província",
  "Nampula",
  "Niassa",
  "Sofala",
  "Tete",
  "Zambézia",
];

export function StepProfile({ form }: StepProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* 1. Tipo de Conta */}
      <FormField
        control={form.control}
        name="accountType"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-sm font-bold text-slate-700">Tipo de Negócio</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-2 gap-4"
              >
                <FormItem>
                  <FormControl>
                    <RadioGroupItem value="FREELANCER" className="peer sr-only" />
                  </FormControl>
                  <FormLabel className="flex flex-col items-center justify-center rounded-xl border-2 border-slate-100 bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50/50 cursor-pointer transition-all">
                    <Briefcase className="mb-2 h-6 w-6 text-slate-400 peer-data-[state=checked]:text-blue-600" />
                    <span className="font-bold text-sm">Freelancer</span>
                    <span className="text-[10px] text-slate-500 text-center leading-tight mt-1">Trabalho Individual</span>
                  </FormLabel>
                </FormItem>
                
                <FormItem>
                  <FormControl>
                    <RadioGroupItem value="AGENCY" className="peer sr-only" />
                  </FormControl>
                  <FormLabel className="flex flex-col items-center justify-center rounded-xl border-2 border-slate-100 bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50/50 cursor-pointer transition-all">
                    <Users className="mb-2 h-6 w-6 text-slate-400 peer-data-[state=checked]:text-blue-600" />
                    <span className="font-bold text-sm">Agência</span>
                    <span className="text-[10px] text-slate-500 text-center leading-tight mt-1">Equipa ou Empresa</span>
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* 2. Localização */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="province"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">Província</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-11 rounded-lg border-slate-200">
                    <SelectValue placeholder="Onde atua?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PROVINCIAS.map((prov) => (
                    <SelectItem key={prov} value={prov}>
                      {prov}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="district"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">Distrito / Cidade</FormLabel>
              <FormControl>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    placeholder="Ex: Marracuene" 
                    className="h-11 pl-9 rounded-lg border-slate-200"
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

     
      <FormField
  control={form.control}
  name="logoUrl" 
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Logotipo da Agência</FormLabel>
      <FormControl>
        <ImageUpload
          value={field.value}
          onChange={field.onChange}
          endpoint="agencyLogo" 
          disabled={form.formState.isSubmitting}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
    </div>
  );
}