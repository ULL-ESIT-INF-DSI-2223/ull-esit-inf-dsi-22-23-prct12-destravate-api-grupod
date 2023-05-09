import express from "express";
import { Usuario } from "../models/usuarios.js";

type FilterType =
  | {
      usuario_id?: string;
    }
  | {
      usuario_nombre?: string;
    };

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

usuariosRouter.get("/users", async (req, res) => {
  let filter: FilterType;
  if (req.query.usuario_id) {
    filter = req.query.usuario_id
      ? { usuario_id: req.query.usuario_id.toString() }
      : {};
  } else if (req.query.usuario_nombre) {
    filter = req.query.usuario_nombre
      ? { usuario_nombre: req.query.usuario_nombre.toString() }
      : {};
  } else {
    filter = {};
  }
  try {
    const usuarios = await Usuario.find(filter);
    if (usuarios.length !== 0) {
      return res.status(200).send(usuarios);
    }
    return res.status(404).send({ error: "No users found" });
  } catch (error) {
    return res.status(500).send(error);
  }
});

usuariosRouter.patch("/users", async (req, res) => {
  if (!req.query.usuario_nombre && !req.query.usuario_id) {
    return res.status(400).send({
      error:
        "You must provide at least one of the following: usuario_id, usuario_nombre",
    });
  }
  const allowedUpdates = ["usuario_nombre", "actividad"];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate) {
    return res.status(400).send({
      error: "Update is not permitted",
    });
  }
  try {
    let filter: FilterType;
    if (req.query.usuario_id) {
      filter = { usuario_id: req.query.usuario_id.toString() };
    } else if (req.query.usuario_nombre) {
      filter = { usuario_nombre: req.query.usuario_nombre.toString() };
    } else {
      filter = {};
    }
    const user = await Usuario.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true,
    });
    if (user) {
      return res.send(user);
    }
    return res.status(404).send({ error: "User not found" });
  } catch (error) {
    res.status(500).send(error);
  }
});
