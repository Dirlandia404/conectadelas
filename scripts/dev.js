import { spawn } from "node:child_process";

const processos = [
  spawn(process.execPath, ["backend/server.js"], { stdio: "inherit" }),
  spawn(process.execPath, ["scripts/serve-static.js", "frontend", "5500"], { stdio: "inherit" })
];

function encerrar() {
  for (const processo of processos) processo.kill("SIGTERM");
}

for (const processo of processos) {
  processo.on("exit", (codigo) => {
    if (codigo && codigo !== 0) process.exitCode = codigo;
  });
}

process.on("SIGINT", encerrar);
process.on("SIGTERM", encerrar);
