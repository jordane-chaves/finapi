<h1 align="center">FinAPI Financeira</h1>

<p>A FinAPI é uma aplicação financeira básica, onde é possível criar uma conta para o cliente e fazer transações financeiras, que são salvas em uma variável da aplicação.</p>

## Rotas

Url Base: ```http://localhost:3333```

### 👤 Conta

Criar conta

- Request: POST ```/account```

```json
{
	"cpf": "55555555555",
	"name": "Nome"
}
```

---

Obter dados de uma conta

- Request: GET ```/account```

Enviando o ```cpf``` nos headers.

---

Atualizar uma conta

- Request: PUT ```/account```

```json
{
	"name": "Nome"
}
```

Enviando o ```cpf``` nos headers.

---

Obter dados de uma conta

- Request: DELETE ```/account```

Enviando o ```cpf``` nos headers.

---

### 💵 Movimentações

> Em todas as rotas será necessário enviar o ```cpf``` nos headers.

Depositar na conta

- Request: POST ```/deposit```

```json
{
	"description": "Depósito na conta",
	"amount": 3500.00
}
```

---

Fazer saque

- Request: POST ```/withdraw```

```json
{
	"amount": 100
}
```

---

### Detalhes das movimentações

> Em todas as rotas será necessário enviar o ```cpf``` nos headers.

Obter todo o histórico de movimentações

- Request: GET ```/statement```

---

Obter o histórico de movimentações por **data**.

- Request: GET ```/statement/date?date=2022-05-21```

---

Obter o saldo

- Request: GET ```/balance```

---

## 📝 Requisitos

- [x] Deve ser possível criar uma conta
- [x] Deve ser possível buscar o extrato bancário do cliente
- [x] Deve ser possível realizar um depósito
- [x] Deve ser possível realizar um saque
- [x] Deve ser possível buscar o extrato bancário do cliente por data
- [x] Deve ser possível atualizar dados da conta do cliente
- [x] Deve ser possível obter dados da conta do cliente
- [x] Deve ser possível deletar uma conta
- [x] Deve ser possível retornar o balance

## 📋 Regras de negócio

- [x] Não deve ser possível cadastrar uma conta com CPF já existente
- [x] Não deve ser possível buscar extrato em uma conta não existente
- [x] Não deve ser possível fazer depósito em uma conta não existente
- [x] Não deve ser possível fazer saque em uma conta não existente
- [x] Não deve ser possível fazer saque quando o saldo for insuficiente
- [x] Não deve ser possível excluir uma conta não existente

## Autor

<img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/jordane-chaves" width="100px;" alt=""/>
<br />

Feito com 💜 por Jordane Chaves