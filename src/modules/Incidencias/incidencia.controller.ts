import { ok } from "@/utils/ApiResponse";
import { ValidatedRequest } from "@/utils/types";
import { CrearIncidenciaBody, ResolverIncidenciaBody } from "futbol-in-core/schemas";
import { IncidenciaService } from "./incidencia.service";

export const IncidenciaController = {
  crear: async (req: ValidatedRequest<any, CrearIncidenciaBody>) => {
    const dto = await IncidenciaService.crear(req.validated, req.user!);
    return ok(dto, "Incidencia creada");
  },

  listarTodas: async (req: ValidatedRequest) => {
    const list = await IncidenciaService.listarTodas(req.user!);
    return ok(list, "Todas las incidencias");
  },

  listarPorFutbolin: async (spotId: string) => {
    const list = await IncidenciaService.listarPorFutbolin(spotId);
    return ok(list, "Incidencias del futbolín");
  },

  resolver: async (
    id: string,
    req: ValidatedRequest<any, ResolverIncidenciaBody>
  ) => {
    const dto = await IncidenciaService.resolver(id, req.validated, req.user!);
    return ok(dto, "Incidencia actualizada");
  },
  
  // TODO check BorrarUsuarioBody
  borrar: async (
    id: string,
    req: ValidatedRequest<any, ResolverIncidenciaBody>
  ) => {
    const res = await IncidenciaService.borrar(id, req.user!);
    return ok(res, "Incidencia eliminada");
  },
};
