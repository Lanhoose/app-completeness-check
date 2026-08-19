import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/funcionalidades")({
  head: () => ({
    meta: [
      { title: "Funcionalidades | GeTech ERP Industrial" },
      {
        name: "description",
        content:
          "Cloud, inteligência artificial, cibersegurança, apps mobile, big data e IoT aplicados à indústria.",
      },
      { property: "og:title", content: "Funcionalidades | GeTech ERP Industrial" },
      {
        property: "og:description",
        content: "Soluções GeTech: nuvem, IA, cibersegurança, mobile, big data e IoT.",
      },
    ],
  }),
  component: FuncionalidadesPage,
});

const SOLUCOES = [
  {
    icone: "☁️",
    titulo: "Cloud Computing",
    resumo: "Escalabilidade e armazenamento seguro na nuvem.",
    detalhe:
      "Nossa infraestrutura em nuvem oferece disponibilidade de 99,9%, garantindo que seus dados estejam sempre acessíveis.",
  },
  {
    icone: "🤖",
    titulo: "Inteligência Artificial",
    resumo: "Algoritmos avançados para análise e automação de tarefas.",
    detalhe:
      "Algoritmos avançados para análise de dados e automação de tarefas repetitivas em larga escala.",
  },
  {
    icone: "🛡️",
    titulo: "Cibersegurança",
    resumo: "Proteção total contra ataques e integridade de dados.",
    detalhe:
      "Proteção contra ataques DDoS e Ransomware, com garantia de integridade dos dados corporativos.",
  },
  {
    icone: "📱",
    titulo: "Apps Mobile",
    resumo: "Interfaces intuitivas para iOS e Android.",
    detalhe:
      "Desenvolvemos interfaces intuitivas e backends robustos para sua aplicação decolar nas lojas.",
  },
  {
    icone: "📊",
    titulo: "Big Data",
    resumo: "Análise estratégica de grandes volumes de informação.",
    detalhe:
      "Processamento de dados em tempo real para gerar insights valiosos e cruciais para o seu negócio.",
  },
  {
    icone: "🔗",
    titulo: "IoT Solutions",
    resumo: "Conectividade entre dispositivos e sensores.",
    detalhe:
      "Conectamos sua indústria com tecnologia de sensores e monitoramento remoto eficiente.",
  },
];

function FuncionalidadesPage() {
  return (
    <PageShell
      titulo="Nossas Soluções"
      descricao="Inovação e performance para o seu ecossistema digital."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SOLUCOES.map((s) => (
          <article
            key={s.titulo}
            className="group rounded-lg border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-elevated"
          >
            <span className="text-3xl">{s.icone}</span>
            <h2 className="mt-3 font-bold">{s.titulo}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{s.resumo}</p>
            <details className="mt-3">
              <summary className="cursor-pointer text-sm font-bold text-primary">
                Ver detalhes
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">{s.detalhe}</p>
            </details>
          </article>
        ))}
      </div>
    </PageShell>
  );
}