# 📂 middleware

Middleware Express **agnóstico de dominio**.

| Archivo | Qué hace |
|---------|----------|
| `responseHandler.ts` | Convierte un `Controller` en `req → res.json(resp)` y captura errores. |
| `errorHandler.ts`    | Serializa `ApiError` y fallback 500. |
| `validate*.ts`       | Helpers Zod para `req.body`, `req.query`. |

**No** incluyas middlewares de autentificación específicos (JWT, roles); ponlos en `modules/auth`.
