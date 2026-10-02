const API_URL = "http://localhost:3000";
const formulario = document.querySelector("#formulario");
const lista = document.querySelector("#lista");
const mensagem = document.querySelector("#mensagem");
const botao = document.querySelector("#enviar");

function mostrarOportunidades(oportunidades) {
  lista.replaceChildren();

  oportunidades.forEach((oportunidade) => {
    const cartao = document.createElement("article");
    const titulo = document.createElement("h3");
    const instituicao = document.createElement("p");

    titulo.textContent = oportunidade.titulo;
    instituicao.textContent = `${oportunidade.instituicao} · ${oportunidade.modalidade}`;
    cartao.append(titulo, instituicao);
    lista.append(cartao);
  });
}

async function carregarOportunidades() {
  const resposta = await fetch(`${API_URL}/oportunidades`);
  const oportunidades = await resposta.json();
  mostrarOportunidades(oportunidades);
}

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  mensagem.textContent = "";
  mensagem.className = "";
  botao.disabled = true;
  botao.textContent = "Enviando...";

  try {
    const oportunidade = Object.fromEntries(new FormData(formulario));
    const resposta = await fetch(`${API_URL}/oportunidades`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(oportunidade)
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.mensagem || "Não foi possível cadastrar.");
    }

    mensagem.textContent = "Oportunidade cadastrada com sucesso!";
    mensagem.className = "sucesso";
    formulario.reset();
    await carregarOportunidades();
  } catch (erro) {
    mensagem.textContent = erro.message;
    mensagem.className = "erro";
  } finally {
    botao.disabled = false;
    botao.textContent = "Cadastrar";
  }
});

carregarOportunidades().catch(() => {
  lista.textContent = "Não foi possível carregar os dados.";
});
