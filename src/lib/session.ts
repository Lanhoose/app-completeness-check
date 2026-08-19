import { useEffect, useState } from "react";

export type Perfil = "cliente" | "gestor";

export interface Usuario {
  nome: string;
  email: string;
  senha: string;
  perfil: Perfil;
  foto?: string;
}

export interface Sessao {
  nome: string;
  email: string;
  perfil: Perfil;
  foto: string;
  loginAtivo: boolean;
}

const SESSAO_KEY = "sessaoGeTech";
const USUARIOS_KEY = "usuariosGeTech";
export const FOTO_PADRAO = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const isBrowser = () => typeof window !== "undefined";
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function getUsuarios(): Usuario[] {
  if (!isBrowser()) return [];
  try {
    return JSON.parse(localStorage.getItem(USUARIOS_KEY) ?? "[]") as Usuario[];
  } catch {
    return [];
  }
}

export function salvarUsuario(usuario: Usuario) {
  const usuarios = getUsuarios();
  usuarios.push(usuario);
  localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
}

/** Redefinição local de senha (sem backend): usada em /recuperar-senha. */
export function redefinirSenha(email: string, novaSenha: string): boolean {
  if (!isBrowser()) return false;
  const alvo = email.trim().toLowerCase();
  const usuarios = getUsuarios();
  const usuario = usuarios.find((u) => u.email === alvo);
  if (!usuario) return false;
  usuario.senha = novaSenha;
  localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
  emit();
  return true;
}

export function getSessao(): Sessao | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(SESSAO_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Sessao;
    return s?.loginAtivo ? s : null;
  } catch {
    return null;
  }
}

export function login(email: string, senha: string): Sessao | null {
  const alvo = email.trim().toLowerCase();
  const usuario = getUsuarios().find((u) => u.email === alvo && u.senha === senha);
  if (!usuario) return null;
  const sessao: Sessao = {
    nome: usuario.nome,
    email: usuario.email,
    perfil: usuario.perfil,
    foto: usuario.foto || FOTO_PADRAO,
    loginAtivo: true,
  };
  localStorage.setItem(SESSAO_KEY, JSON.stringify(sessao));
  emit();
  return sessao;
}

export function logout() {
  if (!isBrowser()) return;
  localStorage.removeItem(SESSAO_KEY);
  emit();
}

/** Sessão reativa e segura para SSR (null no servidor / primeiro render). */
export function useSessao() {
  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    const sync = () => setSessao(getSessao());
    sync();
    setPronto(true);
    listeners.add(sync);
    window.addEventListener("storage", sync);
    return () => {
      listeners.delete(sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return {
    sessao,
    pronto,
    isGestor: sessao?.perfil === "gestor",
    isCliente: sessao?.perfil === "cliente",
  };
}
