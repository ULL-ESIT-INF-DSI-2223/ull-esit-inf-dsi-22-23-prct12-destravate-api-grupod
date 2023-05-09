import express from "express";
import { Grupo } from "../models/grupos.js";

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
    filter = req.query.grupo_id
      ? { grupo_id: req.query.grupo_id.toString() }
      : {};
  } else if (req.query.grupo_nombre) {
    filter = req.query.grupo_nombre
      ? { grupo_nombre: req.query.grupo_nombre.toString() }
      : {};
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
  if (!req.query.grupo_id) {
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
    const grupo = await Grupo.findOneAndUpdate(
      { grupo_id: req.query.grupo_id.toString() },
      req.body,
      { new: true, runValidators: true }
    );

    if (grupo) {
      return res.status(200).send(grupo);
    }
    return res.status(404).send({ error: "Group not found" });
  } catch (error) {
    return res.status(500).send(error);
  }
});

gruposRouter.delete("/groups", async (req, res) => {
  if (!req.query.grupo_id) {
    return res.status(400).send({
      error: "You must provide at least one of the following: grupo_id",
    });
  }
  let filter: NameIdType;
  if (req.query.grupo_id) {
    filter = req.query.grupo_id
      ? { grupo_id: req.query.grupo_id.toString() }
      : {};
  } else if (req.query.grupo_nombre) {
    filter = req.query.grupo_nombre
      ? { grupo_nombre: req.query.grupo_nombre.toString() }
      : {};
  } else {
    filter = {};
  }
  try {
    const grupo = await Grupo.findOne(filter);
    if (!grupo) {
      return res.status(404).send({ error: "Group not found" });
    }

    const result = await Grupo.deleteOne(filter);
    if (result.deletedCount !== 0) {
      return res.status(200).send(grupo);
    }
    return res.status(404).send({ error: "Group not found" });
  } catch (error) {
    return res.status(500).send(error);
  }
});
