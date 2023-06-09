import { Document, model, Schema } from "mongoose";
import { TrackInterface } from "./track.js";
import { RetoInterface } from "./retos.js";
import { GrupoInterface } from "./grupos.js";

export interface UsuarioInterface extends Document {
  usuario_id: number;
  usuario_nombre: string;
  actividad: "correr" | "bicicleta";
  amigos: UsuarioInterface[];
  grupos: GrupoInterface[];
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
  actividad: {
    type: String,
    required: true,
    trim: true,
    enum: ["correr", "bicicleta"],
  },
  amigos: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: "Usuario",
    validate(friends: UsuarioInterface[]) {
      const existingFriends = friends.map((friend) => friend._id);
      if (existingFriends.length !== new Set(existingFriends).size) {
        throw new Error("No puede haber amigos repetidos");
      }
    },
  },
  grupos: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: "Grupo",
    validate(groups: GrupoInterface[]) {
      const existingGroups = groups.map((group) => group.grupo_id);
      if (existingGroups.length !== new Set(existingGroups).size) {
        throw new Error("No puede haber grupos repetidos");
      }
    },
  },
  estadisticas: {
    km_semana: {
      type: Number,
      default: 0,
      validate(value: number) {
        if (value < 0) {
          throw new Error("km_semana must be a positive number");
        }
      },
    },
    km_mes: {
      type: Number,
      default: 0,
      validate(value: number) {
        if (value < 0) {
          throw new Error("km_semana must be a positive number");
        }
      },
    },
    km_ano: {
      type: Number,
      default: 0,
      validate(value: number) {
        if (value < 0) {
          throw new Error("km_semana must be a positive number");
        }
      },
    },
    desnivel_semana: {
      type: Number,
      default: 0,
      validate(value: number) {
        if (value < 0) {
          throw new Error("km_semana must be a positive number");
        }
      },
    },
    desnivel_mes: {
      type: Number,
      default: 0,
      validate(value: number) {
        if (value < 0) {
          throw new Error("km_semana must be a positive number");
        }
      },
    },
    desnivel_ano: {
      type: Number,
      default: 0,
      validate(value: number) {
        if (value < 0) {
          throw new Error("km_semana must be a positive number");
        }
      },
    },
  },
  rutas_favoritas: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: "Track",
    validate(favorites: TrackInterface[]) {
      const existingFavorites = favorites.map((favorite) => favorite._id);
      if (existingFavorites.length !== new Set(existingFavorites).size) {
        throw new Error("No puede haber rutas favoritas repetidas");
      }
    },
  },
  retos_activos: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: "Reto",
    validate(challenges: RetoInterface[]) {
      const existingChallenges = challenges.map((challenge) => challenge._id);
      if (existingChallenges.length !== new Set(existingChallenges).size) {
        throw new Error("No puede haber retos activos repetidos");
      }
    },
  },
  historico_rutas: {
    type: [{ fecha: Date, ruta: Schema.Types.ObjectId }],
    default: [],
    ref: "Track",
  },
});

export const Usuario = model<UsuarioInterface>("Usuario", UsuarioSchema);
