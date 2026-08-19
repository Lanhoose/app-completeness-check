import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { Moon, Sun, LogOut, ArrowLeft } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Guard } from "@/components/Guard";
import { Button } from "@/components/ui/button";
import { useSessao, logout } from "@/lib/session";
import { useTheme } from "@/lib/theme";

export const Route = createFileRoute("/erp")({
  component: ErpLayout,
});

function ErpLayout() {
  const { sessao } = useSessao();
  const { tema, toggle } = useTheme();
  const navigate = useNavigate();

  return (
    <Guard perfil="gestor">
      <div className="flex min-h-screen flex-col bg-background">
        <header className="gradient-panel px-4 py-3 text-white shadow-card">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
            <div>
              <Link to="/erp" className="text-lg font-bold">
                Painel ERP
              </Link>
              <p className="text-xs text-white/75">Bem-vindo, {sessao?.nome ?? "Usuário"}!</p>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/portal" className="inline-flex items-center gap-1 text-sm font-bold">
                <ArrowLeft className="size-4" /> Voltar
              </Link>
              <Button variant="ghost" size="icon" onClick={toggle} aria-label="Alternar tema">
                {tema === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Sair"
                onClick={() => {
                  logout();
                  navigate({ to: "/login" });
                }}
              >
                <LogOut className="size-5" />
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
          <Outlet />
        </main>

        <footer className="bg-header py-4 text-center text-xs text-header-foreground">
          &copy; 2026 GeTech — Sistema de Gestão Integrado
        </footer>
      </div>
    </Guard>
  );
}
