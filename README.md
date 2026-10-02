# ConectaDelas

Projeto didático criado para a série **Integração e Publicação: da interface ao projeto no ar**, do CodeDelas.

A aplicação divulga oportunidades gratuitas de cursos, eventos e capacitações para meninas e mulheres interessadas em tecnologia. Ela foi construída para demonstrar, em um exemplo pequeno e completo, como o front-end se comunica com uma API e como o projeto pode ser publicado.

## Tecnologias

- front-end: HTML, CSS e JavaScript;
- back-end: Node.js e Express;
- desenvolvimento local: arquivo JSON;
- produção: PostgreSQL opcional;
- testes: módulo de testes nativo do Node.js.

## O que está pronto

- interface responsiva e acessível;
- listagem de oportunidades;
- filtro por modalidade;
- cadastro com validação;
- mensagens de carregamento, sucesso e erro;
- API REST com operações de listar, consultar, cadastrar, atualizar e excluir;
- armazenamento local em JSON;
- suporte opcional a PostgreSQL por variável de ambiente;
- quatro etapas didáticas para as gravações;
- guia detalhado das quatro aulas;
- testes automatizados da API.

## Requisitos

- Node.js 20 ou superior;
- npm.

## Executar rapidamente

No terminal, dentro da pasta do projeto:

```bash
npm install
npm run dev
```

Depois, abra:

- aplicação completa: `http://localhost:5500`;
- API: `http://localhost:3000/oportunidades`;
- verificação da API: `http://localhost:3000/api/health`.

Também é possível executar tudo pelo mesmo endereço:

```bash
npm start
```

Nesse caso, abra `http://localhost:3000`.

## Rotas da API

| Método | Rota | Finalidade |
| --- | --- | --- |
| `GET` | `/api/health` | Verificar se a API está funcionando |
| `GET` | `/oportunidades` | Listar todas as oportunidades |
| `GET` | `/oportunidades/:id` | Consultar uma oportunidade |
| `POST` | `/oportunidades` | Cadastrar uma oportunidade |
| `PUT` | `/oportunidades/:id` | Atualizar uma oportunidade |
| `DELETE` | `/oportunidades/:id` | Excluir uma oportunidade |

Exemplo de cadastro:

```json
{
  "titulo": "Oficina de lógica de programação",
  "instituicao": "CodeDelas",
  "descricao": "Atividade introdutória e gratuita para iniciantes.",
  "modalidade": "Online",
  "link": "https://example.com/inscricao"
}
```

## Etapas para as aulas

| Aula | Pasta | Comando | O que demonstra |
| --- | --- | --- | --- |
| 1 | `etapas/01-entendendo-a-integracao` | `npm run etapa:1` | Interface estática e arquitetura |
| 2 | `etapas/02-buscando-dados` | `npm run etapa:2` | Requisição `GET` |
| 3 | `etapas/03-enviando-dados` | `npm run etapa:3` | Requisições `GET` e `POST` |
| 4 | `etapas/04-publicando-o-projeto` | — | Publicação da versão completa |

Nas etapas 2 e 3, mantenha a API ligada com `npm start` em outro terminal.

## Variáveis de ambiente

Copie `.env.example` como referência e configure as variáveis diretamente no terminal ou na plataforma de hospedagem.

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `PORT` | Não | Porta da API; padrão `3000` |
| `CORS_ORIGIN` | Não | Endereços de front-end autorizados, separados por vírgula |
| `DATABASE_URL` | Não | Conexão com PostgreSQL |
| `DATABASE_SSL` | Não | Use `true` quando o provedor exigir SSL |
| `DATA_FILE` | Não | Arquivo JSON alternativo para desenvolvimento ou testes |

Sem `DATABASE_URL`, o projeto grava em `data/oportunidades.json`.

## Usar PostgreSQL

Defina a conexão antes de iniciar:

```bash
export DATABASE_URL="postgresql://usuario:senha@servidor:5432/banco"
export DATABASE_SSL="true"
npm start
```

A tabela é criada automaticamente na primeira execução.

## Publicação

### Uma única publicação

O Express já serve a pasta `frontend`. Para publicar tudo junto em um serviço Node.js:

- comando de instalação: `npm install` ou `npm ci`;
- comando de inicialização: `npm start`;
- rota de verificação: `/api/health`.

Configure `DATABASE_URL` para que os cadastros persistam após reinicializações do serviço.

### Front-end e back-end separados

1. Publique a API e copie o endereço recebido.
2. Em `frontend/config.js`, informe esse endereço em `apiUrl`.
3. No back-end, configure `CORS_ORIGIN` com o endereço público do front-end.
4. Publique a pasta `frontend` em uma hospedagem de sites estáticos.

## Testes

```bash
npm test
```

Os testes usam um arquivo temporário e não alteram os exemplos da pasta `data`.

## Arquivos importantes

- `GUIA-DAS-AULAS.md`: roteiro completo para os quatro vídeos;
- `frontend/app.js`: integração final do front-end;
- `backend/app.js`: rotas da API;
- `backend/services/validacao.js`: regras de validação;
- `backend/storage`: armazenamento em JSON e PostgreSQL;
- `etapas`: versões utilizadas em cada gravação.
