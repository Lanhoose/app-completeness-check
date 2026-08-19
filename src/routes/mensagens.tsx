import { createFileRoute } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Guard } from "@/components/Guard";
import { Button } from "@/components/ui/button";
import { useCollection } from "@/lib/local-collection";
import { CHAMADOS_KEY, type Chamado } from "@/components/Chatbot";

export const Route = createFileRoute("/mensagens")({
  head: () => ({
    meta: [
      { title: "Caixa de Mensagens | GeTech" },
      { name: "description", content: "Chamados recebidos pelo chatbot e pelo formulário de contato." },
      { property: "og:title", content: "Caixa de Mensagens | GeTech" },
      { property: "og:description", content: "Chamados recebidos pela GeTech." },
    ],
  }),
  component: () => (
    <Guard perfil="gestor">
      <MensagensPage />
    </Guard>
  ),
});

function MensagensPage() {
  const { itens, remove, clear } = useCollection<Chamado>(CHAMADOS_KEY, "Chamados");

  return (
    <PageShell titulo="Caixa de Mensagens Recebidas" descricao="Área restrita ao gestor.">
      <div className="mb-4 flex justify-end">
        <Button variant="destructive" onClick={clear} disabled={itens.length === 0}>
          Limpar Caixa
        </Button>
      </div>

      {itens.length === 0 ? (
        <p className="rounded-lg border border-border bg-card p-6 text-center text-muted-foreground shadow-card">
          Nenhuma mensagem recebida.
        </p>
      ) : (
        <ul className="space-y-3">
          {itens.map((m) => (
            <li key={m.id} className="rounded-lg border border-border bg-card p-4 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-bold">{m.nome}</h2>
                  <p className="text-xs text-muted-foreground">
                    {m.email} · {m.origem} ·{" "}
                    {new Date(m.criadoEm).toLocaleString("pt-BR")}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => remove(m.id)}>
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
              <p className="mt-2 text-sm">{m.problema}</p>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
