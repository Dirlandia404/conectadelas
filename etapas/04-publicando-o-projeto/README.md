# Etapa 4 — Publicando o projeto

Nesta aula, use a aplicação completa da pasta `frontend` junto com a API da pasta `backend`.

## Antes da gravação

1. Execute `npm test`.
2. Execute `npm start` e acesse `http://localhost:3000`.
3. Crie previamente as contas nas plataformas escolhidas.
4. Tenha o repositório do projeto disponível.
5. Se usar PostgreSQL, tenha a variável `DATABASE_URL` em mãos.

## Caminho simples: uma única publicação

O back-end já serve os arquivos da pasta `frontend`. Publique o repositório como um serviço Node.js usando:

- instalação: `npm install` ou `npm ci`;
- inicialização: `npm start`;
- verificação: `/api/health`.

Se nenhuma `DATABASE_URL` for informada, a aplicação usa o arquivo JSON. Alguns serviços apagam alterações feitas nesse arquivo quando reiniciam. Para persistência real, utilize PostgreSQL.

## Caminho didático: front-end e back-end separados

1. Publique o back-end como serviço Node.js.
2. Copie o endereço público recebido.
3. Abra `frontend/config.js`.
4. Informe o endereço em `apiUrl`.
5. Defina `CORS_ORIGIN` no back-end com o endereço do front-end.
6. Publique somente a pasta `frontend` em uma hospedagem estática.
7. Teste listagem e cadastro usando o endereço público.

## Erros para demonstrar

- URL da API incorreta;
- `CORS_ORIGIN` sem o endereço do front-end;
- variável `DATABASE_URL` ausente;
- comando de inicialização incorreto;
- erro de rede visível na aba **Network**;
- detalhes do problema nos logs da plataforma.
