import type { ReactNode } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Footer } from "@/components/Footer";

export function PageShell({
  children,
  titulo,
  descricao,
}: {
  children: ReactNode;
  titulo?: string;
  descricao?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {titulo && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{titulo}</h1>
            {descricao && <p className="mt-1 text-sm text-muted-foreground">{descricao}</p>}
          </div>
        )}
        {children}
      </main>
      <Footer />
    </div>
  );
}
