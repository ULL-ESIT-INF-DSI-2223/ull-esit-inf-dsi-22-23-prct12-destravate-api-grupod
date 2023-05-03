import { Document, model, Schema } from "mongoose";

interface RetoInterface extends Document {
  reto_id: number;
  reto_nombre: string;
  rutas: number[];
  tipo: "correr" | "bicicleta";
  km_totales: number;
  usuarios_realizando: number[];
}

const RetoSchema = new Schema<RetoInterface>({
  reto_id: { type: Number, required: true },
  reto_nombre: { type: String, required: true },
  rutas: { type: [Number] },
  tipo: { type: String },
  km_totales: { type: Number },
  usuarios_realizando: { type: [Number] },
});

export const Reto = model<RetoInterface>("Reto", RetoSchema);
