import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/politica-privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade e LGPD | GeTech" },
      {
        name: "description",
        content:
          "Como a GeTech coleta, usa e protege os dados operacionais e pessoais no ERP industrial, conforme a LGPD.",
      },
      { property: "og:title", content: "Política de Privacidade e LGPD | GeTech" },
      {
        property: "og:description",
        content: "Transparência no tratamento de dados do ERP industrial GeTech.",
      },
    ],
  }),
  component: PrivacidadePage,
});

const CHAVE = "getech:lgpd-aceite";

const SECOES = [
  {
    titulo: "1. Dados que coletamos",
    texto:
      "Coletamos dados de cadastro (nome, e-mail e empresa), dados operacionais lançados no ERP (ordens de serviço, estoque, ativos e logs de auditoria) e dados técnicos de uso da plataforma necessários para segurança e suporte.",
  },
  {
    titulo: "2. Finalidade do tratamento",
    texto:
      "Os dados são utilizados exclusivamente para operar os módulos de manutenção, estoque e relatórios, prestar suporte técnico, cumprir obrigações legais e gerar indicadores de desempenho da sua operação industrial.",
  },
  {
    titulo: "3. Armazenamento e segurança",
    texto:
      "Nesta versão do aplicativo, os registros ficam armazenados localmente no dispositivo do usuário (armazenamento do navegador). Nenhum dado é enviado a terceiros sem sua autorização, exceto as mensagens enviadas ao assistente virtual, processadas apenas para gerar a resposta técnica.",
  },
  {
    titulo: "4. Seus direitos como titular (LGPD)",
    texto:
      "Você pode a qualquer momento confirmar a existência de tratamento, acessar, corrigir, portar ou eliminar seus dados, além de revogar o consentimento. Os módulos do ERP permitem exportar e apagar registros diretamente pelo painel.",
  },
  {
    titulo: "5. Retenção e eliminação",
    texto:
      "Os logs de auditoria mantêm os 500 eventos mais recentes. Ao limpar uma coleção no ERP, os dados correspondentes são eliminados de forma definitiva do dispositivo.",
  },
  {
    titulo: "6. Encarregado de dados (DPO)",
    texto:
      "Dúvidas ou solicitações relacionadas à LGPD podem ser enviadas pela página de contato, com resposta em até 15 dias úteis.",
  },
];

function PrivacidadePage() {
  const [aceito, setAceito] = useState(false);
  const [dataAceite, setDataAceite] = useState<string | null>(null);

  useEffect(() => {
    const salvo = localStorage.getItem(CHAVE);
    if (salvo) {
      setAceito(true);
      setDataAceite(salvo);
    }
  }, []);

  const aceitar = () => {
    const agora = new Date().toISOString();
    localStorage.setItem(CHAVE, agora);
    setAceito(true);
    setDataAceite(agora);
    toast.success("Consentimento registrado.");
  };

  const revogar = () => {
    localStorage.removeItem(CHAVE);
    setAceito(false);
    setDataAceite(null);
    toast.info("Consentimento revogado.");
  };

  return (
    <PageShell
      titulo="Política de Privacidade"
      descricao="Transparência total sobre o tratamento dos seus dados, conforme a Lei nº 13.709/2018 (LGPD)."
    >
      <div className="space-y-4">
        {SECOES.map((s) => (
          <section key={s.titulo} className="rounded-lg border border-border bg-card p-5 shadow-card">
            <h2 className="font-bold">{s.titulo}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{s.texto}</p>
          </section>
        ))}
      </div>

      <section className="mt-6 rounded-lg border border-primary/40 bg-primary/5 p-5">
        <h2 className="font-bold">Consentimento</h2>
        {aceito && dataAceite ? (
          <>
            <p className="mt-2 text-sm text-muted-foreground">
              Consentimento registrado em{" "}
              {new Date(dataAceite).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}.
            </p>
            <Button variant="outline" className="mt-4" onClick={revogar}>
              Revogar consentimento
            </Button>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-muted-foreground">
              Li e concordo com o tratamento dos meus dados nos termos descritos acima.
            </p>
            <Button className="mt-4" onClick={aceitar}>
              Aceitar e continuar
            </Button>
          </>
        )}
      </section>
    </PageShell>
  );
}