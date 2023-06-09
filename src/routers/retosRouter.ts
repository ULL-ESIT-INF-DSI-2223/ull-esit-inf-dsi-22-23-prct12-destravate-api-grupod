import express from "express";
import { Reto } from "../models/retos.js";
import { Usuario } from "../models/usuarios.js";

export const retosRouter = express.Router();

/**
 * Will be used to determine if the request is with id or name
 */
type NameIdType =
  | {
      reto_id?: string;
    }
  | {
      reto_nombre?: string;
    };

/**
 * Create reto
 */
retosRouter.post("/challenges", async (req, res) => {
  const reto = new Reto(req.body);
  try {
    await reto.save();
    return res.status(201).send(reto);
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * Get retos
 */
retosRouter.get("/challenges", async (req, res) => {
  let filter: NameIdType = {};
  if (req.query.reto_id) {
    filter = { reto_id: req.query.reto_id.toString() };
  } else if (req.query.reto_nombre) {
    filter = { reto_nombre: req.query.reto_nombre.toString() };
  }
  try {
    const retos = await Reto.find(filter);
    if (retos.length !== 0) {
      return res.status(200).send(retos);
    }
    return res.status(404).send({ error: "No retos found" });
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * Update retos
 */
retosRouter.patch("/challenges", async (req, res) => {
  if (!req.query.reto_id && !req.query.reto_nombre) {
    return res.status(400).send({
      error: "You must provide at least one of the following: reto_id, reto_nombre",
    });
  }
  const allowedUpdates = [
    "reto_id",
    "reto_nombre",
    "rutas",
    "tipo",
    "km_totales",
    "usuarios_realizando",
  ];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidUpdate) {
    return res.status(400).send({ error: "Invalid update" });
  }
  try {
    let filter: NameIdType = {};
    if (req.query.reto_id) {
      filter = { reto_id: req.query.reto_id.toString() };
    } else if (req.query.reto_nombre) {
      filter = { reto_nombre: req.query.reto_nombre.toString() };
    }

    const reto = await Reto.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true,
    });
    if (reto) {
      return res.status(200).send(reto);
    }
    return res.status(404).send({ error: "Reto not found" });
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * Delete retos
 */
retosRouter.delete("/challenges", async (req, res) => {
  if (!req.query.reto_id && !req.query.reto_nombre) {
    return res.status(400).send({
      error:
        "You must provide at least one of the following: reto_id, reto_nombre",
    });
  }

  try {
    let filter: NameIdType = {};
    if (req.query.reto_id) {
      filter = { reto_id: req.query.reto_id.toString() };
    } else if (req.query.reto_nombre) {
      filter = { reto_nombre: req.query.reto_nombre.toString() };
    }
    //Eliminar reto de los usuarios que lo estén realizando
    const deleted_reto = await Reto.findOne(filter);
    const usuarios = await Usuario.find({});
    usuarios.forEach(async (usuario) => {
      const index1 = usuario.retos_activos.indexOf(deleted_reto?._id);
      if (index1 > -1) {
        usuario.retos_activos.splice(index1, 1);
        await usuario.save();
      }
    });

    const reto = await Reto.findOneAndDelete(filter);
    if (reto) {
      return res.status(200).send(reto);
    }

    return res.status(404).send({ error: "Reto not found" });
  } catch (error) {
    return res.status(500).send(error);
  }
});
