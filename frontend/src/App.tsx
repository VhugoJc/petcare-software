import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Layout } from './components/Layout';
import { UserFormDialog } from './components/UserFormDialog';
import { UsersTable } from './components/UsersTable';
import { ErrorAlert } from './components/ErrorAlert';
import { useUserManagement } from './hooks/useUserManagement';
import { LoginPage } from './features/auth/components/LoginPage';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';
import { DashboardPage } from './features/dashboard/components/DashboardPage';
import { OwnersPage } from './features/owners/components/OwnersPage';
import { PetsPage } from './features/pets/components/PetsPage';
import { PetProfilePage } from './features/pets/components/PetProfilePage';
import { AppointmentsPage } from './features/appointments/components/AppointmentsPage';
import { SettingsPage } from './features/settings/SettingsPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/users" element={<UserManagementPage />} />
          <Route path="/owners" element={<OwnersPage />} />
          <Route path="/pets" element={<PetsPage />} />
          <Route path="/pets/:id" element={<PetProfilePage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/users" replace />} />
    </Routes>
  );
}

/* ------------------------------------------------------------------ */
/*  User Management Page                                              */
/* ------------------------------------------------------------------ */

function UserManagementPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { users, error, addUser, updateUser, deleteUser, clearError } = useUserManagement();

  const handleOpenDialog = () => {
    setSelectedUser(null);
    setDialogOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUser(null);
  };

  const handleFormSubmit = (formData) => {
    if (selectedUser) {
      updateUser(selectedUser.id, formData);
    } else {
      addUser(formData);
    }
    handleCloseDialog();
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(id);
    }
  };

  return (
    <>
      <ErrorAlert error={error} onClose={clearError} />

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h1">User Management</Typography>
        <Typography variant="body1" sx={{ mt: 1, color: '#6b6375' }}>
          Manage your system users and their information
        </Typography>
      </Box>

      {/* Action Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          size="large"
        >
          Create User
        </Button>
      </Box>

      {/* Users Table */}
      <UsersTable
        users={users}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />

      {/* Form Dialog */}
      <UserFormDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleFormSubmit}
        user={selectedUser}
      />

      {/* Footer Stats */}
      <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e5e4e7', textAlign: 'center' }}>
        <Typography variant="body1" sx={{ color: '#6b6375' }}>
          Total users: <strong>{users.length}</strong>
        </Typography>
      </Box>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Placeholder pages for future sprints                              */
/* ------------------------------------------------------------------ */


export default App;
