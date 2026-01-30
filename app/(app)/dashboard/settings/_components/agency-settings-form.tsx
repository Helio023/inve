"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ImageUpload } from "@/components/image-upload"; // Use o seu componente existente
import { Loader2, Save, Building2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { updateAgencyAction } from "@/features/agency/actions";

export function AgencySettingsForm({ agency }: { agency: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState(agency.logoUrl || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("logoUrl", logo); // Adiciona o logo manualmente

    const res = await updateAgencyAction(formData);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Perfil atualizado com sucesso!");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Identidade Visual */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" /> Identidade
          </CardTitle>
          <CardDescription>
            Como a sua agência aparece para os clientes.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Logótipo</Label>
            <div className="bg-slate-50 border rounded-xl p-1">
              <ImageUpload value={logo} onChange={setLogo} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome da Agência</Label>
              <Input name="name" defaultValue={agency.name} required />
            </div>
            <div className="space-y-2">
              <Label>Descrição / Slogan</Label>
              <Textarea
                name="description"
                defaultValue={agency.description}
                placeholder="Criamos momentos inesquecíveis..."
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Contactos e Localização */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" /> Contactos
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Email de Contacto</Label>
            <Input
              name="emailContact"
              type="email"
              defaultValue={agency.emailContact}
              required
            />
            {/* Adicione este texto de ajuda: */}
            <p className="text-[10px] text-slate-500">
              Este email será visível nos convites para os convidados entrarem
              em contacto. Mudar isto <strong>não altera</strong> o seu email de
              login.
            </p>
          </div>
          <div className="space-y-2">
            <Label>Telefone / WhatsApp</Label>
            <Input name="phone" defaultValue={agency.phone} required />
          </div>
          <div className="space-y-2">
            <Label>Província</Label>
            <Input
              name="province"
              defaultValue={agency.location?.province}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Distrito / Cidade</Label>
            <Input
              name="district"
              defaultValue={agency.location?.district}
              required
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          size="lg"
          className="min-w-[150px]"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Salvar Alterações
        </Button>
      </div>
    </form>
  );
}
