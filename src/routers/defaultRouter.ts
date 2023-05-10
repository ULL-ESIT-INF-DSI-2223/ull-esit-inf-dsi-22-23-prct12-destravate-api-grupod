import express from "express";

export const defaultRouter = express.Router();

defaultRouter.all("*", (_, res) => {
  res.status(404).send({ error: "Route not found" });
});
