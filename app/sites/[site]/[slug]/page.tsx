// import { notFound } from "next/navigation";
// import { Metadata } from "next";
// import connectDB from "@/lib/db";

// // Imports corrigidos para o padrão do projeto
// import { Agency } from "@/lib/models/Agency";
// import { Event } from "@/lib/models/Event";
// import { EventViewer } from "@/components/event-viewer";

// interface Props {
//   params: Promise<{ site: string; slug: string }>;
// }

// // 1. Geração de Metadata Dinâmico (Para WhatsApp, Facebook, etc)
// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const { slug } = await params;
//   await connectDB();

 
//   const event = await Event.findOne({ slug })
//     .select("title description coverImage")
//     .lean();

//   if (!event) {
//     return { title: "Evento não encontrado" };
//   }

 

//   const title = event.title;
//   const description =
//     event.description ||
//     "Você recebeu um convite especial. Toque para ver os detalhes.";
//   const images = event.coverImage
//     ? [{ url: event.coverImage, width: 1200, height: 630 }]
//     : [];

//   return {
//     title: title,
//     description: description,
//     openGraph: {
//       title: title,
//       description: description,
//       images: images,
//       type: "website",
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: title,
//       description: description,
//       images: images,
//     },
//   };
// }

// // 2. Componente da Página
// export default async function PublicEventPage({ params }: Props) {
//   const { site, slug } = await params;
//   await connectDB();

//   const agency = await Agency.findOne({ slug: site }).lean();
//   if (!agency) return notFound();

//   const event = await Event.findOne({
//     slug: slug,
//     agencyId: agency._id,
//   }).lean();

//   if (!event) return notFound();

//   const plainSettings = event.settings ? JSON.parse(JSON.stringify(event.settings)) : {};

//   const pages = event.designContent && event.designContent.length > 0
//       ? event.designContent
//       : [{ id: "default", title: "Capa", blocks: [], styles: { backgroundColor: "#ffffff" } }];

//   return (
//     <EventViewer 
//       pages={pages} 
//       isPublished={event.status === 'PUBLISHED'} 
//       settings={plainSettings}
//       isEditorPreview={false} 
//     />
//   );
// }


import { notFound } from "next/navigation";
import { Metadata } from "next";
import connectDB from "@/lib/db";

// Imports corrigidos para o padrão do projeto
import { Agency } from "@/lib/models/Agency";
import { Event } from "@/lib/models/Event";
import { Guest } from "@/lib/models/Guest"; // <--- NOVO IMPORT
import { EventViewer } from "@/components/event-viewer";
// Ajuste o caminho conforme a sua estrutura real (usámos features/editor anteriormente)
// import { EventViewer } from "@/features/editor/components/event-viewer"; 

interface Props {
  params: Promise<{ site: string; slug: string }>;
  // --- ALTERAÇÃO: Adicionar searchParams ---
  searchParams: Promise<{ c?: string }>;
}

// 1. Geração de Metadata (Mantém-se, mas adicionei a busca por imagem de forma segura)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();

  const event = await Event.findOne({ slug }).select("title description coverImage").lean();

  if (!event) return { title: "Evento não encontrado" };

  return {
    title: event.title,
    description: event.description || "Você recebeu um convite especial.",
    openGraph: {
      images: event.coverImage ? [{ url: event.coverImage }] : [],
    },
  };
}

// 2. Componente da Página
export default async function PublicEventPage({ params, searchParams }: Props) {
  const { site, slug } = await params;
  const { c } = await searchParams; // Ler o token do URL

  await connectDB();

  const agency = await Agency.findOne({ slug: site }).lean();
  if (!agency) return notFound();

  const event = await Event.findOne({
    slug: slug,
    agencyId: agency._id,
  }).lean();

  if (!event) return notFound();

  // --- NOVA LÓGICA: Buscar Nome do Convidado ---
  let guestName = "";
  if (c) {
    const guest = await Guest.findOne({ inviteToken: c }).select("name").lean();
    if (guest) {
      guestName = guest.name;
    }
  }
  // ----------------------------------------------

  const plainSettings = event.settings ? JSON.parse(JSON.stringify(event.settings)) : {};
  
  // Limpeza profunda do conteúdo para evitar erros de serialização
  const content = event.designContent ? JSON.parse(JSON.stringify(event.designContent)) : [];
  
  const pages = content.length > 0
      ? content
      : [{ id: "default", title: "Capa", blocks: [], styles: { backgroundColor: "#ffffff" } }];

  return (
    <EventViewer 
      pages={pages} 
      isPublished={event.status === 'PUBLISHED'} 
      settings={plainSettings}
      isEditorPreview={false}
      // --- PASSAR O NOME ---
      guestName={guestName}
    />
  );
}