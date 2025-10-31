import {
  AuthProvider,
  Posicion,
  UserRole,
  UserStatus,
} from "futbol-in-core/enum";
import { HydratedDocument, InferSchemaType, Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true },
    password: { type: String },
    imagen: { type: String, default: "" },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.MUST_CONFIRM_EMAIL,
    },
    role: {
      type: [String],
      enum: Object.values(UserRole),
      default: [UserRole.USER],
    },
    provider: {
      type: String,
      enum: Object.values(AuthProvider),
      required: true,
    },
    verificationCode: { type: String },
    verificationCodeExpires: { type: Date },
    nombre: { type: String, default: null },
    telefono: { type: String, default: null },
    posicion: { type: String, enum: Object.values(Posicion), default: null },
    ciudad: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);
export type User = InferSchemaType<typeof userSchema>;
export type UserDoc = HydratedDocument<User>;
export const UserModel = model<UserDoc>("User", userSchema);
