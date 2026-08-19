import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/PasswordInput";
import { getUsuarios, redefinirSenha } from "@/lib/session";
import { registrarLog } from "@/lib/local-collection";

export const Route = createFileRoute("/recuperar-senha")({
  head: () => ({
    meta: [
      { title: "Recuperar senha | GeTech" },
      {
        name: "description",
        content: "Redefina a senha da sua conta GeTech usando o e-mail cadastrado.",
      },
      { property: "og:title", content: "Recuperar senha | GeTech" },
      { property: "og:description", content: "Redefina a senha da sua conta GeTech." },
    ],
  }),
  component: RecuperarSenhaPage,
});

function RecuperarSenhaPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [enviando, setEnviando] = useState(false);

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    const alvo = email.trim().toLowerCase();

    if (senha.length < 4) {
      toast.error("A nova senha precisa ter pelo menos 4 caracteres.");
      return;
    }
    if (senha !== confirmacao) {
      toast.error("As senhas não coincidem.");
      return;
    }
    if (!getUsuarios().some((u) => u.email === alvo)) {
      toast.error("Nenhuma conta encontrada com este e-mail.");
      registrarLog("RECUPERACAO_FALHA", `E-mail não cadastrado: ${alvo}`, "AVISO");
      return;
    }

    setEnviando(true);
    redefinirSenha(alvo, senha);
    registrarLog("RECUPERACAO", `Senha redefinida para ${alvo}`, "AVISO");
    toast.success("Senha redefinida. Faça login com a nova senha.");
    navigate({ to: "/login" });
  };

  return (
    <PageShell
      titulo="Recuperar senha"
      descricao="Esta versão opera localmente: confirme o e-mail cadastrado e defina uma nova senha."
    >
      <form
        onSubmit={enviar}
        className="mx-auto max-w-md space-y-4 rounded-lg border border-border bg-card p-6 shadow-card"
      >
        <div className="space-y-2">
          <Label htmlFor="email-recuperacao">E-mail cadastrado</Label>
          <Input
            id="email-recuperacao"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nova-senha">Nova senha</Label>
          <PasswordInput
            id="nova-senha"
            value={senha}
            onChange={setSenha}
            autoComplete="new-password"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirma-senha">Confirmar nova senha</Label>
          <PasswordInput
            id="confirma-senha"
            value={confirmacao}
            onChange={setConfirmacao}
            autoComplete="new-password"
          />
        </div>
        <Button type="submit" className="w-full" disabled={enviando}>
          {enviando ? "Redefinindo..." : "Redefinir senha"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          <Link to="/login" className="font-bold text-primary hover:underline">
            Voltar para o login
          </Link>
        </p>
      </form>
    </PageShell>
  );
}
