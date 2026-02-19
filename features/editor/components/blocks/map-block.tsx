"use client";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTypographyStyle, extractMapUrl } from "../../utils"; 

export const MapBlock = ({ content, styles, isPreview }: any) => {
  const s = styles;
  const mapSrc = extractMapUrl(content?.link);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${content?.venueName || ""} ${content?.address || ""}`)}`;

  return (
    <div
      className="w-full h-full flex flex-col relative"
      style={{
        minHeight: s.height === "auto" ? "350px" : "100%",
        flex: 1,
      }}
    >
      <div className="absolute inset-0 z-0 bg-slate-100">
        {mapSrc ? (
          <iframe
            width="100%"
            height="100%"
            src={mapSrc}
            style={{ border: 0 }}
            className={cn(!isPreview && "pointer-events-none")}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-slate-300">
            <MapPin className="w-10 h-10" />
          </div>
        )}
      </div>
      <div className="relative z-10 mt-auto p-4 w-full">
        <div
          className="p-5 rounded-xl shadow-lg backdrop-blur-sm"
          style={{
            backgroundColor: s.backgroundColor || "#fff",
            borderRadius: s.borderRadius || 16,
          }}
        >
          <h3 style={getTypographyStyle(s, "title")}>
            {content?.venueName || "Local"}
          </h3>
          <p style={getTypographyStyle(s, "desc")}>{content?.address}</p>
          <a
            href={isPreview ? googleMapsUrl : "#"}
            target={isPreview ? "_blank" : "_self"}
            className={cn(
              "mt-4 py-2 px-4 text-center font-bold flex items-center justify-center gap-2 transition-all block",
              !isPreview && "cursor-default",
            )}
            style={{
              ...getTypographyStyle(s, "btn"),
              backgroundColor: (s as any).btnBackgroundColor || "#000",
              color: (s as any).btnColor || "#fff",
              borderRadius: (s as any).btnBorderRadius || 8,
            }}
          >
            <MapPin className="w-4 h-4" /> {content?.buttonText || "Abrir GPS"}
          </a>
        </div>
      </div>
    </div>
  );
};
