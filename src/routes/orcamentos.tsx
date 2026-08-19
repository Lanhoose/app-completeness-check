import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Trash2 } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Guard } from "@/components/Guard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCollection, type Registro } from "@/lib/local-collection";

export const Route = createFileRoute("/orcamentos")({
  head: () => ({
    meta: [
      { title: "Gerador de Orçamento | GeTech" },
      { name: "description", content: "Monte orçamentos de serviços e peças industriais." },
      { property: "og:title", content: "Gerador de Orçamento | GeTech" },
      { property: "og:description", content: "Ferramenta interna de orçamentos da GeTech." },
    ],
  }),
  component: () => (
    <Guard perfil="gestor">
      <OrcamentosPage />
    </Guard>
  ),
});

interface ItemOrcamento extends Registro {
  desc: string;
  valor: number;
  qtd: number;
}

const brl = (v: number) => v.toLocaleString("pt-BR", { minimumFractionDigits: 2 });

function OrcamentosPage() {
  const { itens, add, remove, clear } = useCollection<ItemOrcamento>(
    "getech:orcamento",
    "Orçamento",
  );
  const [form, setForm] = useState({ desc: "", valor: "", qtd: "1" });

  const total = itens.reduce((s, i) => s + i.valor * i.qtd, 0);

  const adicionar = (e: FormEvent) => {
    e.preventDefault();
    add({ desc: form.desc, valor: Number(form.valor) || 0, qtd: Number(form.qtd) || 1 });
    setForm({ desc: "", valor: "", qtd: "1" });
  };

  return (
    <PageShell titulo="Gerador de Orçamento" descricao="Área restrita ao gestor.">
      <div className="rounded-lg border border-border bg-card p-6 shadow-card">
        <form onSubmit={adicionar} className="grid gap-3 sm:grid-cols-[2fr_1fr_80px_auto]">
          <Input
            placeholder="Descrição do Item"
            value={form.desc}
            onChange={(e) => setForm({ ...form, desc: e.target.value })}
            required
          />
          <Input
            type="number"
            step="0.01"
            placeholder="Preço (R$)"
            value={form.valor}
            onChange={(e) => setForm({ ...form, valor: e.target.value })}
            required
          />
          <Input
            type="number"
            min="1"
            value={form.qtd}
            onChange={(e) => setForm({ ...form, qtd: e.target.value })}
          />
          <Button type="submit">Adicionar</Button>
        </form>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="p-2">Item</th>
                <th className="p-2">Qtd</th>
                <th className="p-2">Unitário</th>
                <th className="p-2">Total</th>
                <th className="p-2 w-12">Ação</th>
              </tr>
            </thead>
            <tbody>
              {itens.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">
                    Nenhum item adicionado.
                  </td>
                </tr>
              )}
              {itens.map((i) => (
                <tr key={i.id} className="border-t border-border">
                  <td className="p-2">{i.desc}</td>
                  <td className="p-2">{i.qtd}</td>
                  <td className="p-2">R$ {brl(i.valor)}</td>
                  <td className="p-2">R$ {brl(i.valor * i.qtd)}</td>
                  <td className="p-2">
                    <Button variant="ghost" size="icon" onClick={() => remove(i.id)}>
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-right text-lg font-bold">Total: R$ {brl(total)}</div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="destructive" onClick={clear}>
            Limpar Tudo
          </Button>
          <Button variant="secondary" onClick={() => window.print()}>
            Gerar PDF / Imprimir
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
