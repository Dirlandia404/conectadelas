const API_URL = (window.CONECTADELAS_CONFIG?.apiUrl ?? "").replace(/\/$/, "");

const elementos = {
  lista: document.querySelector("#lista-oportunidades"),
  estadoLista: document.querySelector("#estado-lista"),
  filtro: document.querySelector("#filtro-modalidade"),
  formulario: document.querySelector("#form-oportunidade"),
  botaoEnviar: document.querySelector("#botao-enviar"),
  mensagem: document.querySelector("#mensagem-formulario"),
  modelo: document.querySelector("#modelo-oportunidade")
};

let oportunidades = [];

function mostrarEstado(texto, tipo = "") {
  elementos.estadoLista.textContent = texto;
  elementos.estadoLista.className = `estado ${tipo}`.trim();
  elementos.estadoLista.hidden = false;
}

function criarCartao(oportunidade) {
  const fragmento = elementos.modelo.content.cloneNode(true);
  const cartao = fragmento.querySelector("article");

  cartao.querySelector(".modalidade").textContent = oportunidade.modalidade;
  cartao.querySelector(".numero").textContent = `#${String(oportunidade.id).padStart(2, "0")}`;
  cartao.querySelector("h3").textContent = oportunidade.titulo;
  cartao.querySelector(".instituicao").textContent = oportunidade.instituicao;
  cartao.querySelector(".descricao").textContent = oportunidade.descricao;

  const link = cartao.querySelector(".link-oportunidade");
  link.href = oportunidade.link;
  link.setAttribute("aria-label", `Ver oportunidade: ${oportunidade.titulo}`);

  return fragmento;
}

function renderizarOportunidades() {
  const modalidade = elementos.filtro.value;
  const filtradas = modalidade
    ? oportunidades.filter((item) => item.modalidade === modalidade)
    : oportunidades;

  elementos.lista.replaceChildren();

  if (filtradas.length === 0) {
    mostrarEstado("Nenhuma oportunidade foi encontrada para este filtro.", "estado-vazio");
    return;
  }

  elementos.estadoLista.hidden = true;
  const fragmento = document.createDocumentFragment();
  filtradas.forEach((oportunidade) => fragmento.append(criarCartao(oportunidade)));
  elementos.lista.append(fragmento);
}

async function carregarOportunidades() {
  mostrarEstado("Carregando oportunidades...");

  try {
    const resposta = await fetch(`${API_URL}/oportunidades`);
    if (!resposta.ok) throw new Error("A API não respondeu corretamente.");

    oportunidades = await resposta.json();
    renderizarOportunidades();
  } catch (erro) {
    console.error(erro);
    mostrarEstado(
      "Não foi possível carregar as oportunidades. Confira se a API está funcionando.",
      "estado-erro"
    );
  }
}

function limparErros() {
  document.querySelectorAll(".erro-campo").forEach((elemento) => {
    elemento.textContent = "";
  });
}

function mostrarErros(erros = {}) {
  for (const [campo, mensagem] of Object.entries(erros)) {
    const elemento = document.querySelector(`[data-erro="${campo}"]`);
    if (elemento) elemento.textContent = mensagem;
  }
}

async function cadastrarOportunidade(evento) {
  evento.preventDefault();
  limparErros();

  const dados = Object.fromEntries(new FormData(elementos.formulario));
  elementos.botaoEnviar.disabled = true;
  elementos.botaoEnviar.textContent = "Enviando...";
  elementos.mensagem.textContent = "";
  elementos.mensagem.className = "mensagem campo-completo";

  try {
    const resposta = await fetch(`${API_URL}/oportunidades`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      mostrarErros(resultado.erros);
      throw new Error(resultado.mensagem || "Não foi possível realizar o cadastro.");
    }

    elementos.formulario.reset();
    elementos.mensagem.textContent = "Oportunidade cadastrada com sucesso!";
    elementos.mensagem.classList.add("mensagem-sucesso");
    oportunidades.unshift(resultado);
    elementos.filtro.value = "";
    renderizarOportunidades();
    document.querySelector("#oportunidades").scrollIntoView({ behavior: "smooth" });
  } catch (erro) {
    elementos.mensagem.textContent = erro.message;
    elementos.mensagem.classList.add("mensagem-erro");
  } finally {
    elementos.botaoEnviar.disabled = false;
    elementos.botaoEnviar.textContent = "Cadastrar oportunidade";
  }
}

elementos.filtro.addEventListener("change", renderizarOportunidades);
elementos.formulario.addEventListener("submit", cadastrarOportunidade);
carregarOportunidades();
