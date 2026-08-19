import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ModuloHeader, Painel, Tabela } from "@/components/ModuloHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCollection, type Registro } from "@/lib/local-collection";
import { baixarCSV, buscarCEP } from "@/lib/exportar";

export const Route = createFileRoute("/erp/pedidos")({
  head: () => ({
    meta: [
      { title: "Ordens de Serviço | GeTech" },
      { name: "description", content: "Kanban, recebimento, rastreio e frete das ordens de produção." },
      { property: "og:title", content: "Ordens de Serviço | GeTech" },
      { property: "og:description", content: "Módulo de pedidos do ERP GeTech." },
    ],
  }),
  component: ErpPedidos,
});

const STATUS = ["A Fazer", "Em Andamento", "Qualidade", "Finalizado"] as const;
type StatusPedido = (typeof STATUS)[number];

const PERFIS = {
  PCP: "Acesso: PCP (cadastro e edição completa)",
  Producao: "Acesso: Produção (avanço de etapas)",
  Gestao: "Acesso: Gestão (visão total e relatórios)",
  Entregador: "Acesso: Entregador (somente entregas)",
} as const;
type PerfilOp = keyof typeof PERFIS;

interface Pedido extends Registro {
  op: string;
  cliente: string;
  produto: string;
  qtd: number;
  responsavel: string;
  cep: string;
  rua: string;
  numeroCasa: string;
  bairro: string;
  cidade: string;
  status: StatusPedido;
  prioridade: "Normal" | "Urgente";
  prazo: string;
  descricao: string;
}

const COR: Record<StatusPedido, string> = {
  "A Fazer": "bg-primary/10 text-primary",
  "Em Andamento": "bg-accent/10 text-accent",
  Qualidade: "bg-destructive/10 text-destructive",
  Finalizado: "bg-muted text-muted-foreground",
};

const FORM_VAZIO = {
  op: "",
  cliente: "",
  produto: "",
  qtd: "1",
  responsavel: "",
  cep: "",
  rua: "",
  numeroCasa: "",
  bairro: "",
  cidade: "",
  status: "A Fazer" as StatusPedido,
  prioridade: "Normal" as Pedido["prioridade"],
  prazo: "",
  descricao: "",
};

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}

