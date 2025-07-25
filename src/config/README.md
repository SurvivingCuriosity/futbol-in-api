# 📂 config

Configura **dependencias globales** de la aplicación.

| Archivo | Responsabilidad | No poner aquí |
|---------|-----------------|---------------|
| `env.ts` | Expone constantes leídas de variables de entorno. *Una única fuente de verdad.* | Lógica de dominio, claves sensibles hard‑codeadas. |
| `db.ts` | Conexión Mongoose (`connectDB`, `disconnectDB`). | Operaciones CRUD (van en `repositories`). |

> Mantén todo **idempotente**: llamar dos veces a `connectDB()` nunca debe abrir 2 pools.
