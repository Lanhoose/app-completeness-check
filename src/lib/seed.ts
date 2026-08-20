/**
 * Semente de demonstração: cria usuários padrão (gestor/cliente) e popula
 * os módulos do ERP com dados realistas na primeira execução do navegador.
 * Roda uma única vez (flag SEED_KEY) e nunca sobrescreve dados existentes.
 */
import { FOTO_PADRAO, type Usuario } from "@/lib/session";
import type { LogEntry, Registro } from "@/lib/local-collection";

const SEED_KEY = "getech:seed";
const SEED_VERSAO = "v1";
const USUARIOS_KEY = "usuariosGeTech";

const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

/** Data ISO deslocada em horas para trás. */
const horasAtras = (h: number) => new Date(Date.now() - h * 3600_000).toISOString();
const diasAtras = (d: number) => new Date(Date.now() - d * 86400_000).toISOString();
const dataCurta = (d: number) => diasAtras(d).slice(0, 10);
const dataFrente = (d: number) => new Date(Date.now() + d * 86400_000).toISOString().slice(0, 10);

export const USUARIOS_DEMO: Usuario[] = [
  {
    nome: "Ana Ribeiro",
    email: "gestor@getech.com",
    senha: "getech123",
    perfil: "gestor",
    foto: FOTO_PADRAO,
  },
  {
    nome: "Carlos Menezes",
    email: "cliente@getech.com",
    senha: "getech123",
    perfil: "cliente",
    foto: FOTO_PADRAO,
  },
];

function registros<T extends Record<string, unknown>>(
  lista: T[],
  idades: number[] = [],
): (T & Registro)[] {
  return lista.map((dados, i) => ({
    ...dados,
    id: uid(),
    criadoEm: diasAtras(idades[i] ?? i + 1),
  })) as (T & Registro)[];
}

