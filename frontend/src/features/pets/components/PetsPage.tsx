import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Snackbar, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { usePets } from '../hooks/usePets';
import { PetFormDialog } from './PetFormDialog';
import { PetDetailDialog } from './PetDetailDialog';
import { ErrorAlert } from '../../../components/ErrorAlert';
import {
  DataTable,
  PageHeader,
  GenericToolbar,
  Pagination,
  ConfirmDialog,
} from '../../../components/data';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import type { Pet, CreatePetInput, UpdatePetInput } from '../types';
import type { Column, Action, FilterConfig } from '../../../components/data/DataTable.types';
import type { Species } from '../../../types';
import { getSpeciesIcon } from '../utils/petHelpers';

/* ------------------------------------------------------------------ */
/*  PetsPage — Page orchestrator                                      */
/* ------------------------------------------------------------------ */

export function PetsPage() {
  const navigate = useNavigate();
  const {
    pets,
    total,
    page,
    pageSize,
    totalPages,
    isLoading,
    error,
    filters,
    setFilters,
    refresh,
    createPet,
    updatePet,
    toggleActiveStatus,
  } = usePets();

  /* ---------- Dialog state ---------- */
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [petToToggle, setPetToToggle] = useState<Pet | null>(null);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /* ---------- Column definitions ---------- */

  const columns: Column<Pet>[] = useMemo(
    () => [
      {
        field: 'name',
        headerName: 'Name',
        width: 200,
        render: (row) => {
          const icon = getSpeciesIcon(row.species);
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  backgroundColor: '#f0e6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                {icon}
              </Box>
              <Box>
                <Box sx={{ fontWeight: 500, color: '#08060d', fontSize: '14px' }}>
                  {row.name}
                </Box>
                <Box sx={{ color: '#6b6375', fontSize: '12px' }}>
                  {row.breed}
                </Box>
              </Box>
            </Box>
          );
        },
        valueGetter: (row) => row.name,
      },
      {
        field: 'species',
        headerName: 'Species',
        width: 100,
        render: (row) => row.species.charAt(0).toUpperCase() + row.species.slice(1),
      },
      {
        field: 'ownerName',
        headerName: 'Owner',
        width: 180,
      },
      {
        field: 'sex',
        headerName: 'Sex',
        width: 70,
        align: 'center',
        render: (row) => (row.sex === 'male' ? '♂' : '♀'),
      },
      {
        field: 'dateOfBirth',
        headerName: 'DOB',
        width: 110,
        render: (row) => row.dateOfBirth,
      },
      {
        field: 'isActive',
        headerName: 'Status',
        width: 100,
        align: 'center',
        render: (row) => <StatusBadge label={row.isActive ? 'Active' : 'Inactive'} />,
      },
    ],
    [],
  );

  /* ---------- Row actions ---------- */

  const rowActions: Action<Pet>[] = useMemo(
    () => [
      {
        label: 'View Profile',
        icon: <OpenInNewIcon fontSize="small" />,
        onClick: (pet) => navigate(`/pets/${pet.id}`),
      },
      {
        label: 'Quick View',
        icon: <VisibilityIcon fontSize="small" />,
        onClick: (pet) => {
          setSelectedPet(pet);
          setDetailDialogOpen(true);
        },
      },
      {
        label: 'Edit',
        icon: <EditIcon fontSize="small" />,
        onClick: (pet) => {
          setSelectedPet(pet);
          setDetailDialogOpen(false);
          setFormDialogOpen(true);
        },
      },
      {
        label: 'Deactivate',
        icon: <ToggleOffIcon fontSize="small" />,
        onClick: (pet) => {
          setPetToToggle(pet);
          setConfirmDialogOpen(true);
        },
        disabled: (row) => !row.isActive,
        color: 'warning',
        divider: true,
      },
      {
        label: 'Activate',
        icon: <ToggleOnIcon fontSize="small" />,
        onClick: (pet) => {
          setPetToToggle(pet);
          setConfirmDialogOpen(true);
        },
        disabled: (row) => row.isActive,
        color: 'success',
      },
    ],
    [navigate],
  );

  /* ---------- Filter config ---------- */

  const filterConfig: FilterConfig[] = useMemo(
    () => [
      {
        key: 'species',
        label: 'Species',
        options: [
          { value: 'dog', label: '🐕 Dogs' },
          { value: 'cat', label: '🐱 Cats' },
          { value: 'bird', label: '🐦 Birds' },
          { value: 'rabbit', label: '🐰 Rabbits' },
          { value: 'other', label: '🐾 Other' },
        ],
      },
      {
        key: 'isActive',
        label: 'Status',
        options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ],
      },
    ],
    [],
  );

  const filterValues: Record<string, string | undefined> = {
    species: filters.species,
    isActive:
      filters.isActive === undefined
        ? undefined
        : filters.isActive
          ? 'active'
          : 'inactive',
  };

  const handleFilterChange = useCallback(
    (key: string, value: string) => {
      if (key === 'species') {
        setFilters({ species: value as Species });
      } else if (key === 'isActive') {
        setFilters({ isActive: value === 'active' });
      }
    },
    [setFilters],
  );

  const handleFilterClear = useCallback(
    (key: string) => {
      if (key === 'species') {
        setFilters({ species: undefined });
      } else if (key === 'isActive') {
        setFilters({ isActive: undefined });
      }
    },
    [setFilters],
  );

  /* ---------- Handlers ---------- */

  const handleOpenCreate = useCallback(() => {
    setSelectedPet(null);
    setFormDialogOpen(true);
  }, []);

  const handleCloseDialogs = useCallback(() => {
    setFormDialogOpen(false);
    setDetailDialogOpen(false);
    setSelectedPet(null);
  }, []);

  const handleCreateSubmit = useCallback(
    async (data: CreatePetInput | UpdatePetInput) => {
      try {
        await createPet(data as CreatePetInput);
        setSuccessMessage('Pet created successfully');
      } catch {
        // Error is set by the hook
      }
    },
    [createPet],
  );

  const handleUpdateSubmit = useCallback(
    async (data: CreatePetInput | UpdatePetInput) => {
      if (!selectedPet) return;
      try {
        await updatePet(selectedPet.id, data as UpdatePetInput);
        setSuccessMessage('Pet updated successfully');
      } catch {
        // Error is set by the hook
      }
    },
    [selectedPet, updatePet],
  );

  const handleConfirmToggleActive = useCallback(async () => {
    if (!petToToggle) return;
    const action = petToToggle.isActive ? 'deactivated' : 'activated';
    try {
      await toggleActiveStatus(petToToggle);
      setSuccessMessage(`Pet ${action} successfully`);
    } catch {
      // Error is set by the hook
    }
    setConfirmDialogOpen(false);
    setPetToToggle(null);
  }, [petToToggle, toggleActiveStatus]);

  const handlePageChange = useCallback(
    (newPage: number) => setFilters({ page: newPage }),
    [setFilters],
  );

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => setFilters({ pageSize: newPageSize, page: 1 }),
    [setFilters],
  );

  const handleSort = useCallback(
    (config: { field: string; direction: 'asc' | 'desc' }) => {
      setFilters({
        sortBy: config.field as 'name' | 'species' | 'breed' | 'dateOfBirth' | 'createdAt',
        sortOrder: config.direction,
      });
    },
    [setFilters],
  );

  /* ---------- Render ---------- */

  return (
    <>
      <ErrorAlert error={error} onClose={() => {}} />

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

      <PageHeader
        title="Pets"
        subtitle="Manage patient records and their medical information"
        action={{
          label: 'Create Pet',
          icon: <AddIcon />,
          onClick: handleOpenCreate,
        }}
      />

      <GenericToolbar
        search={{
          value: filters.search ?? '',
          onChange: (value) => setFilters({ search: value }),
          placeholder: 'Search by name, breed, or owner...',
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

      <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ typography: 'body2', color: '#6b6375' }}>
          {total} pet{total !== 1 ? 's' : ''} found
        </Box>
      </Box>

      <DataTable<Pet>
        columns={columns}
        rows={pets}
        keyExtractor={(p) => p.id}
        actions={rowActions}
        isLoading={isLoading}
        loadingRows={10}
        sortable
        sortConfig={{
          field: filters.sortBy ?? 'name',
          direction: filters.sortOrder ?? 'asc',
        }}
        onSort={handleSort}
        emptyState={{
          icon: '🐾',
          title: 'No pets found',
          description: 'Try adjusting your search or filters, or create a new pet.',
        }}
      />

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

      <PetFormDialog
        open={formDialogOpen}
        onClose={handleCloseDialogs}
        onSubmit={selectedPet ? handleUpdateSubmit : handleCreateSubmit}
        pet={selectedPet}
      />

      <PetDetailDialog
        open={detailDialogOpen}
        onClose={handleCloseDialogs}
        pet={selectedPet}
        onEdit={(pet) => {
          setSelectedPet(pet);
          setDetailDialogOpen(false);
          setFormDialogOpen(true);
        }}
      />

      <ConfirmDialog
        open={confirmDialogOpen}
        title={petToToggle?.isActive ? 'Deactivate Pet' : 'Activate Pet'}
        message={
          petToToggle?.isActive
            ? `Are you sure you want to deactivate ${petToToggle.name}? They will no longer appear in active patient lists.`
            : `Are you sure you want to reactivate ${petToToggle?.name}?`
        }
        confirmLabel={petToToggle?.isActive ? 'Deactivate' : 'Activate'}
        confirmColor={petToToggle?.isActive ? 'warning' : 'primary'}
        onConfirm={handleConfirmToggleActive}
        onCancel={() => {
          setConfirmDialogOpen(false);
          setPetToToggle(null);
        }}
      />
    </>
  );
}