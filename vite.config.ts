import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const isLovableSandbox =
  process.env["LOVABLE_SANDBOX"] === "1" ||
  !!process.env["DEV_SERVER__PROJECT_PATH"];

export default defineConfig({
  // No GitHub Actions/GitHub Pages:
  // desativa o Nitro para que o TanStack Start use
  // a saída normal esperada pelo prerender.
  nitro: isLovableSandbox ? undefined : false,

  tanstackStart: {
    // Mantém o server.ts personalizado do projeto Lovable.
    server: {
      entry: "server",
    },

    // Gera o shell estático para o GitHub Pages.
    spa: {
      enabled: true,
    },
  },

  vite: {
    base: "/app-completeness-check/",
  },
});
