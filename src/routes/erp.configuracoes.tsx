import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import { ModuloHeader, Painel } from "@/components/ModuloHeader";
import { Button } from "@/components/ui/button";
import { useSessao, logout } from "@/lib/session";
import { useTheme } from "@/lib/theme";
import { registrarLog } from "@/lib/local-collection";

export const Route = createFileRoute("/erp/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações | GeTech" },
      { name: "description", content: "Preferências de tema, sessão e dados locais do ERP." },
      { property: "og:title", content: "Configurações | GeTech" },
      { property: "og:description", content: "Ajustes do sistema de gestão GeTech." },
    ],
  }),
  component: ErpConfiguracoes,
});

const COLECOES = [
  { chave: "getech:estoque", rotulo: "Inventário" },
  { chave: "getech:manutencao", rotulo: "Manutenção" },
  { chave: "getech:colaboradores", rotulo: "Colaboradores" },
  { chave: "getech:pontos", rotulo: "Registros de ponto" },
  { chave: "getech:pedidos", rotulo: "Pedidos" },
  { chave: "getech:orcamento", rotulo: "Orçamento" },
];

function ErpConfiguracoes() {
  const { sessao } = useSessao();
  const { tema, toggle } = useTheme();
  const navigate = useNavigate();

  const limpar = (chave: string, rotulo: string) => {
    localStorage.removeItem(chave);
    registrarLog("LIMPAR", `Dados de ${rotulo} apagados nas configurações`, "CRITICO");
    toast.success(`Dados de ${rotulo} apagados`);
  };

  return (
    <>
      <ModuloHeader
        titulo="Configurações"
        descricao="Preferências de aparência, sessão e dados armazenados localmente."
      />
      <div className="space-y-4">
        <Painel>
          <h2 className="font-bold">Conta</h2>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Nome</dt>
              <dd className="font-bold">{sessao?.nome ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">E-mail</dt>
              <dd className="font-bold">{sessao?.email ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Perfil</dt>
              <dd className="font-bold capitalize">{sessao?.perfil ?? "—"}</dd>
            </div>
          </dl>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              logout();
              toast("Sessão encerrada");
              navigate({ to: "/login" });
            }}
          >
            Encerrar sessão
          </Button>
        </Painel>

        <Painel>
          <h2 className="font-bold">Aparência</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tema atual: {tema === "dark" ? "escuro" : "claro"}. A preferência fica salva neste
            dispositivo.
          </p>
          <Button variant="outline" className="mt-4 gap-2" onClick={toggle}>
            {tema === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            Alternar para tema {tema === "dark" ? "claro" : "escuro"}
          </Button>
        </Painel>

        <Painel>
          <h2 className="font-bold">Dados locais</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Esta versão armazena tudo no navegador. Apagar uma coleção é irreversível e fica
            registrado nos logs.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {COLECOES.map((c) => (
              <div
                key={c.chave}
                className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm"
              >
                <span className="font-bold">{c.rotulo}</span>
                <Button size="sm" variant="ghost" onClick={() => limpar(c.chave, c.rotulo)}>
                  Apagar
                </Button>
              </div>
            ))}
          </div>
        </Painel>
      </div>
    </>
  );
}
