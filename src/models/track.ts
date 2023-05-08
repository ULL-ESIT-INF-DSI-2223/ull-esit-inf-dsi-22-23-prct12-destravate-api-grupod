import { Document, model, Schema } from "mongoose";
import { UsuarioInterface } from "./usuarios.js";

export interface TrackInterface extends Document {
  track_id: number;
  track_nombre: string;
  localizacionInicio: string;
  localizacionFin: string;
  desnivel: number;
  usuarios_realizados: UsuarioInterface[];
  tipo: "correr" | "bicicleta";
  calificacion: number;
}

const TrackSchema = new Schema<TrackInterface>({
  track_id: {
    type: Number,
    required: true,
    unique: true,
    validate(value: number) {
      if (value < 0) {
        throw new Error("track_id must be a positive number");
      }
    },
  },
  track_nombre: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate(value: string) {
      if (value.length < 3) {
        throw new Error("track_nombre must be at least 3 characters long");
      }
    },
  },
  localizacionInicio: { type: String, trim: true, required: true },
  localizacionFin: { type: String, trim: true, required: true },
  desnivel: {
    type: Number,
    required: true,
    validate(value: number) {
      if (value < 0) {
        throw new Error("desnivel must be a positive number");
      }
    },
  },
  usuarios_realizados: { type: [Schema.Types.ObjectId], required: true },
  tipo: { type: String, trim: true, required: true },
  calificacion: { type: Number, required: true, min: 0, max: 5 },
});

export const Track = model<TrackInterface>("Track", TrackSchema);
