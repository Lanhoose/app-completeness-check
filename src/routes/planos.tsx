import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/planos")({
  head: () => ({
    meta: [
      { title: "Planos de Gestão | GeTech" },
      {
        name: "description",
        content:
          "Essencial, Pro Performance e Enterprise: escolha a inteligência ideal para a vida útil do seu maquinário.",
      },
      { property: "og:title", content: "Planos de Gestão | GeTech" },
      {
        property: "og:description",
        content: "Planos de manutenção corretiva, preditiva com IoT e gestão de parque ilimitado.",
      },
    ],
  }),
  component: PlanosPage,
});

const PLANOS = [
  {
    nome: "Essencial",
    preco: "R$ 499",
    periodo: "/mês",
    destaque: false,
    acao: "Começar agora",
    itens: [
      "Manutenção corretiva agendada",
      "Relatórios mensais em PDF",
      "Suporte em até 24h",
      "Gestão de até 5 máquinas",
    ],
  },
  {
    nome: "Pro Performance",
    preco: "R$ 1.299",
    periodo: "/mês",
    destaque: true,
    acao: "Assinar Pro",
    itens: [
      "Manutenção preditiva com IoT",
      "Dashboard em tempo real",
      "Suporte prioritário em 4h",
      "Gestão de até 20 máquinas",
      "Análise de vibração inclusa",
    ],
  },
  {
    nome: "Enterprise",
    preco: "Sob consulta",
    periodo: "",
    destaque: false,
    acao: "Falar com consultor",
    itens: [
      "Gestão de parque industrial ilimitado",
      "Consultoria técnica dedicada",
      "Integração total via API",
      "Treinamento de equipe in loco",
    ],
  },
];

function PlanosPage() {
  return (
    <PageShell
      titulo="Planos de Gestão"
      descricao="Escolha a inteligência ideal para a vida útil do seu maquinário."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {PLANOS.map((p) => (
          <article
            key={p.nome}
            className={`relative flex flex-col rounded-lg border bg-card p-6 shadow-card ${
              p.destaque ? "border-primary shadow-elevated" : "border-border"
            }`}
          >
            {p.destaque && (
              <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                Mais popular
              </span>
            )}
            <h2 className="text-lg font-bold">{p.nome}</h2>
            <p className="mt-2 text-3xl font-bold text-primary">
              {p.preco}
              <span className="text-sm font-normal text-muted-foreground">{p.periodo}</span>
            </p>
            <ul className="mt-4 flex-1 space-y-2 text-sm text-muted-foreground">
              {p.itens.map((i) => (
                <li key={i}>✓ {i}</li>
              ))}
            </ul>
            <Button
              className="mt-6"
              variant={p.destaque ? "default" : "outline"}
              onClick={() => toast.success(`Plano selecionado: ${p.nome}`, {
                description: "Nossa equipe comercial entrará em contato para concluir a contratação.",
              })}
            >
              {p.acao}
            </Button>
          </article>
        ))}
      </div>
    </PageShell>
  );
}