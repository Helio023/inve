"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, ChevronDown, ChevronUp, Utensils } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function MenuForm({ content, onUpdate }: any) {
  const sections = content.sections || [];
  const isInteractive = content.isInteractive || false;

  const addSection = () => {
    const newSections = [...sections, { title: "Nova Secção", items: [] }];
    onUpdate({ ...content, sections: newSections });
  };

  const removeSection = (idx: number) => {
    const newSections = sections.filter((_: any, i: number) => i !== idx);
    onUpdate({ ...content, sections: newSections });
  };

  const updateSectionTitle = (idx: number, title: string) => {
    const newSections = [...sections];
    newSections[idx].title = title;
    onUpdate({ ...content, sections: newSections });
  };

  const addItem = (sectionIdx: number) => {
    const newSections = [...sections];
    newSections[sectionIdx].items.push({ name: "Novo Prato", description: "", price: "" });
    onUpdate({ ...content, sections: newSections });
  };

  const updateItem = (sectionIdx: number, itemIdx: number, field: string, value: string) => {
    const newSections = [...sections];
    newSections[sectionIdx].items[itemIdx][field] = value;
    onUpdate({ ...content, sections: newSections });
  };

  const removeItem = (sectionIdx: number, itemIdx: number) => {
    const newSections = [...sections];
    newSections[sectionIdx].items = newSections[sectionIdx].items.filter((_:any, i:number) => i !== itemIdx);
    onUpdate({ ...content, sections: newSections });
  };

  return (
    <div className="space-y-6">
      
      {/* Opção de Interatividade */}
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-blue-800">Menu Interativo?</span>
          <span className="text-[10px] text-blue-600">Permitir que convidados selecionem pratos.</span>
        </div>
        <Switch 
          checked={isInteractive}
          onCheckedChange={(checked) => onUpdate({ ...content, isInteractive: checked })}
        />
      </div>

      <div className="space-y-4">
        {sections.map((section: any, idx: number) => (
          <div key={idx} className="border rounded-lg p-3 bg-white space-y-3">
            <div className="flex items-center gap-2">
              <Input 
                value={section.title} 
                onChange={(e) => updateSectionTitle(idx, e.target.value)}
                className="font-bold h-9"
                placeholder="Nome da Secção (Ex: Jantar)"
              />
              <Button variant="ghost" size="icon" onClick={() => removeSection(idx)} className="text-red-400 hover:text-red-600 h-9 w-9">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="pl-4 border-l-2 border-slate-100 space-y-3">
              {section.items.map((item: any, itemIdx: number) => (
                <div key={itemIdx} className="bg-slate-50 p-2 rounded relative group">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeItem(idx, itemIdx)}
                    className="absolute top-1 right-1 h-6 w-6 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                  <Input 
                    value={item.name} 
                    onChange={(e) => updateItem(idx, itemIdx, 'name', e.target.value)}
                    className="h-7 text-xs bg-transparent border-0 border-b border-slate-200 rounded-none focus-visible:ring-0 px-0 font-medium mb-1"
                    placeholder="Nome do Prato"
                  />
                  <Textarea 
                    value={item.description}
                    onChange={(e) => updateItem(idx, itemIdx, 'description', e.target.value)}
                    className="min-h-[40px] text-[10px] bg-transparent border-0 p-0 resize-none text-slate-500 focus-visible:ring-0"
                    placeholder="Descrição dos ingredientes..."
                  />
                </div>
              ))}
              <Button onClick={() => addItem(idx)} variant="outline" size="sm" className="w-full text-xs h-8 border-dashed">
                <Plus className="w-3 h-3 mr-2" /> Adicionar Prato
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button onClick={addSection} className="w-full bg-slate-900 text-white">
        <Plus className="w-4 h-4 mr-2" /> Nova Secção
      </Button>
    </div>
  );
}