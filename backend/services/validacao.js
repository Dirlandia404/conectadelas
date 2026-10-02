const MODALIDADES = ["Online", "Presencial", "Híbrida"];

function texto(valor) {
  return typeof valor === "string" ? valor.trim() : "";
}

function urlValida(valor) {
  try {
    const url = new URL(valor);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function validarOportunidade(dados, { parcial = false } = {}) {
  const campos = ["titulo", "instituicao", "descricao", "modalidade", "link"];
  const erros = {};
  const oportunidade = {};

  for (const campo of campos) {
    const foiEnviado = Object.prototype.hasOwnProperty.call(dados ?? {}, campo);

    if (parcial && !foiEnviado) continue;

    const valor = texto(dados?.[campo]);
    oportunidade[campo] = valor;

    if (!valor) erros[campo] = "Este campo é obrigatório.";
  }

  if (oportunidade.titulo && oportunidade.titulo.length < 4) {
    erros.titulo = "Informe um título com pelo menos 4 caracteres.";
  }

  if (oportunidade.descricao && oportunidade.descricao.length < 10) {
    erros.descricao = "Informe uma descrição com pelo menos 10 caracteres.";
  }

  if (oportunidade.modalidade && !MODALIDADES.includes(oportunidade.modalidade)) {
    erros.modalidade = `Use uma destas opções: ${MODALIDADES.join(", ")}.`;
  }

  if (oportunidade.link && !urlValida(oportunidade.link)) {
    erros.link = "Informe um endereço iniciado por http:// ou https://.";
  }

  return {
    valido: Object.keys(erros).length === 0,
    erros,
    oportunidade
  };
}

export { MODALIDADES };
