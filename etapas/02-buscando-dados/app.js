const API_URL = "http://localhost:3000";
const lista = document.querySelector("#lista");
const estado = document.querySelector("#estado");

async function carregarOportunidades() {
  try {
    const resposta = await fetch(`${API_URL}/oportunidades`);

    if (!resposta.ok) {
      throw new Error("A API não respondeu corretamente.");
    }

    const oportunidades = await resposta.json();
    estado.hidden = true;

    oportunidades.forEach((oportunidade) => {
      const cartao = document.createElement("article");

      const modalidade = document.createElement("span");
      modalidade.textContent = oportunidade.modalidade;

      const titulo = document.createElement("h2");
      titulo.textContent = oportunidade.titulo;

      const instituicao = document.createElement("p");
      instituicao.textContent = oportunidade.instituicao;

      const link = document.createElement("a");
      link.href = oportunidade.link;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Ver oportunidade";

      cartao.append(modalidade, titulo, instituicao, link);
      lista.append(cartao);
    });
  } catch (erro) {
    console.error(erro);
    estado.textContent = "Não foi possível carregar as oportunidades.";
    estado.classList.add("erro");
  }
}

carregarOportunidades();
