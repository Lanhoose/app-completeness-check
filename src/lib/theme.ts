import { useCallback, useEffect, useState } from "react";

export type Tema = "light" | "dark";
const KEY = "theme";

export function aplicarTema(tema: Tema) {
  const root = document.documentElement;
  root.classList.toggle("dark", tema === "dark");
  root.setAttribute("data-theme", tema);
  localStorage.setItem(KEY, tema);
}

export function useTheme() {
  const [tema, setTema] = useState<Tema>("light");

  useEffect(() => {
    const salvo = (localStorage.getItem(KEY) as Tema | null) ?? "light";
    setTema(salvo);
    aplicarTema(salvo);
  }, []);

  const toggle = useCallback(() => {
    setTema((atual) => {
      const proximo: Tema = atual === "dark" ? "light" : "dark";
      aplicarTema(proximo);
      return proximo;
    });
  }, []);

  return { tema, toggle };
}
