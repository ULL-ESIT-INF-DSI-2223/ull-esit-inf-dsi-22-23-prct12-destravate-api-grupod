import request from "supertest";
import { app } from "../src/app.js";
import { Grupo } from "../src/models/grupos.js";

const grupo = {
  grupo_id: 999,
  grupo_nombre: "Test",
};

beforeEach(async () => {
  await Grupo.deleteMany({});
  await new Grupo(grupo).save();
});

describe("POST /groups", () => {
  it("Debería crear un grupo", async () => {
    await request(app)
      .post("/groups")
      .send({
        grupo_id: 998,
        grupo_nombre: "corredores",
      })
      .expect(201);
  });
  it("Debería fallar al intentar añadir un grupo existente", async () => {
    await request(app).post("/groups").send(grupo).expect(500);
  });
});

describe("GET /groups", () => {
  it("Debería poder obtener un grupo por su nombre", async () => {
    await request(app).get("/groups?grupo_nombre=Test").expect(200);
  });
  it("Debería poder obtener un grupo por su id", async () => {
    await request(app).get("/groups?grupo_id=999").expect(200);
  });
  it("Debería poder obtener todos los grupos", async () => {
    await request(app).get("/groups").expect(200);
  });
  it("Debería fallar al intentar obtener un grupo que no existe", async () => {
    await request(app).get("/groups?grupo_id=123").expect(404);
  });
});

describe("PATCH /groups", () => {
  it("Debería poder actualizar un grupo por su nombre", async () => {
    await request(app)
      .patch("/groups?grupo_nombre=Test")
      .send({ grupo_nombre: "Test2" })
      .expect(200);
  });
  it("Debería poder actualizar un grupo por su id", async () => {
    await request(app)
      .patch("/groups?grupo_id=999")
      .send({ grupo_nombre: "Test2" })
      .expect(200);
  });
  it("Debería fallar al intentar actualizar un grupo que no existe", async () => {
    await request(app)
      .patch("/groups?grupo_nombre=Test3")
      .send({ grupo_nombre: "Test2" })
      .expect(404);
  });
});

describe("DELETE /groups", () => {
  it("Debería poder eliminar un grupo por su nombre", async () => {
    await request(app).delete("/groups?grupo_nombre=Test").expect(200);
  });
  it("Debería poder eliminar un grupo por su id", async () => {
    await request(app).delete("/groups?grupo_id=999").expect(200);
  });
  it("Debería fallar al intentar eliminar un grupo que no existe", async () => {
    await request(app).delete("/groups?grupo_nombre=Test3").expect(404);
  });
});
