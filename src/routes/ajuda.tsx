import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/ajuda")({
  head: () => ({
    meta: [
      { title: "Central de Ajuda | GeTech" },
      {
        name: "description",
        content:
          "Acesso e conta, pagamentos, pedidos e suporte direto: encontre respostas rápidas da GeTech.",
      },
      { property: "og:title", content: "Central de Ajuda | GeTech" },
      { property: "og:description", content: "Como podemos facilitar sua experiência hoje?" },
    ],
  }),
  component: AjudaPage,
});

const CATEGORIAS = [
  {
    icone: "🔑",
    titulo: "Acesso e Conta",
    texto: "Gerencie seu perfil e a segurança da conta.",
    to: "/configuracoes",
  },
  {
    icone: "💳",
    titulo: "Pagamentos",
    texto: "Planos, faturas e formas de contratação.",
    to: "/planos",
  },
  {
    icone: "📦",
    titulo: "Pedidos e Materiais",
    texto: "Status de solicitações e manuais das máquinas.",
    to: "/materiais",
  },
  {
    icone: "🎧",
    titulo: "Suporte Direto",
    texto: "Fale com nossa equipe técnica industrial.",
    to: "/contato",
  },
] as const;

function AjudaPage() {
  const [busca, setBusca] = useState("");
  const filtradas = CATEGORIAS.filter((c) =>
    `${c.titulo} ${c.texto}`.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <PageShell
      titulo="Central de Ajuda GeTech"
      descricao="Como podemos facilitar sua experiência hoje?"
    >
      <Input
        aria-label="Buscar na central de ajuda"
        placeholder="Buscar por assunto..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="max-w-md"
      />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filtradas.map((c) => (
          <Link
            key={c.titulo}
            to={c.to}
            className="rounded-lg border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-elevated"
          >
            <span className="text-3xl">{c.icone}</span>
            <h2 className="mt-2 font-bold">{c.titulo}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{c.texto}</p>
          </Link>
        ))}
        {filtradas.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhuma categoria encontrada.</p>
        )}
      </div>
    </PageShell>
  );
}