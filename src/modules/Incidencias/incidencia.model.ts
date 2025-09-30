import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IIncidencia extends Document {
  _id: Types.ObjectId;
  spotId: Types.ObjectId;
  userId: Types.ObjectId;
  texto: string;
  resuelto: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const IncidenciaSchema = new Schema<IIncidencia>(
  {
    spotId: {
      type: Schema.Types.ObjectId,
      ref: "Spot",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    texto: { type: String, default: "", maxlength: 1000 },
    resuelto: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

IncidenciaSchema.index({ spotId: 1, createdAt: -1 });

const Incidencia: Model<IIncidencia> =
  mongoose.models.Incidencia ||
  mongoose.model<IIncidencia>("Incidencia", IncidenciaSchema);

export default Incidencia;
