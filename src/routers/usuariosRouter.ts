import express from "express";
import { Usuario } from "../models/usuarios.js";
import { Grupo } from "../models/grupos.js";
import { Reto } from "../models/retos.js";
import { Track } from "../models/track.js";
import e from "express";

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
  let filter: FilterType = {};
  if (req.query.usuario_id) {
    filter = { usuario_id: req.query.usuario_id.toString() };
  } else if (req.query.usuario_nombre) {
    filter = { usuario_nombre: req.query.usuario_nombre.toString() };
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
  const allowedUpdates = [
    "usuario_id",
    "usuario_nombre",
    "actividad",
    "amigos",
    "grupos",
    "estadisticas",
    "rutas_favoritas",
    "retos_activos",
  ];
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
    let filter: FilterType = {};
    if (req.query.usuario_id) {
      filter = { usuario_id: req.query.usuario_id.toString() };
    } else if (req.query.usuario_nombre) {
      filter = { usuario_nombre: req.query.usuario_nombre.toString() };
    }
    const user = await Usuario.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true,
    });
    if (user) {
      return res.status(200).send(user);
    }
    return res.status(404).send({ error: "User not found" });
  } catch (error) {
    return res.status(500).send(error);
  }
});

usuariosRouter.delete("/users", async (req, res) => {
  if (!req.query.usuario_nombre && !req.query.usuario_id) {
    return res.status(400).send({
      error:
        "You must provide at least one of the following: usuario_id, usuario_nombre",
    });
  }
  try {
    let filter: FilterType = {};
    if (req.query.usuario_id) {
      filter = { usuario_id: req.query.usuario_id.toString() };
    } else if (req.query.usuario_nombre) {
      filter = { usuario_nombre: req.query.usuario_nombre.toString() };
    }
    // Eliminar usuario de la lista de amigos de otros usuarios
    const deleted_user = await Usuario.findOne(filter);
    const users = await Usuario.find({});
    users.forEach(async (user) => {
      const index = user.amigos.indexOf(deleted_user?._id);
      if (index > -1) {
        user.amigos.splice(index, 1);
        await user.save();
      }
    });
    // Eliminar usuario de la lista de usuarios de los grupos
    const grupos = await Grupo.find({});
    grupos.forEach(async (grupo) => {
      const index = grupo.participantes.indexOf(deleted_user?._id);
      if (index > -1) {
        grupo.participantes.splice(index, 1);
        await grupo.save();
      }
    });
    // Eliminar usuario de la lista de usuarios de los retos
    const retos = await Reto.find({});
    retos.forEach(async (reto) => {
      const index = reto.usuarios_realizando.indexOf(deleted_user?._id);
      if (index > -1) {
        reto.usuarios_realizando.splice(index, 1);
        await reto.save();
      }
    });
    // Eliminar usuario de la lista de usuarios de las rutas
    const tracks = await Track.find({});
    tracks.forEach(async (track) => {
      const index = track.usuarios_realizados.indexOf(deleted_user?._id);
      if (index > -1) {
        track.usuarios_realizados.splice(index, 1);
        await track.save();
      }
    });

    const user = await Usuario.findOneAndDelete(filter);
    if (user) {
      return res.status(200).send(user);
    }
    return res.status(404).send({ error: "User not found" });
  } catch (error) {
    return res.status(500).send(error);
  }
});
