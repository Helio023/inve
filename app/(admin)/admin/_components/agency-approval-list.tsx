'use client';

import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle, XCircle, Loader2, MapPin, Mail, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { updateAgencyStatus } from "@/features/admin/actions";

// Tipo simplificado vindo do banco
interface PendingAgency {
  _id: string;
  name: string;
  emailContact: string;
  phone: string;
  type: string;
  location: {
    province: string;
    district: string;
  };
  createdAt: string;
}

interface AgencyApprovalListProps {
  agencies: PendingAgency[];
}

export function AgencyApprovalList({ agencies }: AgencyApprovalListProps) {
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAction = async (id: string, action: 'APPROVED' | 'REJECTED') => {
    setProcessingId(id);
    const toastId = toast.loading(action === 'APPROVED' ? "Aprovando..." : "Rejeitando...");

    try {
      const result = await updateAgencyStatus(id, action);

      if (result.error) {
        toast.error("Erro", { id: toastId, description: result.error });
      } else {
        toast.success(action === 'APPROVED' ? "Agência Aprovada!" : "Agência Rejeitada", { 
          id: toastId 
        });
      }
    } catch (error) {
      toast.error("Erro inesperado", { id: toastId });
    } finally {
      setProcessingId(null);
    }
  };

  if (agencies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
        <p className="text-slate-500 font-medium">Nenhuma solicitação pendente.</p>
        <p className="text-sm text-slate-400">Tudo limpo por aqui! 🎉</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {agencies.map((agency) => (
        <Card key={agency._id} className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-4">
              
              {/* Informações da Agência */}
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-lg text-slate-800">{agency.name}</h3>
                  <Badge variant="secondary" className="text-xs font-normal bg-blue-50 text-blue-700 hover:bg-blue-100">
                    {agency.type === 'AGENCY' ? 'Agência' : 'Freelancer'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" />
                    {agency.emailContact}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5" />
                    {agency.phone}
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {agency.location.province}, {agency.location.district}
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex items-center gap-3 border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0">
                <Button 
                  variant="outline" 
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100 min-w-[110px]"
                  onClick={() => handleAction(agency._id, 'REJECTED')}
                  disabled={!!processingId}
                >
                  {processingId === agency._id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 mr-2" /> 
                      Rejeitar
                    </>
                  )}
                </Button>
                
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white min-w-[110px]"
                  onClick={() => handleAction(agency._id, 'APPROVED')}
                  disabled={!!processingId}
                >
                   {processingId === agency._id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" /> 
                      Aprovar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}