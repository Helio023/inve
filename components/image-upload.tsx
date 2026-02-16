// "use client";

// import { useState, useRef } from "react";
// import { X, Image as ImageIcon, CloudUpload, Loader2 } from "lucide-react";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { useUploadThing } from "@/lib/uploadthing";
// import { cn } from "@/lib/utils";

// interface ImageUploadProps {
//   value?: string;
//   onChange: (url: string) => void;
//   disabled?: boolean;
//   endpoint?: "eventImage" | "agencyLogo";
// }

// export function ImageUpload({
//   value,
//   onChange,
//   disabled,
//   endpoint = "eventImage",
// }: ImageUploadProps) {
//   const [file, setFile] = useState<File | null>(null);
//   const [localBlob, setLocalBlob] = useState<string | null>(null);
//   const [progress, setProgress] = useState(0);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const imageToShow = localBlob || value;

//   // @ts-ignore - Dependendo da versão do UT o tipo pode reclamar, mas o valor via string funciona
//   const { startUpload, isUploading } = useUploadThing(endpoint, {
//     onUploadProgress: (p) => setProgress(p),
//     onClientUploadComplete: (res) => {
//       if (res && res.length > 0) {
//         const uploadedUrl = res[0].url;
//         onChange(uploadedUrl);
//         setFile(null);
//         setLocalBlob(null);
//         toast.success("Upload concluído!");
//       }
//     },
//     onUploadError: (e) => {
//       console.error("Upload Error:", e);
//       toast.error("Erro no upload. Tente novamente.");
//       setProgress(0);
//     },
//   });

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0];
//     if (selectedFile) {
//       if (selectedFile.size > 2 * 1024 * 1024) {
//         toast.error("Imagem muito grande. Máximo 2MB");
//         return;
//       }
//       setFile(selectedFile);
//       setLocalBlob(URL.createObjectURL(selectedFile));
//     }
//   };

//   const handleUpload = async (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (!file) return;
//     await startUpload([file]);
//   };

//   const onRemove = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setFile(null);
//     setLocalBlob(null);
//     setProgress(0);
//     onChange("");
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   if (imageToShow) {
//     return (
//       <div className="relative w-full h-52 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group">
//         <img
//           src={imageToShow}
//           alt="Preview"
//           className={cn(
//             "w-full h-full object-cover",
//             isUploading && "opacity-50",
//           )}
//         />
//         {!isUploading && (
//           <div className="absolute top-2 right-2 z-10">
//             <Button
//               type="button"
//               onClick={onRemove}
//               variant="destructive"
//               size="icon"
//               className="h-8 w-8 rounded-full shadow-md"
//             >
//               <X className="h-4 w-4" />
//             </Button>
//           </div>
//         )}
//         {localBlob && !isUploading && (
//           <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//             <Button
//               type="button"
//               onClick={handleUpload}
//               className="bg-blue-600 hover:bg-blue-700 font-bold shadow-lg"
//             >
//               <CloudUpload className="mr-2 h-4 w-4" /> Confirmar Foto
//             </Button>
//           </div>
//         )}
//         {isUploading && (
//           <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20 px-6">
//             <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
//             <Progress value={progress} className="h-2 w-full bg-white/20" />
//           </div>
//         )}
//       </div>
//     );
//   }

//   return (
//     <div
//       onClick={() => fileInputRef.current?.click()}
//       className={cn(
//         "w-full h-40 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 p-4 flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-all hover:bg-slate-100 hover:border-blue-400 group",
//         disabled && "opacity-50 cursor-not-allowed",
//       )}
//     >
//       <input
//         type="file"
//         ref={fileInputRef}
//         onChange={handleFileSelect}
//         accept="image/*"
//         className="hidden"
//         disabled={disabled}
//       />
//       <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
//         <ImageIcon className="w-6 h-6 text-blue-500" />
//       </div>
//       <p className="text-sm font-medium text-slate-700">Adicionar Imagem</p>
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
  endpoint?: "eventImage" | "agencyLogo";
}

export function ImageUpload({
  value,
  onChange,
  disabled,
  endpoint = "eventImage",
}: ImageUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [localBlob, setLocalBlob] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const imageToShow = localBlob || value;

  // @ts-ignore - Dependendo da versão do UT o tipo pode reclamar, mas o valor via string funciona
  const { startUpload, isUploading } = useUploadThing(endpoint, {
    onUploadProgress: (p) => setProgress(p),
    onClientUploadComplete: (res) => {
      if (res && res.length > 0) {
       
        const uploadedUrl = res[0].ufsUrl ?? res[0].url;

        if (uploadedUrl) {
          onChange(uploadedUrl);
          setFile(null);
          setLocalBlob(null);
          toast.success("Upload concluído!");
        }
      }
    },
    onUploadError: (e) => {
      console.error("Upload Error:", e);
      toast.error(`Erro no upload: ${e.message || "Tente novamente."}`);
      setProgress(0);
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 4 * 1024 * 1024) {
        toast.error("Imagem muito grande. Máximo 4MB");
        return;
      }
      setFile(selectedFile);
      setLocalBlob(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!file) return;
    await startUpload([file]);
  };

  const onRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFile(null);
    setLocalBlob(null);
    setProgress(0);
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (imageToShow) {
    return (
      <div className="relative w-full h-52 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group">
        <img
          src={imageToShow}
          alt="Preview"
          className={cn(
            "w-full h-full object-cover",
            isUploading && "opacity-50",
          )}
        />
        {!isUploading && (
          <div className="absolute top-2 right-2 z-10">
            <Button
              type="button"
              onClick={onRemove}
              variant="destructive"
              size="icon"
              className="h-8 w-8 rounded-full shadow-md"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        {localBlob && !isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <Button
              type="button"
              onClick={handleUpload}
              className="bg-blue-600 hover:bg-blue-700 font-bold shadow-lg"
            >
              <CloudUpload className="mr-2 h-4 w-4" /> Confirmar Foto
            </Button>
          </div>
        )}
        {isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20 px-6">
            <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
            <Progress value={progress} className="h-2 w-full bg-white/20" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      className={cn(
        "w-full h-40 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 p-4 flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-all hover:bg-slate-100 hover:border-blue-400 group",
        disabled && "opacity-50 cursor-not-allowed",
      )}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
        disabled={disabled}
      />
      <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
        <ImageIcon className="w-6 h-6 text-blue-500" />
      </div>
      <p className="text-sm font-medium text-slate-700 uppercase tracking-tighter">
        Adicionar Imagem
      </p>
    </div>
  );
}
