import { ok } from "@/utils/ApiResponse";
import { ValidatedRequest } from "@/utils/types";
import { AgregarFutbolin, EditarFutbolinBody } from "futbol-in-core/schemas";
import { FutbolinService } from "./futbolin.service";

export const FutbolinController = {
  getAll: async () => {
    const futbolines = await FutbolinService.getAll();
    return ok(futbolines, "Lista de futbolines");
  },

  getInCiudad: async (req: ValidatedRequest<any, { ciudad: string }, any>) => {
    const futbolines = await FutbolinService.getFromCiudad(
      req.validatedParams.ciudad
    );
    return ok(futbolines, "Lista de futbolines");
  },

  getFutbolinesPorMarca: async (
    req: ValidatedRequest<any, { marca: string }, any>
  ) => {
    const futbolines = await FutbolinService.getFromMarca(
      req.validatedParams.marca
    );
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
  borrarFutbolin: async (req: ValidatedRequest<any, { id: string }>) => {
    const { id } = req.validatedParams;
    const { deletedCount } = await FutbolinService.borrarFutbolin(id);
    return ok(deletedCount, "Futbolín borrado");
  },
  editar: async (req: ValidatedRequest<any, EditarFutbolinBody>) => {
    const { id } = req.validatedParams;
    const { tipoFutbolin, distribucion, comentarios } = req.validated;
    const updated = await FutbolinService.editarFutbolin(id, {
      tipoFutbolin,
      distribucion,
      comentarios,
    });
    return ok(updated, "Futbolín editado");
  },
};
