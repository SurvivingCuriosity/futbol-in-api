# 📂 modules/<feature>

Implementa el caso de uso “<feature>” siguiendo Clean Architecture.

| Archivo          | Capa | Contenido |
|------------------|------|-----------|
| `<feature>.routes.ts`     | ✆ Transporte | Define rutas Express y aplica middlewares. |
| `<feature>.controller.ts` | Controller | Orquesta servicio, valida permisos y retorna `ApiResponse<T>`. |
| `<feature>.service.ts`    | Service | Reglas de negocio; puede llamar a varios repos o servicios externos. |
| `<feature>.repository.ts` | Repository | Acceso persistencia (Mongoose). |
| `<feature>.mapper.ts`     | Mapper | Document ↔ DTO (`SpotDocument` → `SpotDTO`). |
| `<feature>.schemas.ts`    | DTO/Validation | Zod schemas para esta feature (body, query). |

**No** importes otro módulo directo al repository; hazlo vía Services.
