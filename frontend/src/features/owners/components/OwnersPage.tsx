import { useState, useCallback } from 'react';
import { Box, Typography, Button, LinearProgress, Snackbar, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useOwners } from '../hooks/useOwners';
import { OwnerFilters } from './OwnerFilters';
import { OwnersTable } from './OwnersTable';
import { OwnerFormDialog } from './OwnerFormDialog';
import { OwnerDetailDialog } from './OwnerDetailDialog';
import { ErrorAlert } from '../../../components/ErrorAlert';
import type { Owner, CreateOwnerInput, UpdateOwnerInput } from '../types';

/* ------------------------------------------------------------------ */
/*  OwnersPage — Page orchestrator                                    */
/* ------------------------------------------------------------------ */

export function OwnersPage() {
  const {
    owners,
    total,
    page,
    pageSize,
    totalPages,
    isLoading,
    error,
    filters,
    setFilters,
    refresh,
    createOwner,
    updateOwner,
    toggleActiveStatus,
  } = useOwners();

  /* ---------- Dialog state ---------- */
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /* ---------- Handlers ---------- */

  const handleOpenCreate = useCallback(() => {
    setSelectedOwner(null);
    setFormDialogOpen(true);
  }, []);

  const handleOpenEdit = useCallback((owner: Owner) => {
    setSelectedOwner(owner);
    // Close detail dialog if open
    setDetailDialogOpen(false);
    setFormDialogOpen(true);
  }, []);

  const handleOpenDetail = useCallback((owner: Owner) => {
    setSelectedOwner(owner);
    setDetailDialogOpen(true);
  }, []);

  const handleCloseDialogs = useCallback(() => {
    setFormDialogOpen(false);
    setDetailDialogOpen(false);
    setSelectedOwner(null);
  }, []);

  const handleCreateSubmit = useCallback(
    async (data: CreateOwnerInput | UpdateOwnerInput) => {
      try {
        await createOwner(data as CreateOwnerInput);
        setSuccessMessage('Owner created successfully');
      } catch {
        // Error is set by the hook
      }
    },
    [createOwner],
  );

  const handleUpdateSubmit = useCallback(
    async (data: CreateOwnerInput | UpdateOwnerInput) => {
      if (!selectedOwner) return;
      try {
        await updateOwner(selectedOwner.id, data as UpdateOwnerInput);
        setSuccessMessage('Owner updated successfully');
      } catch {
        // Error is set by the hook
      }
    },
    [selectedOwner, updateOwner],
  );

  const handleToggleActive = useCallback(
    async (owner: Owner) => {
      const action = owner.isActive ? 'deactivated' : 'activated';
      try {
        await toggleActiveStatus(owner);
        setSuccessMessage(`Owner ${action} successfully`);
      } catch {
        // Error is set by the hook
      }
    },
    [toggleActiveStatus],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setFilters({ page: newPage });
    },
    [setFilters],
  );

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      setFilters({ pageSize: newPageSize, page: 1 });
    },
    [setFilters],
  );

  /* ---------- Render ---------- */

  return (
    <>
      {/* Error alert from hook */}
      <ErrorAlert error={error} onClose={() => {}} />

      {/* Success snackbar */}
      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSuccessMessage(null)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Loading bar */}
      {isLoading && (
        <LinearProgress
          sx={{
            mb: 2,
            borderRadius: 1,
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#aa3bff',
            },
          }}
        />
      )}

      {/* Page header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h1" sx={{ fontSize: '28px', fontWeight: 700, color: '#08060d' }}>
          Owners
        </Typography>
        <Typography variant="body1" sx={{ mt: 0.5, color: '#6b6375' }}>
          Manage pet owners and their contact information
        </Typography>
      </Box>

      {/* Filters */}
      <OwnerFilters filters={filters} onFiltersChange={setFilters} />

      {/* Action bar */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ color: '#6b6375' }}>
          {total} owner{total !== 1 ? 's' : ''} found
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          size="medium"
        >
          Create Owner
        </Button>
      </Box>

      {/* Table */}
      <OwnersTable
        owners={owners}
        total={total}
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onEdit={handleOpenEdit}
        onViewDetails={handleOpenDetail}
        onToggleActive={handleToggleActive}
      />

      {/* Create / Edit dialog */}
      <OwnerFormDialog
        open={formDialogOpen}
        onClose={handleCloseDialogs}
        onSubmit={selectedOwner ? handleUpdateSubmit : handleCreateSubmit}
        owner={selectedOwner}
      />

      {/* Detail dialog */}
      <OwnerDetailDialog
        open={detailDialogOpen}
        onClose={handleCloseDialogs}
        owner={selectedOwner}
        onEdit={handleOpenEdit}
      />
    </>
  );
}