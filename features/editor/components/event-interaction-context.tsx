// "use client";

// import { createContext, useContext, useState, ReactNode } from "react";

// type MenuChoice = {
//   section: string;
//   item: string;
// };

// interface InteractionContextType {
//   menuSelections: MenuChoice[];
//   toggleMenuSelection: (section: string, item: string) => void;
// }

// const EventInteractionContext = createContext<
//   InteractionContextType | undefined
// >(undefined);

// export function EventInteractionProvider({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   const [menuSelections, setMenuSelections] = useState<MenuChoice[]>([]);

//   const toggleMenuSelection = (section: string, item: string) => {
//     setMenuSelections((prev) => {
//       const existingInSection = prev.find((s) => s.section === section);

//       if (existingInSection && existingInSection.item === item) {
//         return prev.filter((s) => s.section !== section);
//       } else {
//         const filtered = prev.filter((s) => s.section !== section);
//         return [...filtered, { section, item }];
//       }
//     });
//   };

//   return (
//     <EventInteractionContext.Provider
//       value={{ menuSelections, toggleMenuSelection }}
//     >
//       {children}
//     </EventInteractionContext.Provider>
//   );
// }

// export const useEventInteraction = () => {
//   const context = useContext(EventInteractionContext);
//   if (!context)
//     throw new Error("useEventInteraction must be used within a Provider");
//   return context;
// };


"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type MenuChoice = {
  section: string;
  item: string;
};

interface InteractionContextType {
  menuSelections: MenuChoice[];
  toggleMenuSelection: (section: string, item: string) => void;
  // Novos campos para Música
  songDraft: string;
  setSongDraft: (song: string) => void;
  isSongSent: boolean;
  setSongSent: (status: boolean) => void;
}

const EventInteractionContext = createContext<InteractionContextType | undefined>(undefined);

export function EventInteractionProvider({ children }: { children: ReactNode }) {
  const [menuSelections, setMenuSelections] = useState<MenuChoice[]>([]);
  const [songDraft, setSongDraft] = useState(""); // Guarda o texto enquanto o usuário digita
  const [isSongSent, setSongSent] = useState(false); // Guarda se já foi enviado com sucesso

  const toggleMenuSelection = (section: string, item: string) => {
    setMenuSelections((prev) => {
      const existingInSection = prev.find((s) => s.section === section);
      if (existingInSection && existingInSection.item === item) {
        return prev.filter((s) => s.section !== section);
      } else {
        const filtered = prev.filter((s) => s.section !== section);
        return [...filtered, { section, item }];
      }
    });
  };

  return (
    <EventInteractionContext.Provider
      value={{ 
        menuSelections, 
        toggleMenuSelection, 
        songDraft, 
        setSongDraft, 
        isSongSent, 
        setSongSent 
      }}
    >
      {children}
    </EventInteractionContext.Provider>
  );
}

export const useEventInteraction = () => {
  const context = useContext(EventInteractionContext);
  if (!context) throw new Error("useEventInteraction must be used within a Provider");
  return context;
};