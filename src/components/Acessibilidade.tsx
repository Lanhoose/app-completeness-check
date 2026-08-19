import { useEffect, useState } from "react";
import { Accessibility, Minus, Plus, Contrast, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const FONTE_KEY = "getech:fonte";
const CONTRASTE_KEY = "getech:contraste";

export function Acessibilidade() {
  const [aberto, setAberto] = useState(false);
  const [escala, setEscala] = useState(100);
  const [contraste, setContraste] = useState(false);

  useEffect(() => {
    const e = Number(localStorage.getItem(FONTE_KEY) ?? 100);
    const c = localStorage.getItem(CONTRASTE_KEY) === "1";
    setEscala(Number.isFinite(e) ? e : 100);
    setContraste(c);
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = `${escala}%`;
    localStorage.setItem(FONTE_KEY, String(escala));
  }, [escala]);

  useEffect(() => {
    document.documentElement.classList.toggle("alto-contraste", contraste);
    localStorage.setItem(CONTRASTE_KEY, contraste ? "1" : "0");
  }, [contraste]);

  // VLibras — mesmo plugin oficial usado no site GeTech.
  useEffect(() => {
    if (document.getElementById("vlibras-script")) return;
    const wrapper = document.createElement("div");
    wrapper.setAttribute("vw", "");
    wrapper.className = "enabled";
    wrapper.innerHTML =
      '<div vw-access-button class="active"></div><div vw-plugin-wrapper><div class="vw-plugin-top-wrapper"></div></div>';
    document.body.appendChild(wrapper);

    const script = document.createElement("script");
    script.id = "vlibras-script";
    script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    script.async = true;
    script.onload = () => {
      const w = window as unknown as { VLibras?: { Widget: new (url: string) => unknown } };
      if (w.VLibras) new w.VLibras.Widget("https://vlibras.gov.br/app");
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col items-start gap-2 print:hidden">
      {aberto && (
        <div
          className="w-56 rounded-lg border border-border bg-card p-3 shadow-elevated"
          role="group"
          aria-label="Opções de acessibilidade"
        >
          <p className="text-sm font-bold text-card-foreground">Acessibilidade</p>
          <p className="mt-1 text-xs text-muted-foreground">Tamanho do texto: {escala}%</p>
          <div className="mt-2 flex gap-2">
            <Button
              size="icon"
              variant="outline"
              className="min-h-11 min-w-11"
              aria-label="Diminuir tamanho do texto"
              onClick={() => setEscala((v) => Math.max(85, v - 10))}
            >
              <Minus className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="min-h-11 min-w-11"
              aria-label="Aumentar tamanho do texto"
              onClick={() => setEscala((v) => Math.min(150, v + 10))}
            >
              <Plus className="size-4" />
            </Button>
            <Button
              size="icon"
              variant={contraste ? "default" : "outline"}
              className="min-h-11 min-w-11"
              aria-pressed={contraste}
              aria-label="Alternar alto contraste"
              onClick={() => setContraste((v) => !v)}
            >
              <Contrast className="size-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            className="mt-2 w-full justify-start text-xs"
            onClick={() => {
              setEscala(100);
              setContraste(false);
            }}
          >
            <RotateCcw className="mr-2 size-3" />
            Restaurar padrão
          </Button>
        </div>
      )}
      <Button
        size="icon"
        className="min-h-12 min-w-12 rounded-full shadow-elevated"
        aria-expanded={aberto}
        aria-label="Opções de acessibilidade"
        onClick={() => setAberto((v) => !v)}
      >
        <Accessibility className="size-6" />
      </Button>
    </div>
  );
}