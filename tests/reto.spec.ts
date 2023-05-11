import request from "supertest";
import { app } from "../src/app.js";
import { Reto } from "../src/models/retos.js";
import { expect } from "chai";

const reto = {
  reto_id: 999,
  reto_nombre: "Test",
  tipo: "correr",
  km_totales: 10,
};

beforeEach(async () => {
  await Reto.deleteMany({});
  await new Reto(reto).save();
});

describe("POST /challenges", () => {
  it("Debería crear un reto", async () => {
    const response = await request(app)
      .post("/challenges")
      .send({
        reto_id: 998,
        reto_nombre: "paisajes",
        tipo: "correr",
        km_totales: 100,
      })
      .expect(201);

    expect(response.body).to.include({
      reto_id: 998,
      reto_nombre: "paisajes",
      tipo: "correr",
    });
  });
  it("Debería fallar al intentar añadir un reto existente", async () => {
    await request(app).post("/challenges").send(reto).expect(500);
  });
});

describe("GET /challenges", () => {
  it("Debería poder obtener un reto por su nombre", async () => {
    await request(app).get("/challenges?reto_nombre=Test").expect(200);
  });
  it("Debería poder obtener un reto por su id", async () => {
    await request(app).get("/challenges?reto_id=999").expect(200);
  });
  it("Debería poder obtener todos los retos", async () => {
    await request(app).get("/challenges").expect(200);
  });
  it("Debería fallar al intentar obtener un reto que no existe", async () => {
    await request(app).get("/challenges?reto_id=123").expect(404);
  });
});

describe("PATCH /challenges", () => {
  it("Debería poder actualizar un reto por su nombre", async () => {
    await request(app)
      .patch("/challenges?reto_nombre=Test")
      .send({ reto_nombre: "Test2" })
      .expect(200);
  });
  it("Debería poder actualizar un reto por su id", async () => {
    await request(app)
      .patch("/challenges?reto_id=999")
      .send({ reto_nombre: "Test2" })
      .expect(200);
  });
  it("Debería fallar al intentar actualizar un reto que no existe", async () => {
    await request(app)
      .patch("/challenges?reto_nombre=Test3")
      .send({ reto_nombre: "Test2" })
      .expect(404);
  });
});

describe("DELETE /challenges", () => {
  it("Debería poder eliminar un reto por su nombre", async () => {
    await request(app).delete("/challenges?reto_nombre=Test").expect(200);
  });
  it("Debería poder eliminar un reto por su id", async () => {
    await request(app).delete("/challenges?reto_id=999").expect(200);
  });
  it("Debería fallar al intentar eliminar un reto que no existe", async () => {
    await request(app).delete("/challenges?reto_nombre=Test3").expect(404);
  });
});
