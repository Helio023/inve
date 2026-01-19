// "use client";

// import { useState, useRef } from "react";
// import { X, Image as ImageIcon, CloudUpload, Loader2 } from "lucide-react";
// import Image from "next/image";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { useUploadThing } from "@/lib/uploadthing";
// import { cn } from "@/lib/utils";

// interface ImageUploadProps {
//   value?: string;
//   onChange: (url: string) => void;
//   disabled?: boolean;
// }

// export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
//   const [file, setFile] = useState<File | null>(null);
//   const [localBlob, setLocalBlob] = useState<string | null>(null); // Apenas para preview antes do upload
//   const [progress, setProgress] = useState(0);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Lógica principal: O que mostrar na tela?
//   // Se tiver um blob local (usuario acabou de selecionar), mostra ele.
//   // Se não, mostra o que veio do banco (value).
//   const imageToShow = localBlob || value;

//   const { startUpload, isUploading } = useUploadThing("eventImage", {
//     onUploadProgress: (p) => {
//       setProgress(p);
//     },
//     onClientUploadComplete: (res) => {
//       if (res && res.length > 0) {
//         const uploadedUrl = res[0].url;

//         // 1. Salva a URL real no banco
//         onChange(uploadedUrl);

//         // 2. Limpa o estado local para garantir que o componente use a URL do banco agora
//         setFile(null);
//         setLocalBlob(null);

//         toast.success("Imagem salva com sucesso!");
//       }
//     },
//     onUploadError: (e) => {
//       toast.error(`Erro: ${e.message}`);
//       setProgress(0);
//     },
//   });

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0];
//     if (selectedFile) {
//       if (selectedFile.size > 4 * 1024 * 1024) {
//         toast.error("A imagem deve ter no máximo 4MB");
//         return;
//       }
//       setFile(selectedFile);
//       // Cria URL temporária apenas para visualização imediata
//       setLocalBlob(URL.createObjectURL(selectedFile));
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) return;
//     await startUpload([file]);
//   };

//   const onRemove = () => {
//     setFile(null);
//     setLocalBlob(null);
//     setProgress(0);
//     onChange(""); // Limpa no banco
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   const triggerSelect = () => {
//     fileInputRef.current?.click();
//   };

//   // --- RENDERIZAÇÃO ---

//   // CASO 1: Tem imagem (Seja do banco ou preview local)
//   if (imageToShow) {
//     return (
//       <div className="relative w-full h-56 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
//         <Image
//           fill
//           src={imageToShow}
//           alt="Upload Preview"
//           className={cn(
//             "object-cover transition-transform duration-500",
//             isUploading && "opacity-50 scale-105"
//           )}
//         />

//         {/* Botão de Remover (Só aparece se não estiver subindo) */}
//         {!isUploading && (
//           <div className="absolute top-2 right-2 z-10">
//             <Button
//               type="button"
//               onClick={onRemove}
//               variant="destructive"
//               size="icon"
//               className="h-8 w-8 shadow-sm rounded-full opacity-90 hover:opacity-100 transition-opacity"
//             >
//               <X className="h-4 w-4" />
//             </Button>
//           </div>
//         )}

//         {/* OVERLAY DE UPLOAD (Aparece apenas se for um arquivo local pendente) */}
//         {localBlob && !isUploading && (
//           <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all">
//             <Button
//               type="button"
//               onClick={handleUpload}
//               className="bg-blue-600 hover:bg-blue-700 font-bold shadow-lg transform hover:scale-105 transition-all"
//             >
//               <CloudUpload className="mr-2 h-4 w-4" /> Confirmar Upload
//             </Button>
//           </div>
//         )}

//         {/* BARRA DE PROGRESSO */}
//         {isUploading && (
//           <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20 px-6">
//             <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
//             <p className="text-white text-sm font-medium mb-2">
//               Enviando... {progress}%
//             </p>
//             <Progress value={progress} className="h-2 w-full bg-white/20" />
//           </div>
//         )}
//       </div>
//     );
//   }

//   // CASO 2: Estado Vazio (Dropzone)
//   return (
//     <div
//       onClick={triggerSelect}
//       className={cn(
//         "w-full h-40 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 p-4 flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-all hover:bg-slate-100 hover:border-blue-400 group",
//         disabled && "opacity-50 cursor-not-allowed"
//       )}
//     >
//       <input
//         type="file"
//         ref={fileInputRef}
//         onChange={handleFileSelect}
//         accept="image/png, image/jpeg, image/webp"
//         className="hidden"
//         disabled={disabled}
//       />

//       <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
//         <ImageIcon className="w-6 h-6 text-blue-500" />
//       </div>

//       <div className="space-y-1">
//         <p className="text-sm font-semibold text-slate-700">
//           Toque para selecionar
//         </p>
//         <p className="text-[10px] text-slate-400">PNG, JPG (Máx 4MB)</p>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useRef } from "react";
import { X, Image as ImageIcon, CloudUpload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUploadThing } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [localBlob, setLocalBlob] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lógica de Prioridade: Mostra o blob local se existir, senão mostra o valor do banco
  const imageToShow = localBlob || value;

  const { startUpload, isUploading } = useUploadThing("eventImage", {
    onUploadProgress: (p) => setProgress(p),
    onClientUploadComplete: (res) => {
      if (res && res.length > 0) {
        const uploadedUrl = res[0].url;
        onChange(uploadedUrl); // Atualiza o form pai

        // Limpa estado local para usar a URL final
        setFile(null);
        setLocalBlob(null);

        toast.success("Upload concluído!");
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
      setFile(selectedFile);
      setLocalBlob(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    await startUpload([file]);
  };

  const onRemove = () => {
    setFile(null);
    setLocalBlob(null);
    setProgress(0);
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- RENDERIZAÇÃO ---

  // Se tiver imagem (seja local ou salva), mostra o preview
  if (imageToShow) {
    return (
      <div className="relative w-full h-52 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group">
        {/* USANDO IMG PADRÃO PARA EVITAR ERROS DO NEXT/IMAGE */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageToShow}
          alt="Preview"
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isUploading ? "opacity-50" : "opacity-100"
          )}
        />

        {/* Botão Remover */}
        {!isUploading && (
          <div className="absolute top-2 right-2 z-10">
            <Button
              type="button"
              onClick={onRemove}
              variant="destructive"
              size="icon"
              className="h-8 w-8 rounded-full shadow-md opacity-90 hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Overlay de Confirmação (Aparece se for arquivo local) */}
        {localBlob && !isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <Button
              type="button"
              onClick={handleUpload}
              className="bg-blue-600 hover:bg-blue-700 font-bold shadow-lg"
            >
              <CloudUpload className="mr-2 h-4 w-4" /> Confirmar Upload
            </Button>
          </div>
        )}

        {/* Barra de Progresso */}
        {isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20 px-6">
            <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
            <p className="text-white text-sm font-medium mb-2">{progress}%</p>
            <Progress value={progress} className="h-2 w-full bg-white/20" />
          </div>
        )}
      </div>
    );
  }

  // Estado Vazio (Dropzone)
  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      className={cn(
        "w-full h-40 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 p-4 flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-all hover:bg-slate-100 hover:border-blue-400 group",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/png, image/jpeg, image/jpg, image/webp"
        className="hidden"
        disabled={disabled}
      />

      <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
        <ImageIcon className="w-6 h-6 text-blue-500" />
      </div>
      <p className="text-sm font-medium text-slate-700">
        Toque para selecionar imagem
      </p>
    </div>
  );
}
