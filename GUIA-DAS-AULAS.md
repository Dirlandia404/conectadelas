# Guia das aulas — Integração e Publicação

Cada vídeo foi planejado para durar entre 15 e 20 minutos. Use as versões da pasta `etapas` para evitar escrever arquivos inteiros durante a gravação.

## Antes de gravar

1. Execute `npm install` e `npm test`.
2. Abra o editor, o navegador e dois terminais.
3. Aumente a fonte do editor e do navegador.
4. Desative notificações.
5. Limpe o console e a aba **Network** antes de cada demonstração.
6. Grave um teste curto para conferir áudio e tamanho do texto.
7. Tenha dados de cadastro já preparados para copiar e colar.

Dados sugeridos:

```text
Título: Clube de Programação para Iniciantes
Instituição: CodeDelas
Modalidade: Online
Descrição: Encontros gratuitos para aprender lógica e criar o primeiro projeto.
Link: https://example.com/clube-programacao
```

---

## Vídeo 1 — Como as partes de uma aplicação se conectam

**Objetivo:** compreender o papel do front-end, back-end, API e banco de dados.

**Arquivos:** `etapas/01-entendendo-a-integracao`.

### 0:00–2:00 — Apresente o problema

Fala sugerida:

> Durante esta série, vamos acompanhar o ConectaDelas, uma aplicação que reúne oportunidades gratuitas para meninas e mulheres na tecnologia. Ao final, nossa aplicação vai buscar dados reais, cadastrar novas oportunidades e ficar acessível por um link.

Mostre a interface e os dois cartões estáticos.

### 2:00–6:00 — Explique as partes

- a usuária interage com o front-end;
- o front-end solicita ou envia informações;
- a API recebe a solicitação;
- o back-end aplica as regras;
- o banco de dados guarda as informações;
- a resposta retorna ao front-end.

Use uma ação concreta:

> Quando a usuária abre esta página, o front-end solicita as oportunidades. O back-end consulta o banco de dados e devolve uma lista. O front-end transforma essa lista nos cartões que enxergamos.

### 6:00–10:00 — Mostre a limitação dos dados estáticos

1. Abra o HTML da etapa 1.
2. Localize um dos cartões.
3. Altere o título manualmente.
4. Atualize o navegador.
5. Explique que essa informação ainda está presa à interface.

Pergunta para as participantes:

> O que aconteceria se tivéssemos cem oportunidades ou se outra pessoa precisasse cadastrar uma nova?

### 10:00–15:00 — Apresente a API

Execute `npm start` e abra `http://localhost:3000/oportunidades`.

Explique:

- rota ou endpoint;
- método `GET`;
- resposta JSON;
- propriedades como `titulo`, `instituicao` e `modalidade`.

Apresente rapidamente os métodos:

- `GET`: buscar;
- `POST`: cadastrar;
- `PUT`: atualizar;
- `DELETE`: excluir.

### 15:00–18:00 — Fechamento

> Agora sabemos onde os dados estão e como a aplicação é organizada. No próximo vídeo, vamos substituir os cartões escritos manualmente por dados recebidos da API.

**Atividade:** desenhar o fluxo do projeto da equipe indicando front-end, back-end e fonte de dados.

---

## Vídeo 2 — Buscando dados reais da API

**Objetivo:** realizar uma requisição `GET` e apresentar a resposta na interface.

**Arquivos:** `etapas/02-buscando-dados`.

### 0:00–2:00 — Retome o fluxo

> A API já possui as oportunidades. Agora o front-end precisa solicitar essas informações e transformá-las em elementos visuais.

### 2:00–6:00 — Apresente o `fetch`

Abra `app.js` e destaque:

```javascript
const resposta = await fetch(`${API_URL}/oportunidades`);
const oportunidades = await resposta.json();
```

Explique que:

- `fetch` realiza a solicitação;
- `await` aguarda a resposta;
- `resposta.json()` converte o JSON em dados utilizáveis pelo JavaScript.

Adicione temporariamente:

```javascript
console.log(oportunidades);
```

Mostre o resultado no console.

### 6:00–12:00 — Transforme dados em cartões

Percorra o `forEach` devagar. Mostre que cada oportunidade recebida cria:

- um `article`;
- uma modalidade;
- um título;
- uma instituição;
- um link.

Não explique cada método da linguagem. Mantenha o foco na transformação dos dados em interface.

### 12:00–16:00 — Use as ferramentas do navegador

1. Abra a aba **Network**.
2. Atualize a página.
3. Clique na requisição `oportunidades`.
4. Mostre URL, método, status e resposta.
5. Relacione o código `200` com uma solicitação bem-sucedida.

