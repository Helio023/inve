import { notFound } from "next/navigation";
import { Metadata } from "next";
import connectDB from "@/lib/db";

// Imports corrigidos para o padrão do projeto
import { Agency } from "@/lib/models/Agency";
import { Event } from "@/lib/models/Event";
import { EventViewer } from "@/components/event-viewer";

interface Props {
  params: Promise<{ site: string; slug: string }>;
}

// 1. Geração de Metadata Dinâmico (Para WhatsApp, Facebook, etc)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();

 
  const event = await Event.findOne({ slug })
    .select("title description coverImage")
    .lean();

  if (!event) {
    return { title: "Evento não encontrado" };
  }

 

  const title = event.title;
  const description =
    event.description ||
    "Você recebeu um convite especial. Toque para ver os detalhes.";
  const images = event.coverImage
    ? [{ url: event.coverImage, width: 1200, height: 630 }]
    : [];

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: images,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: images,
    },
  };
}

// 2. Componente da Página
export default async function PublicEventPage({ params }: Props) {
  const { site, slug } = await params;
  await connectDB();

  const agency = await Agency.findOne({ slug: site }).lean();
  if (!agency) return notFound();

  const event = await Event.findOne({
    slug: slug,
    agencyId: agency._id,
  }).lean();

  if (!event) return notFound();

  const plainSettings = event.settings ? JSON.parse(JSON.stringify(event.settings)) : {};

  const pages = event.designContent && event.designContent.length > 0
      ? event.designContent
      : [{ id: "default", title: "Capa", blocks: [], styles: { backgroundColor: "#ffffff" } }];

  return (
    <EventViewer 
      pages={pages} 
      isPublished={event.status === 'PUBLISHED'} 
      settings={plainSettings}
      isEditorPreview={false} 
    />
  );
}
