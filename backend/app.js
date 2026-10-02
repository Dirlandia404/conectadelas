import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validarOportunidade } from "./services/validacao.js";

const diretorioAtual = path.dirname(fileURLToPath(import.meta.url));
const diretorioFrontend = path.resolve(diretorioAtual, "../frontend");

function lerId(valor) {
  const id = Number(valor);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function configurarCors() {
  const origens = (process.env.CORS_ORIGIN ?? "")
    .split(",")
    .map((origem) => origem.trim())
    .filter(Boolean);

  return cors({
    origin(origem, callback) {
      if (!origem || origens.length === 0 || origens.includes(origem)) {
        callback(null, true);
        return;
      }
      callback(new Error("Origem não autorizada pelo CORS."));
    }
  });
}

export function criarApp(store) {
  const app = express();

  app.disable("x-powered-by");
  app.use(configurarCors());
  app.use(express.json({ limit: "50kb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", projeto: "ConectaDelas" });
  });

  app.get("/oportunidades", async (_req, res, next) => {
    try {
      res.json(await store.list());
    } catch (erro) {
      next(erro);
    }
  });

  app.get("/oportunidades/:id", async (req, res, next) => {
    try {
      const id = lerId(req.params.id);
      if (!id) return res.status(400).json({ mensagem: "Identificador inválido." });

      const oportunidade = await store.findById(id);
      if (!oportunidade) return res.status(404).json({ mensagem: "Oportunidade não encontrada." });

      return res.json(oportunidade);
    } catch (erro) {
      return next(erro);
    }
  });

  app.post("/oportunidades", async (req, res, next) => {
    try {
      const resultado = validarOportunidade(req.body);
      if (!resultado.valido) {
        return res.status(422).json({
          mensagem: "Confira os dados enviados.",
          erros: resultado.erros
        });
      }

      const criada = await store.create(resultado.oportunidade);
      return res.status(201).json(criada);
    } catch (erro) {
      return next(erro);
    }
  });

  app.put("/oportunidades/:id", async (req, res, next) => {
    try {
      const id = lerId(req.params.id);
      if (!id) return res.status(400).json({ mensagem: "Identificador inválido." });

      const resultado = validarOportunidade(req.body, { parcial: true });
      if (!resultado.valido || Object.keys(resultado.oportunidade).length === 0) {
        return res.status(422).json({
          mensagem: "Confira os dados enviados.",
          erros: resultado.erros
        });
      }

      const atualizada = await store.update(id, resultado.oportunidade);
      if (!atualizada) return res.status(404).json({ mensagem: "Oportunidade não encontrada." });

      return res.json(atualizada);
    } catch (erro) {
      return next(erro);
    }
  });

  app.delete("/oportunidades/:id", async (req, res, next) => {
    try {
      const id = lerId(req.params.id);
      if (!id) return res.status(400).json({ mensagem: "Identificador inválido." });

      const excluida = await store.delete(id);
      if (!excluida) return res.status(404).json({ mensagem: "Oportunidade não encontrada." });

      return res.status(204).send();
    } catch (erro) {
      return next(erro);
    }
  });

  app.use(express.static(diretorioFrontend));

  app.use((req, res) => {
    if (req.path.startsWith("/api/") || req.path.startsWith("/oportunidades")) {
      return res.status(404).json({ mensagem: "Rota não encontrada." });
    }
    return res.status(404).sendFile(path.join(diretorioFrontend, "404.html"));
  });

  app.use((erro, _req, res, _next) => {
    console.error(erro);

    if (erro.message === "Origem não autorizada pelo CORS.") {
      return res.status(403).json({ mensagem: erro.message });
    }

    if (erro instanceof SyntaxError && "body" in erro) {
      return res.status(400).json({ mensagem: "O corpo da requisição contém JSON inválido." });
    }

    return res.status(500).json({ mensagem: "Ocorreu um erro interno no servidor." });
  });

  return app;
}
