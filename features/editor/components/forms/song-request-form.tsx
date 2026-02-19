"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Music } from "lucide-react";

export const SongRequestForm = ({ content, onUpdate }: any) => {
  const val = (v: any) => v || "";

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* TÍTULO DO BLOCO */}
      <div className="space-y-1">
        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Título da Seção
        </Label>
        <Input 
          value={val(content.title)} 
          onChange={(e) => onUpdate({ title: e.target.value })} 
          placeholder="Ex: Sugira uma Música para o DJ"
        />
      </div>

      {/* DICA DENTRO DO CAMPO */}
      <div className="space-y-1">
        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Dica no Campo (Placeholder)
        </Label>
        <Input 
          value={val(content.placeholder)} 
          onChange={(e) => onUpdate({ placeholder: e.target.value })} 
          placeholder="Ex: Nome da música ou link do Spotify"
        />
      </div>

      {/* TEXTO DO BOTÃO */}
      <div className="space-y-1">
        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Texto do Botão
        </Label>
        <Input 
          value={val(content.buttonText)} 
          onChange={(e) => onUpdate({ buttonText: e.target.value })} 
          placeholder="Ex: Pedir Música"
        />
      </div>

      {/* INFO COMPLEMENTAR */}
      <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start gap-2">
        <Music className="w-3.5 h-3.5 text-blue-500 mt-0.5" />
        <p className="text-[9px] text-blue-700 leading-relaxed font-medium">
          <strong>Interatividade:</strong> Os pedidos feitos pelos convidados serão enviados diretamente para o painel de gestão do evento.
        </p>
      </div>
    </div>
  );
};