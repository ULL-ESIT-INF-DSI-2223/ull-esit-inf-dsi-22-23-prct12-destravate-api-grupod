import { Document, model, Schema } from "mongoose";

interface UsuarioInterface extends Document {
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
  rutas_favoritas: number[];
  retos_activos: number[];
  historico_rutas: { fehca: Date; ruta: number }[];
}

const UsuarioSchema = new Schema<UsuarioInterface>({
  usuario_id: { type: Number, required: true },
  usuario_nombre: { type: String, required: true },
  actividad: { type: String, required: true },
  amigos: { type: [Number] },
  grupos: { type: [Number] },
  estadisticas: {
    km_semana: { type: Number },
    km_mes: { type: Number },
    km_ano: { type: Number },
    desnivel_semana: { type: Number },
    desnivel_mes: { type: Number },
    desnivel_ano: { type: Number },
  },
  rutas_favoritas: { type: [Number] },
  retos_activos: { type: [Number] },
  historico_rutas: { type: [{ fecha: Date, ruta: Number }] },
});

export const Usuario = model<UsuarioInterface>("Usuario", UsuarioSchema);
