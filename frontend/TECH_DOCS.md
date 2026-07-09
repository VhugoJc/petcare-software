# PetCare Frontend - Documentación Técnica

## Descripción General

Se ha creado una interfaz CRUD minimalista y moderna para la gestión de usuarios en PetCare utilizando React, Vite y Material UI. La aplicación está completamente funcional sin dependencias de base de datos, permitiendo pruebas inmediatas.

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.jsx                  # Main app layout with header & sidebar
│   │   ├── UserFormDialog.jsx          # Dialog for create/edit users
│   │   ├── UsersTable.jsx              # Data table with actions
│   │   ├── ErrorAlert.jsx              # Error notification component
│   │   └── index.js                    # Component exports
│   │
│   ├── hooks/
│   │   └── useUserManagement.js     # Hook personalizado para gestión de usuarios
│   │                                 # (Manejo de estado con useReducer)
│   │
│   ├── utils/
│   │   └── validation.js            # Funciones de validación reutilizables
│   │
│   ├── constants/
│   │   └── index.js                 # Constantes de la aplicación
│   │
│   ├── config/
│   │   └── api.js                   # Configuración de endpoints API
│   │
│   ├── theme.js                     # Configuración del tema Material UI
│   ├── App.jsx                      # Componente principal
│   ├── main.jsx                     # Punto de entrada
│   ├── index.css                    # Estilos globales
│   └── App.css                      # Estilos específicos de la app
│
├── public/
├── .env.example                     # Variables de entorno de ejemplo
├── .gitignore
├── vite.config.js
├── eslint.config.js
├── package.json
└── README.md
```

## ✨ Características Implementadas

### 1. **Layout Profesional de PetCare**
- **Barra Superior**: AppBar con logo de PetCare, título y menú de usuario
- **Menú Lateral**: Drawer con navegación, logo y sección de usuario
- **Responsive**: Menú colapsa en dispositivos móviles
- **Diseño Minimalista**: Colores y tipografía coherente con PetCare

### 2. **Componentes Reutilizables**
- **Layout**: Contenedor principal con estructura de app profesional
- **UserFormDialog**: Diálogo modal para crear y editar usuarios
- **UsersTable**: Tabla de datos con opciones de editar y eliminar
- **ErrorAlert**: Componente de alerta con auto-cierre

### 2. **Gestión de Estado**
- Hook personalizado `useUserManagement` con `useReducer`
- Separación de lógica de negocio
- Validación de datos antes de operaciones
- Manejo de errores integrado

### 3. **Funcionalidades CRUD**
- ✅ **Create**: Crear nuevos usuarios mediante un diálogo
- ✅ **Read**: Mostrar lista de usuarios en tabla
- ✅ **Update**: Editar usuarios existentes
- ✅ **Delete**: Eliminar usuarios con confirmación

### 4. **Material UI Integration**
- Componentes Material UI reutilizados
- Tema personalizado con colores coherentes
- Responsive design automático
- Iconos de Material Icons

### 5. **Mejores Prácticas de Código**
- Componentes funcionales con hooks
- Single Responsibility Principle
- Código limpio y bien documentado
- Validación de entrada
- Error handling robusto
- Estructura modular y escalable

## 🎨 Tema y Colores

El proyecto utiliza un tema minimalista con:
- **Color Primario**: `#aa3bff` (Púrpura)
- **Color Secundario**: `#08060d` (Negro oscuro)
- **Fondo**: Blanco
- **Texto**: Gris oscuro

## 🚀 Cómo Usar

### Instalación
```bash
cd frontend
npm install
```

### Desarrollo
```bash
npm run dev
```
Abre [http://localhost:5173](http://localhost:5173)

### Construcción para Producción
```bash
npm run build
```

### Vista Previa de Producción
```bash
npm run preview
```

## 📝 Funcionalidades de la Interfaz

### Panel Principal
- Encabezado con título y descripción
- Botón "Create User" para crear nuevos usuarios
- Tabla de usuarios con información
- Contador de usuarios totales

### Diálogo de Formulario
- Campos: Nombre, Email, Teléfono
- Validación en tiempo real
- Botones Cancel y Create/Update
- Reutilizable para crear y editar

### Tabla de Usuarios
- Columnas: Nombre, Email, Teléfono
- Botones de acción: Editar, Eliminar
- Mensajes cuando no hay usuarios
- Hover effects para mejor UX

### Sistema de Alertas
- Alertas de error con auto-cierre
- Mensajes claros en español e inglés
- Cierre manual disponible

## 🔧 Configuración API (Para Futuro)

El archivo `config/api.js` ya está preparado para conectarse a un backend:

```javascript
VITE_API_URL=http://localhost:5000/api
```

## 📦 Dependencias Principales

```json
{
  "react": "^19.2.6",
  "react-dom": "^19.2.6",
  "@mui/material": "^5.x",
  "@mui/icons-material": "^5.x",
  "@emotion/react": "^11.x",
  "@emotion/styled": "^11.x"
}
```

## 🎯 Próximos Pasos

1. **Backend Integration**: Conectar con API Node.js/Express
2. **Autenticación**: Agregar sistema de login
3. **Validación Avanzada**: Validación lado del servidor
4. **Paginación**: Para listas grandes de usuarios
5. **Búsqueda y Filtros**: Funcionalidades de búsqueda
6. **Dark Mode**: Soporte para modo oscuro
7. **Internacionalización**: Soporte multiidioma

## 📚 Recursos Útiles

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Material UI Documentation](https://mui.com)
- [Material Icons](https://fonts.google.com/icons)

---

**Estado del Proyecto**: ✅ Completado y funcional
**Última Actualización**: Junio 2026
