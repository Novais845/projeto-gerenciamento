# API de Gerenciamento de Projetos e Tarefas

API REST desenvolvida com Node.js, Express e MongoDB para o cadastro e gerenciamento de projetos e tarefas.

## Requisitos

- Node.js 18 ou superior;
- MongoDB local em execução ou uma instância MongoDB Atlas.

## Instalação e execução

```bash
npm install
copy .env.example .env
npm run seed
npm start
```

No Linux/macOS, use `cp .env.example .env` no lugar de `copy`. Ajuste `MONGODB_URI` no `.env` quando necessário. A API inicia por padrão em `http://localhost:3000`.

O comando `npm run seed` insere os três projetos iniciais apenas quando a coleção está vazia.

## Endpoints

| Método | Endpoint | Função |
|---|---|---|
| GET | `/projetos` | Lista projetos; aceita `nome` e `tarefa` |
| GET | `/projetos/:codigo` | Busca um projeto |
| GET | `/projetos/:codigo/tarefas` | Lista tarefas |
| POST | `/projetos` | Cadastra projeto |
| PUT | `/projetos/:codigo` | Atualiza o nome |
| DELETE | `/projetos/:codigo` | Exclui projeto e tarefas |
| POST | `/projetos/:codigo/tarefas` | Adiciona tarefa |
| PUT | `/projetos/:codigo/tarefas/:codigoTarefa` | Atualiza tarefa |
| DELETE | `/projetos/:codigo/tarefas/:codigoTarefa` | Exclui tarefa |
| GET | `/projetos/:codigo/resumo` | Exibe resumo do projeto |

Projetos precisam de `codigo` e `nome`. Tarefas precisam de `codigo`, `nome` e `responsavel`. Códigos duplicados retornam HTTP 409; campos inválidos retornam 400 e registros inexistentes retornam 404.

## Evidências

Os 22 prints solicitados devem ser executados no Postman ou Thunder Client e salvos em `evidencias/sucesso` e `evidencias/erros`, conforme a lista do enunciado. Cada print deve mostrar método, URL, corpo (se houver), status e resposta.
