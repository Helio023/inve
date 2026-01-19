import { UseFormReturn } from "react-hook-form";
import { RegisterInput } from "../../schemas";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, Users } from "lucide-react";

interface StepProps {
  form: UseFormReturn<RegisterInput>;
}

export function StepProfile({ form }: StepProps) {
  return (
    <div className="space-y-6">
      {/* Radio Group Customizado (Freelancer vs Agência) */}
      <FormField
        control={form.control}
        name="accountType"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Tipo de Conta</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-2 gap-4"
              >
                {/* Opção 1 */}
                <FormItem>
                  <FormControl>
                    <RadioGroupItem value="FREELANCER" className="peer sr-only" />
                  </FormControl>
                  <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                    <Briefcase className="mb-3 h-6 w-6" />
                    <span className="font-bold">Freelancer</span>
                    <span className="text-xs text-muted-foreground mt-1">Trabalho só</span>
                  </FormLabel>
                </FormItem>
                
                {/* Opção 2 */}
                <FormItem>
                  <FormControl>
                    <RadioGroupItem value="AGENCY" className="peer sr-only" />
                  </FormControl>
                  <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                    <Users className="mb-3 h-6 w-6" />
                    <span className="font-bold">Agência</span>
                    <span className="text-xs text-muted-foreground mt-1">Tenho equipe</span>
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        {/* Select Shadcn */}
        <FormField
          control={form.control}
          name="province"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Província</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Maputo Cidade">Maputo Cidade</SelectItem>
                  <SelectItem value="Maputo Província">Maputo Província</SelectItem>
                  <SelectItem value="Gaza">Gaza</SelectItem>
                  <SelectItem value="Inhambane">Inhambane</SelectItem>
                  <SelectItem value="Sofala">Sofala</SelectItem>
                  <SelectItem value="Nampula">Nampula</SelectItem>
                  {/* ... outros */}
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
              <FormLabel>Distrito</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Marracuene" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Upload de Arquivo (Input Nativo estilizado, pois Shadcn não tem File Input complexo) */}
      <FormField
        control={form.control}
        name="logo"
        render={({ field: { value, onChange, ...fieldProps } }) => (
          <FormItem>
            <FormLabel>Logotipo (Opcional)</FormLabel>
            <FormControl>
              <Input
                {...fieldProps}
                type="file"
                accept="image/*"
                onChange={(event) => {
                  onChange(event.target.files);
                }}
                className="cursor-pointer file:text-primary file:font-medium"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
