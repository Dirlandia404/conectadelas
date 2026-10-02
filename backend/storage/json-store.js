import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export class JsonOpportunityStore {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async init() {
    await mkdir(path.dirname(this.filePath), { recursive: true });

    try {
      await readFile(this.filePath, "utf8");
    } catch (erro) {
      if (erro.code !== "ENOENT") throw erro;
      await this.#write([]);
    }
  }

  async #read() {
    const conteudo = await readFile(this.filePath, "utf8");
    return JSON.parse(conteudo || "[]");
  }

  async #write(oportunidades) {
    const temporario = `${this.filePath}.tmp`;
    await writeFile(temporario, `${JSON.stringify(oportunidades, null, 2)}\n`, "utf8");
    await rename(temporario, this.filePath);
  }

  async list() {
    const oportunidades = await this.#read();
    return oportunidades.sort((a, b) => b.id - a.id);
  }

  async findById(id) {
    const oportunidades = await this.#read();
    return oportunidades.find((item) => item.id === id) ?? null;
  }

  async create(dados) {
    const oportunidades = await this.#read();
    const proximoId = oportunidades.reduce((maior, item) => Math.max(maior, item.id), 0) + 1;
    const nova = { id: proximoId, ...dados, createdAt: new Date().toISOString() };
    oportunidades.push(nova);
    await this.#write(oportunidades);
    return nova;
  }

  async update(id, dados) {
    const oportunidades = await this.#read();
    const indice = oportunidades.findIndex((item) => item.id === id);
    if (indice === -1) return null;

    oportunidades[indice] = {
      ...oportunidades[indice],
      ...dados,
      id,
      updatedAt: new Date().toISOString()
    };
    await this.#write(oportunidades);
    return oportunidades[indice];
  }

  async delete(id) {
    const oportunidades = await this.#read();
    const restantes = oportunidades.filter((item) => item.id !== id);
    if (restantes.length === oportunidades.length) return false;
    await this.#write(restantes);
    return true;
  }

  async close() {}
}
