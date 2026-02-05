🚀 PRIORITARIO (SETUP LOCAL RÁPIDO)
========================================

0) Prerrequisitos
- Node.js 20+
- Docker + Docker Compose

1) PostgreSQL (dockerizado) 🐘
- En la raíz del repo:
  docker compose up -d db
- Verificar health:
  docker compose ps
  (db debe quedar "healthy")

2) Backend (API) ⚙️
- Ir a backend:
  cd backend
- Instalar deps:
  npm i
- Crear/cargar env:
  - Copiar .env.example -> .env (o crear backend/.env)
  - DATABASE_URL local (con puerto 5433 del compose):
    DATABASE_URL=postgresql://tekne:tekne@localhost:5433/tekne_db?schema=public
- Levantar dev:
  npm run dev
- API: http://localhost:3001
- Swagger: http://localhost:3001/docs

3) Prisma / Migraciones (IMPORTANTE) 🧬
- Si corres el backend con `npm run dev` (fuera de Docker):
  - Prisma NO corre solo.
  - Ejecutar UNA VEZ:
    npx prisma generate
    npx prisma migrate dev
- Si corres todo con `docker compose up --build`:
  - Prisma SÍ corre solo (por el `command:` del servicio api):
    npx prisma generate && (npx prisma migrate deploy || npx prisma db push) && npm run start

4) Frontend (Web) 🖥️
- En otra terminal:
  cd frontend
- Instalar deps:
  npm i
- (Opcional) env:
  VITE_API_URL=http://localhost:3001
- Levantar dev:
  npm run dev
- Web: http://localhost:5173

5) Flujo de prueba rápido ✅
- Abrir UI -> Upload
- Subir CSV con headers:
  policy_number,customer,policy_type,start_date,end_date,premium_usd,status,insured_value_usd
- Ver resultados:
  inserted/rejected/duplicates + operation_id + correlation_id + errors por fila

TIP: Mostrar siempre los detalles
- Logs backend: correlation_id + endpoint + duration_ms
- Respuesta /upload: operation_id + correlation_id + errors


========================================
CARACTERISTICAS:
========================================

## 1) Resumen
- Mini app end-to-end para ingestión de pólizas desde CSV, validación (técnica + reglas de negocio), persistencia en PostgreSQL y endpoints UI-friendly.
- Incluye trazabilidad (operations + correlation_id) y un endpoint de IA (heurístico) basado en datos del sistema.

## 2) Stack
- Backend: Node.js + Express (TypeScript), Prisma, PostgreSQL, Multer (upload CSV), Zod (validación), Pino (logs), Swagger.
- Frontend: React (Vite), TanStack Router, TanStack React Query, Zod schemas para contratos, Tailwind (UI mínima).
- Infra local: Docker Compose (db + api + web).

## 3) Modelo de datos
- **Policy**
  - policy_number (UNIQUE)
  - customer
  - policy_type
  - start_date
  - end_date
  - premium_usd
  - status
  - insured_value_usd
  - created_at
- **Operation** (trazabilidad de `/upload`)
  - id (operation_id), created_at, endpoint, status, correlation_id
  - rows_inserted, rows_rejected, duration_ms, error_summary

## 4) Upload CSV (POST /upload) 📦
- Input: `multipart/form-data`, campo: `file`
- Headers requeridos:
  - policy_number,customer,policy_type,start_date,end_date,premium_usd,status,insured_value_usd

### Validaciones técnicas mínimas
- policy_number obligatorio
- start_date < end_date
- status ∈ {active, expired, cancelled}
- policy_type ∈ {Property, Auto}
- premium_usd e insured_value_usd deben ser números finitos (rechaza NaN/Infinity)

### Reglas de negocio (OOP engine)
- Property ⇒ insured_value_usd >= 5000  (code: PROPERTY_VALUE_TOO_LOW)
- Auto     ⇒ insured_value_usd >= 10000 (code: AUTO_VALUE_TOO_LOW)

### Duplicados (strict) 🧷
- policy_number es UNIQUE en DB
- Si se intenta insertar un duplicado:
  - se captura Prisma P2002
  - se reporta error por fila: DUPLICATE_POLICY_NUMBER
  - **duplicates_count**: cantidad de duplicados detectados en ese upload

