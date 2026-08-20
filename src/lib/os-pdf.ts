/**
 * Relatório de Ordem de Serviço em PDF.
 * Abre uma janela de impressão já formatada em A4 — o usuário salva como PDF
 * (no Android/Chrome a opção "Salvar como PDF" aparece no mesmo diálogo).
 */
export interface OSParaPDF {
  id: string;
  criadoEm: string;
  maquina: string;
  setor?: string;
  tipo: string;
  responsavel?: string;
  status: string;
  observacoes?: string;
  fotos?: string[];
}

function escapar(v: string) {
  return v.replace(/[&<>"]/g, (c) => `&${{ "&": "amp", "<": "lt", ">": "gt", '"': "quot" }[c]};`);
}

export function gerarPDFOrdem(os: OSParaPDF) {
  const numero = os.id.slice(0, 8).toUpperCase();
  const data = new Date(os.criadoEm).toLocaleString("pt-BR");
  const linha = (rotulo: string, valor: string) =>
    `<tr><th>${escapar(rotulo)}</th><td>${escapar(valor || "—")}</td></tr>`;

  const fotos = (os.fotos ?? [])
    .map((src) => `<img src="${src}" alt="Anexo da ordem de serviço" />`)
    .join("");

  const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8" />
<title>OS-${numero} - GeTech</title>
<style>
  @page { size: A4; margin: 16mm; }
  * { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
  body { color: #10182a; }
  header { display: flex; justify-content: space-between; align-items: flex-end;
    border-bottom: 3px solid #f59e0b; padding-bottom: 10px; }
  h1 { font-size: 20px; margin: 0; }
  .sub { font-size: 12px; color: #55607a; }
  table { width: 100%; border-collapse: collapse; margin-top: 18px; font-size: 13px; }
  th, td { border: 1px solid #d7dce6; padding: 8px; text-align: left; }
  th { background: #f2f5fa; width: 32%; }
  h2 { font-size: 14px; margin: 22px 0 8px; }
  .fotos { display: flex; flex-wrap: wrap; gap: 8px; }
  .fotos img { width: 47%; border: 1px solid #d7dce6; border-radius: 4px; }
  .assinaturas { display: flex; gap: 32px; margin-top: 48px; font-size: 12px; }
  .assinaturas div { flex: 1; border-top: 1px solid #10182a; padding-top: 6px; text-align: center; }
  footer { margin-top: 28px; font-size: 10px; color: #7b8398; }
</style></head>
<body>
  <header>
    <div><h1>GeTech Soluções Industriais</h1>
      <div class="sub">Ordem de Serviço de Manutenção</div></div>
    <div class="sub"><strong>OS-${numero}</strong><br />${escapar(data)}</div>
  </header>
  <table>
    ${linha("Máquina / equipamento", os.maquina)}
    ${linha("Setor", os.setor ?? "")}
    ${linha("Tipo de manutenção", os.tipo)}
    ${linha("Responsável técnico", os.responsavel ?? "")}
    ${linha("Status", os.status)}
    ${linha("Abertura", data)}
  </table>
  <h2>Observações técnicas</h2>
  <table><tr><td style="height:70px">${escapar(os.observacoes ?? "")}</td></tr></table>
  ${fotos ? `<h2>Registros fotográficos</h2><div class="fotos">${fotos}</div>` : ""}
  <div class="assinaturas">
    <div>Técnico responsável</div><div>Responsável pelo setor</div>
  </div>
  <footer>Documento gerado pelo ERP GeTech em ${escapar(new Date().toLocaleString("pt-BR"))}.</footer>
</body></html>`;

  const janela = window.open("", "_blank", "width=900,height=1000");
  if (!janela) return false;
  janela.document.write(html);
  janela.document.close();
  janela.focus();
  setTimeout(() => janela.print(), 400);
  return true;
}
