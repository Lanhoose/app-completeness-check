import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { ModuloHeader, Painel, Tabela } from "@/components/ModuloHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCollection, type Registro } from "@/lib/local-collection";

export const Route = createFileRoute("/erp/sistema")({
  head: () => ({
    meta: [
      { title: "S.I.U. Gestão de Manutenção | GeTech" },
      {
        name: "description",
        content: "Status de ativos, ordens de serviço, cadastros e histórico de intervenções.",
      },
      { property: "og:title", content: "S.I.U. Gestão de Manutenção | GeTech" },
      { property: "og:description", content: "Sistema de Inventário Unificado da GeTech." },
    ],
  }),
  component: ErpSistema,
});

interface Ativo extends Registro {
  codigo: string;
  nome: string;
  setor: string;
  situacao: "Operacional" | "Em Manutenção" | "Parada";
  freq: number;
}

interface Tecnico extends Registro {
  matricula: string;
  nome: string;
  especialidade: string;
}

interface Intervencao extends Registro {
  codigo: string;
  maquina: string;
  data: string;
  tipo: string;
  servico: string;
  tecnico: string;
}

const COR_SITUACAO: Record<Ativo["situacao"], string> = {
  Operacional: "bg-primary/10 text-primary",
  "Em Manutenção": "bg-accent/10 text-accent",
  Parada: "bg-destructive/10 text-destructive",
};

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}

