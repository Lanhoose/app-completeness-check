import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { useSessao } from "@/lib/session";

export const Route = createFileRoute("/redirecionar")({
  head: () => ({
    meta: [
      { title: "Redirecionando | GeTech" },
      {
        name: "description",
        content: "Encaminhando você para a área correta do ecossistema GeTech.",
      },
      { property: "og:title", content: "Redirecionando | GeTech" },
      { property: "og:description", content: "Encaminhando para a área correta da GeTech." },
    ],
  }),
  component: RedirecionarPage,
});

/** Equivalente nativo de site/Site C/pages/redirecionar.html: envia cada
 *  perfil para a sua camada (cliente → área do cliente, gestor → portal). */
function RedirecionarPage() {
  const { sessao, pronto } = useSessao();
  const navigate = useNavigate();

  useEffect(() => {
    if (!pronto) return;
    const destino = !sessao ? "/login" : sessao.perfil === "gestor" ? "/portal" : "/cliente";
    const timer = setTimeout(() => navigate({ to: destino, replace: true }), 600);
    return () => clearTimeout(timer);
  }, [pronto, sessao, navigate]);

  return (
    <PageShell>
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <Loader2 className="size-8 animate-spin text-primary" />
        <h1 className="text-xl font-bold">Redirecionando…</h1>
        <p className="text-sm text-muted-foreground">
          Estamos levando você para a área correta da GeTech.
        </p>
      </div>
    </PageShell>
  );
}
