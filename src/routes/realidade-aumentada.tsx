import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/realidade-aumentada")({
  head: () => ({
    meta: [
      { title: "Visualização 3D e Realidade Aumentada | GeTech" },
      {
        name: "description",
        content:
          "Explore componentes industriais em 3D e projete equipamentos no seu chão de fábrica com realidade aumentada.",
      },
      { property: "og:title", content: "Visualização 3D e Realidade Aumentada | GeTech" },
      {
        property: "og:description",
        content: "Treinamento e inspeção de máquinas pesadas em 3D interativo.",
      },
    ],
  }),
  component: ArPage,
});

const PECAS = [
  {
    id: "cilindro",
    nome: "Cilindro Hidráulico",
    detalhe: "Haste cromada, vedações e camisa. Verifique vazamento externo e riscos na haste.",
    cor: "from-sky-500 to-sky-700",
  },
  {
    id: "rolamento",
    nome: "Rolamento de Esferas",
    detalhe: "Pista interna, gaiola e esferas. Ruído agudo indica falha de lubrificação.",
    cor: "from-amber-500 to-amber-700",
  },
  {
    id: "motor",
    nome: "Motor Elétrico Trifásico",
    detalhe: "Carcaça, estator e ventoinha. Monitore temperatura e vibração do mancal.",
    cor: "from-emerald-500 to-emerald-700",
  },
] as const;

function ArPage() {
  const [pecaId, setPecaId] = useState<string>(PECAS[0].id);
  const [rotX, setRotX] = useState(-18);
  const [rotY, setRotY] = useState(28);
  const [zoom, setZoom] = useState(1);

  const peca = PECAS.find((p) => p.id === pecaId) ?? PECAS[0];
  const faces = [
    "translateZ(90px)",
    "rotateY(180deg) translateZ(90px)",
    "rotateY(90deg) translateZ(90px)",
    "rotateY(-90deg) translateZ(90px)",
    "rotateX(90deg) translateZ(90px)",
    "rotateX(-90deg) translateZ(90px)",
  ];

  return (
    <PageShell
      titulo="Visualização 3D e Realidade Aumentada"
      descricao="Inspecione componentes industriais em 3D interativo antes de ir a campo."
    >
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div
          className="flex h-[380px] items-center justify-center overflow-hidden rounded-lg border border-border bg-muted"
          style={{ perspective: "900px" }}
        >
          <div
            className="relative size-[180px] transition-transform duration-200"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${zoom})`,
            }}
            aria-label={`Modelo 3D: ${peca.nome}`}
            role="img"
          >
            {faces.map((t) => (
              <div
                key={t}
                className={`absolute inset-0 flex items-center justify-center border border-white/30 bg-gradient-to-br ${peca.cor} text-center text-xs font-bold text-white opacity-90`}
                style={{ transform: t }}
              >
                {peca.nome}
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-4 rounded-lg border border-border bg-card p-5 shadow-card">
          <div>
            <label className="block text-sm font-medium" htmlFor="peca">
              Componente
            </label>
            <select
              id="peca"
              className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={pecaId}
              onChange={(e) => setPecaId(e.target.value)}
            >
              {PECAS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="rot-y">
              Rotação horizontal
            </label>
            <input
              id="rot-y"
              type="range"
              min={-180}
              max={180}
              value={rotY}
              onChange={(e) => setRotY(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="rot-x">
              Rotação vertical
            </label>
            <input
              id="rot-x"
              type="range"
              min={-90}
              max={90}
              value={rotX}
              onChange={(e) => setRotX(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="zoom">
              Zoom
            </label>
            <input
              id="zoom"
              type="range"
              min={0.6}
              max={1.8}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setRotX(-18);
              setRotY(28);
              setZoom(1);
            }}
          >
            Redefinir visualização
          </Button>

          <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">{peca.detalhe}</p>
        </aside>
      </div>

      <section className="mt-6 rounded-lg border border-border bg-card p-5 shadow-card">
        <h2 className="font-bold">Como usar em campo</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Gire o componente para localizar pontos de inspeção antes da parada de máquina.</li>
          <li>Use o modelo em treinamentos rápidos com a equipe de manutenção.</li>
          <li>Registre o que encontrar diretamente em uma ordem de serviço no ERP.</li>
        </ul>
      </section>
    </PageShell>
  );
}