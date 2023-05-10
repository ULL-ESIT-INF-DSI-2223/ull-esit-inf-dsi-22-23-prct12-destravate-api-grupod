import express from "express";

export const defaultRouter = express.Router();

defaultRouter.get("*", (_, res) => {
  res.status(501).send({ error: "Not implemented" });
});
