// @lovable.dev/vite-tanstack-config já inclui:
// TanStack Start, React, Tailwind, tsconfig paths, Nitro,
// aliases, dedupe e demais plugins necessários.

import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // GitHub Pages é hospedagem estática.
    spa: {
      enabled: true,
    },
  },

  vite: {
    // O repositório será publicado neste caminho.
    base: "/app-completeness-check/",
  },
});
