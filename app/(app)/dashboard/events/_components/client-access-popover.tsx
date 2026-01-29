"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Copy, Check, ExternalLink, Share2 } from "lucide-react"; // Mudei Key para Share2 (faz mais sentido para o cliente)
import { toast } from "sonner";

interface ClientAccessPopoverProps {
  eventId: string;
  managementToken: string;
}

export function ClientAccessPopover({ eventId, managementToken }: ClientAccessPopoverProps) {
  const [copied, setCopied] = useState(false);
  
  // Evita erro de hidratação usando verificação de window
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const magicLink = `${origin}/manage/${eventId}?key=${managementToken}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(magicLink);
    setCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        {/* --- MUDANÇA AQUI: Botão Largo com Texto --- */}
        <Button 
          variant="secondary" 
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 shadow-sm"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Acesso do Cliente (Anfitrião)
        </Button>
        {/* ------------------------------------------- */}
      </PopoverTrigger>
      
      <PopoverContent className="w-80" align="center">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-bold leading-none text-slate-900">Link do Anfitrião</h4>
            <p className="text-xs text-slate-500">
              Partilhe este link com os donos da festa. Eles poderão ver a lista de convidados sem fazer login.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Input 
              value={magicLink} 
              readOnly 
              className="h-8 text-xs font-mono bg-slate-50" 
            />
            <Button size="icon" variant="default" className="h-8 w-8 shrink-0 bg-slate-900" onClick={handleCopy}>
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>

          <Button variant="ghost" size="sm" className="w-full text-xs h-6" asChild>
            <a href={magicLink} target="_blank" rel="noopener noreferrer">
              Testar Link <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}