"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Music, 
  Settings, 
  Smartphone, 
  ArrowRight, 
  ArrowDown, 
  Layers,
  Box,
  MonitorPlay
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AudioUpload } from "@/components/audio-upload"; 

export function GlobalSettingsDialog({ settings, onUpdate }: any) {
  const [isOpen, setIsOpen] = useState(false);
  
  const parseSettings = (data: any) => {
    return {
      music: {
        isEnabled: data?.music?.isEnabled || false,
        url: data?.music?.url || "",
        autoPlay: data?.music?.autoPlay || false,
        showControl: data?.music?.showControl ?? true,
      },
      navigation: {
        direction: data?.navigation?.direction || "horizontal",
        effect: data?.navigation?.effect || "slide",
      }
    };
  };

  const [localSettings, setLocalSettings] = useState(parseSettings(settings));

  useEffect(() => {
    if (isOpen) {
        setLocalSettings(parseSettings(settings));
    }
  }, [settings, isOpen]);

  const handleSave = () => {
    onUpdate(localSettings);
    setIsOpen(false);
  };

  const updateMusic = (key: string, value: any) => {
    setLocalSettings(prev => ({ ...prev, music: { ...prev.music, [key]: value } }));
  };

  const updateNav = (key: string, value: any) => {
    setLocalSettings(prev => ({ ...prev, navigation: { ...prev.navigation, [key]: value } }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900" title="Configurações do Evento">
          <Settings className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      
      {/* 
         ADICIONADO 'no-scrollbar' AQUI 
         Mantemos o overflow-y-auto para permitir scroll, mas a classe abaixo esconde a barra visualmente
      */}
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle>Configurações do Evento</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-8 py-4">
          
          {/* 1. NAVEGAÇÃO */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-purple-100 p-2 rounded-lg"><Smartphone className="w-5 h-5 text-purple-600" /></div>
              <h4 className="font-bold text-sm text-slate-800">Navegação e Efeitos</h4>
            </div>
            
            <div className="p-4 border rounded-xl bg-slate-50/50 space-y-5">
              <div className="space-y-3">
                <Label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Direção do Slide</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => updateNav('direction', 'horizontal')} className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${localSettings.navigation.direction === 'horizontal' ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}><ArrowRight className="w-6 h-6" /><span className="text-xs font-bold">Horizontal</span></button>
                  <button onClick={() => updateNav('direction', 'vertical')} className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${localSettings.navigation.direction === 'vertical' ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}><ArrowDown className="w-6 h-6" /><span className="text-xs font-bold">Vertical (TikTok)</span></button>
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <Label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Animação de Transição</Label>
                <Select value={localSettings.navigation.effect} onValueChange={(val) => updateNav('effect', val)}>
                  <SelectTrigger className="bg-white h-10 border-slate-200"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slide"><div className="flex items-center gap-2"><Layers className="w-4 h-4 text-slate-400"/> Deslizar (Clássico)</div></SelectItem>
                    <SelectItem value="fade"><div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-gradient-to-r from-transparent to-slate-400 border"/> Suave (Fade)</div></SelectItem>
                    <SelectItem value="scale"><div className="flex items-center gap-2"><MonitorPlay className="w-4 h-4 text-slate-400"/> Profundidade (iOS)</div></SelectItem>
                    <SelectItem value="cube"><div className="flex items-center gap-2"><Box className="w-4 h-4 text-slate-400"/> Cubo 3D</div></SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 2. MÚSICA DE FUNDO */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 p-2 rounded-lg"><Music className="w-5 h-5 text-blue-600" /></div>
              <h4 className="font-bold text-sm text-slate-800">Áudio MP3</h4>
            </div>

            <div className="p-4 border rounded-xl bg-slate-50/50 space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="music-enabled" className="cursor-pointer font-medium">Ativar Música de Fundo</Label>
                <Switch 
                  id="music-enabled"
                  checked={localSettings.music.isEnabled}
                  onCheckedChange={(c) => updateMusic('isEnabled', c)}
                />
              </div>

              {localSettings.music.isEnabled && (
                <div className="space-y-4 animate-in slide-in-from-top-2 pt-2 border-t border-slate-200 mt-2">
                  <div className="space-y-2">
                    <AudioUpload 
                        value={localSettings.music.url} 
                        onChange={(url) => updateMusic('url', url)} 
                    />
                    <p className="text-[10px] text-slate-400 text-center">Ficheiros .mp3 até 8MB</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="space-y-0.5">
                      <Label className="text-xs">Autoplay</Label>
                      <p className="text-[10px] text-slate-400">Tentar iniciar automaticamente.</p>
                    </div>
                    <Switch 
                      checked={localSettings.music.autoPlay}
                      onCheckedChange={(c) => updateMusic('autoPlay', c)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        <div className="flex gap-2 pt-2 border-t mt-2">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">Cancelar</Button>
            <Button onClick={handleSave} className="flex-1 bg-slate-900 text-white hover:bg-slate-800">Salvar Alterações</Button>
        </div>

        {/* CSS PARA ESCONDER SCROLLBAR */}
        <style jsx global>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}