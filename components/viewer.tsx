import { cn } from "@/lib/utils";
import { MapPin, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

// Tipos (Podemos extrair para um arquivo compartilhado depois)
interface BlockProps {
  block: {
    id: string;
    type: string;
    content: any;
    styles?: any;
  };
}

export function PublicBlockRenderer({ block }: BlockProps) {
  const { type, content, styles } = block;

  const containerStyle = {
    backgroundColor: styles?.backgroundColor || 'transparent',
    color: styles?.color || 'inherit',
    textAlign: styles?.textAlign || 'left',
  };

  switch (type) {
    case 'HERO':
      return (
        <div style={containerStyle} className="flex flex-col items-center justify-center py-10 animate-in fade-in zoom-in duration-700">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight">
            {content.title}
          </h1>
          <div className="text-lg opacity-80 uppercase tracking-widest border-t border-b py-2 border-current">
            {content.subtitle}
          </div>
        </div>
      );

    case 'TEXT':
      return (
        <div style={containerStyle} className="py-4 px-2">
          <p className="whitespace-pre-wrap leading-relaxed text-lg opacity-90">
            {content.text}
          </p>
        </div>
      );

    case 'IMAGE':
      if (!content.url) return null;
      return (
        <div className="w-full py-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={content.url} 
            alt={content.caption || "Imagem do evento"} 
            className="w-full h-auto rounded-xl shadow-lg object-cover"
          />
          {content.caption && (
            <p className="text-center text-sm opacity-70 mt-2 italic">{content.caption}</p>
          )}
        </div>
      );

    case 'MAP':
      return (
        <div className="w-full py-6">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-2xl text-center shadow-sm">
            <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-lg mb-1">{content.address}</h3>
            {content.link && (
              <Button asChild variant="link" className="text-blue-600 p-0 h-auto font-semibold">
                <a href={content.link} target="_blank" rel="noopener noreferrer">
                  Ver no Google Maps
                </a>
              </Button>
            )}
          </div>
        </div>
      );

    case 'COUNTDOWN':
      // Nota: Implementaremos a lógica JS do contador depois. Por enquanto é visual.
      return (
        <div className="py-8 text-center">
          <p className="text-xs uppercase tracking-widest opacity-70 mb-4">A contagem começou</p>
          <div className="flex justify-center gap-4 text-center">
            <TimeBox value="00" label="Dias" />
            <span className="text-2xl mt-2">:</span>
            <TimeBox value="00" label="Horas" />
            <span className="text-2xl mt-2">:</span>
            <TimeBox value="00" label="Min" />
          </div>
        </div>
      );

    default:
      return null;
  }
}

function TimeBox({ value, label }: { value: string, label: string }) {
  return (
    <div className="flex flex-col">
      <div className="bg-white text-slate-900 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-lg font-mono text-xl md:text-2xl font-bold shadow-md">
        {value}
      </div>
      <span className="text-[10px] uppercase mt-2 font-medium opacity-80">{label}</span>
    </div>
  );
}