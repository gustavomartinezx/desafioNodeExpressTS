import request from "supertest";
import express from "express";
import { postUSER } from "../controllers/userController";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());
app.post("/users", postUSER);

describe("POST /users", () => {
  it("deve retornar erro se name estiver ausente", async () => {
    const res = await request(app).post("/users").send({
      email: "teste@exemplo.com",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("O campo name é obrigatorio");
  });

  it("deve retornar erro se email estiver ausente", async () => {
    const res = await request(app).post("/users").send({
      name: "Teste",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("O campo email é obrigatorio");
  });

  it("deve verificar se o e-mail ja foi cadastrado", async () => {
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
});
