import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ModuloHeader, Painel, Tabela } from "@/components/ModuloHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCollection, type Registro } from "@/lib/local-collection";

export const Route = createFileRoute("/erp/rh")({
  head: () => ({
    meta: [
      { title: "RH & Ponto Digital | GeTech" },
      { name: "description", content: "Colaboradores e registro de jornada de trabalho." },
      { property: "og:title", content: "RH & Ponto Digital | GeTech" },
      { property: "og:description", content: "Módulo de recursos humanos do ERP GeTech." },
    ],
  }),
  component: ErpRh,
});

interface Colaborador extends Registro {
  nome: string;
  cargo: string;
  setor: string;
  entrada: string | null;
}

interface Ponto extends Registro {
  colaborador: string;
  tipo: "Entrada" | "Saída";
}

const hora = (iso: string) =>
  new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

function ErpRh() {
  const equipe = useCollection<Colaborador>("getech:colaboradores", "Colaboradores");
  const pontos = useCollection<Ponto>("getech:pontos", "Ponto");
  const [form, setForm] = useState({ nome: "", cargo: "", setor: "" });

  const cadastrar = (e: FormEvent) => {
    e.preventDefault();
    equipe.add({ ...form, entrada: null });
    toast.success("Colaborador cadastrado");
    setForm({ nome: "", cargo: "", setor: "" });
  };

  const baterPonto = (c: Colaborador) => {
    const tipo = c.entrada ? "Saída" : "Entrada";
    equipe.update(c.id, { entrada: c.entrada ? null : new Date().toISOString() });
    pontos.add({ colaborador: c.nome, tipo });
    toast.success(`${tipo} registrada para ${c.nome}`);
  };

  return (
    <>
      <ModuloHeader
        titulo="RH & Ponto Digital"
        descricao="Cadastre a equipe e registre entradas e saídas da jornada."
      />
      <div className="space-y-4">
      <Painel>
        <form onSubmit={cadastrar} className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_auto]">
          <Input
            placeholder="Nome do colaborador"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            required
          />
          <Input
            placeholder="Cargo"
            value={form.cargo}
            onChange={(e) => setForm({ ...form, cargo: e.target.value })}
          />
          <Input
            placeholder="Setor"
            value={form.setor}
            onChange={(e) => setForm({ ...form, setor: e.target.value })}
          />
          <Button type="submit">Cadastrar</Button>
        </form>

        <Tabela
          colunas={["Colaborador", "Cargo", "Setor", "Jornada", "Ponto", "Ação"]}
          vazio={equipe.itens.length === 0}
        >
          {equipe.itens.map((c) => (
            <tr key={c.id} className="border-b border-border">
              <td className="p-2 font-bold">{c.nome}</td>
              <td className="p-2">{c.cargo || "—"}</td>
              <td className="p-2">{c.setor || "—"}</td>
              <td className="p-2">
                {c.entrada ? (
                  <span className="text-xs font-bold text-primary">
                    Em turno desde {hora(c.entrada)}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">Fora de turno</span>
                )}
              </td>
              <td className="p-2">
                <Button size="sm" variant="outline" onClick={() => baterPonto(c)}>
                  {c.entrada ? "Registrar saída" : "Registrar entrada"}
                </Button>
              </td>
              <td className="p-2">
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Excluir colaborador"
                  onClick={() => {
                    equipe.remove(c.id);
                    toast("Colaborador removido");
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </td>
            </tr>
          ))}
        </Tabela>
      </Painel>

      <Painel>
        <h2 className="font-bold">Últimos registros de ponto</h2>
        {pontos.itens.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">Nenhum ponto registrado ainda.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {pontos.itens.slice(0, 10).map((p) => (
              <li key={p.id} className="flex justify-between border-b border-border pb-2">
                <span className="font-bold">{p.colaborador}</span>
                <span className="text-muted-foreground">
                  {p.tipo} · {hora(p.criadoEm)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Painel>
      </div>
    </>
  );
}
