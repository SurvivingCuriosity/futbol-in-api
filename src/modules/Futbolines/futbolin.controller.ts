import { ApiResponse, ok } from "@/utils/ApiResponse";
import { FutbolinService } from "./futbolin.service";
import { AuthRequest } from "@/middleware/auth";
import { AgregarFutbolin } from "futbol-in-core/schemas";

const getAll = async () => {
  const spots = await FutbolinService.getAll();
  return ok(spots, "Lista de futbolines");
};

export const agregarFutbolin = async (
  req: AuthRequest & { validated: AgregarFutbolin }
): Promise<ApiResponse<unknown>> => {
  const spot = await FutbolinService.agregarFutbolin(req.validated, req.user!);
  return ok(spot, "Futbolín creado");
};

export const FutbolinController = {
  getAll,
  agregarFutbolin,
};
