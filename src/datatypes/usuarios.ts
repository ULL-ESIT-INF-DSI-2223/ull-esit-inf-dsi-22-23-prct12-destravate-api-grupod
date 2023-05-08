import { Document, model, Schema } from "mongoose";
import { TrackInterface } from "./track";
import { RetoInterface } from "./retos";

export interface UsuarioInterface extends Document {
  usuario_id: number;
  usuario_nombre: string;
  actividad: "correr" | "bicicleta";
  amigos: number[];
  grupos: number[];
  estadisticas: {
    km_semana: number;
    km_mes: number;
    km_ano: number;
    desnivel_semana: number;
    desnivel_mes: number;
    desnivel_ano: number;
  };
  rutas_favoritas: TrackInterface[];
  retos_activos: RetoInterface[];
  historico_rutas: { fehca: Date; ruta: TrackInterface }[];
}

const UsuarioSchema = new Schema<UsuarioInterface>({
  usuario_id: {
    type: Number,
    required: true,
    unique: true,
    validate(value: number) {
      if (value < 0) {
        throw new Error("usuario_id must be a positive number");
      }
    },
  },
  usuario_nombre: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate(value: string) {
      if (value.length < 3) {
        throw new Error("usuario_nombre must be at least 3 characters long");
      }
    },
  },
  actividad: { type: String, required: true, trim: true },
  amigos: { type: [Number], required: true },
  grupos: { type: [Number], required: true },
  estadisticas: {
    km_semana: {
      type: Number,
      required: true,
      validate(value: number) {
        if (value < 0) {
          throw new Error("km_semana must be a positive number");
        }
      },
    },
    km_mes: {
      type: Number,
      required: true,
      validate(value: number) {
        if (value < 0) {
          throw new Error("km_semana must be a positive number");
        }
      },
    },
    km_ano: {
      type: Number,
      required: true,
      validate(value: number) {
        if (value < 0) {
          throw new Error("km_semana must be a positive number");
        }
      },
    },
    desnivel_semana: {
      type: Number,
      required: true,
      validate(value: number) {
        if (value < 0) {
          throw new Error("km_semana must be a positive number");
        }
      },
    },
    desnivel_mes: {
      type: Number,
      required: true,
      validate(value: number) {
        if (value < 0) {
          throw new Error("km_semana must be a positive number");
        }
      },
    },
    desnivel_ano: {
      type: Number,
      required: true,
      validate(value: number) {
        if (value < 0) {
          throw new Error("km_semana must be a positive number");
        }
      },
    },
  },
  rutas_favoritas: { type: [Schema.Types.ObjectId], required: true },
  retos_activos: { type: [Schema.Types.ObjectId], required: true },
  historico_rutas: {
    type: [{ fecha: Date, ruta: Schema.Types.ObjectId }],
    required: true,
  },
});

export const Usuario = model<UsuarioInterface>("Usuario", UsuarioSchema);
