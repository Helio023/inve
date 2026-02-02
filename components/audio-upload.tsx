"use client";

import { useState, useRef } from "react";
import { X, Music, CloudUpload, Loader2, Headphones, FileAudio } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUploadThing } from "@/lib/uploadthing"; // Certifique-se que o caminho está certo
import { cn } from "@/lib/utils";

interface AudioUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export function AudioUpload({ value, onChange, disabled }: AudioUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hook do UploadThing configurado para a rota de áudio
  const { startUpload, isUploading } = useUploadThing("audioUploader", {
    onUploadProgress: (p) => setProgress(p),
    onClientUploadComplete: (res) => {
      if (res && res.length > 0) {
        const uploadedUrl = res[0].url;
        onChange(uploadedUrl); // Atualiza o form pai com a URL final

        // Limpa o ficheiro local pois agora já está salvo na nuvem
        setFile(null);
        toast.success("Música carregada com sucesso!");
      }
    },
    onUploadError: (e) => {
      toast.error("Erro no upload: " + e.message);
      setProgress(0);
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validação extra de segurança
      if (!selectedFile.type.includes("audio") && !selectedFile.name.endsWith(".mp3")) {
        toast.error("Por favor selecione um arquivo MP3.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    await startUpload([file]);
  };

  const onRemove = () => {
    setFile(null);
    setProgress(0);
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- LÓGICA DE VISUALIZAÇÃO ---
  // Se existir um ficheiro local pendente OU uma URL já salva
  const hasContent = file || value;
  
  // Nome para exibir (Do ficheiro local ou genérico se vier da URL)
  const fileName = file ? file.name : value ? "Música Carregada.mp3" : "";
  const fileSize = file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : "";

  if (hasContent) {
    return (
      <div className="relative w-full h-40 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group flex flex-col items-center justify-center p-4">
        
        {/* ÍCONE DE FUNDO */}
        <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
            <Headphones className="h-6 w-6 text-purple-600" />
        </div>
        
        {/* INFORMAÇÃO DO FICHEIRO */}
        <div className="text-center max-w-full px-4">
            <p className="text-sm font-bold text-slate-700 truncate w-full">{fileName}</p>
            {file && <p className="text-[10px] text-slate-400 mt-1">{fileSize} - Aguardando confirmação</p>}
            {value && !file && <p className="text-[10px] text-emerald-600 mt-1 font-medium">Pronto para tocar</p>}
        </div>

        {/* --- ESTADO 1: CARREGANDO --- */}
        {isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-20 px-6">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-2" />
            <p className="text-purple-900 text-sm font-medium mb-2">{progress}%</p>
            <Progress value={progress} className="h-2 w-full bg-purple-100" />
          </div>
        )}

        {/* --- ESTADO 2: CONFIRMAÇÃO (Só se for ficheiro local novo) --- */}
        {file && !isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px] z-10">
            <Button
              type="button"
              onClick={handleUpload}
              className="bg-purple-600 hover:bg-purple-700 font-bold shadow-lg animate-in zoom-in duration-300"
            >
              <CloudUpload className="mr-2 h-4 w-4" /> Confirmar Upload
            </Button>
          </div>
        )}

        {/* BOTÃO REMOVER (Sempre visível se não estiver carregando) */}
        {!isUploading && (
          <div className="absolute top-2 right-2 z-30">
            <Button
              type="button"
              onClick={onRemove}
              variant="destructive"
              size="icon"
              className="h-7 w-7 rounded-full shadow-sm opacity-80 hover:opacity-100"
              title="Remover música"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  // --- ESTADO VAZIO (SELETOR) ---
  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      className={cn(
        "w-full h-32 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 p-4 flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-all hover:bg-purple-50 hover:border-purple-300 group",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
       
        accept=".mp3,audio/mpeg,audio/mp3" 
        className="hidden"
        disabled={disabled}
      />

      <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
        <Music className="w-5 h-5 text-purple-500" />
      </div>
      <div className="space-y-1">
        <p className="text-xs font-bold text-slate-700">
          Selecione o ficheiro MP3
        </p>
        <p className="text-[10px] text-slate-400">
          Máximo 4MB
        </p>
      </div>
    </div>
  );
}