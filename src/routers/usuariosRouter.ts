import express from "express";
import { Usuario } from "../models/usuarios.js";

export const usuariosRouter = express.Router();

usuariosRouter.post("/users", async (req, res) => {
  const usuario = new Usuario(req.body);
  try {
    await usuario.save();
    return res.status(201).send(usuario);
  } catch (error) {
    return res.status(500).send(error);
  }
});
