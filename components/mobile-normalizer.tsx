"use client";

import { useEffect } from "react";

export function MobileNormalizer() {
  useEffect(() => {
    // --- FUNÇÕES ---

    // 1. Fallback para altura real (corrige 100vh em browsers antigos)
    const setRealVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    // 2. Detector de Teclado (Essencial para Androids antigos)
    const handleResize = () => {
      setRealVh(); // Atualiza a altura

      // Verifica se a tela encolheu drasticamente (teclado abriu)
      if (window.visualViewport) {
        const currentHeight = window.visualViewport.height;
        const totalHeight = window.innerHeight;

        // Se a altura visível for menor que 75% da altura total, o teclado provávelmente abriu
        // Nota: O teclado ocupa geralmente 30-40% da tela
        if (currentHeight < totalHeight * 0.8) {
          document.body.classList.add("keyboard-open");
        } else {
          document.body.classList.remove("keyboard-open");
        }
      }
    };

    // 3. Ativar estado :active no iOS (Faz o botão "piscar" ao tocar)
    const enableActiveStates = () => {
      document.body.addEventListener("touchstart", () => {}, { passive: true });
    };

    // --- INICIALIZAÇÃO ---
    setRealVh();
    enableActiveStates();

    // --- EVENT LISTENERS ---
    // VisualViewport é a API moderna para mobile
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
    } else {
      // Fallback para browsers jurássicos
      window.addEventListener("resize", handleResize);
    }

    window.addEventListener("orientationchange", () => {
      setTimeout(setRealVh, 100);
    });

    // --- CLEANUP (Importante para não travar o navegador) ---
    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleResize);
      } else {
        window.removeEventListener("resize", handleResize);
      }
      document.body.classList.remove("keyboard-open");
    };
  }, []);

  return null;
}