### 16:00–19:00 — Demonstre um erro

Pare a API e atualize a página. Mostre a mensagem de erro e explique a importância de informar o estado da aplicação para a usuária.

> Uma integração não deve funcionar somente quando tudo dá certo. Ela também precisa orientar a pessoa quando houver demora ou falha.

**Atividade:** conectar uma tela do projeto da equipe a uma rota `GET`.

---

## Vídeo 3 — Enviando dados pelo formulário

**Objetivo:** cadastrar uma oportunidade com uma requisição `POST`.

**Arquivos:** `etapas/03-enviando-dados`.

### 0:00–3:00 — Mostre o formulário

Apresente os campos e explique que o HTML coleta as informações, mas é o JavaScript que fará o envio.

### 3:00–7:00 — Capture os valores

Destaque:

```javascript
const oportunidade = Object.fromEntries(new FormData(formulario));
```

Adicione um `console.log(oportunidade)` e envie o formulário. Mostre que os valores agora formam um objeto.

### 7:00–13:00 — Realize o `POST`

Explique cada parte da requisição:

```javascript
const resposta = await fetch(`${API_URL}/oportunidades`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(oportunidade)
});
```

- `POST`: intenção de cadastrar;
- `Content-Type`: formato enviado;
- `JSON.stringify`: conversão do objeto para JSON;
- resposta `201`: recurso criado.

### 13:00–16:00 — Atualize a interface

Mostre que, após o cadastro:

- o formulário é limpo;
- aparece uma mensagem de sucesso;
- a lista é carregada novamente;
- o novo item aparece na tela.

### 16:00–19:00 — Validação e segurança

Envie uma descrição curta ou um link inválido. Na aba **Network**, mostre a resposta `422` e as mensagens enviadas pela API.

Reforce:

- validar também no back-end;
- nunca colocar senhas ou chaves privadas no front-end;
- desabilitar o botão enquanto o envio acontece;
- exibir mensagens claras.

**Atividade:** criar um formulário conectado a uma rota `POST`.

---

## Vídeo 4 — Publicando e testando o projeto

**Objetivo:** disponibilizar a aplicação por meio de um endereço público.

**Arquivos:** aplicação final e `etapas/04-publicando-o-projeto/README.md`.

### 0:00–3:00 — Explique local e produção

> Até agora, o projeto funciona apenas no nosso computador. Fazer o deploy é colocar a aplicação em uma infraestrutura acessível pela internet.

Explique que front-end, back-end e banco podem ser publicados juntos ou separadamente.

### 3:00–6:00 — Faça o checklist

- projeto funcionando localmente;
- testes aprovados;
- código no repositório;
- comandos de instalação e inicialização;
- variáveis de ambiente;
- nenhuma senha salva no código.

### 6:00–11:00 — Publique o back-end

Na plataforma escolhida:

1. conecte o repositório;
2. informe `npm install` ou `npm ci`;
3. informe `npm start`;
4. adicione as variáveis de ambiente;
5. inicie a publicação;
6. abra `/api/health`;
7. abra `/oportunidades`.

Explique que o arquivo JSON é adequado à demonstração local, mas um banco externo é recomendado para preservar os cadastros em produção.

### 11:00–15:00 — Publique o front-end

Se publicar separado:

1. copie o endereço da API;
2. coloque-o em `frontend/config.js`;
3. configure `CORS_ORIGIN` com o endereço do front-end;
4. publique a pasta `frontend`;
5. abra o endereço recebido.

Se publicar tudo junto, o back-end já entrega a pasta `frontend` e essa etapa fica mais curta.

### 15:00–18:00 — Teste como usuária

1. abra o link em uma janela anônima;
2. confirme a listagem;
3. cadastre uma oportunidade;
4. atualize a página;
5. teste no celular, se possível;
6. mostre onde consultar os logs.

### 18:00–20:00 — Fechamento da série

> Começamos entendendo a arquitetura, buscamos dados, enviamos informações e colocamos a aplicação no ar. As ferramentas podem mudar, mas esse fluxo estará presente em muitos projetos desenvolvidos por vocês.

**Atividade final:** publicar o MVP da equipe e testar o link em outro dispositivo.

---

## Plano de contingência para a gravação

- mantenha a versão local funcionando caso a plataforma de publicação esteja indisponível;
- grave previamente a parte do deploy que depende de espera;
- não mostre senhas, tokens ou endereços privados;
- tenha uma segunda oportunidade pronta para cadastrar;
- se surgir um erro inesperado, explique como o console, a aba **Network** e os logs ajudam a encontrá-lo;
- mantenha uma versão já publicada para mostrar o resultado final.
