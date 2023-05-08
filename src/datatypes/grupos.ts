import { Document, model, Schema } from "mongoose";
import { TrackInterface } from "./track";
import { UsuarioInterface } from "./usuarios";

export interface GrupoInterface extends Document {
  grupo_id: number;
  grupo_nombre: string;
  participantes: UsuarioInterface[];
  estadisticas_grupales: {
    km_semana: number;
    km_mes: number;
    km_ano: number;
    desnivel_semana: number;
    desnivel_mes: number;
    desnivel_ano: number;
  };
  rutas_favoritas: TrackInterface[];
  historico_rutas: { fecha: Date; ruta: TrackInterface }[];
}

const GrupoSchema = new Schema<GrupoInterface>({
  grupo_id: {
    type: Number,
    required: true,
    unique: true,
    validate(value: number) {
      if (value < 0) {
        throw new Error("grupo_id must be a positive number");
      }
    },
  },
  grupo_nombre: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate(value: string) {
      if (value.length < 3) {
        throw new Error("grupo_nombre must be at least 3 characters long");
      }
    },
  },
  participantes: { type: [Schema.Types.ObjectId] },
  estadisticas_grupales: {
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
  historico_rutas: { type: [{ fecha: Date, ruta: Schema.Types.ObjectId }], required: true },
});

export const Grupo = model<GrupoInterface>("Grupo", GrupoSchema);
