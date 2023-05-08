import express from "express";
import "./db/mongoose.js";
import { usuariosRouter } from "./routers/usuariosRouter.js";

const app = express();
app.use(express.json());
app.use(usuariosRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
