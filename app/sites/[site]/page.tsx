import { notFound } from "next/navigation";
import Link from "next/link";
import connectDB from "@/lib/db";
import { Agency } from "@/lib/models/Agency";
import { Event } from "@/lib/models/Event";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface Props {
  params: Promise<{ site: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { site } = await params;
  await connectDB();
  const agency = await Agency.findOne({ slug: site }).select("name").lean();
  return {
    title: agency ? `${agency.name} | Eventos` : "Agência não encontrada",
  };
}

export default async function AgencyLandingPage({ params }: Props) {
  const { site } = await params;

  await connectDB();

  // 1. Buscar Agência pelo Subdomínio
  const agency = await Agency.findOne({ slug: site }).lean();

  if (!agency) {
    return notFound();
  }

  // 2. Buscar Eventos PUBLICADOS desta agência
  const events = await Event.find({
    agencyId: agency._id,
    status: "PUBLISHED", // Só mostra o que está pronto
  })
    .sort({ date: 1 }) // Próximos eventos primeiro
    .select("title slug date coverImage eventType")
    .lean();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Cabeçalho da Agência */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">{agency.name}</h1>
          <p className="text-slate-500">
            Confira nossos eventos e convites digitais.
          </p>
        </div>

        {/* Lista de Eventos */}
        {events.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-200">
            <p className="text-slate-400">
              Esta agência ainda não tem eventos públicos.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event: any) => (
              <Card
                key={event._id.toString()}
                className="overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {/* Imagem de Capa (Se tiver) */}
                {event.coverImage && (
                  <div className="h-48 w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={event.coverImage}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}

                <CardHeader>
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                    {event.eventType}
                  </div>
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center text-slate-500 text-sm">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    {event.date
                      ? format(new Date(event.date), "PPP", { locale: pt })
                      : "Data a definir"}
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    asChild
                    className="w-full bg-slate-900 hover:bg-slate-800"
                  >
                    <Link href={`/sites/${site}/${event.slug}`}>
                      Ver Convite <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <footer className="text-center text-xs text-slate-400 mt-12">
          <p>
            Powered by <strong>Qonvip</strong>
          </p>
        </footer>
      </div>
    </div>
  );
}
