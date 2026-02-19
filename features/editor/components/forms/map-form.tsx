"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const MapForm = ({ content, onUpdate }: any) => (
  <div className="space-y-4">
    <div className="space-y-1">
      <Label className="text-[10px] font-bold text-slate-500 uppercase">Local</Label>
      <Input value={content.venueName || ""} onChange={(e) => onUpdate({ venueName: e.target.value })} />
    </div>
    <div className="space-y-1">
      <Label className="text-[10px] font-bold text-slate-500 uppercase">Morada</Label>
      <Input value={content.address || ""} onChange={(e) => onUpdate({ address: e.target.value })} />
    </div>
    <div className="space-y-1">
      <Label className="text-[10px] font-bold text-slate-500 uppercase">Texto Botão</Label>
      <Input value={content.buttonText || ""} onChange={(e) => onUpdate({ buttonText: e.target.value })} />
    </div>
    <div className="space-y-1">
      <Label className="text-[10px] font-bold text-slate-500 uppercase">Iframe / Link Maps</Label>
      <Textarea rows={3} value={content.link || ""} onChange={(e) => onUpdate({ link: e.target.value })} />
    </div>
  </div>
);