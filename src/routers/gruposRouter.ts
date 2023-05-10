import express from "express";
import { Grupo } from "../models/grupos.js";
import { Usuario } from "../models/usuarios.js";

export const gruposRouter = express.Router();

type NameIdType =
  | {
      grupo_id?: string;
    }
  | {
      grupo_nombre?: string;
    };

gruposRouter.post("/groups", async (req, res) => {
  const grupo = new Grupo(req.body);
  try {
    await grupo.save();
    return res.status(201).send(grupo);
  } catch (error) {
    return res.status(500).send(error);
  }
});

gruposRouter.get("/groups", async (req, res) => {
  let filter: NameIdType;
  if (req.query.grupo_id) {
    filter = { grupo_id: req.query.grupo_id.toString() };
  } else if (req.query.grupo_nombre) {
    filter = { grupo_nombre: req.query.grupo_nombre.toString() };
  } else {
    filter = {};
  }
  try {
    const grupos = await Grupo.find(filter);
    if (grupos.length !== 0) {
      return res.status(200).send(grupos);
    }
    return res.status(404).send({ error: "No groups found" });
  } catch (error) {
    return res.status(500).send(error);
  }
});

gruposRouter.patch("/groups", async (req, res) => {
  if (!req.query.grupo_id && !req.query.grupo_nombre) {
    return res.status(400).send({
      error: "You must provide at least one of the following: grupo_id",
    });
  }
  const allowedUpdates = [
    "grupo_nombre",
    "participantes",
    "estadisticas_grupales",
    "rutas_favoritas",
    "historico_rutas",
  ];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidUpdate) {
    return res.status(400).send({ error: "Invalid update" });
  }
  try {
    let filter: NameIdType;
    if (req.query.grupo_id) {
      filter = { grupo_id: req.query.grupo_id.toString() };
    } else if (req.query.grupo_nombre) {
      filter = { grupo_nombre: req.query.grupo_nombre.toString() };
    } else {
      filter = {};
    }
    const grupo = await Grupo.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true,
    });

    if (grupo) {
      return res.status(200).send(grupo);
    }
    return res.status(404).send({ error: "Group not found" });
  } catch (error) {
    return res.status(500).send(error);
  }
});

gruposRouter.delete("/groups", async (req, res) => {
  if (!req.query.grupo_id && !req.query.grupo_nombre) {
    return res.status(400).send({
      error:
        "You must provide at least one of the following: grupo_id, grupo_nombre",
    });
  }
  try {
    let filter: NameIdType;
    if (req.query.grupo_id) {
      filter = { grupo_id: req.query.grupo_id.toString() };
    } else if (req.query.grupo_nombre) {
      filter = { grupo_nombre: req.query.grupo_nombre.toString() };
    } else {
      filter = {};
    }

    // Eliminar el grupo de los usuarios
    const deleted_group = await Grupo.findOne(filter);
    const usuarios = await Usuario.find({});
    usuarios.forEach(async (usuario) => {
      const index = usuario.grupos.indexOf(deleted_group?._id);
      if (index > -1) {
        usuario.grupos.splice(index, 1);
      }
      await usuario.save();
    });

    const grupo = await Grupo.findOneAndDelete(filter);
    if (grupo) {
      return res.status(200).send(grupo);
    }
    return res.status(404).send({ error: "Group not found" });
  } catch (error) {
    return res.status(500).send(error);
  }
});
