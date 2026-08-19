import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ModuloHeader, Painel, Tabela } from "@/components/ModuloHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCollection, type Registro } from "@/lib/local-collection";

export const Route = createFileRoute("/erp/producao")({
  head: () => ({
    meta: [
      { title: "Linha de Produção | GeTech" },
      {
        name: "description",
        content: "Acompanhamento das linhas de produção, metas do turno e eficiência (OEE).",
      },
      { property: "og:title", content: "Linha de Produção | GeTech" },
      { property: "og:description", content: "Módulo de produção do ERP GeTech." },
    ],
  }),
  component: ErpProducao,
});

interface Linha extends Registro {
  linha: string;
  turno: string;
  meta: number;
  produzido: number;
}

function ErpProducao() {
  const { itens, add, update, remove } = useCollection<Linha>("getech:producao", "Produção");
  const [form, setForm] = useState({ linha: "", turno: "1º turno", meta: "", produzido: "" });

  const registrar = (e: FormEvent) => {
    e.preventDefault();
    add({
      linha: form.linha,
      turno: form.turno,
      meta: Number(form.meta) || 0,
      produzido: Number(form.produzido) || 0,
    });
    toast.success("Linha registrada");
    setForm({ linha: "", turno: "1º turno", meta: "", produzido: "" });
  };

  const metaTotal = itens.reduce((s, i) => s + i.meta, 0);
  const produzidoTotal = itens.reduce((s, i) => s + i.produzido, 0);
  const oee = metaTotal ? Math.round((produzidoTotal / metaTotal) * 100) : 0;

  return (
    <>
      <ModuloHeader
        titulo="Linha de Produção"
        descricao="Metas por turno, volume produzido e eficiência global dos equipamentos."
      />

      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <Painel>
          <p className="text-2xl font-bold">{itens.length}</p>
          <p className="text-sm text-muted-foreground">Linhas monitoradas</p>
        </Painel>
        <Painel>
          <p className="text-2xl font-bold">{produzidoTotal}</p>
          <p className="text-sm text-muted-foreground">Peças produzidas</p>
        </Painel>
        <Painel>
          <p className="text-2xl font-bold text-primary">{oee}%</p>
          <p className="text-sm text-muted-foreground">Eficiência (OEE)</p>
        </Painel>
      </div>

      <Painel>
        <h2 className="font-bold">Registrar apontamento</h2>
        <form onSubmit={registrar} className="mt-4 grid gap-3 sm:grid-cols-4">
          <Input
            placeholder="Linha / célula"
            value={form.linha}
            onChange={(e) => setForm({ ...form, linha: e.target.value })}
            required
          />
          <Input
            placeholder="Turno"
            value={form.turno}
            onChange={(e) => setForm({ ...form, turno: e.target.value })}
            required
          />
          <Input
            type="number"
            min="0"
            placeholder="Meta"
            value={form.meta}
            onChange={(e) => setForm({ ...form, meta: e.target.value })}
            required
          />
          <Input
            type="number"
            min="0"
            placeholder="Produzido"
            value={form.produzido}
            onChange={(e) => setForm({ ...form, produzido: e.target.value })}
            required
          />
          <Button type="submit" className="sm:col-span-4">
            Salvar apontamento
          </Button>
        </form>
      </Painel>

      <Tabela
        colunas={["Linha", "Turno", "Meta", "Produzido", "Atingimento", ""]}
        vazio={itens.length === 0}
      >
        {itens.map((l) => {
          const pct = l.meta ? Math.round((l.produzido / l.meta) * 100) : 0;
          return (
            <tr key={l.id} className="border-b border-border">
              <td className="p-2 font-bold">{l.linha}</td>
              <td className="p-2">{l.turno}</td>
              <td className="p-2">{l.meta}</td>
              <td className="p-2">
                <button
                  className="rounded-md bg-muted px-2 py-1 text-xs font-bold"
                  onClick={() => update(l.id, { produzido: l.produzido + 1 })}
                >
                  {l.produzido} +1
                </button>
              </td>
              <td className="p-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    pct >= 100 ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                  }`}
                >
                  {pct}%
                </span>
              </td>
              <td className="p-2 text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Excluir linha"
                  onClick={() => remove(l.id)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </td>
            </tr>
          );
        })}
      </Tabela>
    </>
  );
}
