import express from "express";
import { Track } from "../models/track.js";

export const trackRouter = express.Router();
type NameIdType =
  | {
      track_id?: string;
    }
  | {
      track_nombre?: string;
    };

trackRouter.post("/tracks", async (req, res) => {
  const track = new Track(req.body);

  try {
    await track.save();
    return res.status(201).send(track);
  } catch (error) {
    return res.status(500).send(error);
  }
});

trackRouter.get("/tracks", async (req, res) => {
  let filter: NameIdType;
  if (req.query.track_id) {
    filter = { track_id: req.query.track_id.toString() };
  } else if (req.query.track_nombre) {
    filter = { track_nombre: req.query.track_nombre.toString() };
  } else {
    filter = {};
  }
  try {
    const tracks = await Track.find(filter);
    if (tracks.length !== 0) {
      return res.status(200).send(tracks);
    }
    return res.status(404).send({ error: "No tracks found" });
  } catch (error) {
    return res.status(500).send(error);
  }
});

trackRouter.patch("/tracks", async (req, res) => {
  if (!req.query.track_id && !req.query.track_nombre) {
    return res.status(400).send({
      error:
        "You must provide at least one of the following: track_id, track_nombre",
    });
  }
  const allowedUpdates = [
    "track_nombre",
    "localizacionInicio",
    "localizacionFin",
    "desnivel",
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
    let filter: NameIdType;
    if (req.query.track_id) {
      filter = { track_id: req.query.track_id.toString() };
    } else if (req.query.track_nombre) {
      filter = { track_nombre: req.query.track_nombre.toString() };
    } else {
      filter = {};
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

trackRouter.delete("/tracks", async (req, res) => {
  if (!req.query.track_id && !req.query.track_nombre) {
    return res.status(400).send({
      error:
        "You must provide at least one of the following: track_id or track_nombre",
    });
  }

  let filter: NameIdType;
  if (req.query.track_id) {
    filter = { track_id: req.query.track_id.toString() };
  } else if (req.query.track_nombre) {
    filter = { track_nombre: req.query.track_nombre.toString() };
  } else {
    filter = {};
  }
  try {
    const track = await Track.findOneAndDelete(filter);
    if (track) {
      return res.status(200).send(track);
    }
    return res.status(404).send({ error: "Track not found" });
  } catch (error) {
    return res.status(500).send(error);
  }
});
