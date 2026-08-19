import { useCallback, useEffect, useState } from "react";

export interface Registro {
  id: string;
  criadoEm: string;
  [key: string]: unknown;
}

export type NivelLog = "INFO" | "AVISO" | "CRITICO";

export interface LogEntry extends Registro {
  operador: string;
  acao: string;
  descricao: string;
  nivel: NivelLog;
}

const isBrowser = () => typeof window !== "undefined";
const listeners = new Map<string, Set<() => void>>();

function emit(key: string) {
  listeners.get(key)?.forEach((l) => l());
}

export function read<T extends Registro>(key: string): T[] {
  if (!isBrowser()) return [];
  try {
    return JSON.parse(localStorage.getItem(key) ?? "[]") as T[];
  } catch {
    return [];
  }
}

export function write<T extends Registro>(key: string, itens: T[]) {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(itens));
  emit(key);
}

export const LOGS_KEY = "getech:logs";

export function registrarLog(
  acao: string,
  descricao: string,
  nivel: NivelLog = "INFO",
  operador = "Sistema",
) {
  if (!isBrowser()) return;
  const logs = read<LogEntry>(LOGS_KEY);
  logs.unshift({
    id: crypto.randomUUID(),
    criadoEm: new Date().toISOString(),
    operador,
    acao,
    descricao,
    nivel,
  });
  write(LOGS_KEY, logs.slice(0, 500));
}

/** CRUD reativo em localStorage, com log automático de cada operação. */
export function useCollection<T extends Registro>(key: string, rotulo = key) {
  const [itens, setItens] = useState<T[]>([]);

  useEffect(() => {
    const sync = () => setItens(read<T>(key));
    sync();
    const set = listeners.get(key) ?? new Set();
    set.add(sync);
    listeners.set(key, set);
    window.addEventListener("storage", sync);
    return () => {
      set.delete(sync);
      window.removeEventListener("storage", sync);
    };
  }, [key]);

  const add = useCallback(
    (dados: Omit<T, "id" | "criadoEm">) => {
      const novo = {
        ...dados,
        id: crypto.randomUUID(),
        criadoEm: new Date().toISOString(),
      } as T;
      write<T>(key, [novo, ...read<T>(key)]);
      if (key !== LOGS_KEY) registrarLog("CRIAR", `Novo registro em ${rotulo}`);
      return novo;
    },
    [key, rotulo],
  );

  const update = useCallback(
    (id: string, dados: Partial<T>) => {
      write<T>(
        key,
        read<T>(key).map((i) => (i.id === id ? { ...i, ...dados } : i)),
      );
      if (key !== LOGS_KEY) registrarLog("ATUALIZAR", `Registro atualizado em ${rotulo}`);
    },
    [key, rotulo],
  );

  const remove = useCallback(
    (id: string) => {
      write<T>(
        key,
        read<T>(key).filter((i) => i.id !== id),
      );
      if (key !== LOGS_KEY) registrarLog("EXCLUIR", `Registro removido de ${rotulo}`, "AVISO");
    },
    [key, rotulo],
  );

  const clear = useCallback(() => {
    write<T>(key, []);
    if (key !== LOGS_KEY) registrarLog("LIMPAR", `Coleção ${rotulo} esvaziada`, "CRITICO");
  }, [key, rotulo]);

  return { itens, add, update, remove, clear };
}