### Respuesta requerida (ejemplo)
{
  "operation_id": "uuid",
  "correlation_id": "uuid",
  "inserted_count": 2,
  "rejected_count": 1,
  "duplicates_count": 1,
  "errors": [
    { "row_number": 3, "field": "insured_value_usd", "code": "PROPERTY_VALUE_TOO_LOW" }
  ]
}

## 5) API de consulta (UI-friendly)
### GET /policies
- Paginado: limit (default 25, max 100), offset (default 0)
- Filtros:
  - status (opcional)
  - policy_type (opcional)
  - q (opcional: búsqueda por policy_number o customer)
- Respuesta:
{
  "items": [ ... ],
  "pagination": { "limit": 25, "offset": 0, "total": 120 }
}

### GET /policies/summary
- Devuelve:
  - total_policies
  - total_premium_usd
  - count_by_status
  - premium_by_type

## 6) OOP (motor de reglas) 🧠
- **BusinessRule** (abstracta)
- Reglas concretas:
  - PropertyMinInsuredValueRule
  - AutoMinInsuredValueRule
- **RuleEngine** aplica reglas sin conocer detalles (polimorfismo).
- **PolicyValidator**
  - valida checks técnicos (enum/fechas/números)
  - si pasa, ejecuta RuleEngine

## 7) Trazabilidad (Operations + Correlation ID) 🧾
- correlation_id:
  - si viene `x-correlation-id` -> se usa
  - si no -> se genera UUID
  - se devuelve en header `x-correlation-id` y en body cuando aplica
- `/upload` crea operación en DB:
  - RECEIVED -> PROCESSING -> COMPLETED/FAILED
  - guarda duration_ms, rows_inserted, rows_rejected, error_summary
- Endpoint de consulta:
  - GET /operations/:id

## 8) Feature IA (POST /ai/insights) 🤖
- Input:
  - { "filters": { "status": "...", "policy_type": "...", "q": "..." } }
- Backend:
  - reusa lógica de list + summary internamente
  - genera 5–10 líneas con anomalías + recomendaciones
- Output:
{
  "insights": [ "..." ],
  "highlights": {
    "total_policies": 120,
    "filtered_policies": 120,
    "risk_flags": 3,
    "filters_applied": { "status": "...", "policy_type": "...", "q": "..." }
  }
}

## 9) UI (React) ✅
- Upload: CSV + Upload + muestra inserted/rejected/duplicates + operation_id + correlation_id + errores por fila
- Policies: tabla + paginado Prev/Next + filtros + botón Generate Insights
- Summary: cards + listas de agregación

## 10) Local Run (Docker Compose) 🐳
- docker compose up --build
- db: postgres:16 (host 5433 -> container 5432)
- api: http://localhost:3001
- web: http://localhost:5173
- Swagger: http://localhost:3001/docs

## 11) Tests 🧪

### Backend (Jest + Supertest)
- `backend/tests/rules.test.ts` — **unit**: motor OOP de reglas de negocio (PolicyValidator + RuleEngine + BusinessRule).
- `backend/tests/upload.int.test.ts` — **integration**: `POST /upload` (CSV multipart, validación, duplicados, conteos y payload).
- `backend/tests/ai.int.test.ts` — **integration**: `POST /ai/insights` (insights + highlights + filtros aplicados).

### Frontend (Vitest + React Testing Library)
- Tests ubicados en `frontend/src/**/__tests__/*` o `frontend/src/**/*.test.tsx` (por feature).
- Ejemplo real:
- `frontend/src/features/policies/PoliciesPage.test.tsx` — renderiza la página de Policies y verifica que la tabla cargue datos (mock de `fetch` + RouterProvider).


## 12) CI (GitHub Actions) 🤖
- Archivo: .github/workflows/ci.yml
- Jobs:
- Backend: install → prisma generate → prisma migrate deploy → test → build
- Frontend: install → test → build
- Backend job usa Postgres (service) para correr integration tests (Supertest + Prisma).



**Run**
```bash
cd backend
npm run test
```
## Docs
- `DECISIONS.md` — decisiones de arquitectura y tradeoffs.
- `DEPLOY.md` — estrategia de deploy (Azure high-level) + checklist.

FIN ✅
