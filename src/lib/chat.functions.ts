import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  historico: z
    .array(
      z.object({
        autor: z.enum(["bot", "user"]),
        texto: z.string().max(2000),
      }),
    )
    .max(30),
});

const SISTEMA = [
  "Você é o Assistente Virtual da GeTech, empresa brasileira de manutenção de máquinas pesadas",
  "e ERP industrial. Responda sempre em português do Brasil, de forma técnica, objetiva e cordial,",
  "em no máximo 5 frases. Domínios: hidráulica (cilindros, bombas, válvulas de alta pressão),",
  "elétrica industrial (painéis, inversores de frequência, motores), mecânica geral (rolamentos,",
  "engrenagens, eixos), manutenção preventiva/preditiva, estoque de peças, ordens de serviço e",
  "segurança operacional. Se o assunto fugir disso, redirecione educadamente para suporte técnico",
  "industrial. Nunca invente números de chamado.",
].join(" ");

export const responderIA = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { texto: "Assistente indisponível no momento. Tente novamente mais tarde." };

    const resposta = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3.7-flash",
        messages: [
          { role: "system", content: SISTEMA },
          ...data.historico.map((m) => ({
            role: m.autor === "bot" ? "assistant" : "user",
            content: m.texto,
          })),
        ],
      }),
    });

    if (resposta.status === 429)
      return { texto: "Muitas mensagens em sequência. Aguarde alguns instantes e tente de novo." };
    if (!resposta.ok) return { texto: "Não consegui responder agora. Pode repetir a pergunta?" };

    const json = (await resposta.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    return {
      texto: json.choices?.[0]?.message?.content?.trim() || "Pode detalhar um pouco mais?",
    };
  });