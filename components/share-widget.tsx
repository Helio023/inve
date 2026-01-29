"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, QrCode, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

interface ShareWidgetProps {
  url: string;
  title: string;
}

export function ShareWidget({ url, title }: ShareWidgetProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copiado para a área de transferência!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-800">Partilhar Convite</h3>
        <Button variant="ghost" size="sm" asChild className="text-xs">
          <a href={url} target="_blank" rel="noopener noreferrer">
            Abrir <ExternalLink className="ml-1 w-3 h-3" />
          </a>
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input readOnly value={url} className="bg-slate-50 pr-10 text-xs font-mono" />
        </div>
        <Button onClick={handleCopy} size="icon" variant="outline">
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full bg-slate-900 text-white hover:bg-slate-800">
            <QrCode className="w-4 h-4 mr-2" /> Ver QR Code
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm flex flex-col items-center text-center">
          <DialogHeader>
            <DialogTitle>QR Code do Evento</DialogTitle>
          </DialogHeader>
          <div className="p-6 bg-white border rounded-xl shadow-inner mt-4">
            <QRCodeSVG value={url} size={200} />
          </div>
          <p className="text-sm text-slate-500 mt-2">
            Mostre isto aos convidados para eles digitalizarem.
          </p>
          <Button variant="link" className="text-xs text-slate-400" onClick={() => window.print()}>
            Imprimir
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}