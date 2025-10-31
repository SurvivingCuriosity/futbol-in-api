import { ok } from "@/utils/ApiResponse";
import { ValidatedRequest } from "@/utils/types";
import { AgregarFutbolin } from "futbol-in-core/schemas";
import { FutbolinService } from "./futbolin.service";

export const FutbolinController = {
  getAll: async () => {
    const futbolines = await FutbolinService.getAll();
    return ok(futbolines, "Lista de futbolines");
  },

  // TODO: rename AgregarFutbolin to AgregarFutbolinBody
  agregarFutbolin: async (req: ValidatedRequest<any, AgregarFutbolin>) => {
    const futbolinCreado = await FutbolinService.agregarFutbolin(
      req.validated,
      req.user!
    );
    return ok(futbolinCreado, "Futbolín creado");
  },
};
