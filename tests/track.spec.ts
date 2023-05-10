import request from "supertest";
import { app } from "../src/app.js";
import { Track } from "../src/models/track.js";

const track = {
  track_id: 999,
  track_nombre: "Test",
  localizacionInicio: "Test",
  localizacionFin: "Test",
  tipo: "correr",
  desnivel: 10,
};

beforeEach(async () => {
  await Track.deleteMany({});
  await new Track(track).save();
});

describe("POST /tracks", () => {
  it("Debería crear un track", async () => {
    await request(app)
      .post("/tracks")
      .send({
        track_id: 998,
        track_nombre: "Track1",
        localizacionInicio: "Test",
        localizacionFin: "Test",
        tipo: "correr",
        desnivel: 10,
      })
      .expect(201);
  });
  it("Debería fallar al intentar añadir un track existente", async () => {
    await request(app).post("/tracks").send(track).expect(500);
  });
});

describe("GET /tracks", () => {
  it("Debería poder obtener un track por su nombre", async () => {
    await request(app).get("/tracks?track_nombre=Test").expect(200);
  });
  it("Debería poder obtener un track por su id", async () => {
    await request(app).get("/tracks?track_id=999").expect(200);
  });
  it("Debería poder obtener todos los tracks", async () => {
    await request(app).get("/tracks").expect(200);
  });
  it("Debería fallar al intentar obtener un track que no existe", async () => {
    await request(app).get("/tracks?track_id=123").expect(404);
  });
});

describe("PATCH /tracks", () => {
  it("Debería poder actualizar un track por su nombre", async () => {
    await request(app)
      .patch("/tracks?track_nombre=Test")
      .send({ track_nombre: "Test2" })
      .expect(200);
  });
  it("Debería poder actualizar un track por su id", async () => {
    await request(app)
      .patch("/tracks?track_id=999")
      .send({ track_nombre: "Test2" })
      .expect(200);
  });
  it("Debería fallar al intentar actualizar un track que no existe", async () => {
    await request(app)
      .patch("/tracks?track_nombre=Test3")
      .send({ track_nombre: "Test2" })
      .expect(404);
  });
});

describe("DELETE /tracks", () => {
  it("Debería poder eliminar un track por su nombre", async () => {
    await request(app).delete("/tracks?track_nombre=Test").expect(200);
  });
  it("Debería poder eliminar un track por su id", async () => {
    await request(app).delete("/tracks?track_id=999").expect(200);
  });
  it("Debería fallar al intentar eliminar un track que no existe", async () => {
    await request(app).delete("/tracks?track_nombre=Test3").expect(404);
  });
});
