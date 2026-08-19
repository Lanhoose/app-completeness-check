import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/PasswordInput";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/session";
import { registrarLog } from "@/lib/local-collection";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar | GeTech" },
      { name: "description", content: "Acesse sua conta GeTech como cliente ou gestor." },
      { property: "og:title", content: "Entrar | GeTech" },
      { property: "og:description", content: "Acesse sua conta GeTech." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [enviando, setEnviando] = useState(false);

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    const sessao = login(email, senha);
    if (!sessao) {
      setEnviando(false);
      toast.error("E-mail ou senha incorretos.");
      registrarLog("LOGIN_FALHA", `Tentativa de acesso com ${email}`, "AVISO");
      return;
    }
    registrarLog("LOGIN", `${sessao.nome} entrou como ${sessao.perfil}`, "INFO", sessao.nome);
    toast.success(`Bem-vindo, ${sessao.nome}!`);
    navigate({ to: sessao.perfil === "gestor" ? "/portal" : "/cliente" });
  };

  return (
    <PageShell titulo="Entrar" descricao="Use o e-mail e a senha cadastrados.">
      <form
        onSubmit={enviar}
        className="mx-auto max-w-md space-y-4 rounded-lg border border-border bg-card p-6 shadow-card"
      >
        <div className="space-y-2">
          <Label htmlFor="usuario">E-mail</Label>
          <Input
            id="usuario"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="senha">Senha</Label>
          <PasswordInput
            id="senha"
            value={senha}
            onChange={setSenha}
            autoComplete="current-password"
          />
        </div>
        <Button type="submit" className="w-full" disabled={enviando}>
          {enviando ? "Entrando..." : "Entrar"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Não tem conta?{" "}
          <Link to="/cadastro" className="font-bold text-primary hover:underline">
            Cadastre-se
          </Link>
        </p>
        <p className="text-center text-sm text-muted-foreground">
          <Link to="/recuperar-senha" className="font-bold text-primary hover:underline">
            Esqueci minha senha
          </Link>
        </p>
      </form>
    </PageShell>
  );
}
