"use client";

import { useState, useEffect } from "react";

/**
 * Hook para detectar mudanças de Media Query (Responsividade via JS)
 * @param query string de media query, ex: "(min-width: 768px)"
 * @returns boolean indicando se a query coincide com o estado atual da tela
 */
export function useMediaQuery(query: string): boolean {
  // Inicializamos com false para evitar erro de hidratação (SSR)
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Cria a lista de media query
    const media = window.matchMedia(query);

    // Define o valor inicial se já estiver montado no cliente
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    // Função de callback para atualizar o estado
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Adiciona o listener (suporte moderno para addEventListener em MediaQueryList)
    media.addEventListener("change", listener);

    // Limpeza ao desmontar
    return () => media.removeEventListener("change", listener);
  }, [query, matches]);

  return matches;
}