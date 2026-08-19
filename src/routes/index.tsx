import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GeTech | Manutenção de Máquinas Pesadas" },
      {
        name: "description",
        content:
          "Especialistas em diagnóstico, reparo e prevenção industrial: hidráulica, elétrica industrial e mecânica geral.",
      },
      { property: "og:title", content: "GeTech | Manutenção de Máquinas Pesadas" },
      {
        property: "og:description",
        content: "Especialistas em diagnóstico, reparo e prevenção industrial.",
      },
    ],
  }),
  component: Index,
});

const ESPECIALIDADES = [
  { titulo: "Hidráulica", texto: "Reparo em cilindros, bombas e válvulas de alta pressão." },
  {
    titulo: "Elétrica Industrial",
    texto: "Manutenção em painéis, inversores de frequência e motores.",
  },
  { titulo: "Mecânica Geral", texto: "Ajuste de rolamentos, engrenagens e eixos rotativos." },
];

function Index() {
  const irParaChat = () => {
    document.getElementById("atendimento")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />

      <main className="flex-1">
        <section className="hero-surface flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
          <h1 className="max-w-3xl text-3xl font-bold text-white sm:text-5xl">
            Manutenção de Máquinas Pesadas
          </h1>
          <p className="mt-4 max-w-xl text-base text-white/85">
            Especialistas em diagnóstico, reparo e prevenção industrial.
          </p>
          <Button size="lg" className="mt-8" onClick={irParaChat}>
            Conversar com nosso chatbot
          </Button>
        </section>

        <section id="servicos" className="mx-auto max-w-6xl px-4 py-12">
          <div className="rounded-lg border border-border bg-card p-6 shadow-card">
            <h2 className="text-2xl font-bold">Sobre a GeTech</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-md bg-muted/60 p-4">
                <h3 className="font-bold text-primary">Atuação</h3>
                <p className="text-sm text-muted-foreground">
                  Setores automotivo, alimentício e metalúrgico com tecnologia de ponta.
                </p>
              </div>
              <div className="rounded-md bg-muted/60 p-4">
                <h3 className="font-bold text-primary">Preventiva</h3>
                <p className="text-sm text-muted-foreground">
                  Redução de custos emergenciais e aumento da vida útil dos equipamentos.
                </p>
              </div>
            </div>
          </div>

          <h2 className="mt-12 text-center text-2xl font-bold">Nossas Especialidades</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ESPECIALIDADES.map((e) => (
              <article
                key={e.titulo}
                className="rounded-lg border-t-4 border-t-accent bg-card p-5 shadow-card transition-shadow hover:shadow-elevated"
              >
                <h3 className="text-lg font-bold">{e.titulo}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{e.texto}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="atendimento" className="mx-auto max-w-3xl px-4 pb-16">
          <h2 className="mb-6 text-center text-2xl font-bold">Assistente Virtual GeTech</h2>
          <Chatbot />
        </section>
      </main>

      <Footer />
    </div>
  );
}