function ErpSistema() {
  const ativos = useCollection<Ativo>("getech:siu-ativos", "Ativos S.I.U.");
  const tecnicos = useCollection<Tecnico>("getech:siu-tecnicos", "Técnicos S.I.U.");
  const historico = useCollection<Intervencao>("getech:siu-historico", "Histórico S.I.U.");

  const [os, setOs] = useState({ codigo: "", tipo: "Preventiva", tecnico: "" });
  const [formAtivo, setFormAtivo] = useState({ codigo: "", nome: "", setor: "", freq: "45" });
  const [formTec, setFormTec] = useState({ matricula: "", nome: "", especialidade: "" });
  const [filtro, setFiltro] = useState("");

  const criarOS = (e: FormEvent) => {
    e.preventDefault();
    const ativo = ativos.itens.find((a) => a.codigo === os.codigo);
    if (!ativo) {
      toast.error("Selecione um ativo válido.");
      return;
    }
    ativos.update(ativo.id, { situacao: "Em Manutenção" });
    historico.add({
      codigo: ativo.codigo,
      maquina: ativo.nome,
      data: new Date().toISOString().slice(0, 10),
      tipo: os.tipo,
      servico: "Nova O.S. aberta pelo painel",
      tecnico: os.tecnico || "Não atribuído",
    });
    toast.success(`O.S. despachada para o ativo ${ativo.nome}`);
  };

  const cadastrarAtivo = (e: FormEvent) => {
    e.preventDefault();
    ativos.add({
      codigo: formAtivo.codigo.toUpperCase(),
      nome: formAtivo.nome,
      setor: formAtivo.setor,
      situacao: "Operacional",
      freq: Number(formAtivo.freq) || 30,
    });
    toast.success("Ativo industrial cadastrado com sucesso!");
    setFormAtivo({ codigo: "", nome: "", setor: "", freq: "45" });
  };

  const cadastrarTecnico = (e: FormEvent) => {
    e.preventDefault();
    tecnicos.add(formTec);
    toast.success("Técnico cadastrado com sucesso!");
    setFormTec({ matricula: "", nome: "", especialidade: "" });
  };

  const termo = filtro.trim().toLowerCase();
  const historicoVisivel = historico.itens.filter(
    (h) => termo === "" || `${h.codigo} ${h.maquina}`.toLowerCase().includes(termo),
  );

  return (
    <>
      <ModuloHeader
        titulo="S.I.U. — Gestão de Manutenção"
        descricao="Sistema de Inventário Unificado: ativos, ordens de serviço, cadastros e histórico."
      />

      <Tabs defaultValue="status">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="status">Status Ativos</TabsTrigger>
          <TabsTrigger value="os">Ordens de Serviço</TabsTrigger>
          <TabsTrigger value="cadastros">Cadastros</TabsTrigger>
          <TabsTrigger value="historico">Histórico Global</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="mt-4">
          <Painel>
            <h2 className="text-lg font-bold">Status Operacional dos Ativos</h2>
            <Tabela
              colunas={["ID Ativo", "Equipamento", "Setor", "Condição", "Revisão (dias)"]}
              vazio={ativos.itens.length === 0}
            >
              {ativos.itens.map((a) => (
                <tr key={a.id} className="border-b border-border">
                  <td className="p-2 font-bold">{a.codigo}</td>
                  <td className="p-2">{a.nome}</td>
                  <td className="p-2">{a.setor}</td>
                  <td className="p-2">
                    <button
                      className={`rounded px-2 py-1 text-xs font-bold ${COR_SITUACAO[a.situacao]}`}
                      onClick={() =>
                        ativos.update(a.id, {
                          situacao:
                            a.situacao === "Operacional"
                              ? "Em Manutenção"
                              : a.situacao === "Em Manutenção"
                                ? "Parada"
                                : "Operacional",
                        })
                      }
                    >
                      {a.situacao}
                    </button>
                  </td>
                  <td className="p-2">{a.freq}</td>
                </tr>
              ))}
            </Tabela>
          </Painel>
        </TabsContent>

        <TabsContent value="os" className="mt-4">
          <Painel>
            <h2 className="text-lg font-bold">Abertura de Ordem de Serviço (O.S.)</h2>
            <p className="text-sm text-muted-foreground">
              Direcione requisições de reparo preventivo ou corretivo emergencial.
            </p>
            <form onSubmit={criarOS} className="mt-4 max-w-md space-y-3">
              <Campo label="Selecionar código do ativo">
                <select
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={os.codigo}
                  onChange={(e) => setOs({ ...os, codigo: e.target.value })}
                  required
                >
                  <option value="">Selecione…</option>
                  {ativos.itens.map((a) => (
                    <option key={a.id} value={a.codigo}>
                      {a.codigo} — {a.nome}
                    </option>
                  ))}
                </select>
              </Campo>
              <Campo label="Classificação da intervenção">
                <select
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={os.tipo}
                  onChange={(e) => setOs({ ...os, tipo: e.target.value })}
                >
                  <option value="Preventiva">Preventiva Programada</option>
                  <option value="Corretiva">Corretiva Emergencial</option>
                  <option value="Calibração">Calibração / Ajuste</option>
                </select>
              </Campo>
              <Campo label="Técnico operacional vinculado">
                <select
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={os.tecnico}
                  onChange={(e) => setOs({ ...os, tecnico: e.target.value })}
                >
                  <option value="">Não atribuído</option>
                  {tecnicos.itens.map((t) => (
                    <option key={t.id} value={t.nome}>
                      {t.nome} — {t.especialidade}
                    </option>
                  ))}
                </select>
              </Campo>
              <Button type="submit">Registrar e Ativar O.S.</Button>
            </form>
          </Painel>
        </TabsContent>

        <TabsContent value="cadastros" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Painel>
              <h3 className="font-bold">Novo Ativo Industrial</h3>
              <form onSubmit={cadastrarAtivo} className="mt-3 space-y-3">
                <Campo label="ID único">
                  <Input
                    value={formAtivo.codigo}
                    onChange={(e) => setFormAtivo({ ...formAtivo, codigo: e.target.value })}
                    placeholder="Ex: M004"
                    required
                  />
                </Campo>
                <Campo label="Nome da máquina">
                  <Input
                    value={formAtivo.nome}
                    onChange={(e) => setFormAtivo({ ...formAtivo, nome: e.target.value })}
                    placeholder="Ex: Torno CNC Hidráulico"
                    required
                  />
                </Campo>
                <Campo label="Setor industrial">
                  <Input
                    value={formAtivo.setor}
                    onChange={(e) => setFormAtivo({ ...formAtivo, setor: e.target.value })}
                    placeholder="Ex: Estamparia"
                    required
                  />
                </Campo>
                <Campo label="Ciclo de revisão (dias)">
                  <Input
                    type="number"
                    value={formAtivo.freq}
                    onChange={(e) => setFormAtivo({ ...formAtivo, freq: e.target.value })}
                  />
                </Campo>
                <Button type="submit">Cadastrar Equipamento</Button>
              </form>
            </Painel>

            <Painel>
              <h3 className="font-bold">Novo Técnico de Campo</h3>
              <form onSubmit={cadastrarTecnico} className="mt-3 space-y-3">
                <Campo label="Matrícula ID">
                  <Input
                    value={formTec.matricula}
                    onChange={(e) => setFormTec({ ...formTec, matricula: e.target.value })}
                    placeholder="Ex: T003"
                    required
                  />
                </Campo>
                <Campo label="Nome completo">
                  <Input
                    value={formTec.nome}
                    onChange={(e) => setFormTec({ ...formTec, nome: e.target.value })}
                    required
                  />
                </Campo>
                <Campo label="Especialidade">
                  <Input
                    value={formTec.especialidade}
                    onChange={(e) => setFormTec({ ...formTec, especialidade: e.target.value })}
                    placeholder="Ex: Eletromecânica"
                    required
                  />
                </Campo>
                <Button type="submit">Cadastrar Colaborador</Button>
              </form>
            </Painel>
          </div>
        </TabsContent>

        <TabsContent value="historico" className="mt-4">
          <Painel>
            <h2 className="text-lg font-bold">Histórico de Intervenções e Eventos</h2>
            <Input
              className="mt-3 max-w-sm"
              placeholder="Buscar por ID do ativo (Ex: M001)"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
            <Tabela
              colunas={["ID / Ativo", "Data", "Classificação", "Serviço executado", "Técnico"]}
              vazio={historicoVisivel.length === 0}
            >
              {historicoVisivel.map((h) => (
                <tr key={h.id} className="border-b border-border">
                  <td className="p-2 font-bold">
                    {h.codigo} — {h.maquina}
                  </td>
                  <td className="p-2">
                    {new Date(`${h.data}T12:00:00`).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="p-2">{h.tipo}</td>
                  <td className="p-2 text-muted-foreground">{h.servico}</td>
                  <td className="p-2">{h.tecnico}</td>
                </tr>
              ))}
            </Tabela>
          </Painel>
        </TabsContent>
      </Tabs>
    </>
  );
}
