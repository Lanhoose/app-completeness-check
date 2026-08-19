import { useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useSessao, type Perfil } from "@/lib/session";

/**
 * Guarda de acesso client-side (sessão em localStorage, igual ao site).
 * `perfil="gestor"` bloqueia clientes e visitantes nas camadas Public/ERP.
 */
export function Guard({ perfil, children }: { perfil?: Perfil; children: ReactNode }) {
  const { sessao, pronto } = useSessao();
  const navigate = useNavigate();

  const bloqueado = pronto && (!sessao || (perfil && sessao.perfil !== perfil));

  useEffect(() => {
    if (!bloqueado) return;
    navigate({ to: sessao ? "/cliente" : "/login", replace: true });
  }, [bloqueado, sessao, navigate]);

  if (!pronto || bloqueado) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        Verificando permissões...
      </div>
    );
  }

  return <>{children}</>;
}
