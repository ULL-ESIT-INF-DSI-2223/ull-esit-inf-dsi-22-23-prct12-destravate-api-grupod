import express from "express";
import "./db/mongoose.js";
import { usuariosRouter } from "./routers/usuariosRouter.js";
import { gruposRouter } from "./routers/gruposRouter.js";
import { retosRouter } from "./routers/retosRouter.js";
import { trackRouter } from "./routers/trackRouter.js";
import { defaultRouter } from "./routers/defaultRouter.js";

export const app = express();
app.use(express.json());
app.use(usuariosRouter);
app.use(gruposRouter);
app.use(retosRouter);
app.use(trackRouter);
app.use(defaultRouter);
