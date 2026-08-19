import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ModuloHeader, Painel, Tabela } from "@/components/ModuloHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCollection, type Registro } from "@/lib/local-collection";

export const Route = createFileRoute("/erp/estoque")({
  head: () => ({
    meta: [
      { title: "Gestão de Inventário | GeTech" },
      { name: "description", content: "Controle de entrada e saída de materiais industriais." },
      { property: "og:title", content: "Gestão de Inventário | GeTech" },
      { property: "og:description", content: "Módulo de estoque do ERP GeTech." },
    ],
  }),
  component: ErpEstoque,
});

interface ItemEstoque extends Registro {
  nome: string;
  codigo: string;
  qtd: number;
  minimo: number;
  local: string;
}

function ErpEstoque() {
  const { itens, add, update, remove } = useCollection<ItemEstoque>("getech:estoque", "Estoque");
  const [form, setForm] = useState({ nome: "", codigo: "", qtd: "0", minimo: "5", local: "" });

  const salvar = (e: FormEvent) => {
    e.preventDefault();
    add({
      nome: form.nome,
      codigo: form.codigo,
      qtd: Number(form.qtd) || 0,
      minimo: Number(form.minimo) || 0,
      local: form.local,
    });
    toast.success("Material cadastrado no inventário");
    setForm({ nome: "", codigo: "", qtd: "0", minimo: "5", local: "" });
  };

  const movimentar = (item: ItemEstoque, delta: number) => {
    const qtd = Math.max(0, item.qtd + delta);
    update(item.id, { qtd });
    toast(delta > 0 ? "Entrada registrada" : "Saída registrada", {
      description: `${item.nome} — saldo atual ${qtd}`,
    });
  };

  const critico = itens.filter((i) => i.qtd <= i.minimo).length;

  return (
    <>
      <ModuloHeader
        titulo="Gestão de Inventário"
        descricao="Cadastre materiais e registre entradas e saídas do almoxarifado."
      />
      <Painel>
        <form onSubmit={salvar} className="grid gap-3 sm:grid-cols-[2fr_1fr_90px_90px_1fr_auto]">
          <Input
            placeholder="Material"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            required
          />
          <Input
            placeholder="Código"
            value={form.codigo}
            onChange={(e) => setForm({ ...form, codigo: e.target.value })}
            required
          />
          <Input
            type="number"
            min="0"
            placeholder="Qtd"
            value={form.qtd}
            onChange={(e) => setForm({ ...form, qtd: e.target.value })}
          />
          <Input
            type="number"
            min="0"
            placeholder="Mín."
            value={form.minimo}
            onChange={(e) => setForm({ ...form, minimo: e.target.value })}
          />
          <Input
            placeholder="Localização"
            value={form.local}
            onChange={(e) => setForm({ ...form, local: e.target.value })}
          />
          <Button type="submit">Cadastrar</Button>
        </form>

        <Tabela
          colunas={["Material", "Código", "Local", "Saldo", "Movimentar", "Status", "Ação"]}
          vazio={itens.length === 0}
        >
          {itens.map((i) => (
            <tr key={i.id} className="border-b border-border">
              <td className="p-2 font-bold">{i.nome}</td>
              <td className="p-2">{i.codigo}</td>
              <td className="p-2">{i.local || "—"}</td>
              <td className="p-2">{i.qtd}</td>
              <td className="p-2">
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => movimentar(i, 1)}>
                    +
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => movimentar(i, -1)}>
                    −
                  </Button>
                </div>
              </td>
              <td className="p-2">
                {i.qtd <= i.minimo ? (
                  <span className="rounded bg-destructive/10 px-2 py-1 text-xs font-bold text-destructive">
                    Repor
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">Normal</span>
                )}
              </td>
              <td className="p-2">
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Excluir material"
                  onClick={() => {
                    remove(i.id);
                    toast("Material removido do inventário");
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </td>
            </tr>
          ))}
        </Tabela>

        <p className="mt-4 text-sm text-muted-foreground">
          {itens.length} itens cadastrados · {critico} abaixo do estoque mínimo
        </p>
      </Painel>
    </>
  );
}
