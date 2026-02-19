// "use client";
// import { getTypographyStyle, getContainerStyle, getBackgroundStyle } from "../../utils";

// export const HeroBlock = ({ content, styles }: any) => {
//   const s = styles;
//   return (
//     <div
//       className="w-full flex-1 flex flex-col relative"
//       style={{
//         ...getContainerStyle(s),
//         ...getBackgroundStyle(s),
//         justifyContent: s.justifyContent || "center",
//         alignItems: s.alignItems || "center",
//         minHeight: s.height === "auto" ? "400px" : s.height,
//       }}
//     >
//       {content.image && (
//         <div className="absolute inset-0 z-0 pointer-events-none">
//           <div className="absolute inset-0 bg-black/30 z-10" />
//           <img src={content.image} className="w-full h-full object-cover" style={{ objectFit: s.objectFit || "cover" }} alt="" />
//         </div>
//       )}
//       <div className="relative z-20 w-full px-6 py-8">
//         <h1 style={getTypographyStyle(s, "title")}>{content.title || "Título"}</h1>
//         {content.subtitle && <p style={getTypographyStyle(s, "desc")}>{content.subtitle}</p>}
//       </div>
//     </div>
//   );
// };

"use client";
import { getTypographyStyle, getBackgroundStyle } from "../../utils";


export const HeroBlock = ({ content, styles: s }: any) => {
  return (
    <div
      className="w-full flex-1 flex flex-col relative"
      style={{
        ...getBackgroundStyle(s), 
        justifyContent: (s as any).justifyContent || "center",
        alignItems: (s as any).alignItems || "center",
        minHeight: s.height === "auto" ? "400px" : s.height,
      }}
    >
 
      {content?.image && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-black/30 z-10" />
          <img 
            src={content.image} 
            className="w-full h-full object-cover" 
            style={{ objectFit: s.objectFit || "cover" }} 
            alt="" 
          />
        </div>
      )}
      <div className="relative z-20 w-full px-6 py-8">
        <h1 style={getTypographyStyle(s, "title")}>{content?.title || "Título"}</h1>
        {content?.subtitle && <p style={getTypographyStyle(s, "desc")}>{content.subtitle}</p>}
      </div>
    </div>
  );
};