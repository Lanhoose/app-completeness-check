import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ModuloHeader, Painel, Tabela } from "@/components/ModuloHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCollection, type Registro } from "@/lib/local-collection";

export const Route = createFileRoute("/erp/qualidade")({
  head: () => ({
    meta: [
      { title: "Controle de Qualidade | GeTech" },
      {
        name: "description",
        content: "Inspeções de qualidade, conformidade de lotes e reprovas da operação industrial.",
      },
      { property: "og:title", content: "Controle de Qualidade | GeTech" },
      { property: "og:description", content: "Módulo de qualidade do ERP GeTech." },
    ],
  }),
  component: ErpQualidade,
});

type Resultado = "Aprovado" | "Reprovado" | "Em análise";

interface Inspecao extends Registro {
  lote: string;
  item: string;
  inspetor: string;
  resultado: Resultado;
}

const PROXIMO: Record<Resultado, Resultado> = {
  "Em análise": "Aprovado",
  Aprovado: "Reprovado",
  Reprovado: "Em análise",
};

const COR: Record<Resultado, string> = {
  Aprovado: "bg-primary/10 text-primary",
  Reprovado: "bg-destructive/10 text-destructive",
  "Em análise": "bg-accent/10 text-accent",
};

function ErpQualidade() {
  const { itens, add, update, remove } = useCollection<Inspecao>("getech:qualidade", "Qualidade");
  const [form, setForm] = useState({ lote: "", item: "", inspetor: "" });

  const registrar = (e: FormEvent) => {
    e.preventDefault();
    add({ ...form, resultado: "Em análise" });
    toast.success("Inspeção registrada");
    setForm({ lote: "", item: "", inspetor: "" });
  };

  const aprovados = itens.filter((i) => i.resultado === "Aprovado").length;
  const taxa = itens.length ? Math.round((aprovados / itens.length) * 100) : 0;

  return (
    <>
      <ModuloHeader
        titulo="Controle de Qualidade"
        descricao="Inspeções, conformidade de lotes e índice de aprovação."
      />

      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <Painel>
          <p className="text-2xl font-bold">{itens.length}</p>
          <p className="text-sm text-muted-foreground">Inspeções registradas</p>
        </Painel>
        <Painel>
          <p className="text-2xl font-bold text-primary">{taxa}%</p>
          <p className="text-sm text-muted-foreground">Taxa de aprovação</p>
        </Painel>
        <Painel>
          <p className="text-2xl font-bold text-destructive">
            {itens.filter((i) => i.resultado === "Reprovado").length}
          </p>
          <p className="text-sm text-muted-foreground">Lotes reprovados</p>
        </Painel>
      </div>

      <Painel>
        <h2 className="font-bold">Nova inspeção</h2>
        <form onSubmit={registrar} className="mt-4 grid gap-3 sm:grid-cols-3">
          <Input
            placeholder="Lote"
            value={form.lote}
            onChange={(e) => setForm({ ...form, lote: e.target.value })}
            required
          />
          <Input
            placeholder="Item inspecionado"
            value={form.item}
            onChange={(e) => setForm({ ...form, item: e.target.value })}
            required
          />
          <Input
            placeholder="Inspetor"
            value={form.inspetor}
            onChange={(e) => setForm({ ...form, inspetor: e.target.value })}
            required
          />
          <Button type="submit" className="sm:col-span-3">
            Registrar inspeção
          </Button>
        </form>
      </Painel>

      <Tabela colunas={["Lote", "Item", "Inspetor", "Resultado", ""]} vazio={itens.length === 0}>
        {itens.map((i) => (
          <tr key={i.id} className="border-b border-border">
            <td className="p-2 font-bold">{i.lote}</td>
            <td className="p-2">{i.item}</td>
            <td className="p-2">{i.inspetor}</td>
            <td className="p-2">
              <button
                className={`rounded-full px-3 py-1 text-xs font-bold ${COR[i.resultado]}`}
                onClick={() => update(i.id, { resultado: PROXIMO[i.resultado] })}
              >
                {i.resultado}
              </button>
            </td>
            <td className="p-2 text-right">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Excluir inspeção"
                onClick={() => remove(i.id)}
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </td>
          </tr>
        ))}
      </Tabela>
    </>
  );
}
