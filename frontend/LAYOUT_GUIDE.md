# PetCare Frontend - Actualización Layout

## 🎨 Nuevo Layout Implementado

Se ha añadido un layout profesional con diseño PetCare que incluye:

### 📋 Componentes Principales

#### **1. Layout.jsx** (NUEVO)
El componente Layout es el contenedor principal que proporciona:

**AppBar Superior:**
- Logo con icono 🐾 y nombre "PetCare"
- Botón de menú (hamburguesa) para móvil
- Menú de usuario (Avatar con opciones: Settings, Logout)
- Diseño limpio con colores PetCare

**Sidebar/Drawer:**
- Navbar de navegación con items (Dashboard, Users, Settings)
- Sección de usuario con avatar y email
- Responsive: se convierte en drawer temporal en móvil
- Icono de PetCare al inicio

**Main Content:**
- Área flexible para contenido
- Footer con copyright
- Padding responsivo

**Características:**
- ✅ Responsive design (desktop y mobile)
- ✅ Drawer temporal en dispositivos pequeños
- ✅ Menú de usuario con opciones
- ✅ Navegación clara e intuitiva
- ✅ Colores coherentes con identidad PetCare

### 🎯 Colores y Diseño

**Paleta de Colores:**
- Primary: `#aa3bff` (Púrpura)
- Dark: `#7a1fa3` (Púrpura oscuro)
- Text: `#08060d` (Negro)
- Secondary Text: `#6b6375` (Gris)
- Border: `#e5e4e7` (Gris claro)
- Background: `#f9f9f9` (Gris muy claro)

**Gradientes:**
- Logo y avatares: `linear-gradient(135deg, #aa3bff 0%, #7a1fa3 100%)`

### 📐 Estructura del Drawer

```
┌─────────────────────┐
│ 🐾 PetCare          │
│    Veterinary System │
├─────────────────────┤
│ 📊 Dashboard        │
│ 👥 Users            │ ← Activo
│ ⚙️  Settings        │
├─────────────────────┤
│ 👨 Admin User       │
│    admin@petcare... │
└─────────────────────┘
```

### 📱 Responsive Behavior

**Desktop (md y mayor):**
- Drawer permanente a la izquierda
- AppBar normal arriba
- Contenido fluido

**Mobile (xs-sm):**
- Drawer temporal que se abre con botón hamburguesa
- AppBar con botón de menú
- Drawer se cierra al hacer click en item

### 🔧 Cómo Usar

```jsx
import { Layout } from './components/Layout';

function App() {
  return (
    <Layout>
      {/* Tu contenido aquí */}
      <YourContent />
    </Layout>
  );
}
```

### 🚀 Cambios Realizados

1. **Creado Layout.jsx** - Componente principal
2. **Actualizado App.jsx** - Ahora envuelto en Layout
3. **Actualizado components/index.js** - Exporta Layout
4. **Estructura CSS** - Toda la lógica en Material UI sx prop

### 📦 Dependencias

El Layout usa:
- `@mui/material` - Componentes
- `@mui/icons-material` - Iconos
- React Hooks (useState)

No requiere dependencias adicionales.

### 🎨 Customización

Puedes personalizar:
- **Menú items**: Modifica el array `menuItems` en Layout.jsx
- **Colores**: Edita los valores en `theme.js`
- **Iconos**: Cambia los imports desde `@mui/icons-material`
- **User Info**: Actualiza "Admin User" y email en la sección de usuario

### ✨ Características Incluidas

✅ Header con logo y branding
✅ Sidebar con navegación
✅ Menú responsive
✅ Avatar de usuario con dropdown
✅ Footer con copyright
✅ Diseño minimalista y profesional
✅ Colores coherentes con PetCare
✅ Iconos intuitivos
✅ Completo responsividad
✅ Fácil de mantener y extender

---

**Estado**: ✅ Completado
**Fecha**: Junio 2026
