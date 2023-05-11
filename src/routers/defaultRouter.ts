import express from "express";

export const defaultRouter = express.Router();

/**
 * This is the default router. It will be used when no other router matches the request.
 */
defaultRouter.all("*", (_, res) => {
  res.status(404).send({ error: "Route not found" });
});
