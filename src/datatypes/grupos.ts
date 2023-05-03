import { Document, model, Schema } from "mongoose";

interface GrupoInterface extends Document {
  grupo_id: number;
  grupo_nombre: string;
  participantes: number[];
  estadisticas_grupales: {
    km_semana: number;
    km_mes: number;
    km_ano: number;
    desnivel_semana: number;
    desnivel_mes: number;
    desnivel_ano: number;
  };
  rutas_favoritas: number[];
  historico_rutas: { fehca: Date; ruta: number }[];
}

const GrupoSchema = new Schema<GrupoInterface>({
  grupo_id: { type: Number, required: true },
  grupo_nombre: { type: String, required: true },
  participantes: { type: [Number] },
  estadisticas_grupales: {
    km_semana: { type: Number },
    km_mes: { type: Number },
    km_ano: { type: Number },
    desnivel_semana: { type: Number },
    desnivel_mes: { type: Number },
    desnivel_ano: { type: Number },
  },
  rutas_favoritas: { type: [Number] },
  historico_rutas: { type: [{ fecha: Date, ruta: Number }] },
});

export const Grupo = model<GrupoInterface>("Grupo", GrupoSchema);
