import express from "express";
import { connect } from "mongoose";

const app = express();

connect("mongodb://localhost:27017/destravate")
  .then(() => {
    console.log("Conectado a la base de datos");
  })
  .catch((err) => {
    console.log("Error al conectar a la base de datos", err);
  });

app.listen(3000, () => {
  console.log("Servidor iniciado en el puerto 3000");
});
