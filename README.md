# tekne-sanso

Requisitos

Node.js 20+

Docker + Docker Compose

(Opcional) curl para smoke tests

Puertos y conexión a DB

API: http://localhost:3001

PostgreSQL (Docker):

Interno en red Docker: db:5432

Expuesto al host: localhost:5433 (mapeo 5433:5432)

Regla de oro:

Si corrés backend en Docker → usa db:5432

Si corrés backend con npm run dev en tu PC → usa localhost:5433

Variables de entorno
Docker (ya configurado en docker-compose.yml)

El servicio api usa:

DATABASE_URL=postgresql://tekne:tekne@db:5432/tekne_db?schema=public

Local dev (backend/.env)

Para correr npm run dev en el host (Windows/macOS/Linux), usar:

DATABASE_URL=postgresql://tekne:tekne@localhost:5433/tekne_db?schema=public

Prisma migrations

Schema: backend/prisma/schema.prisma

Migraciones (versionadas en Git): backend/prisma/migrations/**

Crear la primera migración (o nuevas migraciones)

Levantar DB:

docker compose up -d db


Crear y aplicar migración (desde backend/):

cd backend
npx prisma migrate dev --name init


Cada vez que cambies schema.prisma, repetís migrate dev con un nombre descriptivo y commiteás:

backend/prisma/schema.prisma

backend/prisma/migrations/**

Aplicar migraciones en Docker

El contenedor del backend aplica migraciones al iniciar (modo “deploy”):

npx prisma migrate deploy

Ejecutar el backend con Docker (recomendado)

Desde la raíz del repo (donde está docker-compose.yml):

1) Reset limpio (opcional, útil si querés DB vacía)
docker compose down -v

2) Levantar servicios
docker compose up --build -d

3) Smoke tests
curl http://127.0.0.1:3001/health
curl "http://127.0.0.1:3001/policies?limit=1"
curl "http://127.0.0.1:3001/policies/summary"


Logs:

docker logs tekne-api --tail=200

Ejecutar el backend en modo desarrollo (npm run dev)

Este modo corre Node/TypeScript en tu PC, pero reutiliza Postgres dockerizado.

1) Levantar solo la DB (o dejarla corriendo)
docker compose up -d db

2) (Si la API docker está levantada) detener solo el servicio API

Para evitar colisión de puerto 3001:

docker compose stop api

3) Correr el backend local

Desde backend/:

npm install
npm run dev

4) Smoke tests
curl http://localhost:3001/health
curl "http://localhost:3001/policies?limit=1"

Swagger (API Docs)

http://localhost:3001/docs

Troubleshooting rápido
Empty reply from server / conexiones raras en Windows

Usar 127.0.0.1 en lugar de localhost:

curl http://127.0.0.1:3001/health

Verificar tablas en la DB
docker exec -it tekne-postgres psql -U tekne -d tekne_db -c "\dt"

Prisma no encuentra migraciones

Asegurate de tener backend/prisma/migrations/** versionado y corré:

cd backend
npx prisma migrate dev --name <nombre>

------
wake up and:
cd /c/repos/tekne-sanso
docker compose stop api
docker compose up -d db
cd backend
npm run dev