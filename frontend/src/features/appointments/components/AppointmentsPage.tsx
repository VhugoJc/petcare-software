import { useState, useCallback, useMemo } from 'react';
import { Box, Snackbar, Alert, ToggleButtonGroup, ToggleButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CancelIcon from '@mui/icons-material/Cancel';
import TableChartIcon from '@mui/icons-material/TableChart';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { useAppointments } from '../hooks/useAppointments';
import { AppointmentFormDialog } from './AppointmentFormDialog';
import { AppointmentDetailDialog } from './AppointmentDetailDialog';
import { AppointmentStatusChip } from './AppointmentStatusChip';
import { DailyScheduleView } from './DailyScheduleView';
import { CalendarView } from './CalendarView';
import { ErrorAlert } from '../../../components/ErrorAlert';
import {
  DataTable,
  PageHeader,
  GenericToolbar,
  Pagination,
  ConfirmDialog,
} from '../../../components/data';
import type { Appointment, CreateAppointmentInput, UpdateAppointmentInput, AppointmentStatus } from '../types';
import type { Column, Action, FilterConfig } from '../../../components/data/DataTable.types';
import { formatTimeDisplay, formatDateDisplay, getTodayISO, TYPE_LABELS, TYPE_ICONS } from '../utils/appointmentHelpers';
import { getSpeciesIcon } from '../../pets/utils/petHelpers';

type ViewMode = 'list' | 'schedule' | 'calendar';

/* ------------------------------------------------------------------ */
/*  AppointmentsPage — Page orchestrator                              */
/* ------------------------------------------------------------------ */

export function AppointmentsPage() {
  const {
    appointments,
    total,
    page,
    pageSize,
    totalPages,
    isLoading,
    error,
    filters,
    setFilters,
    refresh,
    createAppointment,
    updateAppointment,
    updateAppointmentStatus,
    cancelAppointment,
  } = useAppointments();

  /* ---------- View mode ---------- */
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  /* ---------- Dialog state ---------- */
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /* ---------- Status change handler (defined before columns that use it) ---------- */

  const handleStatusChange = useCallback(
    async (appt: Appointment, newStatus: AppointmentStatus) => {
      try {
        await updateAppointmentStatus(appt.id, { status: newStatus });
        setSuccessMessage(`Appointment ${appt.appointmentNumber} moved to "${newStatus}"`);
      } catch {
        // Error is set by the hook
      }
    },
    [updateAppointmentStatus],
  );

  /* ---------- Column definitions ---------- */

  const columns: Column<Appointment>[] = useMemo(
    () => [
      {
        field: 'appointmentNumber',
        headerName: '#',
        width: 130,
        render: (row) => (
          <Box sx={{ fontWeight: 500, color: '#08060d', fontSize: '13px' }}>
            {row.appointmentNumber}
          </Box>
        ),
      },
      {
        field: 'petName',
        headerName: 'Pet',
        width: 160,
        render: (row) => {
          const icon = getSpeciesIcon(row.petSpecies);
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ fontSize: 18, flexShrink: 0 }}>{icon}</Box>
              <Box>
                <Box sx={{ fontWeight: 500, color: '#08060d', fontSize: '14px' }}>{row.petName}</Box>
                <Box sx={{ color: '#6b6375', fontSize: '12px' }}>{row.ownerName}</Box>
              </Box>
            </Box>
          );
        },
        valueGetter: (row) => row.petName,
      },
      {
        field: 'date',
        headerName: 'Date',
        width: 120,
        render: (row) => formatDateDisplay(row.date),
      },
      {
        field: 'startTime',
        headerName: 'Time',
        width: 100,
        render: (row) => `${formatTimeDisplay(row.startTime)} – ${formatTimeDisplay(row.endTime)}`,
        valueGetter: (row) => row.startTime,
      },
      {
        field: 'type',
        headerName: 'Type',
        width: 110,
        render: (row) => `${TYPE_ICONS[row.type]} ${TYPE_LABELS[row.type]}`,
      },
      {
        field: 'reason',
        headerName: 'Reason',
        width: 160,
        render: (row) => (
          <Box sx={{ color: '#6b6375', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {row.reason}
          </Box>
        ),
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 130,
        align: 'center',
        render: (row) => (
          <AppointmentStatusChip
            status={row.status}
            onStatusChange={(newStatus) => handleStatusChange(row, newStatus)}
          />
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleStatusChange],
  );

  /* ---------- Row actions ---------- */

  const rowActions: Action<Appointment>[] = useMemo(
    () => [
      {
        label: 'View Details',
        icon: <VisibilityIcon fontSize="small" />,
        onClick: (appt) => {
          setSelectedAppointment(appt);
          setDetailDialogOpen(true);
        },
      },
      {
        label: 'Edit',
        icon: <EditIcon fontSize="small" />,
        onClick: (appt) => {
          setSelectedAppointment(appt);
          setDetailDialogOpen(false);
          setFormDialogOpen(true);
        },
      },
      {
        label: 'Cancel Appointment',
        icon: <CancelIcon fontSize="small" />,
        onClick: (appt) => {
          setCancelTarget(appt);
          setConfirmDialogOpen(true);
        },
        disabled: (row) => row.status === 'completed' || row.status === 'cancelled' || row.status === 'no-show',
        color: 'error',
        divider: true,
      },
    ],
    [],
  );

  /* ---------- Filter config ---------- */

  const filterConfig: FilterConfig[] = useMemo(
    () => [
      {
        key: 'status',
        label: 'Status',
        options: [
          { value: 'scheduled', label: 'Scheduled' },
          { value: 'confirmed', label: 'Confirmed' },
          { value: 'checked-in', label: 'Checked In' },
          { value: 'in-progress', label: 'In Progress' },
          { value: 'completed', label: 'Completed' },
          { value: 'cancelled', label: 'Cancelled' },
          { value: 'no-show', label: 'No Show' },
        ],
      },
      {
        key: 'type',
        label: 'Type',
        options: [
          { value: 'consultation', label: 'Consultation' },
          { value: 'surgery', label: 'Surgery' },
          { value: 'vaccination', label: 'Vaccination' },
          { value: 'checkup', label: 'Check-up' },
          { value: 'grooming', label: 'Grooming' },
          { value: 'dental', label: 'Dental' },
          { value: 'emergency', label: 'Emergency' },
          { value: 'followup', label: 'Follow-up' },
        ],
      },
    ],
    [],
  );

  const filterValues: Record<string, string | undefined> = {
    status: filters.status,
    type: filters.type,
  };

  const handleFilterChange = useCallback(
    (key: string, value: string) => {
      if (key === 'status') {
        setFilters({ status: value as AppointmentStatus });
      } else if (key === 'type') {
        setFilters({ type: value as any });
      }
    },
    [setFilters],
  );

  const handleFilterClear = useCallback(
    (key: string) => {
      if (key === 'status') setFilters({ status: undefined });
      else if (key === 'type') setFilters({ type: undefined });
    },
    [setFilters],
  );

  /* ---------- Handlers ---------- */

  const handleOpenCreate = useCallback(() => {
    setSelectedAppointment(null);
    setFormDialogOpen(true);
  }, []);

  const handleCloseDialogs = useCallback(() => {
    setFormDialogOpen(false);
    setDetailDialogOpen(false);
    setSelectedAppointment(null);
  }, []);

  const handleCreateSubmit = useCallback(
    async (data: CreateAppointmentInput | UpdateAppointmentInput) => {
      try {
        await createAppointment(data as CreateAppointmentInput);
        setSuccessMessage('Appointment created successfully');
      } catch {
        // Error is set by the hook
      }
    },
    [createAppointment],
  );

  const handleUpdateSubmit = useCallback(
    async (data: CreateAppointmentInput | UpdateAppointmentInput) => {
      if (!selectedAppointment) return;
      try {
        await updateAppointment(selectedAppointment.id, data as UpdateAppointmentInput);
        setSuccessMessage('Appointment updated successfully');
      } catch {
        // Error is set by the hook
      }
    },
    [selectedAppointment, updateAppointment],
  );

  const handleConfirmCancel = useCallback(async () => {
    if (!cancelTarget) return;
    try {
      await cancelAppointment(cancelTarget.id);
      setSuccessMessage(`Appointment ${cancelTarget.appointmentNumber} cancelled`);
    } catch {
      // Error is set by the hook
    }
    setConfirmDialogOpen(false);
    setCancelTarget(null);
  }, [cancelTarget, cancelAppointment]);

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
        sortBy: config.field as 'date' | 'startTime' | 'createdAt' | 'status',
        sortOrder: config.direction,
      });
    },
    [setFilters],
  );

  const handleViewModeChange = useCallback(
    (_: React.MouseEvent<HTMLElement>, newMode: ViewMode | null) => {
      if (newMode) setViewMode(newMode);
    },
    [],
  );

  const handleDateSelect = useCallback(
    (date: string) => {
      setFilters({ date });
      setViewMode('list');
    },
    [setFilters],
  );

  const handleTodayClick = useCallback(() => {
    const today = getTodayISO();
    setFilters({ date: today });
    setViewMode('schedule');
  }, [setFilters]);

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
        <Alert onClose={() => setSuccessMessage(null)} severity="success" variant="filled" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      <PageHeader
        title="Appointments"
        subtitle="Schedule and manage patient appointments"
        action={{
          label: 'Create Appointment',
          icon: <AddIcon />,
          onClick: handleOpenCreate,
        }}
      >
        {/* View mode toggle + Today button */}
        <Box sx={{ display: 'flex', gap: 2, mt: 2, alignItems: 'center' }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                textTransform: 'none',
                px: 2,
                color: '#6b6375',
                '&.Mui-selected': { color: '#aa3bff', backgroundColor: '#f0e6ff' },
              },
            }}
          >
            <ToggleButton value="list"><TableChartIcon sx={{ mr: 0.5, fontSize: 18 }} /> List</ToggleButton>
            <ToggleButton value="schedule"><ScheduleIcon sx={{ mr: 0.5, fontSize: 18 }} /> Schedule</ToggleButton>
            <ToggleButton value="calendar"><CalendarMonthIcon sx={{ mr: 0.5, fontSize: 18 }} /> Calendar</ToggleButton>
          </ToggleButtonGroup>

          <Box
            onClick={handleTodayClick}
            sx={{
              px: 2,
              py: 0.5,
              borderRadius: '6px',
              border: '1px solid #e5e4e7',
              cursor: 'pointer',
              typography: 'body2',
              fontWeight: 500,
              color: '#6b6375',
              fontSize: '13px',
              '&:hover': { backgroundColor: '#f5f5f5' },
            }}
          >
            Today
          </Box>
        </Box>
      </PageHeader>

      {/* Toolbar (list view only) */}
      {viewMode === 'list' && (
        <GenericToolbar
          search={{
            value: filters.search ?? '',
            onChange: (value) => setFilters({ search: value }),
            placeholder: 'Search by pet, owner, reason, or #...',
          }}
          filters={{
            config: filterConfig,
            values: filterValues,
            onChange: handleFilterChange,
            onClear: handleFilterClear,
          }}
          refresh={{ onClick: refresh, isLoading }}
        />
      )}

      {/* ── List View ── */}
      {viewMode === 'list' && (
        <>
          <Box sx={{ mb: 1.5, typography: 'body2', color: '#6b6375' }}>
            {total} appointment{total !== 1 ? 's' : ''} found
          </Box>

          <DataTable<Appointment>
            columns={columns}
            rows={appointments}
            keyExtractor={(a) => a.id}
            actions={rowActions}
            isLoading={isLoading}
            loadingRows={10}
            sortable
            sortConfig={{ field: filters.sortBy ?? 'date', direction: filters.sortOrder ?? 'asc' }}
            onSort={handleSort}
            emptyState={{ icon: '📅', title: 'No appointments found', description: 'Try adjusting your search or filters, or create a new appointment.' }}
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
        </>
      )}

      {/* ── Schedule View ── */}
      {viewMode === 'schedule' && (
        <DailyScheduleView
          appointments={appointments}
          date={filters.date ?? getTodayISO()}
          onAppointmentClick={(appt) => {
            setSelectedAppointment(appt);
            setDetailDialogOpen(true);
          }}
          onDateChange={(newDate) => {
            setFilters({ date: newDate });
          }}
        />
      )}

      {/* ── Calendar View ── */}
      {viewMode === 'calendar' && (
        <CalendarView
          appointments={appointments}
          currentMonth={calendarMonth}
          onMonthChange={(m) => {
            setCalendarMonth(m);
            // Fetch appointments for the new month range
            const [y, mo] = m.split('-').map(Number);
            const start = `${y}-${String(mo).padStart(2, '0')}-01`;
            const end = `${y}-${String(mo).padStart(2, '0')}-${new Date(y, mo, 0).getDate()}`;
            setFilters({ dateFrom: start, dateTo: end });
          }}
          onDateSelect={handleDateSelect}
        />
      )}

      {/* Dialogs */}
      <AppointmentFormDialog
        open={formDialogOpen}
        onClose={handleCloseDialogs}
        onSubmit={selectedAppointment ? handleUpdateSubmit : handleCreateSubmit}
        appointment={selectedAppointment}
      />

      <AppointmentDetailDialog
        open={detailDialogOpen}
        onClose={handleCloseDialogs}
        appointment={selectedAppointment}
        onEdit={(appt) => {
          setSelectedAppointment(appt);
          setDetailDialogOpen(false);
          setFormDialogOpen(true);
        }}
      />

      <ConfirmDialog
        open={confirmDialogOpen}
        title="Cancel Appointment"
        message={`Are you sure you want to cancel appointment ${cancelTarget?.appointmentNumber} for ${cancelTarget?.petName}?`}
        confirmLabel="Cancel Appointment"
        confirmColor="error"
        onConfirm={handleConfirmCancel}
        onCancel={() => { setConfirmDialogOpen(false); setCancelTarget(null); }}
      />
    </>
  );
}