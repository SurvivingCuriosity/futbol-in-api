import mongoose from "mongoose";
import { MONGO } from "@/config";

/** Flag interno para evitar doble conexión en tests con watch o al hacer hot‑reload */
let isConnected = false;

/** Conecta (idempotente) y devuelve la instancia de mongoose */
export const connectDB = async () => {
  if (isConnected) return mongoose;

  // Recomendación Mongoose ≥ 8
  mongoose.set("strictQuery", true);

  await mongoose.connect(MONGO.URI, {
    // Ajusta según tu carga; valores por defecto ya son seguros
    maxPoolSize: 10,
    autoIndex: false, // genera índices desde CI, no en runtime
  });

  isConnected = true;

  // Si alguien cierra la conexión, marcamos el flag
  mongoose.connection.on("disconnected", () => {
    isConnected = false;
  });

  console.log(`🚀 Base de datos conectada`);

  return mongoose;
};

/** Desconexión limpia: útil en tests o shutdowns controlados */
export const disconnectDB = async () => {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
  }
};
