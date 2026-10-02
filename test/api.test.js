import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { criarApp } from "../backend/app.js";
import { JsonOpportunityStore } from "../backend/storage/json-store.js";

async function iniciarApi() {
  const pasta = await mkdtemp(path.join(tmpdir(), "conectadelas-"));
  const arquivo = path.join(pasta, "oportunidades.json");
  await writeFile(arquivo, "[]\n", "utf8");

  const store = new JsonOpportunityStore(arquivo);
  await store.init();
  const app = criarApp(store);
  const servidor = app.listen(0);
  await new Promise((resolve) => servidor.once("listening", resolve));
  const { port } = servidor.address();

  return {
    baseUrl: `http://127.0.0.1:${port}`,
    encerrar: () => new Promise((resolve) => servidor.close(resolve))
  };
}

const exemplo = {
  titulo: "Oficina de programação",
  instituicao: "CodeDelas",
  descricao: "Atividade gratuita para quem está começando.",
  modalidade: "Online",
  link: "https://example.com/inscricao"
};

test("verifica a saúde da API", async () => {
  const api = await iniciarApi();

  try {
    const resposta = await fetch(`${api.baseUrl}/api/health`);
    assert.equal(resposta.status, 200);
    assert.deepEqual(await resposta.json(), { status: "ok", projeto: "ConectaDelas" });
  } finally {
    await api.encerrar();
  }
});

test("cadastra e lista uma oportunidade", async () => {
  const api = await iniciarApi();

  try {
    const cadastro = await fetch(`${api.baseUrl}/oportunidades`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(exemplo)
    });

    assert.equal(cadastro.status, 201);
    const criada = await cadastro.json();
    assert.equal(criada.id, 1);
    assert.equal(criada.titulo, exemplo.titulo);

    const listagem = await fetch(`${api.baseUrl}/oportunidades`);
    assert.equal(listagem.status, 200);
    const oportunidades = await listagem.json();
    assert.equal(oportunidades.length, 1);
    assert.equal(oportunidades[0].instituicao, "CodeDelas");
  } finally {
    await api.encerrar();
  }
});

test("rejeita dados inválidos", async () => {
  const api = await iniciarApi();

  try {
    const resposta = await fetch(`${api.baseUrl}/oportunidades`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...exemplo, descricao: "curta", link: "inválido" })
    });

    assert.equal(resposta.status, 422);
    const corpo = await resposta.json();
    assert.equal(corpo.mensagem, "Confira os dados enviados.");
    assert.ok(corpo.erros.descricao);
    assert.ok(corpo.erros.link);
  } finally {
    await api.encerrar();
  }
});

test("atualiza e exclui uma oportunidade", async () => {
  const api = await iniciarApi();

  try {
    const cadastro = await fetch(`${api.baseUrl}/oportunidades`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(exemplo)
    });
    const criada = await cadastro.json();

    const atualizacao = await fetch(`${api.baseUrl}/oportunidades/${criada.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ modalidade: "Híbrida" })
    });
    assert.equal(atualizacao.status, 200);
    assert.equal((await atualizacao.json()).modalidade, "Híbrida");

    const exclusao = await fetch(`${api.baseUrl}/oportunidades/${criada.id}`, {
      method: "DELETE"
    });
    assert.equal(exclusao.status, 204);

    const consulta = await fetch(`${api.baseUrl}/oportunidades/${criada.id}`);
    assert.equal(consulta.status, 404);
  } finally {
    await api.encerrar();
  }
});
