"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const CountdownForm = ({ content, onUpdate }: any) => {
  return (
    <div className="space-y-4 animate-in fade-in">
      {/* SELETOR DE DATA */}
      <div className="space-y-1">
        <Label className="text-[10px] font-bold text-slate-500 uppercase">
          Data do Evento
        </Label>
        <Input
          type="datetime-local"
          value={
            content.date
              ? new Date(content.date).toISOString().slice(0, 16)
              : ""
          }
          onChange={(e) =>
            onUpdate({ date: new Date(e.target.value).toISOString() })
          }
        />
      </div>

      {/* LEGENDA DO TOPO */}
      <div className="space-y-1">
        <Label className="text-[10px] font-bold text-slate-500 uppercase">
          Legenda do Topo
        </Label>
        <Input
          value={content.label || ""}
          onChange={(e) => onUpdate({ label: e.target.value })}
          placeholder="Ex: Faltam apenas..."
        />
      </div>
    </div>
  );
};
