import { HydratedDocument, InferSchemaType, model, Schema } from "mongoose";

const IncidenciaSchema = new Schema(
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

export type Incidencia = InferSchemaType<typeof IncidenciaSchema>;
export type IncidenciaDoc = HydratedDocument<Incidencia>;
export const IncidenciaModel = model<IncidenciaDoc>(
  "Incidencia",
  IncidenciaSchema
);
