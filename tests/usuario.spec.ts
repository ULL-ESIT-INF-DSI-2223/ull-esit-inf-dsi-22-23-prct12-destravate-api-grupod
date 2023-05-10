import request from "supertest";
import { app } from "../src/app.js";
import { Usuario } from "../src/models/usuarios.js";

const usuario = {
  usuario_id: 999,
  usuario_nombre: "Test",
  actividad: "correr",
};

beforeEach(async () => {
  await Usuario.deleteMany({});
  await new Usuario(usuario).save();
});

describe("POST /users", () => {
  it("Debería crear un usuario", async () => {
    await request(app)
      .post("/users")
      .send({
        usuario_id: 998,
        usuario_nombre: "febe",
        actividad: "bicicleta",
      })
      .expect(201);
  });
  it("Debería fallar al intentar añadir un usuario existente", async () => {
    await request(app).post("/users").send(usuario).expect(500);
  });
});

describe("GET /users", () => {
  it("Debería poder obtener un usuario por su nombre", async () => {
    await request(app).get("/users?usuario_nombre=Test").expect(200);
  });
  it("Debería poder obtener un usuario por su id", async () => {
    await request(app).get("/users?usuario_id=999").expect(200);
  });
  it("Debería poder obtener todos los usuarios", async () => {
    await request(app).get("/users").expect(200);
  });
  it("Debería fallar al intentar obtener un usuario que no existe", async () => {
    await request(app).get("/users?usuario_id=123").expect(404);
  });
});

describe("PATCH /users", () => {
  it("Debería poder actualizar un usuario por su nombre", async () => {
    await request(app)
      .patch("/users?usuario_nombre=Test")
      .send({ usuario_nombre: "Test2" })
      .expect(200);
  });
  it("Debería poder actualizar un usuario por su id", async () => {
    await request(app)
      .patch("/users?usuario_id=999")
      .send({ usuario_nombre: "Test2" })
      .expect(200);
  });
  it("Debería fallar al intentar actualizar un usuario que no existe", async () => {
    await request(app)
      .patch("/users?usuario_nombre=Test3")
      .send({ usuario_nombre: "Test2" })
      .expect(404);
  });
});

describe("DELETE /users", () => {
  it("Debería poder eliminar un usuario por su nombre", async () => {
    await request(app).delete("/users?usuario_nombre=Test").expect(200);
  });
  it("Debería poder eliminar un usuario por su id", async () => {
    await request(app).delete("/users?usuario_id=999").expect(200);
  });
  it("Debería fallar al intentar eliminar un usuario que no existe", async () => {
    await request(app).delete("/users?usuario_nombre=Test3").expect(404);
  });
});
