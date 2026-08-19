import { useEffect, useRef, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useCollection, type Registro } from "@/lib/local-collection";
import { responderIA } from "@/lib/chat.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const CHAMADOS_KEY = "getech:chamados";

export interface Chamado extends Registro {
  nome: string;
  email: string;
  problema: string;
  origem: string;
}

type Etapa = "nome" | "email" | "problema" | "livre";

interface Mensagem {
  autor: "bot" | "user";
  texto: string;
}

export function Chatbot() {
  const { add } = useCollection<Chamado>(CHAMADOS_KEY, "Chamados");
  const perguntarIA = useServerFn(responderIA);
  const [etapa, setEtapa] = useState<Etapa>("nome");
  const [dados, setDados] = useState({ nome: "", email: "", problema: "" });
  const [texto, setTexto] = useState("");
  const [pensando, setPensando] = useState(false);
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    { autor: "bot", texto: "Olá! Sou o assistente virtual da GeTech. Qual é o seu nome?" },
  ]);
  const fim = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fim.current?.scrollIntoView({ block: "nearest" });
  }, [mensagens, pensando]);

  const responder = async (event: FormEvent) => {
    event.preventDefault();
    const valor = texto.trim();
    if (!valor || pensando) return;
    setTexto("");
    const novas: Mensagem[] = [{ autor: "user", texto: valor }];

    if (etapa === "nome") {
      setDados((d) => ({ ...d, nome: valor }));
      novas.push({ autor: "bot", texto: `Prazer, ${valor}! Qual o seu e-mail para contato?` });
      setEtapa("email");
    } else if (etapa === "email") {
      if (!/^\S+@\S+\.\S+$/.test(valor)) {
        novas.push({ autor: "bot", texto: "Esse e-mail não parece válido. Pode repetir?" });
      } else {
        setDados((d) => ({ ...d, email: valor }));
        novas.push({ autor: "bot", texto: "Obrigado! Descreva o problema da sua máquina." });
        setEtapa("problema");
      }
    } else if (etapa === "problema") {
      const chamado = { ...dados, problema: valor, origem: "Assistente Virtual" };
      add(chamado);
      novas.push({
        autor: "bot",
        texto: `Chamado registrado, ${dados.nome}! Nossa equipe técnica entrará em contato pelo e-mail ${dados.email}. Enquanto isso, posso ajudar com orientações técnicas — pode perguntar à vontade.`,
      });
      setEtapa("livre");
      setMensagens((m) => [...m, ...novas]);
      void conversar([...mensagens, ...novas], valor);
      return;
    } else {
      setMensagens((m) => [...m, ...novas]);
      void conversar([...mensagens, ...novas], valor);
      return;
    }

    setMensagens((m) => [...m, ...novas]);
  };

  const conversar = async (historico: Mensagem[], pergunta: string) => {
    setPensando(true);
    try {
      const contexto = historico.slice(-12);
      const resultado = await perguntarIA({
        data: {
          historico: [
            ...contexto,
            { autor: "user" as const, texto: `Pergunta técnica: ${pergunta}` },
          ].slice(-13),
        },
      });
      setMensagens((m) => [...m, { autor: "bot", texto: resultado.texto }]);
    } catch {
      setMensagens((m) => [
        ...m,
        { autor: "bot", texto: "Falha ao consultar o assistente. Tente novamente." },
      ]);
    } finally {
      setPensando(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-elevated">
      <div className="gradient-primary px-4 py-3 font-bold text-primary-foreground">
        Suporte Técnico Industrial
      </div>
      <div className="flex h-80 flex-col gap-2 overflow-y-auto bg-muted/40 p-4">
        {mensagens.map((m, i) => (
          <div
            key={i}
            className={
              m.autor === "bot"
                ? "max-w-[85%] self-start rounded-lg rounded-bl-none bg-card px-3 py-2 text-sm text-card-foreground shadow-card"
                : "max-w-[85%] self-end rounded-lg rounded-br-none bg-primary px-3 py-2 text-sm text-primary-foreground"
            }
          >
            {m.texto}
          </div>
        ))}
        <div ref={fim} />
      </div>
      {pensando && (
        <p className="px-4 pb-1 text-xs text-muted-foreground" aria-live="polite">
          Assistente digitando...
        </p>
      )}
      <form onSubmit={responder} className="flex gap-2 border-t border-border p-3">
        <Input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={
            etapa === "livre" ? "Pergunte sobre manutenção industrial..." : "Digite sua resposta..."
          }
          aria-label="Mensagem para o assistente virtual"
          disabled={pensando}
          autoComplete="off"
        />
        <Button type="submit" disabled={pensando}>
          Enviar
        </Button>
      </form>
    </div>
  );
}
