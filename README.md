# PetCare

Software de gestión veterinaria para clínicas y consultorios de mascotas.

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | React + TypeScript + Vite + MUI |
| **Backend** | Node.js + Express + TypeScript + Mongoose |
| **Base de datos** | MongoDB 7.0 |
| **Admin DB** | Mongo Express (opcional, desarrollo) |

## Requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop)

## Inicio rápido

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd petcare-software

# 2. Configurar variables de entorno
cp .env.example .env

# 3. Iniciar toda la aplicación
docker compose up --build
```

La aplicación estará disponible en:

| Servicio | URL |
|----------|-----|
| **Frontend** | http://localhost:5173 |
| **Backend API** | http://localhost:5000/api/v1 |
| **Health check** | http://localhost:5000/api/v1/health |
| **Mongo Express** | http://localhost:8081 (solo con perfil `development`) |

### Credenciales por defecto

- **Email:** `admin@petcare.com`
- **Contraseña:** `admin123`

## Servicios

### Frontend (React + Vite)

- Hot reload habilitado mediante bind mount y polling
- Proxy de Vite: `/api/*` se redirige automáticamente al backend
- Puerto: `5173`

### Backend (Express + TypeScript)

- Hot reload con `tsx watch`
- Validación de variables de entorno con Zod
- Conexión a MongoDB con Mongoose
- Puerto: `5000`

### Base de datos (MongoDB 7.0)

- Datos persistentes en volumen Docker (`petcare_mongo_data`)
- Inicialización automática de colecciones e índices
- Health check configurado

### Mongo Express (opcional)

Interfaz web para administrar MongoDB.

```bash
# Incluir Mongo Express al iniciar
docker compose --profile development up --build
```

## Comandos útiles

```bash
# Iniciar todos los servicios
docker compose up --build

# Iniciar en segundo plano
docker compose up --build -d

# Ver logs de todos los servicios
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs -f petcare-backend

# Detener servicios
docker compose down

# Detener y eliminar volúmenes (⚠️ pierde datos)
docker compose down -v

# Reconstruir un servicio específico
docker compose up --build -d petcare-backend

# Ejecutar un servicio específico con perfil
docker compose --profile tools up petcare-mongo-express
```

## Desarrollo sin Docker

Si prefieres ejecutar los servicios localmente:

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Base de datos

```bash
docker compose up -d petcare-mongo
```

## Variables de entorno

Todas las variables se configuran desde un único archivo `.env` en la raíz del proyecto.

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `MONGO_VERSION` | Versión de MongoDB | `7.0` |
| `MONGO_PORT` | Puerto host de MongoDB | `27017` |
| `MONGO_DATABASE` | Nombre de la base de datos | `petcare` |
| `MONGO_USERNAME` | Usuario de MongoDB | `petcare_user` |
| `MONGO_PASSWORD` | Contraseña de MongoDB | `secure_password_change_me` |
| `MONGO_URI` | URI de conexión interna | `mongodb://...` |
| `BACKEND_PORT` | Puerto del backend | `5000` |
| `NODE_ENV` | Entorno | `development` |
| `JWT_SECRET` | Secreto JWT (mín. 16 caracteres) | `change_me_in_production...` |
| `JWT_EXPIRES_IN` | Duración del token JWT | `24h` |
| `CORS_ORIGIN` | Orígenes CORS permitidos | `http://localhost:5173,...` |
| `LOG_LEVEL` | Nivel de logging | `debug` |
| `FRONTEND_PORT` | Puerto del frontend | `5173` |
| `VITE_API_URL` | URL base de la API | `http://localhost:5000/api/v1` |
| `ME_PORT` | Puerto de Mongo Express | `8081` |

## Estructura del proyecto

```
petcare-software/
├── frontend/              # Aplicación React
│   ├── Dockerfile         # Multi-stage: dev + prod
│   ├── .dockerignore
│   └── src/
├── backend/               # API REST (Express + TypeScript)
│   ├── Dockerfile         # Multi-stage: dev + prod
│   ├── .dockerignore
│   └── src/
├── docker/
│   └── mongo/init/        # Scripts de inicialización de MongoDB
├── docker-compose.yml     # Orquestación de servicios
├── .env.example           # Plantilla de variables de entorno
└── .env                   # Variables de entorno (no versionado)
```

## Producción

Para construir imágenes optimizadas para producción:

```bash
# Backend
docker build --target prod -t petcare-backend:latest ./backend

# Frontend
docker build \
  --target prod \
  --build-arg VITE_API_URL=https://api.tudominio.com/api/v1 \
  -t petcare-frontend:latest ./frontend
```

## Licencia

MIT

---

**Estado del Proyecto**: 🚧 En desarrollo
