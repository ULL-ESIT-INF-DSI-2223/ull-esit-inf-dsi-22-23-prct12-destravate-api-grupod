import express from "express";
import "./db/mongoose.js";
import { usuariosRouter } from "./routers/usuariosRouter.js";

export const app = express();
app.use(express.json());
app.use(usuariosRouter);
