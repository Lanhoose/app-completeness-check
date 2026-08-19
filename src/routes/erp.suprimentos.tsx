import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ModuloHeader, Painel, Tabela } from "@/components/ModuloHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCollection, type Registro } from "@/lib/local-collection";

export const Route = createFileRoute("/erp/suprimentos")({
  head: () => ({
    meta: [
      { title: "Suprimentos | GeTech" },
      {
        name: "description",
        content: "Requisições de compra, fornecedores e acompanhamento da cadeia de suprimentos.",
      },
      { property: "og:title", content: "Suprimentos | GeTech" },
      { property: "og:description", content: "Módulo de suprimentos do ERP GeTech." },
    ],
  }),
  component: ErpSuprimentos,
});

type StatusCompra = "Solicitado" | "Cotação" | "Aprovado" | "Recebido";

interface Requisicao extends Registro {
  item: string;
  fornecedor: string;
  quantidade: string;
  status: StatusCompra;
}

const FLUXO: StatusCompra[] = ["Solicitado", "Cotação", "Aprovado", "Recebido"];

const COR: Record<StatusCompra, string> = {
  Solicitado: "bg-muted text-muted-foreground",
  Cotação: "bg-accent/10 text-accent",
  Aprovado: "bg-primary/10 text-primary",
  Recebido: "bg-primary/20 text-primary",
};

function ErpSuprimentos() {
  const { itens, add, update, remove } = useCollection<Requisicao>(
    "getech:suprimentos",
    "Suprimentos",
  );
  const [form, setForm] = useState({ item: "", fornecedor: "", quantidade: "" });

  const solicitar = (e: FormEvent) => {
    e.preventDefault();
    add({ ...form, status: "Solicitado" });
    toast.success("Requisição registrada");
    setForm({ item: "", fornecedor: "", quantidade: "" });
  };

  const avancar = (r: Requisicao) => {
    const proximo = FLUXO[(FLUXO.indexOf(r.status) + 1) % FLUXO.length] ?? "Solicitado";
    update(r.id, { status: proximo });
  };

  return (
    <>
      <ModuloHeader
        titulo="Suprimentos"
        descricao="Requisições de compra e rastreio de fornecedores da operação."
      />

      <Painel>
        <h2 className="font-bold">Nova requisição</h2>
        <form onSubmit={solicitar} className="mt-4 grid gap-3 sm:grid-cols-3">
          <Input
            placeholder="Item / peça"
            value={form.item}
            onChange={(e) => setForm({ ...form, item: e.target.value })}
            required
          />
          <Input
            placeholder="Fornecedor"
            value={form.fornecedor}
            onChange={(e) => setForm({ ...form, fornecedor: e.target.value })}
            required
          />
          <Input
            placeholder="Quantidade"
            value={form.quantidade}
            onChange={(e) => setForm({ ...form, quantidade: e.target.value })}
            required
          />
          <Button type="submit" className="sm:col-span-3">
            Solicitar compra
          </Button>
        </form>
      </Painel>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FLUXO.map((etapa) => {
          const lista = itens.filter((i) => i.status === etapa);
          return (
            <div key={etapa} className="rounded-lg border border-border bg-card p-4 shadow-card">
              <h3 className="text-sm font-bold">
                {etapa} <span className="text-muted-foreground">({lista.length})</span>
              </h3>
              <ul className="mt-3 space-y-2">
                {lista.length === 0 && (
                  <li className="text-xs text-muted-foreground">Sem requisições.</li>
                )}
                {lista.map((r) => (
                  <li key={r.id} className="rounded-md bg-muted/60 p-3">
                    <p className="text-sm font-bold">{r.item}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.fornecedor} · {r.quantidade}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <Tabela
        colunas={["Item", "Fornecedor", "Qtd.", "Status", ""]}
        vazio={itens.length === 0}
      >
        {itens.map((r) => (
          <tr key={r.id} className="border-b border-border">
            <td className="p-2 font-bold">{r.item}</td>
            <td className="p-2">{r.fornecedor}</td>
            <td className="p-2">{r.quantidade}</td>
            <td className="p-2">
              <button
                className={`rounded-full px-3 py-1 text-xs font-bold ${COR[r.status]}`}
                onClick={() => avancar(r)}
              >
                {r.status}
              </button>
            </td>
            <td className="p-2 text-right">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Excluir requisição"
                onClick={() => remove(r.id)}
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
