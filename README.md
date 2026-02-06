# TEKNE Challenge — Policy Ingestion + Traceability + AI Insights

## 🚀 Despliegue rápido (verlo corriendo YA)

## 🔐 Variables de entorno (.env) — IMPORTANTE para quien clona el repo


### 1- Backend (`backend/.env`)
Crear:
- `backend/.env.example` 

Ejemplo (tal cual funciona con el compose de este repo):
```env
PORT=3001
DATABASE_URL=postgresql://tekne:tekne@localhost:5433/tekne_db?schema=public
LOG_LEVEL=info
AI_PROVIDER=heuristic
```

### 2- Frontend (`frontend/.env`)
Crear:
- `frontend/.env.example` 
Ejemplo:
```env.example
VITE_API_URL=http://localhost:3001
```

### 3- Desplegar todo junto con Docker Compose (recomendado)
```bash
docker compose up --build
```
Abrir:
- Frontend: http://localhost:5173
- Swagger: http://localhost:3001/docs


### 3- Opción B — DB en Docker + Apps en local (dev clásico)
**1) DB**
```bash
docker compose up -d db
docker compose ps
```
(El servicio `db` debe quedar **healthy**)

**2) Backend**
```bash
cd backend
npm i
cp .env.example .env
npx prisma generate
npx prisma migrate dev
npm run dev
```
- API: http://localhost:3001
- Swagger: http://localhost:3001/docs

**3) Frontend**
```bash
cd frontend
npm i
cp .env.example .env
npm run dev
```
- Web: http://localhost:5173

---

Solución end‑to‑end para ingestión de pólizas desde CSV con validación (técnica + reglas de negocio), persistencia en PostgreSQL, trazabilidad por operación/correlation_id y endpoint de “AI insights” (heurístico).


---

## 🧱 Stack
- **Backend:** Node.js + Express (TypeScript), Prisma, PostgreSQL, Multer (CSV upload), Zod (validación), Pino (logging), Swagger.
- **Frontend:** React (Vite), TanStack Router, TanStack React Query, Tailwind.
- **Infra local:** Docker Compose (db + api + web).

---

## ✅ Funcionalidad

### Upload CSV (POST `/upload`)
- Input: `multipart/form-data`, field: `file`
- Headers requeridos:
  - `policy_number,customer,policy_type,start_date,end_date,premium_usd,status,insured_value_usd`

Validaciones técnicas mínimas:
- `policy_number` obligatorio
- `start_date` < `end_date`
- `status` ∈ `{active, expired, cancelled}`
- `policy_type` ∈ `{Property, Auto}`
- `premium_usd` y `insured_value_usd` numéricos finitos (rechaza NaN/Infinity)

Reglas de negocio (OOP engine):
- `Property` ⇒ `insured_value_usd >= 5000`  (code: `PROPERTY_VALUE_TOO_LOW`)
- `Auto`     ⇒ `insured_value_usd >= 10000` (code: `AUTO_VALUE_TOO_LOW`)

Duplicados (strict):
- `policy_number` es **UNIQUE** en DB
- Duplicados se capturan (Prisma `P2002`) y se reportan por fila: `DUPLICATE_POLICY_NUMBER`

Respuesta (ejemplo):
```json
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
```

### API UI‑friendly
#### GET `/policies`
- Paginado: `limit` (default 25, max 100), `offset` (default 0)
- Filtros: `status?`, `policy_type?`, `q?` (busca por `policy_number` o `customer`)

Respuesta:
```json
{
  "items": [],
  "pagination": { "limit": 25, "offset": 0, "total": 0 }
}
```

#### GET `/policies/summary`
Devuelve:
- `total_policies`
- `total_premium_usd`
- `count_by_status`
- `premium_by_type`

### Trazabilidad (Operations + Correlation ID)
- Si viene header `x-correlation-id` → se reutiliza
- Si no → se genera UUID
- Se devuelve en header `x-correlation-id` y en body (cuando aplica)
- `/upload` crea una operación en DB:
  - `RECEIVED -> PROCESSING -> COMPLETED/FAILED`
  - guarda `duration_ms`, `rows_inserted`, `rows_rejected`, `error_summary`
- Endpoint: `GET /operations/:id`

### Feature IA (POST `/ai/insights`)
- Input:
```json
{ "filters": { "status": "...", "policy_type": "...", "q": "..." } }
```
- Reusa list + summary internamente
- Genera 5–10 líneas con anomalías + recomendaciones (AI_PROVIDER=heuristic)

Output:
```json
{
  "insights": ["..."],
  "highlights": {
    "total_policies": 120,
    "filtered_policies": 120,
    "risk_flags": 3,
    "filters_applied": { "status": "...", "policy_type": "...", "q": "..." }
  }
}
```

---

## 🖥️ UI (React)
- **Upload:** sube CSV + muestra `inserted/rejected/duplicates`, `operation_id`, `correlation_id` y errores por fila.
- **Policies:** tabla + paginado Prev/Next + filtros + botón “Generate Insights”.
- **Summary:** cards + agregaciones (por status/tipo/premium).

---

## 🧪 Tests

### Backend (Jest + Supertest)
- `backend/tests/rules.test.ts` — **unit**: motor OOP de reglas (PolicyValidator + RuleEngine + BusinessRule).
- `backend/tests/upload.int.test.ts` — **integration**: `POST /upload` (multipart CSV, validación, duplicados, conteos y payload).
- `backend/tests/ai.int.test.ts` — **integration**: `POST /ai/insights` (insights + highlights + filtros).

Run:
```bash
cd backend
npm run test
```

### Frontend (Vitest + React Testing Library)
- Ubicación recomendada: tests por feature en `frontend/src/features/**/**/*.test.tsx`
- Ejemplo real:
  - `frontend/src/features/policies/PoliciesPage.test.tsx` — renderiza Policies y valida que la tabla cargue datos (mock de `fetch` + RouterProvider).

Run:
```bash
cd frontend
npm run test
```

---

## 🤖 CI (GitHub Actions)
- Workflow: `.github/workflows/ci.yml`
- Jobs típicos:
  - **Backend:** install → prisma generate → prisma migrate deploy → test → build
  - **Frontend:** install → test → build
- El job de backend levanta Postgres como `service` para correr integration tests (Supertest + Prisma).

---

## 📄 Docs
- `DECISIONS.md` — decisiones de arquitectura y tradeoffs.
- `DEPLOY.md` — estrategia de deploy (high‑level) + checklist.

---

## ✅ Quick demo (para probar en 30 segundos)
1) Abrir UI → Upload
2) Subir un CSV con headers:
`policy_number,customer,policy_type,start_date,end_date,premium_usd,status,insured_value_usd`
3) Ver:
- inserted/rejected/duplicates
- `operation_id` + `correlation_id`
- errores por fila
