import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCollection } from "@/lib/local-collection";
import { CHAMADOS_KEY, type Chamado } from "@/components/Chatbot";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato | GeTech" },
      {
        name: "description",
        content: "Fale com a equipe técnica da GeTech e solicite atendimento industrial.",
      },
      { property: "og:title", content: "Contato | GeTech" },
      { property: "og:description", content: "Fale com a equipe técnica da GeTech." },
    ],
  }),
  component: ContatoPage,
});

function ContatoPage() {
  const { add } = useCollection<Chamado>(CHAMADOS_KEY, "Chamados");
  const [form, setForm] = useState({ nome: "", email: "", problema: "" });

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    add({ ...form, origem: "Formulário de contato" });
    setForm({ nome: "", email: "", problema: "" });
    toast.success("Mensagem enviada! Retornaremos em breve.");
  };

  return (
    <PageShell titulo="Contato" descricao="Envie sua solicitação para o suporte técnico.">
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <form
          onSubmit={enviar}
          className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-card"
        >
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="problema">Mensagem</Label>
            <Textarea
              id="problema"
              rows={5}
              value={form.problema}
              onChange={(e) => setForm({ ...form, problema: e.target.value })}
              required
            />
          </div>
          <Button type="submit">Enviar mensagem</Button>
        </form>

        <aside className="space-y-3 rounded-lg border border-border bg-card p-6 shadow-card text-sm">
          <h2 className="text-lg font-bold">GeTech Soluções Industriais</h2>
          <p className="text-muted-foreground">Atendimento técnico 24/7 para plantas industriais.</p>
          <p>
            <strong>E-mail:</strong> contato@getech.com.br
          </p>
          <p>
            <strong>Telefone:</strong> (11) 4000-1234
          </p>
          <p>
            <strong>Setores:</strong> automotivo, alimentício e metalúrgico.
          </p>
        </aside>
      </div>
    </PageShell>
  );
}
