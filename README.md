TEKNE CHALLENGE — NOTAS PARA COPIAR/PEGAR (TEXTO PLANO) ✅
(pegable en README.md / DECISIONS.md / DEPLOY.md sin romper formato)

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
README.md (secciones + bullets)
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
- Backend (Jest + Supertest):
  - tests/upload.int.test.ts
  - tests/rules.test.ts
- Frontend (Vitest + Testing Library):
  - PoliciesPage.test.tsx


========================================
DECISIONS.md (10–20 líneas, sin humo)
========================================

- Prisma + PostgreSQL para rapidez y para hacer cumplir UNIQUE (policy_number) con garantía real (DB como source of truth).
- Duplicados strict: dejamos que la constraint haga el trabajo y reportamos P2002 como DUPLICATE_POLICY_NUMBER por fila (+ duplicates_count).
- Validación por capas: PolicyValidator valida técnico (fechas/enum/números) y luego RuleEngine aplica reglas de negocio (BusinessRule polimórficas).
- OOP real en dominio: BusinessRule abstracta + reglas concretas por tipo; sumar reglas no requiere tocar controllers/services.
- Paginado limit/offset: UX simple (Prev/Next) y queries directas en DB.
- Summary: agregaciones con groupBy/aggregate para no cargar todo en memoria.
- Correlation ID: middleware al inicio para que cada log/response sea correlacionable.
- Operations table: trazabilidad mínima (status + duration_ms + error_summary) sin tooling externo.
- AI insights: heurística “barata” que reusa repo.list + repo.summary (consistencia con la UI).
- Escalabilidad: para CSV grande, batch inserts + job async; índices por filtros; caching de summary si sube el volumen.


========================================
DEPLOY.md (Azure high-level, práctico)
========================================

Arquitectura propuesta:
- Backend: Azure App Service (Node) o Azure Functions (HTTP triggers)
- DB: Azure Database for PostgreSQL (managed)
- Secrets: Azure Key Vault
- Observabilidad: Application Insights
- CI/CD: GitHub Actions

1) Backend (App Service)
- App Service Linux con Node 20.
- App settings:
  - DATABASE_URL (Azure Postgres)
  - LOG_LEVEL=info
  - AI_PROVIDER=heuristic
- Deploy ejecuta:
  - npx prisma generate
  - npx prisma migrate deploy
- Healthcheck: /health
- CORS: permitir dominio del frontend.

2) Backend (Functions)
- Express -> Functions vía wrapper o deploy como contenedor.
- Endpoints como HTTP triggers.
- Para CSV grande: blob storage + queue + worker (fuera del scope del challenge).

3) PostgreSQL managed
- Provisionar Azure Database for PostgreSQL.
- Ejecutar migrations Prisma.
- Mantener constraints + indexes (status, policy_type, customer, UNIQUE policy_number).

4) Key Vault
- Guardar DATABASE_URL y futuras keys.
- App Service/Functions lee secretos con Managed Identity.

5) Application Insights
- Logs estructurados: correlation_id, endpoint, duration_ms, inserted/rejected.
- Alertas por 500s, latencia y ratio de fallos en /upload.

6) Frontend
- Azure Static Web Apps (o cualquier host estático).
- Setear VITE_API_URL al backend público.

7) CI/CD (GitHub Actions)
- Steps:
  - install deps
  - tests backend (jest) + frontend (vitest)
  - build backend (tsc) + frontend (vite)
  - deploy backend + frontend
  - prisma migrate deploy en deploy del backend

8) Idempotencia / Duplicados
- UNIQUE en DB como verdad.
- Extra (opcional): hash del archivo para evitar reprocesar el mismo CSV.
- Para throughput alto: createMany(skipDuplicates=true) + estrategia para mapear duplicados por fila.

FIN ✅
