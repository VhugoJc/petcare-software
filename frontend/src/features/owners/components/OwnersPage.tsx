import { useState, useCallback, useMemo } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import { useOwners } from '../hooks/useOwners';
import { OwnerFormDialog } from './OwnerFormDialog';
import { OwnerDetailDialog } from './OwnerDetailDialog';
import { ErrorAlert } from '../../../components/ErrorAlert';
import {
  DataTable,
  PageHeader,
  GenericToolbar,
  Pagination,
  ConfirmDialog,
} from '../../../components/data';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import type { Owner, CreateOwnerInput, UpdateOwnerInput } from '../types';
import type { Column, Action, FilterConfig } from '../../../components/data/DataTable.types';

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
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [ownerToToggle, setOwnerToToggle] = useState<Owner | null>(null);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /* ---------- Column definitions ---------- */

  const columns: Column<Owner>[] = useMemo(
    () => [
      {
        field: 'firstName',
        headerName: 'Name',
        width: 200,
        render: (row) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: '#f0e6ff',
                color: '#aa3bff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '13px',
                flexShrink: 0,
              }}
            >
              {row.firstName[0]}{row.lastName[0]}
            </Box>
            <span style={{ fontWeight: 500 }}>
              {row.firstName} {row.lastName}
            </span>
          </Box>
        ),
        valueGetter: (row) => `${row.lastName}, ${row.firstName}`,
      },
      { field: 'email', headerName: 'Email', width: 220 },
      { field: 'phoneNumber', headerName: 'Phone', width: 150 },
      {
        field: 'city',
        headerName: 'City',
        width: 130,
        render: (row) => row.city || '—',
      },
      {
        field: 'isActive',
        headerName: 'Status',
        width: 100,
        align: 'center',
        render: (row) => (
          <StatusBadge label={row.isActive ? 'Active' : 'Inactive'} />
        ),
      },
    ],
    [],
  );

  /* ---------- Row actions ---------- */

  const rowActions: Action<Owner>[] = useMemo(
    () => [
      {
        label: 'View Details',
        icon: <VisibilityIcon fontSize="small" />,
        onClick: (owner) => {
          setSelectedOwner(owner);
          setDetailDialogOpen(true);
        },
      },
      {
        label: 'Edit',
        icon: <EditIcon fontSize="small" />,
        onClick: (owner) => {
          setSelectedOwner(owner);
          setDetailDialogOpen(false);
          setFormDialogOpen(true);
        },
      },
      {
        label: 'Deactivate',
        icon: <ToggleOffIcon fontSize="small" />,
        onClick: (owner) => {
          setOwnerToToggle(owner);
          setConfirmDialogOpen(true);
        },
        disabled: (row) => !row.isActive,
        color: 'warning',
        divider: true,
      },
      {
        label: 'Activate',
        icon: <ToggleOnIcon fontSize="small" />,
        onClick: (owner) => {
          setOwnerToToggle(owner);
          setConfirmDialogOpen(true);
        },
        disabled: (row) => row.isActive,
        color: 'success',
      },
    ],
    [],
  );

  /* ---------- Filter config ---------- */

  const filterConfig: FilterConfig[] = useMemo(
    () => [
      {
        key: 'isActive',
        label: 'Status',
        options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ],
      },
      {
        key: 'sortBy',
        label: 'Sort by',
        options: [
          { value: 'lastName', label: 'Last Name' },
          { value: 'firstName', label: 'First Name' },
          { value: 'createdAt', label: 'Date Added' },
        ],
      },
    ],
    [],
  );

  const filterValues: Record<string, string | undefined> = {
    isActive:
      filters.isActive === undefined
        ? undefined
        : filters.isActive
          ? 'active'
          : 'inactive',
    sortBy: filters.sortBy,
  };

  const handleFilterChange = useCallback(
    (key: string, value: string) => {
      if (key === 'isActive') {
        setFilters({ isActive: value === 'active' });
      } else if (key === 'sortBy') {
        setFilters({ sortBy: value as 'firstName' | 'lastName' | 'createdAt' });
      }
    },
    [setFilters],
  );

  const handleFilterClear = useCallback(
    (key: string) => {
      if (key === 'isActive') {
        setFilters({ isActive: undefined });
      }
    },
    [setFilters],
  );

  /* ---------- Handlers ---------- */

  const handleOpenCreate = useCallback(() => {
    setSelectedOwner(null);
    setFormDialogOpen(true);
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

  const handleConfirmToggleActive = useCallback(async () => {
    if (!ownerToToggle) return;
    const action = ownerToToggle.isActive ? 'deactivated' : 'activated';
    try {
      await toggleActiveStatus(ownerToToggle);
      setSuccessMessage(`Owner ${action} successfully`);
    } catch {
      // Error is set by the hook
    }
    setConfirmDialogOpen(false);
    setOwnerToToggle(null);
  }, [ownerToToggle, toggleActiveStatus]);

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

  const handleSort = useCallback(
    (config: { field: string; direction: 'asc' | 'desc' }) => {
      setFilters({
        sortBy: config.field as 'firstName' | 'lastName' | 'createdAt',
        sortOrder: config.direction,
      });
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

      {/* Page header */}
      <PageHeader
        title="Owners"
        subtitle="Manage pet owners and their contact information"
        action={{
          label: 'Create Owner',
          icon: <AddIcon />,
          onClick: handleOpenCreate,
        }}
      />

      {/* Toolbar with search + filters + refresh */}
      <GenericToolbar
        search={{
          value: filters.search ?? '',
          onChange: (value) => setFilters({ search: value }),
          placeholder: 'Search by name, email, or phone...',
        }}
        filters={{
          config: filterConfig,
          values: filterValues,
          onChange: handleFilterChange,
          onClear: handleFilterClear,
        }}
        refresh={{
          onClick: refresh,
          isLoading: isLoading,
        }}
      />

      {/* Results count */}
      <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ typography: 'body2', color: '#6b6375' }}>
          {total} owner{total !== 1 ? 's' : ''} found
        </Box>
      </Box>

      {/* Data table */}
      <DataTable<Owner>
        columns={columns}
        rows={owners}
        keyExtractor={(o) => o.id}
        actions={rowActions}
        isLoading={isLoading}
        loadingRows={10}
        sortable
        sortConfig={{
          field: filters.sortBy ?? 'lastName',
          direction: filters.sortOrder ?? 'asc',
        }}
        onSort={handleSort}
        emptyState={{
          icon: '🐾',
          title: 'No owners found',
          description: 'Try adjusting your search or filters, or create a new owner.',
        }}
      />

      {/* Pagination */}
      {total > 0 && (
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

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
        onEdit={(owner) => {
          setSelectedOwner(owner);
          setDetailDialogOpen(false);
          setFormDialogOpen(true);
        }}
      />

      {/* Confirm toggle active */}
      <ConfirmDialog
        open={confirmDialogOpen}
        title={ownerToToggle?.isActive ? 'Deactivate Owner' : 'Activate Owner'}
        message={
          ownerToToggle?.isActive
            ? `Are you sure you want to deactivate ${ownerToToggle.firstName} ${ownerToToggle.lastName}? They will no longer be able to schedule appointments.`
            : `Are you sure you want to reactivate ${ownerToToggle?.firstName} ${ownerToToggle?.lastName}?`
        }
        confirmLabel={ownerToToggle?.isActive ? 'Deactivate' : 'Activate'}
        confirmColor={ownerToToggle?.isActive ? 'warning' : 'primary'}
        onConfirm={handleConfirmToggleActive}
        onCancel={() => {
          setConfirmDialogOpen(false);
          setOwnerToToggle(null);
        }}
      />
    </>
  );
}