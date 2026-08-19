import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Guard } from "@/components/Guard";
import { useSessao } from "@/lib/session";
import { useCollection } from "@/lib/local-collection";
import { CHAMADOS_KEY, type Chamado } from "@/components/Chatbot";

export const Route = createFileRoute("/cliente")({
  head: () => ({
    meta: [
      { title: "Minha Área | GeTech" },
      { name: "description", content: "Acompanhe seus chamados abertos com a GeTech." },
      { property: "og:title", content: "Minha Área | GeTech" },
      { property: "og:description", content: "Área do cliente GeTech." },
    ],
  }),
  component: () => (
    <Guard>
      <ClientePage />
    </Guard>
  ),
});

function ClientePage() {
  const { sessao } = useSessao();
  const { itens } = useCollection<Chamado>(CHAMADOS_KEY, "Chamados");
  const meus = itens.filter((c) => c.email?.toLowerCase() === sessao?.email);

  return (
    <PageShell
      titulo={`Olá, ${sessao?.nome ?? ""}`}
      descricao="Área do cliente: acompanhe seus chamados e materiais técnicos."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to="/materiais"
          className="rounded-lg border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-elevated"
        >
          <h2 className="font-bold">Materiais e manuais</h2>
          <p className="text-sm text-muted-foreground">Baixe a documentação das máquinas.</p>
        </Link>
        <Link
          to="/contato"
          className="rounded-lg border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-elevated"
        >
          <h2 className="font-bold">Abrir novo chamado</h2>
          <p className="text-sm text-muted-foreground">Fale com o suporte técnico industrial.</p>
        </Link>
      </div>

      <h2 className="mt-8 text-lg font-bold">Meus chamados</h2>
      {meus.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">Você ainda não abriu chamados.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {meus.map((c) => (
            <li key={c.id} className="rounded-lg border border-border bg-card p-4 shadow-card">
              <p className="text-xs text-muted-foreground">
                {c.origem} · {new Date(c.criadoEm).toLocaleString("pt-BR")}
              </p>
              <p className="mt-1 text-sm">{c.problema}</p>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-8 rounded-md border border-border bg-muted/50 p-4 text-xs text-muted-foreground">
        Orçamentos, mensagens e o ERP são restritos ao perfil gestor.
      </p>
    </PageShell>
  );
}
