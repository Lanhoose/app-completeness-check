// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.

import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Mantém o server entry original do projeto Lovable.
    server: {
      entry: "server",
    },

    // GitHub Pages será usado como hospedagem estática.
    spa: {
      enabled: true,
    },
  },

  // O projeto será servido em:
  // https://lanhoose.github.io/app-completeness-check/
  vite: {
    base: "/app-completeness-check/",
  },
});
