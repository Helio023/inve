"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function MenuForm({ content, onUpdate }: any) {
  const sections = content.sections || [];
  const val = (v: any) => v || "";

  // --- ATUALIZAÇÕES IMUTÁVEIS ---
  const updateSectionTitle = (sIdx: number, title: string) => {
    const newSections = sections.map((section: any, index: number) => 
      index === sIdx ? { ...section, title } : section
    );
    onUpdate({ sections: newSections });
  };

  const addDish = (sIdx: number) => {
    const newSections = sections.map((section: any, index: number) => {
      if (index === sIdx) {
        return {
          ...section,
          items: [...(section.items || []), { name: "", description: "" }]
        };
      }
      return section;
    });
    onUpdate({ sections: newSections });
  };

  const updateDish = (sIdx: number, iIdx: number, field: string, value: string) => {
    const newSections = sections.map((section: any, index: number) => {
      if (index === sIdx) {
        const newItems = section.items.map((item: any, itemIndex: number) => 
          itemIndex === iIdx ? { ...item, [field]: value } : item
        );
        return { ...section, items: newItems };
      }
      return section;
    });
    onUpdate({ sections: newSections });
  };

  const removeDish = (sIdx: number, iIdx: number) => {
    const newSections = sections.map((section: any, index: number) => {
      if (index === sIdx) {
        return {
          ...section,
          items: section.items.filter((_: any, itemIndex: number) => itemIndex !== iIdx)
        };
      }
      return section;
    });
    onUpdate({ sections: newSections });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Toggle Interativo */}
      <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-center justify-between shadow-sm">
        <div className="space-y-0.5">
          <span className="text-[10px] font-black text-blue-900 uppercase tracking-tighter block">Menu Interativo</span>
          <span className="text-[9px] text-blue-600 block">Permitir escolha de pratos.</span>
        </div>
        <Switch 
          checked={content.isInteractive}
          onCheckedChange={(v) => onUpdate({ isInteractive: v })}
        />
      </div>

      <div className="space-y-4 pb-20"> {/* Padding extra para não cobrir o botão de baixo */}
        {sections.map((section: any, sIdx: number) => (
          <div key={sIdx} className="border rounded-2xl p-4 bg-slate-50/30 space-y-4 relative group/section">
            
            {/* Header da Secção */}
            <div className="flex items-center gap-2">
              <div className="flex-1 space-y-1">
                <Label className="text-[9px] font-bold text-slate-400 uppercase">Nome da Secção</Label>
                <Input 
                  value={val(section.title)} 
                  onChange={(e) => updateSectionTitle(sIdx, e.target.value)}
                  className="font-black text-[10px] uppercase h-9 tracking-widest bg-white"
                  placeholder="EX: ENTRADAS"
                />
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="mt-5 text-red-400 hover:bg-red-50"
                onClick={() => onUpdate({ sections: sections.filter((_: any, i: number) => i !== sIdx) })}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Lista de Pratos */}
            <div className="pl-3 border-l-2 border-slate-200 space-y-3">
              {section.items.map((item: any, iIdx: number) => (
                <div key={iIdx} className="bg-white p-3 rounded-xl border shadow-sm relative group/item space-y-1">
                  
                  {/* BOTÃO DE APAGAR PRATO - CORRIGIDO PARA MOBILE */}
                  <button 
                    type="button"
                    onClick={() => removeDish(sIdx, iIdx)}
                    className={cn(
                      "absolute -top-2 -right-2 h-7 w-7 rounded-full shadow-md flex items-center justify-center transition-all z-20",
                      "bg-white border border-slate-100 text-red-500",
                      // No Desktop (lg), começa invisível. No Mobile, está sempre visível.
                      "opacity-100 lg:opacity-0 lg:group-hover/item:opacity-100 hover:bg-red-50 active:scale-90"
                    )}
                  >
                    <X className="w-3.5 h-3.5 stroke-[3px]" />
                  </button>
                  
                  <Input 
                    value={val(item.name)} 
                    onChange={(e) => updateDish(sIdx, iIdx, 'name', e.target.value)}
                    className="h-7 text-xs font-bold border-0 border-b border-slate-100 rounded-none px-0 focus-visible:ring-0"
                    placeholder="Nome do Prato"
                  />
                  <Textarea 
                    value={val(item.description)}
                    onChange={(e) => updateDish(sIdx, iIdx, 'description', e.target.value)}
                    className="min-h-[40px] text-[10px] p-0 border-0 resize-none text-slate-500 focus-visible:ring-0"
                    placeholder="Ingredientes..."
                  />
                </div>
              ))}

              <Button 
                onClick={() => addDish(sIdx)} 
                variant="ghost" 
                className="w-full text-[10px] font-bold h-9 border-dashed border-slate-200 hover:bg-white"
              >
                <Plus className="w-3.5 h-3.5 mr-2" /> Adicionar Prato
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 pt-4 bg-white/80 backdrop-blur-sm pb-2">
        <Button 
          onClick={() => onUpdate({ sections: [...sections, { title: "", items: [] }] })} 
          className="w-full h-12 rounded-xl bg-slate-900 text-white shadow-xl active:scale-95 transition-transform"
        >
          <Plus className="w-4 h-4 mr-2" /> Nova Secção
        </Button>
      </div>
    </div>
  );
}