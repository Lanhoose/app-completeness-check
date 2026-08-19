import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/integracoes")({
  head: () => ({
    meta: [
      { title: "Integrações do ERP | GeTech" },
      {
        name: "description",
        content:
          "Conecte o ERP GeTech a sensores IoT, CLPs, ERPs financeiros e ferramentas de gestão via API.",
      },
      { property: "og:title", content: "Integrações do ERP | GeTech" },
      {
        property: "og:description",
        content: "Parceiros e protocolos suportados pela integração ERP da GeTech.",
      },
    ],
  }),
  component: IntegracoesPage,
});

const PARCEIROS = [
  { nome: "MQTT / OPC UA", texto: "Leitura direta de sensores e CLPs do chão de fábrica." },
  { nome: "API REST GeTech", texto: "Endpoints para ordens de serviço, estoque e ativos." },
  { nome: "Power BI", texto: "Exportação de indicadores de OEE e disponibilidade." },
  { nome: "ERPs financeiros", texto: "Conciliação de pedidos de compra e notas de peças." },
  { nome: "WhatsApp Business", texto: "Notificação de ordens críticas para a equipe de campo." },
  { nome: "Google Workspace", texto: "Login corporativo e relatórios enviados por e-mail." },
];

function IntegracoesPage() {
  return (
    <PageShell
      titulo="Nossas Integrações"
      descricao="Conectando a GeTech com as melhores soluções de mercado através da integração ERP."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PARCEIROS.map((p) => (
          <article key={p.nome} className="rounded-lg border border-border bg-card p-5 shadow-card">
            <h2 className="font-bold">{p.nome}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{p.texto}</p>
          </article>
        ))}
      </div>
    </PageShell>
  );
}