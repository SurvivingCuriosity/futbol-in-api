import { ok } from "@/utils/ApiResponse";
import { ValidatedRequest } from "@/utils/types";
import { CrearIncidenciaBody, ResolverIncidenciaBody } from "futbol-in-core/schemas";
import { IncidenciaService } from "./incidencia.service";



export const IncidenciaController = {
  listarTodasAdmin: async (req: ValidatedRequest) => {
    const list = await IncidenciaService.listarTodasAdmin(req.user!);
    return ok(list, "Todas las incidencias abiertas");
  },

  crear: async (req: ValidatedRequest<any, CrearIncidenciaBody>) => {
    const result = await IncidenciaService.crear(
      req.params.spotId,
      req.validated,
      req.user!
    );
    return ok(result, "Incidencia creada");
  },

  resolver: async (
    spotId: string,
    incidenciaId: string,
    req: ValidatedRequest<any, ResolverIncidenciaBody>
  ) => {
    const result = await IncidenciaService.resolver(
      spotId,
      incidenciaId,
      req.validated,
      req.user!
    );
    return ok(result, "Incidencia actualizada");
  },

  borrar: async (
    spotId: string,
    incidenciaId: string,
    req: ValidatedRequest
  ) => {
    const result = await IncidenciaService.borrar(
      spotId,
      incidenciaId,
      req.user!
    );
    return ok(result, "Incidencia eliminada");
  },
};
