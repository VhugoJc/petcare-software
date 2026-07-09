// Example Usage Guide for PetCare Frontend Components

// ===========================================
// 1. USING THE APP
// ===========================================

// The app starts with App.jsx which displays the UserManagementPanel
// - See all users in the table
// - Click "Create User" button to add a new user
// - Click edit icon to modify a user
// - Click delete icon to remove a user

// ===========================================
// 2. COMPONENT USAGE EXAMPLES
// ===========================================

// ---- UserFormDialog ----
import { UserFormDialog } from './components/UserFormDialog';

// In your component:
const [dialogOpen, setDialogOpen] = useState(false);

const handleSubmit = (formData) => {
  // formData = { name: string, email: string, phone: string }
  console.log('Form submitted:', formData);
};

return (
  <UserFormDialog
    open={dialogOpen}
    onClose={() => setDialogOpen(false)}
    onSubmit={handleSubmit}
    user={null} // For create, or pass user object for edit
  />
);

// ---- UsersTable ----
import { UsersTable } from './components/UsersTable';

const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '555-1234' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '555-5678' },
];

return (
  <UsersTable
    users={users}
    onEdit={(user) => console.log('Edit:', user)}
    onDelete={(userId) => console.log('Delete:', userId)}
  />
);

// ---- ErrorAlert ----
import { ErrorAlert } from './components/ErrorAlert';

const [error, setError] = useState(null);

return (
  <ErrorAlert
    error={error}
    onClose={() => setError(null)}
  />
);

// ===========================================
// 3. USING CUSTOM HOOKS
// ===========================================

import { useUserManagement } from './hooks/useUserManagement';

function MyComponent() {
  const {
    users,        // Array of users
    error,        // Current error message
    addUser,      // (userData) => void
    updateUser,   // (id, userData) => void
    deleteUser,   // (id) => void
    clearError    // () => void
  } = useUserManagement();

  // Example: Add a user
  const newUser = { name: 'Alice', email: 'alice@example.com', phone: '555-9999' };
  addUser(newUser); // Returns user with auto-generated id

  // Example: Update a user
  updateUser(1, { name: 'Updated Name', email: 'new@example.com', phone: '555-0000' });

  // Example: Delete a user
  deleteUser(1);
}

// ===========================================
// 4. VALIDATION EXAMPLES
// ===========================================

import { validateUserData, isValidEmail } from './utils/validation';

// Validate complete user object
const result = validateUserData({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '555-1234'
});

if (!result.isValid) {
  console.log('Validation errors:', result.errors);
  // Output: { email: 'Invalid email format', ... }
}

// Check single email
if (isValidEmail('test@example.com')) {
  console.log('Valid email');
}

// ===========================================
// 5. THEME CUSTOMIZATION
// ===========================================

// Edit src/theme.js to customize:
// - Primary color: palette.primary.main
// - Secondary color: palette.secondary.main
// - Typography: font sizes, weights
// - Component overrides: MuiButton, MuiCard, etc.

// Example change:
// palette: {
//   primary: {
//     main: '#your-color', // Change primary color
//   },
// }

// ===========================================
// 6. STATE MANAGEMENT PATTERN
// ===========================================

// The useUserManagement hook uses useReducer for complex state logic
// Actions supported:
// - ADD_USER: { type: 'ADD_USER', payload: userData }
// - UPDATE_USER: { type: 'UPDATE_USER', payload: { id, ...userData } }
// - DELETE_USER: { type: 'DELETE_USER', payload: userId }
// - SET_ERROR: { type: 'SET_ERROR', payload: errorMessage }
// - CLEAR_ERROR: { type: 'CLEAR_ERROR' }

// ===========================================
// 7. API INTEGRATION READY
// ===========================================

// When backend is ready, update the hook to use API calls:
// Replace local state operations with API calls

// Example structure (to be implemented):
// const response = await fetch(`${API_ENDPOINTS.users.list}`);
// const data = await response.json();

// See config/api.js for API endpoint configuration

// ===========================================
// 8. ENVIRONMENT VARIABLES
// ===========================================

// Create .env file:
VITE_API_URL=http://localhost:5000/api

// Access in code:
const apiUrl = import.meta.env.VITE_API_URL;

// ===========================================
// 9. RESPONSIVE DESIGN
// ===========================================

// Material UI handles responsive design automatically
// No media queries needed for basic layouts
// Table, forms, and buttons adapt to screen size

// For custom responsive styles, use Material UI's sx prop:
// sx={{ display: { xs: 'block', md: 'flex' } }}

// ===========================================
// 10. ACCESSIBILITY
// ===========================================

// All components include:
// - Proper semantic HTML
// - ARIA labels where needed
// - Keyboard navigation support
// - Color contrast compliance
// - Focus management

// Test with keyboard navigation:
// Tab: Move between interactive elements
// Enter/Space: Activate buttons
// Escape: Close dialogs

// ===========================================
