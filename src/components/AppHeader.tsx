import { Link, useNavigate } from "@tanstack/react-router";
import { Moon, Sun, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { useSessao, logout, FOTO_PADRAO } from "@/lib/session";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import getechLogo from "@/assets/getech-logo.png";

interface ItemNav {
  to: string;
  label: string;
  restrito?: boolean;
  /** Aparece apenas no menu mobile / lista completa. */
  secundario?: boolean;
}

const ITENS: ItemNav[] = [
  { to: "/", label: "Início" },
  { to: "/sobre", label: "Sobre" },
  { to: "/planos", label: "Planos" },
  { to: "/contato", label: "Contato" },
  { to: "/materiais", label: "Materiais" },
  { to: "/ajuda", label: "Ajuda" },
  { to: "/funcionalidades", label: "Funcionalidades", secundario: true },
  { to: "/integracoes", label: "Integrações", secundario: true },
  { to: "/depoimentos", label: "Depoimentos", secundario: true },
  { to: "/blog", label: "Comunidade", secundario: true },
  { to: "/faq", label: "FAQ", secundario: true },
  { to: "/realidade-aumentada", label: "Visualização 3D", secundario: true },
  { to: "/configuracoes", label: "Configurações", secundario: true },
  { to: "/politica-privacidade", label: "Privacidade", secundario: true },
  { to: "/orcamentos", label: "Orçamentos", restrito: true },
  { to: "/mensagens", label: "Mensagens", restrito: true },
  { to: "/portal", label: "Sistema", restrito: true },
];

export function AppHeader() {
  const { sessao, isGestor } = useSessao();
  const { tema, toggle } = useTheme();
  const navigate = useNavigate();
  const [aberto, setAberto] = useState(false);

  const itens = ITENS.filter((i) => !i.restrito || isGestor);
  const itensDesktop = itens.filter((i) => !i.secundario);

  const sair = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <header className="sticky top-0 z-50 bg-header text-header-foreground shadow-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2">
        <Link to="/" className="flex items-center gap-2">
          <img src={getechLogo} alt="Logo GeTech" className="h-10 w-10 rounded-full object-cover" />
          <span className="text-xl tracking-wide">
            <strong>GE</strong>TECH
          </span>
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {itensDesktop.map((i) => (
            <Link
              key={i.to}
              to={i.to}
              className="text-sm font-bold transition-colors hover:text-accent"
              activeProps={{ className: "text-accent" }}
            >
              {i.label}
            </Link>
          ))}
          {sessao?.perfil === "cliente" && (
            <Link to="/cliente" className="text-sm font-bold transition-colors hover:text-accent">
              Minha Área
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Alternar tema">
            {tema === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>
          <Link to={sessao ? "/cliente" : "/cadastro"} aria-label="Perfil">
            <img
              src={sessao?.foto || FOTO_PADRAO}
              alt="Foto de perfil"
              className="size-9 rounded-full border border-border object-cover"
            />
          </Link>
          {sessao ? (
            <Button variant="ghost" size="icon" onClick={sair} aria-label="Sair">
              <LogOut className="size-5 text-destructive" />
            </Button>
          ) : (
            <Link to="/login" className="hidden text-sm font-bold hover:text-accent md:inline">
              Entrar
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setAberto((v) => !v)}
            aria-label="Abrir menu"
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </div>

      {aberto && (
        <nav className="border-t border-border/30 px-4 pb-3 md:hidden">
          <ul className="flex flex-col gap-2 pt-2">
            {itens.map((i) => (
              <li key={i.to}>
                <Link
                  to={i.to}
                  onClick={() => setAberto(false)}
                  className="block py-1 text-sm font-bold"
                >
                  {i.label}
                </Link>
              </li>
            ))}
            {sessao?.perfil === "cliente" && (
              <li>
                <Link to="/cliente" onClick={() => setAberto(false)} className="block py-1 text-sm font-bold">
                  Minha Área
                </Link>
              </li>
            )}
            {!sessao && (
              <li>
                <Link to="/login" onClick={() => setAberto(false)} className="block py-1 text-sm font-bold">
                  Entrar
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
