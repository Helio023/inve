import { notFound } from "next/navigation";
import { Metadata } from "next";
import connectDB from "@/lib/db";

import { Agency } from "@/lib/models/Agency";
import { Event } from "@/lib/models/Event";
import { Guest } from "@/lib/models/Guest"; 
import { EventViewer } from "@/components/event-viewer";

interface Props {
  params: Promise<{ site: string; slug: string }>;

  searchParams: Promise<{ c?: string }>;
}

// 1. Geração de Metadata (Mantém-se, mas adicionei a busca por imagem de forma segura)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();

  const event = await Event.findOne({ slug })
    .select("title description coverImage")
    .lean();

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
  const { c } = await searchParams; 

  await connectDB();

  const agency = await Agency.findOne({ slug: site }).lean();
  if (!agency) return notFound();

  const event = await Event.findOne({
    slug: slug,
    agencyId: agency._id,
  }).lean();

  if (!event) return notFound();

  let guestName = "";
  let guestData = null;
  if (c) {
    const guest = await Guest.findOne({ inviteToken: c }).lean();
    if (guest) {
      guestName = guest.name;
      guestData = JSON.parse(JSON.stringify(guest));
    }
  }

  const plainSettings = event.settings
    ? JSON.parse(JSON.stringify(event.settings))
    : {};

  const content = event.designContent
    ? JSON.parse(JSON.stringify(event.designContent))
    : [];

  const pages =
    content.length > 0
      ? content
      : [
          {
            id: "default",
            title: "Capa",
            blocks: [],
            styles: { backgroundColor: "#ffffff" },
          },
        ];

  return (
    <EventViewer
      pages={pages}
      isPublished={event.status === "PUBLISHED"}
      settings={plainSettings}
      isEditorPreview={false}
      guest={guestData}
      guestName={guestName}
      
    />
  );
}
