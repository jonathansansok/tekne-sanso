# DECISIONS.md

- **OOP (reglas de negocio):** se separó validación técnica de reglas de dominio usando `BusinessRule` + `RuleEngine`. Esto permite agregar reglas nuevas (ej: nuevos tipos) **sin tocar controllers/services**: solo se suma una clase que implemente `validate()`.
- **Polimorfismo real:** cada regla se activa según `policy_type` y devuelve `RuleError | null`. El motor ejecuta una lista de reglas sin conocer detalles del dominio.
- **Validación por capas:** `PolicyValidator` primero corta por errores técnicos (fechas/enum/números) y recién si pasa, corre reglas de negocio. Resultado: mensajes más claros y menos trabajo innecesario.
- **Duplicados (source of truth = DB):** `policy_number` es `UNIQUE` en PostgreSQL. No se “filtra a mano”: se intenta insertar y se captura Prisma `P2002` para reportar `DUPLICATE_POLICY_NUMBER` y sumar `duplicates_count`.
- **Idempotencia (pragmática):** el mecanismo mínimo es la constraint `UNIQUE`. Si se requiere idempotencia fuerte, se agregaría `file_hash` en `Operation` y se rechaza re-proceso del mismo archivo con un código tipo `ALREADY_PROCESSED`.
- **Paginado limit/offset:** elegido por simplicidad de UI (Prev/Next determinístico) y query fácil en SQL/Prisma. Cursor pagination sería mejor en datasets masivos, pero aumenta complejidad para el challenge.
- **Summary server-side:** agregaciones con `groupBy/aggregate` para evitar cargar filas en memoria. Esto escala mejor que hacer reduce del lado del backend.
- **Trazabilidad mínima:** `Operation` registra lifecycle (`RECEIVED/PROCESSING/COMPLETED/FAILED`) + `duration_ms` + contadores. Es suficiente para auditar uploads sin infraestructura extra.
- **Correlation ID:** middleware temprano para que cada log/response quede correlacionable (útil para App Insights y debugging por request).
- **Tradeoff del upload sync:** el parseo/insert es sincrónico en request (simple). Para CSV grande, se movería a async (queue + worker) y streaming/batch insert.
- **Escalado futuro:** `createMany` por lotes, cola (Service Bus/Storage Queue), persistir errores por fila en tabla, indexes adicionales según filtros y caching de summary.
- **AI Feature (heurística):** se evita dependencia externa y se reutiliza la misma capa de repositorio/summary para mantener consistencia con lo que la UI ve.
