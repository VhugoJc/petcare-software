# PetCare Frontend

Interfaz moderna y minimalista para la gestión de usuarios en PetCare, construida con React, Vite y Material UI.

## Características

- ✨ Interfaz limpia y minimalista
- 📱 Diseño responsivo
- 🎨 Material UI components
- ⚡ Vite para desarrollo rápido
- 🔄 CRUD completo para gestión de usuarios
- 🎯 Código limpio y bien organizado
- 📦 Estructura modular y reutilizable

## Tech Stack

- **React 19** - Library UI
- **Vite 8** - Build tool
- **Material UI** - Component library
- **Emotion** - CSS-in-JS solution

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── UserFormDialog.jsx      # Form dialog for create/edit users
│   ├── UsersTable.jsx          # Users data table
│   ├── ErrorAlert.jsx          # Error notification component
│   └── index.js                # Component exports
├── hooks/              # Custom React hooks
│   └── useUserManagement.js    # User management logic
├── config/             # Configuration files
│   └── api.js          # API endpoints configuration
├── theme.js            # Material UI theme configuration
├── App.jsx             # Main app component
├── main.jsx            # App entry point
├── index.css           # Global styles
└── App.css             # App-specific styles
```

## Installation

```bash
# Install dependencies
npm install
```

## Environment Setup

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Configure your API URL:

```
VITE_API_URL=http://localhost:5000/api
```

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build

Build for production:

```bash
npm run build
```

## Preview

Preview the production build:

```bash
npm run preview
```

## Code Conventions

### Component Structure

- All components are functional components with hooks
- Components are reusable and follow single responsibility principle
- Props are clearly defined and documented

### State Management

- Local state is managed with `useState`
- Complex state logic is handled with custom hooks using `useReducer`
- State updates are performed through action dispatchers

### Error Handling

- Form validation happens before submission
- Error messages are displayed in a dismissible alert
- Errors auto-dismiss after 5 seconds

### Styling

- Material UI `sx` prop for component styling
- Global styles in `index.css`
- Theme customization in `theme.js`
- Consistent spacing, colors, and typography

## Component API

### UserFormDialog

```jsx
<UserFormDialog
  open={boolean}
  onClose={function}
  onSubmit={function}
  user={object|null}
/>
```

- `open`: Controls dialog visibility
- `onClose`: Called when dialog closes
- `onSubmit`: Called with form data on submit
- `user`: User data for editing (null for create)

### UsersTable

```jsx
<UsersTable
  users={array}
  onEdit={function}
  onDelete={function}
/>
```

- `users`: Array of user objects
- `onEdit`: Called when edit button clicked
- `onDelete`: Called when delete button clicked

### ErrorAlert

```jsx
<ErrorAlert
  error={string|null}
  onClose={function}
/>
```

- `error`: Error message to display
- `onClose`: Called when alert closes

## Future Enhancements

- [ ] Backend API integration
- [ ] User authentication
- [ ] Advanced filtering and search
- [ ] Pagination for large user lists
- [ ] Dark mode support
- [ ] User roles and permissions
- [ ] Bulk operations
- [ ] Export functionality

## License

MIT
