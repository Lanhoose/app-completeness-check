import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCollection, type Registro } from "@/lib/local-collection";
import { useSessao } from "@/lib/session";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Comunidade Tech | Blog GeTech" },
      {
        name: "description",
        content:
          "Feed da comunidade GeTech: dúvidas, tutoriais, artigos e notícias sobre manutenção industrial.",
      },
      { property: "og:title", content: "Comunidade Tech | Blog GeTech" },
      { property: "og:description", content: "Compartilhe conhecimento com a fábrica GeTech." },
    ],
  }),
  component: BlogPage,
});

interface Post extends Registro {
  autor: string;
  categoria: string;
  titulo: string;
  texto: string;
}

const CATEGORIAS = ["❓ Dúvida", "📚 Tutorial", "📝 Artigo", "🚀 Notícia"];

const FIXOS: Post[] = [
  {
    id: "post-1",
    criadoEm: "",
    autor: "Equipe GeTech",
    categoria: "📚 Tutorial",
    titulo: "Como identificar desgaste em cilindros hidráulicos",
    texto:
      "Vazamento externo, queda de força e ruído de cavitação são os três sinais iniciais. Meça a velocidade de avanço sem carga e compare com a ficha do fabricante antes de abrir o cilindro.",
  },
  {
    id: "post-2",
    criadoEm: "",
    autor: "Engenharia de Manutenção",
    categoria: "📝 Artigo",
    titulo: "Preventiva x preditiva: onde investir primeiro",
    texto:
      "Comece pela preventiva nos ativos críticos e evolua para análise de vibração nos equipamentos com maior custo de parada. O ganho médio observado é de 18% em disponibilidade.",
  },
];

function BlogPage() {
  const { sessao } = useSessao();
  const { itens, add } = useCollection<Post>("getech:posts", "Publicações");
  const [aberto, setAberto] = useState(false);
  const [form, setForm] = useState({ titulo: "", categoria: CATEGORIAS[0], texto: "" });

  const publicar = (e: FormEvent) => {
    e.preventDefault();
    if (!form.titulo.trim() || !form.texto.trim()) return;
    add({
      autor: sessao?.nome ?? "Visitante",
      categoria: form.categoria,
      titulo: form.titulo.trim().slice(0, 120),
      texto: form.texto.trim().slice(0, 1000),
    });
    setForm({ titulo: "", categoria: CATEGORIAS[0], texto: "" });
    setAberto(false);
  };

  return (
    <PageShell
      titulo="Comunidade Tech GeTech"
      descricao="Explore posts ou compartilhe seu conhecimento com a nossa fábrica."
    >
      <Button onClick={() => setAberto((v) => !v)}>
        {aberto ? "Fechar" : "✨ Criar publicação"}
      </Button>

      {aberto && (
        <form
          onSubmit={publicar}
          className="mt-4 space-y-3 rounded-lg border border-border bg-card p-5 shadow-card"
        >
          <h2 className="font-bold">Criar nova publicação</h2>
          <Input
            aria-label="Título da publicação"
            placeholder="Título"
            maxLength={120}
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          />
          <label className="block text-sm font-medium" htmlFor="categoria">
            Categoria
          </label>
          <select
            id="categoria"
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={form.categoria}
            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
          >
            {CATEGORIAS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <Textarea
            aria-label="Conteúdo da publicação"
            placeholder="Escreva sua publicação"
            maxLength={1000}
            value={form.texto}
            onChange={(e) => setForm({ ...form, texto: e.target.value })}
          />
          <Button type="submit">Publicar no feed</Button>
        </form>
      )}

      <h2 className="mt-8 text-xl font-bold">🚀 Feed da comunidade</h2>
      <div className="mt-4 space-y-4">
        {[...itens, ...FIXOS].map((p) => (
          <article key={p.id} className="rounded-lg border border-border bg-card p-5 shadow-card">
            <span className="text-xs font-bold text-primary">{p.categoria}</span>
            <h3 className="mt-1 font-bold">{p.titulo}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{p.texto}</p>
            <p className="mt-3 text-xs text-muted-foreground">por {p.autor}</p>
          </article>
        ))}
      </div>
    </PageShell>
  );
}