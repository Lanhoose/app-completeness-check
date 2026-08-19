import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

export function ModuloHeader({ titulo, descricao }: { titulo: string; descricao: string }) {
  return (
    <div className="mb-6">
      <Link
        to="/erp"
        className="inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" /> Módulos
      </Link>
      <h1 className="mt-2 text-2xl font-bold">{titulo}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{descricao}</p>
    </div>
  );
}

export function Painel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-card">{children}</div>
  );
}

export function Tabela({
  colunas,
  vazio,
  children,
}: {
  colunas: string[];
  vazio: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted text-left">
          <tr>
            {colunas.map((c) => (
              <th key={c} className="p-2 font-bold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {vazio ? (
            <tr>
              <td colSpan={colunas.length} className="p-4 text-center text-muted-foreground">
                Nenhum registro cadastrado.
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
}
