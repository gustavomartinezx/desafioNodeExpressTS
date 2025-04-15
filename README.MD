# ⤹ Projeto CRUD com Node.js, TypeScript e Express [🚀]

Este é um projeto de CRUD para o INOVATEC. Ele inclui autenticação com JWT, banco de dados PostgreSQL e arquitetura organizada com controllers, middlewares e services.

---

## Tecnologias utilizadas

- Node.js
- Jest
- TypeScript
- Express
- Sequelize
- PostgreSQL
- JWT
- Dotenv
- ts-node-dev

---

## ⚙️ Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/seu-projeto.git
cd seu-projeto
```

2. Instale as dependências:

```
npm install
```

3. Crie um arquivo .env baseado no .env.example

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=sua_senha
DB_NAME=seu_banco
JWT_SECRET=sua_chave_secreta
```

4. Rode o projeto

```
npm run dev
```

---

## Endpoints

| Método     | Endpoint      | Descrição                                                                   | Corpo da Requisição                                             | Resposta                                                  | Autenticação Requerida |
| ---------- | ------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------- | ---------------------- |
| **POST**   | `/auth/login` | Recebe email, valida se o usuário existe e retorna um token JWT.            | `{"email": "exemplo@dominio.com", "name": "Nome do Usuário"}`   | 200 OK (Token JWT) ou 401 Unauthorized (Erro)             | Não                    |
| **POST**   | `/users`      | Cria um novo usuário com `name`, `email` e `age` (opcional).                | `{"name": "Nome", "email": "exemplo@dominio.com", "age": 25}`   | 201 Created (Usuário criado) ou 400/500 (Erro)            | Não                    |
| **GET**    | `/users`      | Lista todos os usuários.                                                    | Não aplicável                                                   | 200 OK (Lista de usuários)                                | Sim (Token válido)     |
| **GET**    | `/users/:id`  | Busca um usuário pelo `id`.                                                 | Não aplicável                                                   | 200 OK (Usuário) ou 404 Not Found (Erro)                  | Sim (Token válido)     |
| **PUT**    | `/users/:id`  | Atualiza um usuário pelo `id`, permitindo alterar `name`, `email` ou `age`. | `{"name": "Novo Nome", "email": "novo@dominio.com", "age": 30}` | 200 OK (Usuário atualizado) ou 404 Not Found (Erro)       | Sim (Token válido)     |
| **DELETE** | `/users/:id`  | Remove um usuário pelo `id`.                                                | Não aplicável                                                   | 204 No Content (Usuário removido) ou 404 Not Found (Erro) | Sim (Token válido)     |

---

## Rodando o projeto no insomnia

### 📥 Importação do Workspace

Você pode testar todos os endpoints importando o arquivo `.txt` exportado do Insomnia:

1. Abra o Insomnia.
2. Vá em **Application** → **Import Data** → **From File**.
3. Selecione o arquivo exportado **arquivoInsomnia.txt**
4. O workspace com todas as requisições será adicionado automaticamente.

### 🔐 Uso da variável `{{userTOKEN}}`

Para os endpoints que requerem autenticação, o token JWT é passado no header como variável:

```http
Authorization: Bearer {{userTOKEN}}
```

Após fazer login usando o endpoint POST /auth/login, copie o token retornado e cole na variável usertoken:

Clique no topo da tela onde está escrito Environment.

Adicione ou edite a variável assim:

```
{
	"_BASEURL_": "http://localhost:3000/",
	"userTOKEN": "TOKEN"*
}
```

Com isso, você pode testar facilmente todos os endpoints autenticados e não autenticados do seu projeto no Insomnia

---

## 🧪 Testes Unitários

O projeto utiliza o **Jest** na lógica de testes unitários

### ▶️ Executando os testes

Para rodar os testes, basta usar o seguinte comando:

```
npm test
```

#### Exemplo de Teste

Aqui está um exemplo de um teste unitário implementado para a rota `POST /users`:

```javascript
it("deve verificar se o e-mail já foi cadastrado", async () => {
  await request(app).post("/users").send({
    name: "Teste",
    email: "teste@exemplo.com",
  });

  const res = await request(app).post("/users").send({
    name: "Teste 2",
    email: "teste@exemplo.com",
  });

  expect(res.status).toBe(400);
  expect(res.body.error).toBe("Email já cadastrado");
});
```

Este teste tem como objetivo garantir que o sistema não permita a criação de usuários com e-mails duplicados. Aqui estão os detalhes:

- Primeiro, criamos um usuário com o e-mail `teste@exemplo.com`.
- Em seguida, tentamos criar outro usuário com o mesmo e-mail.
- Esperamos que o servidor retorne um erro `400 Bad Request`, juntamente com a mensagem `"Email já cadastrado"`, garantindo que a validação de e-mails duplicados esteja funcionando corretamente.
