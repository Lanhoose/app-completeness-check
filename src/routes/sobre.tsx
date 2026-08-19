import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre a Plataforma | GeTech ERP Industrial" },
      {
        name: "description",
        content:
          "A tecnologia por trás do controle de ativos industriais: missão, visão e governança do ERP GeTech.",
      },
      { property: "og:title", content: "Sobre a Plataforma | GeTech ERP Industrial" },
      {
        property: "og:description",
        content: "Missão, visão e valores digitais do ERP industrial da GeTech.",
      },
    ],
  }),
  component: SobrePage,
});

const DIRETRIZES = [
  {
    titulo: "Missão do Software",
    texto:
      "Garantir a integridade, a segurança e a alta disponibilidade dos dados críticos dos equipamentos industriais de nossos clientes, oferecendo uma infraestrutura digital confiável para ordens de serviço, relatórios de auditoria e tomadas de decisão rápidas.",
  },
  {
    titulo: "Visão de Futuro",
    texto:
      "Consolidar-se como o ERP líder de mercado no segmento de manutenção de ativos, integrando soluções de ponta como análise preditiva e inteligência de dados aplicada para eliminar completamente o tempo de máquina parada involuntário na indústria.",
  },
  {
    titulo: "Valores Digitais",
    texto:
      "Transparência total na governança de dados, segurança da informação intransigente, arquitetura de software escalável, inovação contínua na experiência do usuário e foco absoluto na produtividade operacional.",
  },
];

function SobrePage() {
  return (
    <PageShell
      titulo="Sobre a Plataforma"
      descricao="A tecnologia por trás do controle de ativos industriais."
    >
      <section className="gradient-panel rounded-lg p-6 text-white shadow-elevated">
        <p className="text-sm leading-relaxed text-white/90">
          O ERP Industrial da GeTech é uma plataforma de software especializada na gestão,
          monitoramento e digitalização do ecossistema de manutenção industrial. Centralizamos dados
          operacionais complexos em uma interface intuitiva, do agendamento automatizado de
          manutenções preventivas e corretivas ao rastreamento em tempo real do histórico digital de
          cada máquina. Com módulos inteligentes e análise de dados, otimizamos processos e
          eliminamos gargalos de comunicação, maximizando a produtividade das plantas fabris.
        </p>
      </section>

      <h2 className="mt-8 text-xl font-bold">Objetivos Tecnológicos e Governança do ERP</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {DIRETRIZES.map((d) => (
          <article key={d.titulo} className="rounded-lg border border-border bg-card p-5 shadow-card">
            <h3 className="font-bold">{d.titulo}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{d.texto}</p>
          </article>
        ))}
      </div>
    </PageShell>
  );
}