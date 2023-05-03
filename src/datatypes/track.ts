import { Document, model, Schema } from "mongoose";

interface TrackInterface extends Document {
  track_id: number;
  track_nombre: string;
  localizacionInicio: string;
  localizacionFin: string;
  desnivel: number;
  usuarios_realizados: number[];
  tipo: "correr" | "bicicleta";
  calificacion: number;
}

const TrackSchema = new Schema<TrackInterface>({
  track_id: { type: Number, required: true },
  track_nombre: { type: String, required: true },
  localizacionInicio: { type: String },
  localizacionFin: { type: String },
  desnivel: { type: Number },
  usuarios_realizados: { type: [Number] },
  tipo: { type: String },
  calificacion: { type: Number },
});

export const Track = model<TrackInterface>("Track", TrackSchema);
