import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Guard } from "@/components/Guard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "Painel Central | GeTech ERP" },
      {
        name: "description",
        content:
          "Plataforma integrada de gestão de ativos: manutenção, estoque, métricas de OEE e auditoria.",
      },
      { property: "og:title", content: "Painel Central | GeTech ERP" },
      { property: "og:description", content: "Plataforma integrada de gestão de ativos industriais." },
    ],
  }),
  component: () => (
    <Guard perfil="gestor">
      <PortalPage />
    </Guard>
  ),
});

const MODULOS = [
  { icone: "⚙️", titulo: "Controle de Manutenção", texto: "Ordens preventivas e corretivas estruturadas." },
  { icone: "📦", titulo: "Estoque de Peças", texto: "Rastreabilidade física e níveis críticos de insumos." },
  { icone: "📊", titulo: "Métricas de OEE", texto: "Eficiência, performance e qualidade em tempo real." },
  { icone: "🔒", titulo: "Auditoria & Logs", texto: "Histórico digital imutável de todas as ações." },
];

const NUMEROS = [
  { valor: "+150", label: "Plantas Industriais Atendidas" },
  { valor: "99.8%", label: "Disponibilidade de Dados" },
  { valor: "24/7", label: "Monitoramento Ativo e Alertas" },
];

function PortalPage() {
  return (
    <PageShell>
      <section className="gradient-panel rounded-lg p-8 text-white shadow-elevated">
        <p className="text-xs font-bold uppercase tracking-widest text-white/70">
          Servidor Principal: Operacional
        </p>
        <h1 className="mt-3 text-3xl font-bold">Plataforma Integrada de Gestão de Ativos</h1>
        <p className="mt-3 max-w-2xl text-sm text-white/85">
          Monitore a eficiência global de seus equipamentos, controle ordens de serviço, gerencie a
          cadeia de suprimentos e reduza o tempo de inatividade em um único ecossistema digital.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/erp">
            <Button size="lg" variant="secondary">
              Entrar no sistema
            </Button>
          </Link>
          <Link to="/erp/geral">
            <Button size="lg" variant="outline">
              Conhecer o ERP
            </Button>
          </Link>
        </div>
      </section>

      <h2 className="mt-10 text-xl font-bold">Módulos Estruturais do Sistema</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MODULOS.map((m) => (
          <article key={m.titulo} className="rounded-lg border border-border bg-card p-5 shadow-card">
            <span className="text-2xl">{m.icone}</span>
            <h3 className="mt-2 font-bold">{m.titulo}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{m.texto}</p>
          </article>
        ))}
      </div>

      <h2 className="mt-10 text-xl font-bold">Impacto Operacional Global</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {NUMEROS.map((n) => (
          <div key={n.label} className="rounded-lg border border-border bg-card p-5 text-center shadow-card">
            <p className="text-3xl font-bold text-primary">{n.valor}</p>
            <p className="mt-1 text-sm text-muted-foreground">{n.label}</p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
