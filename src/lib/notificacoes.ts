import { read, write, type Registro } from "@/lib/local-collection";
import { CHAMADOS_KEY } from "@/components/Chatbot";

/**
 * Notificação interna: grava um aviso na Caixa de Mensagens do gestor e,
 * quando o usuário autorizou, dispara também uma notificação do sistema.
 */
export function notificarGestor(assunto: string, texto: string) {
  if (typeof window === "undefined") return;

  const atuais = read<Registro>(CHAMADOS_KEY);
  write(CHAMADOS_KEY, [
    {
      id: crypto.randomUUID(),
      criadoEm: new Date().toISOString(),
      nome: assunto,
      email: "sistema@getech.com",
      origem: "Sistema",
      problema: texto,
    } as Registro,
    ...atuais,
  ]);

  try {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(assunto, { body: texto, icon: "/app-icon-512.png" });
    }
  } catch {
    /* notificações do sistema são opcionais */
  }
}

/** Pede permissão de notificação do sistema (chamado por ação do usuário). */
export async function pedirPermissaoNotificacao(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  return (await Notification.requestPermission()) === "granted";
}