function ErpPedidos() {
  const { itens, add, update, remove } = useCollection<Pedido>("getech:pedidos", "Pedidos");
  const [perfil, setPerfil] = useState<PerfilOp>("PCP");
  const [form, setForm] = useState(FORM_VAZIO);
  const [pesquisa, setPesquisa] = useState("");
  const [rastreio, setRastreio] = useState("");
  const [achado, setAchado] = useState<Pedido | null | undefined>(undefined);
  const [frete, setFrete] = useState({ peso: "", distancia: "", tipo: "1" });
  const [valorFrete, setValorFrete] = useState(0);

  const podeCadastrar = perfil === "PCP" || perfil === "Gestao";
  const termo = pesquisa.trim().toLowerCase();

  const filtrados = useMemo(
    () =>
      itens.filter(
        (p) =>
          termo === "" ||
          `${p.op} ${p.cliente} ${p.produto}`.toLowerCase().includes(termo),
      ),
    [itens, termo],
  );

  const stats = {
    afazer: itens.filter((p) => p.status === "A Fazer").length,
    producao: itens.filter((p) => p.status === "Em Andamento").length,
    pronto: itens.filter((p) => p.status === "Finalizado").length,
  };

  const salvarOrdem = (e: FormEvent) => {
    e.preventDefault();
    add({
      ...form,
      qtd: Number(form.qtd) || 1,
    });
    toast.success(`Ordem ${form.op || "sem número"} registrada`);
    setForm(FORM_VAZIO);
  };

  const preencherCEP = async (cep: string) => {
    setForm((f) => ({ ...f, cep }));
    const dados = await buscarCEP(cep);
    if (dados) setForm((f) => ({ ...f, ...dados }));
  };

  const avancar = (p: Pedido) => {
    const proximo = STATUS[(STATUS.indexOf(p.status) + 1) % STATUS.length]!;
    update(p.id, { status: proximo });
    toast(`OP ${p.op || p.cliente}: ${proximo}`);
  };

  const exportar = () =>
    baixarCSV(
      "ordens-producao",
      ["OP", "Cliente", "Produto", "Qtd", "Bairro", "Cidade", "Status", "Prioridade", "Prazo"],
      itens.map((p) => [
        p.op,
        p.cliente,
        p.produto,
        p.qtd,
        p.bairro,
        p.cidade,
        p.status,
        p.prioridade,
        p.prazo,
      ]),
    );

  const calcularFrete = () => {
    const peso = Number(frete.peso) || 0;
    const km = Number(frete.distancia) || 0;
    const multiplicador = Number(frete.tipo) || 1;
    setValorFrete((peso * 0.75 + km * 2.4 + 35) * multiplicador);
  };

  return (
    <>
      <ModuloHeader
        titulo="Ordens de Serviço"
        descricao="Controle completo de ordens industriais: kanban, recebimento, rastreio e frete."
      />

      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm shadow-card">
        <strong>Perfil:</strong>
        <select
          className="rounded-md border border-input bg-background px-2 py-1"
          value={perfil}
          onChange={(e) => setPerfil(e.target.value as PerfilOp)}
          aria-label="Perfil de acesso"
        >
          {Object.keys(PERFIS).map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <span className="text-xs text-muted-foreground">{PERFIS[perfil]}</span>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Input
          className="max-w-sm"
          placeholder="Pesquisar por OP, cliente ou produto..."
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
        />
        <div className="flex gap-4 text-xs font-bold">
          <span className="text-primary">A Fazer: {stats.afazer}</span>
          <span className="text-accent">Produção: {stats.producao}</span>
          <span className="text-muted-foreground">Pronto: {stats.pronto}</span>
        </div>
      </div>

      <Tabs defaultValue="kanban">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="cadastro">Recebimento</TabsTrigger>
          <TabsTrigger value="rastreio">Rastreio</TabsTrigger>
          <TabsTrigger value="frete">Frete</TabsTrigger>
          <TabsTrigger value="tabela">Tabela</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STATUS.map((coluna) => (
              <div key={coluna} className="rounded-lg border border-border bg-card p-3 shadow-card">
                <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  {coluna}
                </h2>
                <div className="space-y-2">
                  {filtrados
                    .filter((p) => p.status === coluna)
                    .map((p) => (
                      <button
                        key={p.id}
                        onClick={() => avancar(p)}
                        disabled={perfil === "Entregador"}
                        className="w-full rounded-md border border-border bg-background p-3 text-left text-sm transition-shadow hover:shadow-elevated disabled:opacity-60"
                      >
                        <span className="font-bold">{p.op || "OP —"}</span>
                        <p className="text-xs text-muted-foreground">{p.cliente}</p>
                        <p className="text-xs">{p.produto}</p>
                        {p.prioridade === "Urgente" && (
                          <span className="mt-1 inline-block rounded bg-destructive/10 px-2 py-0.5 text-[10px] font-bold text-destructive">
                            URGENTE
                          </span>
                        )}
                      </button>
                    ))}
                  {filtrados.filter((p) => p.status === coluna).length === 0 && (
                    <p className="py-4 text-center text-xs text-muted-foreground">Vazio</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cadastro" className="mt-4">
          <Painel>
            {!podeCadastrar ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                O perfil {perfil} não tem permissão para cadastrar ordens.
              </p>
            ) : (
              <form onSubmit={salvarOrdem} className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <Campo label="Nº OP *">
                    <Input
                      value={form.op}
                      onChange={(e) => setForm({ ...form, op: e.target.value })}
                      placeholder="Ex: OP-001"
                      required
                    />
                  </Campo>
                  <Campo label="Cliente *">
                    <Input
                      value={form.cliente}
                      onChange={(e) => setForm({ ...form, cliente: e.target.value })}
                      required
                    />
                  </Campo>
                  <Campo label="Produto *">
                    <Input
                      value={form.produto}
                      onChange={(e) => setForm({ ...form, produto: e.target.value })}
                      required
                    />
                  </Campo>
                  <Campo label="Quantidade *">
                    <Input
                      type="number"
                      min="1"
                      value={form.qtd}
                      onChange={(e) => setForm({ ...form, qtd: e.target.value })}
                      required
                    />
                  </Campo>
                  <Campo label="Responsável">
                    <Input
                      value={form.responsavel}
                      onChange={(e) => setForm({ ...form, responsavel: e.target.value })}
                    />
                  </Campo>
                  <Campo label="CEP">
                    <Input
                      value={form.cep}
                      onChange={(e) => void preencherCEP(e.target.value)}
                      placeholder="00000-000"
                    />
                  </Campo>
                  <Campo label="Rua">
                    <Input
                      value={form.rua}
                      onChange={(e) => setForm({ ...form, rua: e.target.value })}
                    />
                  </Campo>
                  <Campo label="Nº Casa">
                    <Input
                      value={form.numeroCasa}
                      onChange={(e) => setForm({ ...form, numeroCasa: e.target.value })}
                    />
                  </Campo>
                  <Campo label="Bairro">
                    <Input
                      value={form.bairro}
                      onChange={(e) => setForm({ ...form, bairro: e.target.value })}
                    />
                  </Campo>
                  <Campo label="Cidade">
                    <Input
                      value={form.cidade}
                      onChange={(e) => setForm({ ...form, cidade: e.target.value })}
                    />
                  </Campo>
                  <Campo label="Status">
                    <select
                      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                      value={form.status}
                      onChange={(e) =>
                        setForm({ ...form, status: e.target.value as StatusPedido })
                      }
                    >
                      {STATUS.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </Campo>
                  <Campo label="Prioridade">
                    <select
                      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                      value={form.prioridade}
                      onChange={(e) =>
                        setForm({ ...form, prioridade: e.target.value as Pedido["prioridade"] })
                      }
                    >
                      <option>Normal</option>
                      <option>Urgente</option>
                    </select>
                  </Campo>
                  <Campo label="Prazo">
                    <Input
                      type="date"
                      value={form.prazo}
                      onChange={(e) => setForm({ ...form, prazo: e.target.value })}
                    />
                  </Campo>
                </div>
                <Campo label="Descrição / Observações">
                  <Textarea
                    rows={3}
                    value={form.descricao}
                    onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                  />
                </Campo>
                <Button type="submit">Registrar Ordem</Button>
              </form>
            )}
          </Painel>
        </TabsContent>

        <TabsContent value="rastreio" className="mt-4">
          <Painel>
            <h2 className="text-lg font-bold">Área de Rastreio</h2>
            <p className="text-sm text-muted-foreground">
              Consulte rapidamente uma ordem pelo nº OP ou nome do cliente.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Input
                className="max-w-sm"
                placeholder="Digite o nº OP ou nome do cliente"
                value={rastreio}
                onChange={(e) => setRastreio(e.target.value)}
              />
              <Button
                onClick={() => {
                  const alvo = rastreio.trim().toLowerCase();
                  setAchado(
                    itens.find(
                      (p) =>
                        p.op.toLowerCase() === alvo || p.cliente.toLowerCase().includes(alvo),
                    ) ?? null,
                  );
                }}
              >
                Rastrear
              </Button>
            </div>
            {achado === null && (
              <p className="mt-4 text-sm text-destructive">Nenhuma ordem encontrada.</p>
            )}
            {achado && (
              <div className="mt-4 rounded-md border border-border p-4 text-sm">
                <p className="font-bold">
                  {achado.op} — {achado.cliente}
                </p>
                <p className="text-muted-foreground">
                  {achado.produto} · {achado.qtd} un.
                </p>
                <p className="mt-2">
                  Status atual:{" "}
                  <span className={`rounded px-2 py-1 text-xs font-bold ${COR[achado.status]}`}>
                    {achado.status}
                  </span>
                </p>
                <p className="mt-2 text-muted-foreground">
                  Entrega: {achado.rua} {achado.numeroCasa}, {achado.bairro} — {achado.cidade}
                </p>
              </div>
            )}
          </Painel>
        </TabsContent>

        <TabsContent value="frete" className="mt-4">
          <Painel>
            <h2 className="text-lg font-bold">Cálculo de Frete</h2>
            <p className="text-sm text-muted-foreground">Simule valores de transporte industrial.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <Campo label="Peso da carga (kg)">
                <Input
                  type="number"
                  value={frete.peso}
                  onChange={(e) => setFrete({ ...frete, peso: e.target.value })}
                />
              </Campo>
              <Campo label="Distância (km)">
                <Input
                  type="number"
                  value={frete.distancia}
                  onChange={(e) => setFrete({ ...frete, distancia: e.target.value })}
                />
              </Campo>
              <Campo label="Tipo de entrega">
                <select
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={frete.tipo}
                  onChange={(e) => setFrete({ ...frete, tipo: e.target.value })}
                >
                  <option value="1">Normal</option>
                  <option value="1.4">Expressa</option>
                  <option value="1.8">Urgente</option>
                </select>
              </Campo>
            </div>
            <Button className="mt-4 w-full" onClick={calcularFrete}>
              Calcular Frete
            </Button>
            <p className="mt-4 text-center text-2xl font-bold text-primary">
              {valorFrete.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </p>
          </Painel>
        </TabsContent>

        <TabsContent value="tabela" className="mt-4">
          <Painel>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-bold">Tabela de Pedidos</h2>
              <Button variant="outline" size="sm" onClick={exportar}>
                Baixar CSV
              </Button>
            </div>
            <Tabela
              colunas={[
                "OP",
                "Cliente",
                "Produto",
                "Qtd",
                "Bairro",
                "Status",
                "Prioridade",
                "Prazo",
                "Ação",
              ]}
              vazio={filtrados.length === 0}
            >
              {filtrados.map((p) => (
                <tr key={p.id} className="border-b border-border">
                  <td className="p-2 font-bold">{p.op || "—"}</td>
                  <td className="p-2">{p.cliente}</td>
                  <td className="p-2">{p.produto}</td>
                  <td className="p-2">{p.qtd}</td>
                  <td className="p-2">{p.bairro || "—"}</td>
                  <td className="p-2">
                    <button
                      className={`rounded px-2 py-1 text-xs font-bold ${COR[p.status]}`}
                      onClick={() => avancar(p)}
                    >
                      {p.status}
                    </button>
                  </td>
                  <td className="p-2">{p.prioridade}</td>
                  <td className="p-2">
                    {p.prazo ? new Date(`${p.prazo}T12:00:00`).toLocaleDateString("pt-BR") : "—"}
                  </td>
                  <td className="p-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Excluir ordem"
                      disabled={!podeCadastrar}
                      onClick={() => {
                        remove(p.id);
                        toast("Ordem removida");
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </Tabela>
            <p className="mt-4 text-sm text-muted-foreground">
              {filtrados.length} de {itens.length} ordens exibidas
            </p>
          </Painel>
        </TabsContent>
      </Tabs>
    </>
  );
}
