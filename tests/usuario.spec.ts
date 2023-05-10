import request from "supertest";
import { app } from "../src/app.js";
import { Usuario } from "../src/models/usuarios.js";

beforeEach(async () => {
  await Usuario.deleteMany({});
});

describe("POST /users", () => {
  it("Debería crear un usuario", async () => {
    await request(app)
      .post("/users")
      .send({
        usuario_id: 999,
        usuario_nombre: "Test",
        actividad: "correr",
      })
      .expect(201);
  });
});
