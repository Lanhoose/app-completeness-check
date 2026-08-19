import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCollection, type Registro } from "@/lib/local-collection";

export const Route = createFileRoute("/depoimentos")({
  head: () => ({
    meta: [
      { title: "Depoimentos de Clientes | GeTech" },
      {
        name: "description",
        content:
          "Resultados reais de indústrias que usam o ERP GeTech na manutenção de máquinas pesadas.",
      },
      { property: "og:title", content: "Depoimentos de Clientes | GeTech" },
      { property: "og:description", content: "O que nossos clientes dizem sobre a GeTech." },
    ],
  }),
  component: DepoimentosPage,
});

interface Depoimento extends Registro {
  nome: string;
  cargo: string;
  nota: number;
  texto: string;
}

const FIXOS: Depoimento[] = [
  {
    id: "fixo-1",
    criadoEm: "",
    nome: "Ricardo Souza",
    cargo: "Gerente de Operações — Metalúrgica Norte",
    nota: 5,
    texto:
      "Reduzimos o tempo de parada de máquina em 22% logo no primeiro semestre. A precisão dos relatórios é impressionante.",
  },
  {
    id: "fixo-2",
    criadoEm: "",
    nome: "Ana Paula",
    cargo: "Diretora de Logística — Indústria Alimentícia",
    nota: 5,
    texto:
      "O suporte técnico é ágil e o sistema é intuitivo. O controle de inventário finalmente está batendo com o físico.",
  },
  {
    id: "fixo-3",
    criadoEm: "",
    nome: "Marcos Vinícius",
    cargo: "Engenheiro Chefe — TechParts Brasil",
    nota: 5,
    texto:
      "A integração com o chão de fábrica via sensores mudou nossa visão da produção em tempo real.",
  },
];

function DepoimentosPage() {
  const { itens, add } = useCollection<Depoimento>("getech:depoimentos", "Depoimentos");
  const [aberto, setAberto] = useState(false);
  const [form, setForm] = useState({ nome: "", cargo: "", nota: 5, texto: "" });

  const salvar = (e: FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim() || !form.texto.trim()) return;
    add({
      nome: form.nome.trim().slice(0, 80),
      cargo: form.cargo.trim().slice(0, 120),
      nota: form.nota,
      texto: form.texto.trim().slice(0, 600),
    });
    setForm({ nome: "", cargo: "", nota: 5, texto: "" });
    setAberto(false);
  };

  const lista = [...itens, ...FIXOS];

  return (
    <PageShell
      titulo="O que nossos clientes dizem"
      descricao="Resultados reais de quem vive a transformação industrial diariamente."
    >
      <Button onClick={() => setAberto((v) => !v)}>
        {aberto ? "Fechar formulário" : "Adicionar depoimento"}
      </Button>

      {aberto && (
        <form
          onSubmit={salvar}
          className="mt-4 space-y-3 rounded-lg border border-border bg-card p-5 shadow-card"
        >
          <h2 className="font-bold">Compartilhe sua experiência</h2>
          <Input
            aria-label="Seu nome"
            placeholder="Seu nome"
            maxLength={80}
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />
          <Input
            aria-label="Cargo e empresa"
            placeholder="Cargo e empresa"
            maxLength={120}
            value={form.cargo}
            onChange={(e) => setForm({ ...form, cargo: e.target.value })}
          />
          <label className="block text-sm font-medium" htmlFor="nota">
            Avaliação
          </label>
          <select
            id="nota"
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={form.nota}
            onChange={(e) => setForm({ ...form, nota: Number(e.target.value) })}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "estrela" : "estrelas"}
              </option>
            ))}
          </select>
          <Textarea
            aria-label="Seu depoimento"
            placeholder="Conte como a GeTech ajudou sua operação"
            maxLength={600}
            value={form.texto}
            onChange={(e) => setForm({ ...form, texto: e.target.value })}
          />
          <Button type="submit">Salvar depoimento</Button>
        </form>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {lista.map((d) => (
          <article key={d.id} className="rounded-lg border border-border bg-card p-5 shadow-card">
            <p className="text-accent" aria-label={`Nota ${d.nota} de 5`}>
              {"★".repeat(d.nota)}
              <span className="text-muted-foreground">{"★".repeat(5 - d.nota)}</span>
            </p>
            <p className="mt-3 text-sm text-card-foreground">“{d.texto}”</p>
            <p className="mt-4 text-sm font-bold">{d.nome}</p>
            <p className="text-xs text-muted-foreground">{d.cargo}</p>
          </article>
        ))}
      </div>
    </PageShell>
  );
}