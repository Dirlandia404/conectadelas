import { criarApp } from "./app.js";
import { criarStore } from "./storage/index.js";

const porta = Number(process.env.PORT) || 3000;
const store = await criarStore();
const app = criarApp(store);

const servidor = app.listen(porta, () => {
  console.log(`ConectaDelas disponível em http://localhost:${porta}`);
});

async function encerrar() {
  servidor.close(async () => {
    await store.close();
    process.exit(0);
  });
}

process.on("SIGINT", encerrar);
process.on("SIGTERM", encerrar);
