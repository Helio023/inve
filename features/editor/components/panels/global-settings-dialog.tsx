// "use client";

// import { useState, useEffect } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
// import { Music, Settings } from "lucide-react";

// export function GlobalSettingsDialog({ settings, onUpdate }: any) {
//   const [isOpen, setIsOpen] = useState(false);
  
//   // FUNÇÃO HELPER: Garante que a estrutura existe, mesmo que 'settings' seja null/vazio
//   const parseSettings = (data: any) => {
//     return {
//       music: {
//         isEnabled: data?.music?.isEnabled || false,
//         url: data?.music?.url || "",
//         autoPlay: data?.music?.autoPlay || false,
//         showControl: data?.music?.showControl ?? true,
//       },
//       // Aqui pode adicionar outras definições futuras (seo, favicon, etc)
//     };
//   };

//   // 1. Inicializa o estado com os dados existentes ou padrão
//   const [localSettings, setLocalSettings] = useState(parseSettings(settings));

//   // 2. BUSCAR O LINK SALVO: Sempre que as 'settings' mudarem (ex: ao abrir ou após salvar),
//   // atualizamos o formulário local para refletir a realidade.
//   useEffect(() => {
//     if (isOpen) {
//         setLocalSettings(parseSettings(settings));
//     }
//   }, [settings, isOpen]);

//   const handleSave = () => {
//     onUpdate(localSettings);
//     setIsOpen(false); // Fecha ao guardar
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>
//         <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900" title="Configurações do Evento">
//           <Settings className="w-5 h-5" />
//         </Button>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Configurações do Evento</DialogTitle>
//         </DialogHeader>
        
//         <div className="space-y-6 py-4">
//           {/* SECÇÃO MÚSICA */}
//           <div className="space-y-4 border p-4 rounded-xl">
//             <div className="flex items-center gap-2 mb-2">
//               <div className="bg-blue-100 p-2 rounded-lg"><Music className="w-5 h-5 text-blue-600" /></div>
//               <h4 className="font-bold text-sm">Música de Fundo</h4>
//             </div>

//             <div className="flex items-center justify-between">
//               <Label htmlFor="music-enabled" className="cursor-pointer">Ativar Música</Label>
//               <Switch 
//                 id="music-enabled"
//                 checked={localSettings.music.isEnabled}
//                 onCheckedChange={(c) => setLocalSettings({ ...localSettings, music: { ...localSettings.music, isEnabled: c } })}
//               />
//             </div>

//             {localSettings.music.isEnabled && (
//               <div className="space-y-4 animate-in slide-in-from-top-2 pt-2">
//                 <div className="space-y-1.5">
//                   <Label className="text-xs font-bold text-slate-500">Link da Música</Label>
//                   <Input 
//                     placeholder="Cole o link (YouTube ou MP3)" 
//                     value={localSettings.music.url}
//                     onChange={(e) => setLocalSettings({ ...localSettings, music: { ...localSettings.music, url: e.target.value } })}
//                     className="bg-slate-50"
//                   />
//                   <p className="text-[10px] text-slate-400">Recomendado: Link direto de MP3 para melhor compatibilidade.</p>
//                 </div>
                
//                 <div className="flex items-center justify-between border-t pt-3">
//                   <div className="space-y-0.5">
//                     <Label className="text-xs">Autoplay</Label>
//                     <p className="text-[10px] text-slate-400">Tentar tocar ao abrir o convite.</p>
//                   </div>
//                   <Switch 
//                     checked={localSettings.music.autoPlay}
//                     onCheckedChange={(c) => setLocalSettings({ ...localSettings, music: { ...localSettings.music, autoPlay: c } })}
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="flex gap-2">
//             <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">Cancelar</Button>
//             <Button onClick={handleSave} className="flex-1 bg-slate-900 text-white">Salvar Alterações</Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

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
  Box
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export function GlobalSettingsDialog({ settings, onUpdate }: any) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Helper para garantir estrutura completa dos dados
  const parseSettings = (data: any) => {
    return {
      music: {
        isEnabled: data?.music?.isEnabled || false,
        url: data?.music?.url || "",
        autoPlay: data?.music?.autoPlay || false,
        showControl: data?.music?.showControl ?? true,
      },
      // --- NOVO: Configuração de Navegação ---
      navigation: {
        direction: data?.navigation?.direction || "horizontal",
        effect: data?.navigation?.effect || "slide",
      }
    };
  };

  const [localSettings, setLocalSettings] = useState(parseSettings(settings));

  // Sincronizar quando abre
  useEffect(() => {
    if (isOpen) {
        setLocalSettings(parseSettings(settings));
    }
  }, [settings, isOpen]);

  const handleSave = () => {
    onUpdate(localSettings);
    setIsOpen(false);
  };

  // Helpers para atualizar estado aninhado
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
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configurações do Evento</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-8 py-4">
          
          {/* --- 1. EXPERIÊNCIA DE NAVEGAÇÃO --- */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-purple-100 p-2 rounded-lg"><Smartphone className="w-5 h-5 text-purple-600" /></div>
              <h4 className="font-bold text-sm text-slate-800">Navegação e Efeitos</h4>
            </div>
            
            <div className="p-4 border rounded-xl bg-slate-50/50 space-y-5">
              {/* Direção */}
              <div className="space-y-3">
                <Label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Direção do Slide</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => updateNav('direction', 'horizontal')}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      localSettings.navigation.direction === 'horizontal' 
                        ? 'border-purple-600 bg-purple-50 text-purple-700' 
                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <ArrowRight className="w-6 h-6" />
                    <span className="text-xs font-bold">Horizontal</span>
                  </button>
                  <button
                    onClick={() => updateNav('direction', 'vertical')}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      localSettings.navigation.direction === 'vertical' 
                        ? 'border-purple-600 bg-purple-50 text-purple-700' 
                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <ArrowDown className="w-6 h-6" />
                    <span className="text-xs font-bold">Vertical (TikTok)</span>
                  </button>
                </div>
              </div>

              <Separator />

              {/* Efeito */}
              <div className="space-y-3">
                <Label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Animação de Transição</Label>
                <Select 
                  value={localSettings.navigation.effect} 
                  onValueChange={(val) => updateNav('effect', val)}
                >
                  <SelectTrigger className="bg-white h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slide">
                      <div className="flex items-center gap-2"><Layers className="w-4 h-4 text-slate-400"/> Deslizar (Clássico)</div>
                    </SelectItem>
                    <SelectItem value="fade">
                      <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-gradient-to-r from-transparent to-slate-400"/> Suave (Fade)</div>
                    </SelectItem>
                    <SelectItem value="scale">
                      <div className="flex items-center gap-2"><Smartphone className="w-4 h-4 text-slate-400"/> Profundidade (iOS)</div>
                    </SelectItem>
                    <SelectItem value="cube">
                      <div className="flex items-center gap-2"><Box className="w-4 h-4 text-slate-400"/> Cubo 3D</div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* --- 2. MÚSICA DE FUNDO --- */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 p-2 rounded-lg"><Music className="w-5 h-5 text-blue-600" /></div>
              <h4 className="font-bold text-sm text-slate-800">Áudio</h4>
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
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-500">Link do Áudio</Label>
                    <Input 
                      placeholder="YouTube ou MP3" 
                      value={localSettings.music.url}
                      onChange={(e) => updateMusic('url', e.target.value)}
                      className="bg-white"
                    />
                    <p className="text-[10px] text-slate-400">Recomendado: Link MP3 direto para melhor performance.</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
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
      </DialogContent>
    </Dialog>
  );
}