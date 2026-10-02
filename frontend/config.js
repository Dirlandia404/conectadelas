// Ao publicar o front-end separadamente, informe aqui o endereço público da API.
// Exemplo: apiUrl: "https://minha-api.exemplo.com"
window.CONECTADELAS_CONFIG = {
  apiUrl: window.location.port === "5500" ? "http://localhost:3000" : ""
};
