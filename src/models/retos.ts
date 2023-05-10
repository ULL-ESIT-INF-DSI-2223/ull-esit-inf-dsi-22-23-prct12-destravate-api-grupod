import { Document, model, Schema } from "mongoose";
import { TrackInterface } from "./track.js";
import { UsuarioInterface } from "./usuarios.js";

export interface RetoInterface extends Document {
  reto_id: number;
  reto_nombre: string;
  rutas: TrackInterface[];
  tipo: "correr" | "bicicleta";
  km_totales: number;
  usuarios_realizando: UsuarioInterface[];
}

const RetoSchema = new Schema<RetoInterface>({
  reto_id: {
    type: Number,
    required: true,
    unique: true,
    validate(value: number) {
      if (value < 0) {
        throw new Error("reto_id must be a positive number");
      }
    },
  },
  reto_nombre: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate(value: string) {
      if (value.length < 3) {
        throw new Error("reto_nombre must be at least 3 characters long");
      }
    },
  },
  rutas: { type: [Schema.Types.ObjectId], ref: "Track", default: [] },
  tipo: {
    type: String,
    trim: true,
    required: true,
    enum: ["correr", "bicicleta"],
  },
  km_totales: {
    type: Number,
    required: true,
    validate(value: number) {
      if (value < 0) {
        throw new Error("km_totales must be a positive number");
      }
    },
  },
  usuarios_realizando: {
    type: [Schema.Types.ObjectId],
    ref: "Usuario",
    default: [],
  },
});

export const Reto = model<RetoInterface>("Reto", RetoSchema);
