/** Exportação de relatórios locais (CSV), equivalente ao "Gerar Relatório" do site. */
export function baixarCSV(nomeArquivo: string, colunas: string[], linhas: (string | number)[][]) {
  const escapar = (v: string | number) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [colunas, ...linhas].map((l) => l.map(escapar).join(";")).join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${nomeArquivo}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Consulta de CEP (ViaCEP), igual ao autopreenchimento de endereço do site. */
export async function buscarCEP(cep: string) {
  const limpo = cep.replace(/\D/g, "");
  if (limpo.length !== 8) return null;
  try {
    const r = await fetch(`https://viacep.com.br/ws/${limpo}/json/`);
    const d = (await r.json()) as {
      erro?: boolean;
      logradouro?: string;
      bairro?: string;
      localidade?: string;
    };
    if (d.erro) return null;
    return { rua: d.logradouro ?? "", bairro: d.bairro ?? "", cidade: d.localidade ?? "" };
  } catch {
    return null;
  }
}
