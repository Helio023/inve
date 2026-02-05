import { UseFormReturn } from "react-hook-form";
import { RegisterInput } from "../../schemas";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface StepProps {
  form: UseFormReturn<RegisterInput>;
}

export function StepPersonal({ form }: StepProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome Completo</FormLabel>
            <FormControl>
              <Input placeholder="João da Silva" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefone</FormLabel>
            <FormControl>
              <Input placeholder="84 123 4567" {...field} />
            </FormControl>
            <FormDescription>
                Usaremos para validar sua conta ou contactá-lo se necessário.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}