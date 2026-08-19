import { createFileRoute } from "@tanstack/react-router";
import { FileDown } from "lucide-react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/materiais")({
  head: () => ({
    meta: [
      { title: "Materiais e Manuais | GeTech" },
      {
        name: "description",
        content: "Baixe manuais técnicos de máquinas agrícolas, prensas hidráulicas e mais.",
      },
      { property: "og:title", content: "Materiais e Manuais | GeTech" },
      { property: "og:description", content: "Manuais técnicos das máquinas atendidas pela GeTech." },
    ],
  }),
  component: MateriaisPage,
});

const MANUAIS = [
  {
    nome: "Máquinas agrícolas",
    url: "https://www.bibliotecaagptea.org.br/agricultura/mecanizacao/livros/APOSTILAS%20DE%20MAQUINAS%20AGRICOLAS%20UNESP.pdf",
  },
  {
    nome: "Prensas Hidráulicas",
    url: "https://www.marcon.ind.br/wp-content/uploads/2024/07/15614-PRENSA-MPH-10-MPH-10S-MPH-15-MPH-15S-MPH-15C-MPH-30.pdf",
  },
  {
    nome: "Máquina de solda transformadora",
    url: "https://www.somar.com.br/wp-content/uploads/2020/06/025.0905-0-Manual-Maquina-de-Solda-Transformador-Somar-MTS-250-Compact-rev2-04.18-Trilingue.pdf",
  },
  { nome: "Quinadoras", url: "https://www.minag.com.br/downloads/maquina-grande.pdf" },
];

function MateriaisPage() {
  return (
    <PageShell titulo="Manuais das Máquinas" descricao="Documentação técnica disponível para download.">
      <ul className="space-y-3">
        {MANUAIS.map((m) => (
          <li
            key={m.nome}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4 shadow-card"
          >
            <span className="font-medium">{m.nome}</span>
            <a
              href={m.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <FileDown className="size-4" /> Baixar Manual
            </a>
          </li>
        ))}
      </ul>

      <section className="mt-8 rounded-lg border border-border bg-card p-6 shadow-card">
        <h2 className="text-lg font-bold">Informações Adicionais</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Os documentos estão disponíveis em formato PDF ou DOCX. Para visualizar, certifique-se de
          ter um leitor de PDF ou software de edição de texto instalado.
        </p>
      </section>
    </PageShell>
  );
}
