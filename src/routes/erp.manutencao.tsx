import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ModuloHeader, Painel, Tabela } from "@/components/ModuloHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCollection, type Registro } from "@/lib/local-collection";

export const Route = createFileRoute("/erp/manutencao")({
  head: () => ({
    meta: [
      { title: "Manutenção Ativa | GeTech" },
      { name: "description", content: "Ordens de manutenção de máquinas e equipamentos." },
      { property: "og:title", content: "Manutenção Ativa | GeTech" },
      { property: "og:description", content: "Módulo de manutenção do ERP GeTech." },
    ],
  }),
  component: ErpManutencao,
});

type StatusOS = "Aberta" | "Em execução" | "Concluída";

interface OrdemManutencao extends Registro {
  maquina: string;
  setor: string;
  tipo: string;
  responsavel: string;
  status: StatusOS;
}

const PROXIMO: Record<StatusOS, StatusOS> = {
  Aberta: "Em execução",
  "Em execução": "Concluída",
  Concluída: "Aberta",
};

const COR: Record<StatusOS, string> = {
  Aberta: "bg-destructive/10 text-destructive",
  "Em execução": "bg-accent/10 text-accent",
  Concluída: "bg-primary/10 text-primary",
};

function ErpManutencao() {
  const { itens, add, update, remove } = useCollection<OrdemManutencao>(
    "getech:manutencao",
    "Manutenção",
  );
  const [form, setForm] = useState({
    maquina: "",
    setor: "",
    tipo: "Preventiva",
    responsavel: "",
  });

  const abrir = (e: FormEvent) => {
    e.preventDefault();
    add({ ...form, status: "Aberta" });
    toast.success("Ordem de manutenção aberta");
    setForm({ maquina: "", setor: "", tipo: "Preventiva", responsavel: "" });
  };

  return (
    <>
      <ModuloHeader
        titulo="Manutenção Ativa"
        descricao="Abra ordens de serviço e acompanhe o andamento por máquina."
      />
      <Painel>
        <form onSubmit={abrir} className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_1fr_auto]">
          <Input
            placeholder="Máquina / equipamento"
            value={form.maquina}
            onChange={(e) => setForm({ ...form, maquina: e.target.value })}
            required
          />
          <Input
            placeholder="Setor"
            value={form.setor}
            onChange={(e) => setForm({ ...form, setor: e.target.value })}
          />
          <select
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            aria-label="Tipo de manutenção"
          >
            <option>Preventiva</option>
            <option>Corretiva</option>
            <option>Preditiva</option>
          </select>
          <Input
            placeholder="Responsável"
            value={form.responsavel}
            onChange={(e) => setForm({ ...form, responsavel: e.target.value })}
          />
          <Button type="submit">Abrir OS</Button>
        </form>

        <Tabela
          colunas={["Máquina", "Setor", "Tipo", "Responsável", "Status", "Ação"]}
          vazio={itens.length === 0}
        >
          {itens.map((o) => (
            <tr key={o.id} className="border-b border-border">
              <td className="p-2 font-bold">{o.maquina}</td>
              <td className="p-2">{o.setor || "—"}</td>
              <td className="p-2">{o.tipo}</td>
              <td className="p-2">{o.responsavel || "—"}</td>
              <td className="p-2">
                <button
                  className={`rounded px-2 py-1 text-xs font-bold ${COR[o.status]}`}
                  onClick={() => {
                    const status = PROXIMO[o.status];
                    update(o.id, { status });
                    toast(`OS de ${o.maquina}: ${status}`);
                  }}
                >
                  {o.status}
                </button>
              </td>
              <td className="p-2">
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Excluir ordem"
                  onClick={() => {
                    remove(o.id);
                    toast("Ordem de manutenção removida");
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </td>
            </tr>
          ))}
        </Tabela>
      </Painel>
    </>
  );
}
