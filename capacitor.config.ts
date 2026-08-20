import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Empacotamento Android (Capacitor).
 *
 * O app usa SSR e funções de servidor (chatbot com IA), por isso o shell nativo
 * carrega o site publicado. Para rodar 100% offline seria necessário um build
 * estático sem funções de servidor.
 *
 * Comandos locais:
 *   bun run build && bunx cap add android && bunx cap sync android
 *   (abrir android/ no Android Studio ou buildar pelo Codemagic)
 */
const config: CapacitorConfig = {
  appId: "com.getech.industrial",
  appName: "GeTech",
  webDir: "dist/client",
  android: {
    allowMixedContent: false,
  },
  server: {
    url: process.env["CAP_SERVER_URL"] ?? "https://app-completer-checker.lovable.app",
    cleartext: false,
    androidScheme: "https",
  },
};

export default config;
