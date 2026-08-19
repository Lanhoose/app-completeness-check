import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ModuloHeader, Painel, Tabela } from "@/components/ModuloHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCollection, LOGS_KEY, type LogEntry, type NivelLog } from "@/lib/local-collection";

export const Route = createFileRoute("/erp/logs")({
  head: () => ({
    meta: [
      { title: "Logs de Operação | GeTech" },
      { name: "description", content: "Auditoria de eventos e operações do sistema GeTech." },
      { property: "og:title", content: "Logs de Operação | GeTech" },
      { property: "og:description", content: "Módulo de auditoria do ERP GeTech." },
    ],
  }),
  component: ErpLogs,
});

const FILTROS = ["TODOS", "INFO", "AVISO", "CRITICO"] as const;

const COR: Record<NivelLog, string> = {
  INFO: "bg-primary/10 text-primary",
  AVISO: "bg-accent/10 text-accent",
  CRITICO: "bg-destructive/10 text-destructive",
};

function ErpLogs() {
  const { itens, clear } = useCollection<LogEntry>(LOGS_KEY, "Logs");
  const [filtro, setFiltro] = useState<(typeof FILTROS)[number]>("TODOS");
  const [busca, setBusca] = useState("");

  const termo = busca.trim().toLowerCase();
  const visiveis = itens.filter(
    (l) =>
      (filtro === "TODOS" || l.nivel === filtro) &&
      (termo === "" ||
        `${l.operador} ${l.acao} ${l.descricao}`.toLowerCase().includes(termo)),
  );

  return (
    <>
      <ModuloHeader
        titulo="Logs de Operação"
        descricao="Histórico de auditoria gerado automaticamente por cada operação do sistema."
      />
      <Painel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {FILTROS.map((f) => (
              <Button
                key={f}
                size="sm"
                variant={filtro === f ? "default" : "outline"}
                onClick={() => setFiltro(f)}
              >
                {f}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              clear();
              toast("Histórico de logs limpo");
            }}
          >
            Limpar histórico
          </Button>
        </div>

        <Input
          className="mt-4"
          placeholder="Buscar por operador, ação ou descrição..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          aria-label="Buscar nos logs"
        />

        <Tabela
          colunas={["Data / hora", "Operador", "Ação", "Descrição", "Nível"]}
          vazio={visiveis.length === 0}
        >
          {visiveis.map((l) => (
            <tr key={l.id} className="border-b border-border">
              <td className="p-2 whitespace-nowrap">
                {new Date(l.criadoEm).toLocaleString("pt-BR")}
              </td>
              <td className="p-2">{l.operador}</td>
              <td className="p-2 font-bold">{l.acao}</td>
              <td className="p-2 text-muted-foreground">{l.descricao}</td>
              <td className="p-2">
                <span className={`rounded px-2 py-1 text-xs font-bold ${COR[l.nivel]}`}>
                  {l.nivel}
                </span>
              </td>
            </tr>
          ))}
        </Tabela>

        <p className="mt-4 text-sm text-muted-foreground">
          {visiveis.length} de {itens.length} eventos exibidos
        </p>
      </Painel>
    </>
  );
}
