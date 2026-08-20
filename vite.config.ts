import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Build para GitHub Pages: `GITHUB_PAGES=1 bun run build`.
// Sem essa variável mantemos o comportamento padrão do Lovable (Nitro + SSR).
const isGithubPages = process.env["GITHUB_PAGES"] === "1";

export default defineConfig({
  nitro: !isGithubPages,

  tanstackStart: {
    // Mantém o server.ts personalizado do projeto (wrapper de erros SSR).
    server: {
      entry: "server",
    },
  },

  ...(isGithubPages
    ? { vite: { base: "/app-completeness-check/" } }
    : {}),
});
