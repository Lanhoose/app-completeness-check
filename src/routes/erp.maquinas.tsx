import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ModuloHeader, Painel, Tabela } from "@/components/ModuloHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCollection, type Registro } from "@/lib/local-collection";

export const Route = createFileRoute("/erp/maquinas")({
  head: () => ({
    meta: [
      { title: "Gestão de Máquinas | GeTech" },
      {
        name: "description",
        content:
          "Cadastro de equipamentos industriais com modelo, número de série e última manutenção.",
      },
      { property: "og:title", content: "Gestão de Máquinas | GeTech" },
      { property: "og:description", content: "Inventário de equipamentos do ERP GeTech." },
    ],
  }),
  component: ErpMaquinas,
});

interface Maquina extends Registro {
  nome: string;
  modelo: string;
  serie: string;
  ultimaManutencao: string;
}

const VAZIO = { nome: "", modelo: "", serie: "", ultimaManutencao: "" };

function ErpMaquinas() {
  const { itens, add, remove } = useCollection<Maquina>("getech:maquinas", "Máquinas");
  const [form, setForm] = useState(VAZIO);
  const [filtro, setFiltro] = useState("");

  const cadastrar = (e: FormEvent) => {
    e.preventDefault();
    add({ ...form });
    toast.success("Equipamento cadastrado");
    setForm(VAZIO);
  };

  const lista = useMemo(() => {
    const termo = filtro.trim().toLowerCase();
    if (!termo) return itens;
    return itens.filter((m) =>
      [m.nome, m.modelo, m.serie].some((v) => v?.toLowerCase().includes(termo)),
    );
  }, [itens, filtro]);

  return (
    <>
      <ModuloHeader
        titulo="Gestão de Máquinas"
        descricao="Cadastro e consulta do inventário de equipamentos industriais."
      />

      <Painel>
        <h2 className="font-bold">Cadastrar equipamento</h2>
        <form onSubmit={cadastrar} className="mt-4 grid gap-3 sm:grid-cols-2">
          <Input
            placeholder="Nome do equipamento"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            required
          />
          <Input
            placeholder="Modelo"
            value={form.modelo}
            onChange={(e) => setForm({ ...form, modelo: e.target.value })}
            required
          />
          <Input
            placeholder="Número de série"
            value={form.serie}
            onChange={(e) => setForm({ ...form, serie: e.target.value })}
            required
          />
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground" htmlFor="ultima">
              Data da última manutenção
            </label>
            <Input
              id="ultima"
              type="date"
              value={form.ultimaManutencao}
              onChange={(e) => setForm({ ...form, ultimaManutencao: e.target.value })}
              required
            />
          </div>
          <Button type="submit" className="sm:col-span-2">
            Cadastrar equipamento
          </Button>
        </form>
      </Painel>

      <div className="mt-6">
        <h2 className="font-bold">Consultar inventário</h2>
        <Input
          className="mt-2 max-w-sm"
          placeholder="Filtrar por nome, modelo ou série"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      <Tabela
        colunas={["Equipamento", "Modelo", "Série", "Última manutenção", ""]}
        vazio={lista.length === 0}
      >
        {lista.map((m) => (
          <tr key={m.id} className="border-b border-border">
            <td className="p-2 font-bold">{m.nome}</td>
            <td className="p-2">{m.modelo}</td>
            <td className="p-2">{m.serie}</td>
            <td className="p-2">
              {m.ultimaManutencao
                ? new Date(`${m.ultimaManutencao}T00:00:00`).toLocaleDateString("pt-BR")
                : "—"}
            </td>
            <td className="p-2 text-right">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Excluir equipamento"
                onClick={() => remove(m.id)}
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
