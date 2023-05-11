import express from "express";
import { Track } from "../models/track.js";
import { Usuario } from "../models/usuarios.js";
import { Reto } from "../models/retos.js";
import { Grupo } from "../models/grupos.js";

export const trackRouter = express.Router();

/**
 * Will be used to determine if the request is with id or name
 */
type NameIdType =
  | {
      track_id?: string;
    }
  | {
      track_nombre?: string;
    };

/**
 * Create track
 */
trackRouter.post("/tracks", async (req, res) => {
  const track = new Track(req.body);

  try {
    await track.save();
    return res.status(201).send(track);
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * Get tracks
 */
trackRouter.get("/tracks", async (req, res) => {
  let filter: NameIdType = {};
  if (req.query.track_id) {
    filter = { track_id: req.query.track_id.toString() };
  } else if (req.query.track_nombre) {
    filter = { track_nombre: req.query.track_nombre.toString() };
  }
  try {
    const tracks = await Track.find(filter).populate({
      path: "usuarios_realizados",
      select: "usuario_nombre",
    });
    if (tracks.length !== 0) {
      return res.status(200).send(tracks);
    }
    return res.status(404).send({ error: "No tracks found" });
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * Update tracks
 */
trackRouter.patch("/tracks", async (req, res) => {
  if (!req.query.track_id && !req.query.track_nombre) {
    return res.status(400).send({
      error:
        "You must provide at least one of the following: track_id, track_nombre",
    });
  }
  const allowedUpdates = [
    "track_id",
    "track_nombre",
    "localizacionInicio",
    "localizacionFin",
    "desnivel",
    "usuarios_realizados",
    "tipo",
    "calificacion",
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
    if (req.query.track_id) {
      filter = { track_id: req.query.track_id.toString() };
    } else if (req.query.track_nombre) {
      filter = { track_nombre: req.query.track_nombre.toString() };
    }
    const track = await Track.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true,
    });
    if (track) {
      return res.status(200).send(track);
    }
    return res.status(404).send({ error: "Track not found" });
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * Delete tracks
 */
trackRouter.delete("/tracks", async (req, res) => {
  if (!req.query.track_id && !req.query.track_nombre) {
    return res.status(400).send({
      error:
        "You must provide at least one of the following: track_id or track_nombre",
    });
  }

  try {
    let filter: NameIdType = {};
    if (req.query.track_id) {
      filter = { track_id: req.query.track_id.toString() };
    } else if (req.query.track_nombre) {
      filter = { track_nombre: req.query.track_nombre.toString() };
    }

    //Eliminar el track de las rutas favoritas de los usuarios
    const deleted_track = await Track.findOne(filter);
    const usuarios = await Usuario.find({});
    usuarios.forEach(async (usuario) => {
      const index1 = usuario.rutas_favoritas.indexOf(deleted_track?._id);
      if (index1 > -1) {
        usuario.rutas_favoritas.splice(index1, 1);
        await usuario.save();
      }
      const index2 = usuario.historico_rutas.indexOf(deleted_track?._id);
      if (index2 > -1) {
        usuario.historico_rutas.splice(index2, 1);
        await usuario.save();
      }
    });
    //Eliminar el track de los retos
    const retos = await Reto.find({});
    retos.forEach(async (reto) => {
      const index = reto.rutas.indexOf(deleted_track?._id);
      if (index > -1) {
        reto.rutas.splice(index, 1);
        await reto.save();
      }
    });
    //Eliminar el track de los grupos
    const grupos = await Grupo.find({});
    grupos.forEach(async (grupo) => {
      const index = grupo.rutas_favoritas.indexOf(deleted_track?._id);
      if (index > -1) {
        grupo.rutas_favoritas.splice(index, 1);
        await grupo.save();
      }
      const index2 = grupo.historico_rutas.indexOf(deleted_track?._id);
      if (index2 > -1) {
        grupo.historico_rutas.splice(index2, 1);
        await grupo.save();
      }
    });

    const track = await Track.findOneAndDelete(filter);
    if (track) {
      return res.status(200).send(track);
    }
    return res.status(404).send({ error: "Track not found" });
  } catch (error) {
    return res.status(500).send(error);
  }
});
