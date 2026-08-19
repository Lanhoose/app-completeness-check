import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Perguntas Frequentes | GeTech ERP Industrial" },
      {
        name: "description",
        content:
          "Integração com o chão de fábrica, operação offline, prazo de implementação e conformidade com auditorias.",
      },
      { property: "og:title", content: "Perguntas Frequentes | GeTech ERP Industrial" },
      { property: "og:description", content: "Dúvidas frequentes sobre o ERP industrial GeTech." },
    ],
  }),
  component: FaqPage,
});

const PERGUNTAS = [
  {
    q: "Como funciona a integração com o chão de fábrica?",
    a: "Nossa plataforma utiliza protocolos industriais (como MQTT e OPC UA) para ler dados diretamente de sensores e CLPs, atualizando o inventário e a produção em tempo real sem intervenção manual.",
  },
  {
    q: "O sistema funciona sem internet?",
    a: "Sim, o ERP possui um módulo Edge que permite a operação offline, sincronizando os dados automaticamente com a nuvem assim que a conexão for restabelecida.",
  },
  {
    q: "Qual o tempo médio de implementação?",
    a: "Para indústrias de médio porte, a implementação completa leva entre 4 e 8 semanas, incluindo o treinamento da equipe e a migração de dados históricos.",
  },
  {
    q: "O ERP GeTech é compatível com normas de auditoria?",
    a: "Sim, o sistema é nativamente compatível com as normas ISO 9001 e IATF 16949, gerando relatórios de rastreabilidade total de lotes e histórico de manutenções.",
  },
];

function FaqPage() {
  return (
    <PageShell titulo="Perguntas Frequentes" descricao="Tudo sobre o ERP Industrial da GeTech.">
      <div className="rounded-lg border border-border bg-card p-4 shadow-card">
        <Accordion type="single" collapsible>
          {PERGUNTAS.map((p, i) => (
            <AccordionItem key={p.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left">{p.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{p.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </PageShell>
  );
}