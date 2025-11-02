import { DistribucionFutbolin, TipoFutbolin, TipoLugar } from "futbol-in-core/enum";
import { HydratedDocument, InferSchemaType, model, Schema } from "mongoose";


const FutbolinSchema = new Schema(
  {
    nombre: { type: String, required: true },
    direccion: { type: String, required: true },
    googlePlaceId: { type: String, required: true },
    ciudad: { type: String, required: true },
    location: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true },
    },
    tipoLugar: { type: String, enum: Object.values(TipoLugar), required: true },
    tipoFutbolin: {
      type: String,
      enum: Object.values(TipoFutbolin),
      required: true,
    },
    distribucion: {
      type: String,
      enum: Object.values(DistribucionFutbolin),
      required: true,
    },
    comentarios: { type: String },
    addedByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    destacado: { type: Boolean, default: false },
  },
  { timestamps: true }
);

FutbolinSchema.index({ addedByUserId: 1 });
FutbolinSchema.index({ location: "2dsphere" });
FutbolinSchema.index({ ciudad: "text" });

export type Futbolin = InferSchemaType<typeof FutbolinSchema>
export type FutbolinDoc = HydratedDocument<Futbolin>
export const FutbolinModel = model<FutbolinDoc>("Spot", FutbolinSchema);