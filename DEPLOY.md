# DEPLOY.md

## Objetivo
Describir un despliegue **realista y rápido** en Azure para:
- **API Node/Express** (este repo) ✅
- **PostgreSQL managed**
- **Secrets en Key Vault**
- **Logs/Métricas en Application Insights**
- **CI/CD high-level (GitHub Actions)**

---

## Opción preferida: Azure Functions (Container) ✅

> Motivo: encaja bien con **HTTP APIs**, escala automático y permite empaquetar Express sin pelear con runtimes.
> Para este challenge, la alternativa más pragmática es **Functions como contenedor**.

### 1) Infra (1 vez)
1. **Azure Database for PostgreSQL (Flexible Server)**
   - Crear servidor Postgres (Flexible Server).
   - Crear DB: `tekne_db`
   - Habilitar acceso desde Azure (VNET o allowlist) según necesidad.
   - Guardar el connection string (sin exponerlo en repo).

2. **Azure Container Registry (ACR)**
   - Crear ACR para publicar imágenes: `tekneacr.azurecr.io`

3. **Function App (Linux)**
   - Crear Function App en Linux con soporte para contenedores.
   - Configurar runtime “Custom Container”.

4. **Key Vault**
   - Crear Key Vault.
   - Crear secrets:
     - `DATABASE_URL`
     - `LOG_LEVEL`
     - `AI_PROVIDER`
     - (opcional) `CORS_ORIGIN`

5. **Application Insights**
   - Crear un recurso de App Insights.
   - Conectar la Function App a App Insights.

---

### 2) Build & Run (Backend) en Functions (Container)
**Idea:** el container expone HTTP (Express) y Functions lo ejecuta como app container.

**Dockerfile backend (ya existe):**
- Se compila `dist/`
- En runtime ejecuta `node dist/server.js`

**Importante (Prisma en prod):**
- En Azure NO asumimos “db push”.
- Se ejecuta **`prisma migrate deploy`** con la DB managed.

**Recomendado (entrypoint de arranque):**
- En el contenedor ejecutar:
  - `npx prisma generate`
  - `npx prisma migrate deploy`
  - `node dist/server.js`

Esto es el mismo patrón que usás en docker-compose:
- `npx prisma generate && npx prisma migrate deploy && npm run start`

---

### 3) Secrets (Key Vault) → App Settings
En la Function App, setear App Settings:
- `DATABASE_URL` (referencia a Key Vault)
- `LOG_LEVEL=info`
- `AI_PROVIDER=heuristic`
- `PORT=3001` (si aplica)

**Acceso a Key Vault**
- Asignar **Managed Identity** a la Function App.
- Dar permisos a la identity para `get` secrets en Key Vault.

---

### 4) Observabilidad (Application Insights)
**Qué capturar:**
- Logs del backend (Pino) con:
  - `correlation_id`
  - `endpoint`
  - `statusCode`
  - `duration_ms`
- Métricas:
  - tasa de 5xx
  - latencia p95/p99
  - throughput (req/min)

**Cómo correlacionar:**
- Middleware `x-correlation-id` ya existe ✅
- `requestLoggerMiddleware` ya registra `duration_ms` + endpoint ✅

---

## Alternativa: Azure App Service (más simple) ✅

> Motivo: si el TL quiere “click-click deploy” sin el modelo Functions.

### 1) Infra
- App Service (Linux, Node 20) **o** App Service con container.
- PostgreSQL Flexible Server.
- Key Vault.
- App Insights.

### 2) Deploy
- Publicar backend como container o zip deploy.
- En el pipeline ejecutar:
  - `npx prisma generate`
  - `npx prisma migrate deploy`
  - start app: `node dist/server.js`

---

## Frontend (Vite React) — Static host
Opciones típicas:
- **Azure Static Web Apps** (ideal)
- Storage Account + Static Website
- CDN opcional

**Config:**
- `VITE_API_URL` apuntando al host público del backend (Functions/App Service).

---

## CI/CD (High-level) — GitHub Actions ✅

### Pipeline (idea)
1. **On push** a `main`:
   - Install deps
   - Run tests backend (`npm test`)
   - Run tests frontend (`npm test`)
   - Build backend (`npm run build`)
   - Build frontend (`npm run build`)

2. **Build & push container**
   - `docker build -t tekneacr.azurecr.io/tekne-api:<sha> backend/`
   - `docker push ...`

3. **Deploy backend**
   - Actualizar Function App / App Service con la nueva imagen (ACR).

4. **Migraciones**
   - Paso previo al arranque o step dedicado:
     - `npx prisma migrate deploy`
   - (en entornos reales: migraciones en step separado con approvals)

5. **Deploy frontend**
   - `vite build`
   - Deploy a Static Web Apps

---

## Duplicados / Idempotencia en producción
- La **verdad** es la DB: `policy_number` es `UNIQUE`.
- Si se re-suben CSVs:
  - duplicados se convierten en `P2002` y se reportan como `DUPLICATE_POLICY_NUMBER` ✅
- Para idempotencia fuerte (opcional):
  - almacenar `file_hash` en Operation
  - si `file_hash` ya existe → devolver `ALREADY_PROCESSED`

---

## Checklist de “listo para prod”
- [ ] `DATABASE_URL` solo por Key Vault
- [ ] `prisma migrate deploy` en deploy
- [ ] App Insights conectado
- [ ] CORS restringido a dominio del frontend
- [ ] Health endpoint `/health` (ya existe ✅)
- [ ] Logs con `correlation_id` (ya existe ✅)
