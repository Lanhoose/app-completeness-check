import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/PasswordInput";
import { Label } from "@/components/ui/label";
import { getUsuarios, salvarUsuario, type Perfil } from "@/lib/session";
import { registrarLog } from "@/lib/local-collection";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Criar conta | GeTech" },
      { name: "description", content: "Cadastre-se na GeTech como cliente ou gestor." },
      { property: "og:title", content: "Criar conta | GeTech" },
      { property: "og:description", content: "Cadastre-se na plataforma GeTech." },
    ],
  }),
  component: CadastroPage,
});

function CadastroPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    perfil: "cliente" as Perfil,
  });

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    const email = form.email.trim().toLowerCase();
    if (getUsuarios().some((u) => u.email === email)) {
      toast.error("Já existe uma conta com este e-mail.");
      return;
    }
    salvarUsuario({ ...form, email });
    registrarLog("CADASTRO", `Novo usuário ${form.nome} (${form.perfil})`);
    toast.success("Cadastro concluído! Faça login para continuar.");
    navigate({ to: "/login" });
  };

  return (
    <PageShell titulo="Criar conta" descricao="Perfis disponíveis: cliente e gestor.">
      <form
        onSubmit={enviar}
        className="mx-auto max-w-md space-y-4 rounded-lg border border-border bg-card p-6 shadow-card"
      >
        <div className="space-y-2">
          <Label htmlFor="nome">Nome completo</Label>
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
          <Label htmlFor="senha">Senha</Label>
          <PasswordInput
            id="senha"
            value={form.senha}
            onChange={(senha) => setForm({ ...form, senha })}
            autoComplete="new-password"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="perfil">Perfil</Label>
          <select
            id="perfil"
            value={form.perfil}
            onChange={(e) => setForm({ ...form, perfil: e.target.value as Perfil })}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="cliente">Cliente</option>
            <option value="gestor">Gestor</option>
          </select>
        </div>
        <Button type="submit" className="w-full">
          Cadastrar
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link to="/login" className="font-bold text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </form>
    </PageShell>
  );
}