function construirDados(): Record<string, unknown[]> {
  return {
  "getech:estoque": registros([
    { nome: "Rolamento SKF 6205", codigo: "RLM-6205", qtd: 42, minimo: 15, local: "Almox. A-01" },
    { nome: "Óleo hidráulico ISO 68", codigo: "OLE-ISO68", qtd: 8, minimo: 12, local: "Almox. B-04" },
    { nome: "Correia dentada HTD 8M", codigo: "COR-8M", qtd: 26, minimo: 10, local: "Almox. A-07" },
    { nome: "Filtro de ar comprimido", codigo: "FIL-AR32", qtd: 5, minimo: 8, local: "Almox. C-02" },
    { nome: "Contator tripolar 25A", codigo: "ELT-C25", qtd: 31, minimo: 10, local: "Painel E-11" },
    { nome: "Vedação NBR 80x100", codigo: "VED-80100", qtd: 64, minimo: 20, local: "Almox. B-09" },
  ]),

  "getech:maquinas": registros([
    { nome: "Torno CNC Romi GL 240", modelo: "GL 240", serie: "RM-2019-4471", ultimaManutencao: dataCurta(21) },
    { nome: "Prensa Hidráulica 150t", modelo: "PH-150", serie: "PH-2021-0088", ultimaManutencao: dataCurta(9) },
    { nome: "Centro de Usinagem VMC 850", modelo: "VMC-850", serie: "VM-2020-1123", ultimaManutencao: dataCurta(45) },
    { nome: "Compressor Parafuso 50HP", modelo: "CP-50", serie: "CP-2018-7702", ultimaManutencao: dataCurta(3) },
    { nome: "Ponte Rolante 10t", modelo: "PR-10", serie: "PR-2017-3390", ultimaManutencao: dataCurta(60) },
  ]),

  "getech:manutencao": registros([
    { maquina: "Prensa Hidráulica 150t", setor: "Estamparia", tipo: "Corretiva", responsavel: "Diego Alves", status: "Em execução" },
    { maquina: "Torno CNC Romi GL 240", setor: "Usinagem", tipo: "Preventiva", responsavel: "Marcos Lima", status: "Aberta" },
    { maquina: "Compressor Parafuso 50HP", setor: "Utilidades", tipo: "Preditiva", responsavel: "Juliana Reis", status: "Concluída" },
    { maquina: "Ponte Rolante 10t", setor: "Expedição", tipo: "Preventiva", responsavel: "Diego Alves", status: "Aberta" },
  ]),

  "getech:producao": registros([
    { linha: "Linha 01 — Usinagem", turno: "1º turno", meta: 480, produzido: 447 },
    { linha: "Linha 02 — Estamparia", turno: "2º turno", meta: 620, produzido: 590 },
    { linha: "Linha 03 — Montagem", turno: "1º turno", meta: 300, produzido: 312 },
    { linha: "Linha 04 — Acabamento", turno: "3º turno", meta: 250, produzido: 198 },
  ]),

  "getech:qualidade": registros([
    { lote: "LT-2401", item: "Eixo usinado 40mm", inspetor: "Paula Fontes", resultado: "Aprovado" },
    { lote: "LT-2402", item: "Flange estampada", inspetor: "Paula Fontes", resultado: "Aprovado" },
    { lote: "LT-2403", item: "Suporte soldado", inspetor: "Renato Dias", resultado: "Reprovado" },
    { lote: "LT-2404", item: "Bucha de bronze", inspetor: "Renato Dias", resultado: "Em análise" },
    { lote: "LT-2405", item: "Engrenagem Z28", inspetor: "Paula Fontes", resultado: "Aprovado" },
  ]),

  "getech:suprimentos": registros([
    { item: "Óleo hidráulico ISO 68 (200L)", fornecedor: "Lubrimax", quantidade: "4 tambores", status: "Aprovado" },
    { item: "Filtro de ar comprimido", fornecedor: "AirParts", quantidade: "20 un", status: "Cotação" },
    { item: "Rolamento SKF 6205", fornecedor: "Rolatec", quantidade: "50 un", status: "Recebido" },
    { item: "Chapa aço 1020 3mm", fornecedor: "Aços Norte", quantidade: "12 chapas", status: "Solicitado" },
  ]),

  "getech:colaboradores": registros([
    { nome: "Marcos Lima", cargo: "Técnico Mecânico", setor: "Manutenção", entrada: horasAtras(6) },
    { nome: "Juliana Reis", cargo: "Engenheira de Confiabilidade", setor: "Engenharia", entrada: horasAtras(7) },
    { nome: "Diego Alves", cargo: "Eletricista Industrial", setor: "Manutenção", entrada: null },
    { nome: "Paula Fontes", cargo: "Inspetora de Qualidade", setor: "Qualidade", entrada: horasAtras(4) },
  ]),

  "getech:pontos": registros(
    [
      { colaborador: "Paula Fontes", tipo: "Entrada" },
      { colaborador: "Marcos Lima", tipo: "Entrada" },
      { colaborador: "Juliana Reis", tipo: "Entrada" },
      { colaborador: "Diego Alves", tipo: "Saída" },
    ],
    [0, 0, 0, 1],
  ),

  "getech:pedidos": registros([
    {
      op: "OP-1042", cliente: "Metalúrgica Norte", produto: "Eixo usinado 40mm", qtd: 120,
      responsavel: "PCP", cep: "01310-100", rua: "Av. Paulista", numeroCasa: "1500",
      bairro: "Bela Vista", cidade: "São Paulo", status: "Em Andamento", prioridade: "Urgente",
      prazo: dataFrente(3), descricao: "Tolerância H7, entrega parcial autorizada.",
    },
    {
      op: "OP-1043", cliente: "Fundição Vale", produto: "Flange estampada 6\"", qtd: 300,
      responsavel: "Produção", cep: "30140-071", rua: "Rua da Bahia", numeroCasa: "820",
      bairro: "Centro", cidade: "Belo Horizonte", status: "A Fazer", prioridade: "Normal",
      prazo: dataFrente(9), descricao: "Aguardando liberação de matéria-prima.",
    },
    {
      op: "OP-1039", cliente: "Agro Máquinas Sul", produto: "Engrenagem Z28", qtd: 80,
      responsavel: "Gestão", cep: "90010-150", rua: "Rua dos Andradas", numeroCasa: "310",
      bairro: "Centro Histórico", cidade: "Porto Alegre", status: "Qualidade", prioridade: "Normal",
      prazo: dataFrente(1), descricao: "Inspeção dimensional em andamento.",
    },
    {
      op: "OP-1035", cliente: "Cimento Atlântico", produto: "Bucha de bronze 60mm", qtd: 45,
      responsavel: "Entregador", cep: "40015-160", rua: "Av. Sete de Setembro", numeroCasa: "77",
      bairro: "Comércio", cidade: "Salvador", status: "Finalizado", prioridade: "Normal",
      prazo: dataCurta(2), descricao: "Entregue e conferido pelo cliente.",
    },
  ]),

  "getech:siu-ativos": registros([
    { codigo: "ATV-001", nome: "Torno CNC Romi GL 240", setor: "Usinagem", situacao: "Operacional", freq: 90 },
    { codigo: "ATV-002", nome: "Prensa Hidráulica 150t", setor: "Estamparia", situacao: "Em Manutenção", freq: 60 },
    { codigo: "ATV-003", nome: "Compressor Parafuso 50HP", setor: "Utilidades", situacao: "Operacional", freq: 30 },
    { codigo: "ATV-004", nome: "Ponte Rolante 10t", setor: "Expedição", situacao: "Parada", freq: 120 },
  ]),

  "getech:siu-tecnicos": registros([
    { matricula: "T-1001", nome: "Marcos Lima", especialidade: "Mecânica pesada" },
    { matricula: "T-1002", nome: "Diego Alves", especialidade: "Elétrica industrial" },
    { matricula: "T-1003", nome: "Juliana Reis", especialidade: "Confiabilidade e preditiva" },
  ]),

  "getech:siu-historico": registros([
    { codigo: "INT-2201", maquina: "Prensa Hidráulica 150t", data: dataCurta(2), tipo: "Corretiva", servico: "Troca de vedação do cilindro principal", tecnico: "Marcos Lima" },
    { codigo: "INT-2198", maquina: "Compressor Parafuso 50HP", data: dataCurta(6), tipo: "Preditiva", servico: "Análise de vibração e troca de filtro", tecnico: "Juliana Reis" },
    { codigo: "INT-2190", maquina: "Torno CNC Romi GL 240", data: dataCurta(21), tipo: "Preventiva", servico: "Lubrificação de guias e ajuste de castanhas", tecnico: "Diego Alves" },
  ]),

  "getech:chamados": registros([
    { nome: "Carlos Menezes", email: "cliente@getech.com", problema: "Ruído anormal no redutor da linha 02.", origem: "Chatbot" },
    { nome: "Fernanda Prado", email: "fernanda@fundicaovale.com", problema: "Solicito orçamento de manutenção preventiva anual.", origem: "Formulário de contato" },
  ]),

  "getech:orcamento": registros([
    { desc: "Manutenção preventiva — Torno CNC", valor: 1850, qtd: 1 },
    { desc: "Troca de vedação hidráulica", valor: 420.5, qtd: 3 },
    { desc: "Hora técnica especializada", valor: 180, qtd: 8 },
  ]),
};

const LOGS_DEMO: Omit<LogEntry, "id" | "criadoEm">[] = [
  { operador: "Ana Ribeiro", acao: "LOGIN", descricao: "Ana Ribeiro entrou como gestor", nivel: "INFO" },
  { operador: "Marcos Lima", acao: "ATUALIZAR", descricao: "OS da Prensa Hidráulica movida para Em execução", nivel: "INFO" },
  { operador: "Sistema", acao: "ALERTA", descricao: "Estoque crítico: Filtro de ar comprimido (5/8)", nivel: "AVISO" },
  { operador: "Paula Fontes", acao: "CRIAR", descricao: "Nova inspeção registrada no lote LT-2405", nivel: "INFO" },
  { operador: "Renato Dias", acao: "ATUALIZAR", descricao: "Lote LT-2403 reprovado na inspeção dimensional", nivel: "CRITICO" },
  { operador: "Sistema", acao: "SEED", descricao: "Base de demonstração carregada", nivel: "INFO" },
];

/** Executa a semente uma única vez por navegador. */
export function aplicarSeed() {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem(SEED_KEY) === SEED_VERSAO) return;

    // Usuários demo (mantém os já cadastrados pelo visitante)
    const atuais: Usuario[] = JSON.parse(localStorage.getItem(USUARIOS_KEY) ?? "[]");
    const faltantes = USUARIOS_DEMO.filter(
      (d) => !atuais.some((u) => u.email === d.email),
    );
    if (faltantes.length) {
      localStorage.setItem(USUARIOS_KEY, JSON.stringify([...atuais, ...faltantes]));
    }

    // Coleções do ERP (só preenche as que estiverem vazias)
    for (const [chave, valores] of Object.entries(DADOS)) {
      const existente = localStorage.getItem(chave);
      const vazio = !existente || existente === "[]";
      if (vazio) localStorage.setItem(chave, JSON.stringify(valores));
    }

    const logs = localStorage.getItem("getech:logs");
    if (!logs || logs === "[]") {
      localStorage.setItem(
        "getech:logs",
        JSON.stringify(
          LOGS_DEMO.map((l, i) => ({ ...l, id: uid(), criadoEm: horasAtras(i + 1) })),
        ),
      );
    }

    localStorage.setItem(SEED_KEY, SEED_VERSAO);
  } catch {
    /* localStorage indisponível — segue sem semente */
  }
}
