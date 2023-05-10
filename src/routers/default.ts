import express from "express";

export const defaultRouter = express.Router();

defaultRouter.all("*", (_, res) => {
  res.status(501).send({ error: "Not implemented" });
});
