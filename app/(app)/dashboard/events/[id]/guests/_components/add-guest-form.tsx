'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { addGuestAction } from "@/features/guests/actions";

export function AddGuestForm({ eventId }: { eventId: string }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    formData.append('eventId', eventId);

    const res = await addGuestAction(formData);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Convidado adicionado!");
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-blue-600" />
          Novo Convidado
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome (ou Família)</Label>
            <Input id="name" name="name" placeholder="Ex: Tio João e Família" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">WhatsApp (Opcional)</Label>
            <Input id="phone" name="phone" placeholder="Ex: 841234567" />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Adicionar à Lista"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}