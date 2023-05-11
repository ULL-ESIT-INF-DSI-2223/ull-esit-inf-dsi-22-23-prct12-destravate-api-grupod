import { Document, model, Schema } from "mongoose";
import { UsuarioInterface } from "./usuarios.js";

export type Coordenadas = [number, number];
export interface TrackInterface extends Document {
  track_id: number;
  track_nombre: string;
  localizacionInicio: Coordenadas;
  localizacionFin: Coordenadas;
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
  localizacionInicio: {
    type: [Number],
    required: true,

    validate(value: [number, number]) {
      if (value.length !== 2) {
        throw new Error("localizacionInicio must be an array of length 2");
      }
    },
  },
  localizacionFin: {
    type: [Number],
    required: true,

    validate(value: [number, number]) {
      if (value.length !== 2) {
        throw new Error("localizacionFin must be an array of length 2");
      }
    },
  },
  desnivel: {
    type: Number,
    required: true,
    validate(value: number) {
      if (value < 0) {
        throw new Error("desnivel must be a positive number");
      }
    },
  },
  usuarios_realizados: {
    type: [Schema.Types.ObjectId],
    ref: "Usuario",
    default: [],
    validate(usuarios: [UsuarioInterface]) {
      const existingUsers = usuarios.map((usuario) => usuario._id);
      if (existingUsers.length !== new Set(existingUsers).size) {
        throw new Error("No puede haber usuarios repetidos");
      }
    },
  },
  tipo: {
    type: String,
    trim: true,
    required: true,
    enum: ["correr", "bicicleta"],
  },
  calificacion: { type: Number, min: 0, max: 5, default: 0 },
});

export const Track = model<TrackInterface>("Track", TrackSchema);
