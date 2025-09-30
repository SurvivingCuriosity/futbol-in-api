import { AuthRequest } from "@/middleware/auth";
import { ApiResponse, ok } from "@/utils/ApiResponse";
import { CrearIncidencia, ResolverIncidencia } from "futbol-in-core/schemas";
import { IncidenciaService } from "./incidencia.service";

const crear = async (req: AuthRequest & { validated: CrearIncidencia }) => {
  const dto = await IncidenciaService.crear(req.validated, req.user!);
  return ok(dto, "Incidencia creada");
};

const listarTodas = async (req: AuthRequest): Promise<ApiResponse<unknown>> => {
  const list = await IncidenciaService.listarTodas(req.user!);
  return ok(list, "Todas las incidencias");
};

const listarPorFutbolin = async (spotId: string) => {
  const list = await IncidenciaService.listarPorFutbolin(spotId);
  return ok(list, "Incidencias del futbolín");
};

const resolver = async (
  id: string,
  req: AuthRequest & { validated: ResolverIncidencia }
): Promise<ApiResponse<unknown>> => {
  const dto = await IncidenciaService.resolver(id, req.validated, req.user!);
  return ok(dto, "Incidencia actualizada");
};

const borrar = async (
  id: string,
  req: AuthRequest
): Promise<ApiResponse<unknown>> => {
  const res = await IncidenciaService.borrar(id, req.user!);
  return ok(res, "Incidencia eliminada");
};

export const IncidenciaController = {
  crear,
  listarTodas,
  listarPorFutbolin,
  resolver,
  borrar,
};
