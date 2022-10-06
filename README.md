<h1 align="center">FinApi</h1>

<p align="center">A Fin Api é uma aplicação financeira onde é possível fazer depósitos, retiradas e consultas em uma conta.</p>

## 💻 Projeto

Esse se trata de um desafio da trilha de Node.js do programa Ignite oferecido pela [Rocketseat](https://rocketseat.com.br).

Para concluir este desafio tive que desenvolver testes unitários e testes de integração.

## ✨ Tecnologias e Ferramentas

Este projeto foi desenvolvido com as seguintes tecnologias:

- [Node.js](https://nodejs.org/en/)
- [Typescript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/)
- [Docker](https://www.docker.com/)
- [Jest](https://jestjs.io/)
- [Typeorm](https://typeorm.io/)
- [Postgres](https://www.postgresql.org/)

## 🛠️ Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas: [Git](https://git-scm.com/), [Node.js](https://git-scm.com/), [Docker](https://www.docker.com/), [Yarn (Opcional)](https://yarnpkg.com/).

## 🚀 Como executar?

### Passos iniciais

- Clone o repositório e acesse o diretório.
- Execute `yarn` para instalar as dependências.
- Execute os containers em docker com `docker-compose up -d`
- Execute `yarn typeorm migration:run` para criar a estrutura do banco de dados

### Executar Localmente

- Após executar os passos iniciais
- Execute `yarn dev` para iniciar a aplicação em ambiente local

### Executar testes

- Após executar os passos iniciais
- Crie uma tabela no banco de dados com nome `fin_api_test`
- Execute `yarn test`

## Autor

<img
  style="border-radius: 50%;"
  src="https://avatars.githubusercontent.com/jordane-chaves"
  width="100px;"
  title="Foto de Jordane Chaves"
  alt="Foto de Jordane Chaves"
/>
<br />

Feito com 💜 por Jordane Chaves
