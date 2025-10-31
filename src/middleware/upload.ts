import { ApiError } from "@/utils/ApiError";
import multer from "multer";

const MAX_FILE_SIZE_MB = 5; // límite de 5 MB

// Configuración básica de almacenamiento temporal en disco
const storage = multer.memoryStorage();

// Filtro de archivos: solo imágenes
const fileFilter = (
  _: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new ApiError(400, "Solo se permiten imágenes JPG, PNG o WEBP"));
  }
  cb(null, true);
};

// Middleware multer
export const uploadSingleImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 },
}).single("file");
