import { createFileRoute } from "@tanstack/react-router";
import { ModuloHeader, Painel } from "@/components/ModuloHeader";

export const Route = createFileRoute("/erp/geral")({
  head: () => ({
    meta: [
      { title: "Visão Geral do ERP | GeTech" },
      { name: "description", content: "Escopo, arquitetura e módulos do ERP industrial GeTech." },
      { property: "og:title", content: "Visão Geral do ERP | GeTech" },
      {
        property: "og:description",
        content: "Documentação técnica do sistema de gestão integrado GeTech.",
      },
    ],
  }),
  component: ErpGeral,
});

const BLOCOS = [
  {
    titulo: "Objetivo do sistema",
    texto:
      "Centralizar inventário, manutenção, pessoas e ordens de serviço da operação industrial em um único painel, reduzindo planilhas paralelas e retrabalho.",
  },
  {
    titulo: "Perfis de acesso",
    texto:
      "Clientes acompanham solicitações e materiais pelo portal público. Gestores têm acesso ao ERP completo, orçamentos, mensagens e auditoria.",
  },
  {
    titulo: "Persistência dos dados",
    texto:
      "Esta versão opera com armazenamento local no navegador, permitindo demonstração completa dos fluxos sem servidor. Cada operação gera registro no módulo de logs.",
  },
  {
    titulo: "Próximos passos",
    texto:
      "Integração com banco de dados na nuvem, autenticação com senha criptografada e emissão de relatórios em PDF.",
  },
];

const INDICADORES = [
  { rotulo: "Módulos ativos", valor: "11" },
  { rotulo: "Perfis suportados", valor: "2" },
  { rotulo: "Auditoria", valor: "500 eventos" },
];

function ErpGeral() {
  return (
    <>
      <ModuloHeader
        titulo="Visão Geral"
        descricao="Documentação técnica e escopo do sistema de gestão GeTech."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {INDICADORES.map((i) => (
          <div key={i.rotulo} className="rounded-lg border border-border bg-card p-5 shadow-card">
            <p className="text-2xl font-bold">{i.valor}</p>
            <p className="text-sm text-muted-foreground">{i.rotulo}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {BLOCOS.map((b) => (
          <Painel key={b.titulo}>
            <h2 className="font-bold">{b.titulo}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{b.texto}</p>
          </Painel>
        ))}
      </div>
    </>
  );
}
