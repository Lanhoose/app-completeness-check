import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/erp/")({
  head: () => ({
    meta: [
      { title: "Dashboard ERP | GeTech" },
      { name: "description", content: "Módulos do ERP industrial GeTech." },
      { property: "og:title", content: "Dashboard ERP | GeTech" },
      { property: "og:description", content: "Módulos do ERP industrial GeTech." },
    ],
  }),
  component: ErpIndex,
});

const MODULOS = [
  { to: "/erp/geral", icone: "🌐", titulo: "Visão Geral", texto: "Documentação técnica e escopo do projeto." },
  { to: "/erp/estoque", icone: "📦", titulo: "Gestão de Inventário", texto: "Entrada e saída de materiais." },
  { to: "/erp/manutencao", icone: "⚙️", titulo: "Manutenção Ativa", texto: "Máquinas e ordens de serviço." },
  { to: "/erp/maquinas", icone: "🏗️", titulo: "Gestão de Máquinas", texto: "Modelo, série e última manutenção." },
  { to: "/erp/rh", icone: "🕐", titulo: "RH & Ponto Digital", texto: "Colaboradores e registro de jornada." },
  { to: "/erp/pedidos", icone: "📋", titulo: "Ordens de Serviço", texto: "Gestão de pedidos de produção." },
  { to: "/erp/qualidade", icone: "✅", titulo: "Controle de Qualidade", texto: "Inspeções e conformidade de lotes." },
  { to: "/erp/suprimentos", icone: "🛒", titulo: "Suprimentos", texto: "Requisições de compra e fornecedores." },
  { to: "/erp/producao", icone: "🏭", titulo: "Linha de Produção", texto: "Metas por turno e eficiência (OEE)." },
  { to: "/erp/logs", icone: "📝", titulo: "Logs de Operação", texto: "Auditoria de eventos do sistema." },
  { to: "/erp/sistema", icone: "🖥️", titulo: "Sistema", texto: "Simulação técnica industrial — em breve." },
  { to: "/erp/configuracoes", icone: "🔧", titulo: "Configurações", texto: "Tema, sessão e dados locais." },
] as const;

function ErpIndex() {
  return (
    <>
      <h1 className="text-2xl font-bold">Módulos do sistema</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODULOS.map((m) => (
          <Link
            key={m.to}
            to={m.to}
            className="rounded-lg border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-elevated"
          >
            <span className="text-2xl">{m.icone}</span>
            <h2 className="mt-2 font-bold">{m.titulo}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{m.texto}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
