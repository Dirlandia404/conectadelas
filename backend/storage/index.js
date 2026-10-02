import path from "node:path";
import { fileURLToPath } from "node:url";
import { JsonOpportunityStore } from "./json-store.js";
import { PostgresOpportunityStore } from "./postgres-store.js";

const diretorioAtual = path.dirname(fileURLToPath(import.meta.url));
const arquivoPadrao = path.resolve(diretorioAtual, "../../data/oportunidades.json");

export async function criarStore({
  databaseUrl = process.env.DATABASE_URL,
  databaseSsl = process.env.DATABASE_SSL === "true",
  jsonFile = process.env.DATA_FILE || arquivoPadrao
} = {}) {
  const store = databaseUrl
    ? new PostgresOpportunityStore(databaseUrl, { ssl: databaseSsl })
    : new JsonOpportunityStore(jsonFile);

  await store.init();
  return store;
}
