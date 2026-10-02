import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const pastaSolicitada = process.argv[2] || "frontend";
const porta = Number(process.argv[3]) || 5500;
const raiz = path.resolve(process.cwd(), pastaSolicitada);

const tipos = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

const servidor = createServer(async (req, res) => {
  try {
    const endereco = new URL(req.url, `http://${req.headers.host}`);
    const caminhoDecodificado = decodeURIComponent(endereco.pathname);
    let arquivo = path.resolve(raiz, `.${caminhoDecodificado}`);

    if (!arquivo.startsWith(raiz)) {
      res.writeHead(403).end("Acesso negado");
      return;
    }

    const informacoes = await stat(arquivo).catch(() => null);
    if (informacoes?.isDirectory() || caminhoDecodificado === "/") {
      arquivo = path.join(arquivo, "index.html");
    }

    const conteudo = await readFile(arquivo);
    const tipo = tipos[path.extname(arquivo)] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": tipo, "Cache-Control": "no-store" });
    res.end(conteudo);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Arquivo não encontrado");
  }
});

servidor.listen(porta, () => {
  console.log(`${pastaSolicitada} disponível em http://localhost:${porta}`);
});
