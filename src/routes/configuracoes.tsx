import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/PasswordInput";
import { useSessao, getUsuarios } from "@/lib/session";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações da Conta | GeTech" },
      {
        name: "description",
        content: "Gerencie perfil, senha e canais de suporte da sua conta no ERP GeTech.",
      },
      { property: "og:title", content: "Configurações da Conta | GeTech" },
      { property: "og:description", content: "Perfil, segurança e suporte da conta GeTech." },
    ],
  }),
  component: ConfiguracoesPage,
});

function ConfiguracoesPage() {
  const { sessao } = useSessao();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senhas, setSenhas] = useState({ atual: "", nova: "", confirmar: "" });

  useEffect(() => {
    setNome(sessao?.nome ?? "");
    setEmail(sessao?.email ?? "");
  }, [sessao]);

  const salvarPerfil = (e: FormEvent) => {
    e.preventDefault();
    if (!sessao) {
      toast.error("Entre na sua conta para editar o perfil.");
      return;
    }
    const sessaoAtualizada = { ...sessao, nome: nome.trim().slice(0, 80) };
    localStorage.setItem("sessaoGeTech", JSON.stringify(sessaoAtualizada));
    toast.success("Perfil atualizado.");
  };

  const atualizarSenha = (e: FormEvent) => {
    e.preventDefault();
    if (!sessao) {
      toast.error("Entre na sua conta para alterar a senha.");
      return;
    }
    const usuarios = getUsuarios();
    const atual = usuarios.find((u) => u.email === sessao.email);
    if (!atual || atual.senha !== senhas.atual) {
      toast.error("Senha atual incorreta.");
      return;
    }
    if (senhas.nova.length < 6) {
      toast.error("A nova senha precisa ter ao menos 6 caracteres.");
      return;
    }
    if (senhas.nova !== senhas.confirmar) {
      toast.error("A confirmação não confere.");
      return;
    }
    localStorage.setItem(
      "usuariosGeTech",
      JSON.stringify(usuarios.map((u) => (u.email === sessao.email ? { ...u, senha: senhas.nova } : u))),
    );
    setSenhas({ atual: "", nova: "", confirmar: "" });
    toast.success("Senha atualizada com sucesso.");
  };

  return (
    <PageShell
      titulo="Configurações"
      descricao="Gerencie as informações básicas da sua conta de acesso ao ERP."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <form onSubmit={salvarPerfil} className="space-y-3 rounded-lg border border-border bg-card p-5 shadow-card">
          <h2 className="font-bold">👤 Perfil do Usuário</h2>
          <label className="block text-sm font-medium" htmlFor="nome">
            Nome do usuário
          </label>
          <Input id="nome" maxLength={80} value={nome} onChange={(e) => setNome(e.target.value)} />
          <label className="block text-sm font-medium" htmlFor="email">
            E-mail de login
          </label>
          <Input id="email" value={email} readOnly aria-describedby="email-ajuda" />
          <p id="email-ajuda" className="text-xs text-muted-foreground">
            Este e-mail é utilizado para acessar a plataforma.
          </p>
          <Button type="submit">Salvar alterações</Button>
        </form>

        <form onSubmit={atualizarSenha} className="space-y-3 rounded-lg border border-border bg-card p-5 shadow-card">
          <h2 className="font-bold">🔒 Segurança e Senha</h2>
          <label className="block text-sm font-medium" htmlFor="senha-atual">
            Senha atual
          </label>
          <PasswordInput
            id="senha-atual"
            value={senhas.atual}
            onChange={(valor) => setSenhas({ ...senhas, atual: valor })}
          />
          <label className="block text-sm font-medium" htmlFor="senha-nova">
            Nova senha
          </label>
          <PasswordInput
            id="senha-nova"
            value={senhas.nova}
            onChange={(valor) => setSenhas({ ...senhas, nova: valor })}
          />
          <label className="block text-sm font-medium" htmlFor="senha-confirmar">
            Confirmar nova senha
          </label>
          <PasswordInput
            id="senha-confirmar"
            value={senhas.confirmar}
            onChange={(valor) => setSenhas({ ...senhas, confirmar: valor })}
          />
          <Button type="submit">Atualizar senha</Button>
        </form>
      </div>

      <section className="mt-4 rounded-lg border border-border bg-card p-5 shadow-card">
        <h2 className="font-bold">❓ Suporte e Ajuda</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Dúvidas sobre os módulos de PCP, manutenção preditiva, estoque de peças ou auditoria de
          logs? Consulte a documentação técnica completa ou fale com o suporte.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/erp/geral">
            <Button variant="outline">📋 Abrir manual do usuário</Button>
          </Link>
          <Link to="/contato">
            <Button variant="outline">✉️ Contatar suporte técnico</Button>
          </Link>
        </div>
      </section>
    </PageShell>
  );
}