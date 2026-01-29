import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/lib/auth";

const f = createUploadthing();

const handleAuth = async () => {
  const session = await auth();
  if (!session?.user) throw new UploadThingError("Unauthorized");
  return { userId: session.user.id };
};

export const ourFileRouter = {
  // Rota de Imagens (que já existia)
  eventImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => await handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload de imagem por:", metadata.userId);
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  
  audioUploader: f({ audio: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(async () => await handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload de áudio por:", metadata.userId);
      return { uploadedBy: metadata.userId, url: file.url };
    }),
    
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;