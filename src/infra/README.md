# 📂 infra

Gateway hacia **servicios externos**: Google Maps, GCS, Stripe, etc.

Características:
* Sin lógica de dominio, solo adaptación protocolo ↔ app.
* Reintentos, circuit‑breaker y logs de latencia.
* Tests unitarios con `nock` / `msw`.

> Cambiar proveedor = editar aquí, no en Services ni Controllers.
