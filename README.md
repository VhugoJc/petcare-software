# PetCare

Software de gestión veterinaria para clínicas y consultorios de mascotas.

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | React + TypeScript + Vite + Tailwind CSS |
| **Backend** | Node.js + Express (próximamente) |
| **Base de datos** | MongoDB 7.0 en Docker |
| **Admin DB** | MongoDB Compass |

## Frontend

```bash
cd frontend
npm install
npm run dev
```

## Base de Datos

MongoDB se ejecuta en un contenedor Docker con datos persistentes.

### Requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop)

### Iniciar MongoDB

```bash
docker compose up -d
```

Esto crea automáticamente la base de datos `petcare` con las colecciones e índices necesarios, y un usuario administrador por defecto (`admin@petcare.com`).

### Conexión con MongoDB Compass

```
mongodb://petcare_user:petcare_dev_password@localhost:27018/petcare?authSource=admin
```

### Comandos útiles

```bash
docker compose up -d          # Iniciar MongoDB
docker compose down           # Detener MongoDB
docker compose down -v        # Detener y borrar datos
docker compose logs -f        # Ver logs
```

## Estructura del proyecto

```
petcare-software/
├── frontend/          # Aplicación React
├── docker/            # Scripts de inicialización de MongoDB
├── docker-compose.yml # Configuración de Docker
└── .env               # Variables de entorno
```

## Licencia

MIT

---

**Estado del Proyecto**: 🚧 En desarrollo
