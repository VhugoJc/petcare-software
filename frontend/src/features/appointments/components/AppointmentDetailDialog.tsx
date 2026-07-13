import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import type { Appointment } from '../types';
import { STATUS_LABELS, TYPE_LABELS, TYPE_ICONS, formatTimeDisplay, formatDateDisplay, getDurationMinutes } from '../utils/appointmentHelpers';
import { getSpeciesIcon } from '../../pets/utils/petHelpers';

/* ------------------------------------------------------------------ */
/*  AppointmentDetailDialog — Quick-view dialog                       */
/* ------------------------------------------------------------------ */

interface AppointmentDetailDialogProps {
  open: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onEdit: (appointment: Appointment) => void;
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
      <Typography variant="caption" sx={{ color: '#6b6375', fontWeight: 500, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ color: value ? '#08060d' : '#bdbdbd' }}>
        {value || '—'}
      </Typography>
    </Box>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#08060d', mb: 1.5, mt: 1 }}>
      {children}
    </Typography>
  );
}

export function AppointmentDetailDialog({ open, onClose, appointment, onEdit }: AppointmentDetailDialogProps) {
  if (!appointment) return null;

  const speciesIcon = getSpeciesIcon(appointment.petSpecies);
  const duration = getDurationMinutes(appointment.startTime, appointment.endTime);
  const statusColorMap: Record<string, 'success' | 'warning' | 'info' | 'error' | 'default'> = {
    scheduled: 'info',
    confirmed: 'info',
    'checked-in': 'success',
    'in-progress': 'warning',
    completed: 'success',
    cancelled: 'error',
    'no-show': 'error',
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#08060d' }}>
              {appointment.appointmentNumber}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5, alignItems: 'center' }}>
              <Chip
                label={STATUS_LABELS[appointment.status]}
                size="small"
                color={statusColorMap[appointment.status] ?? 'default'}
                variant={statusColorMap[appointment.status] ? 'filled' : 'outlined'}
                sx={{ height: 22, fontSize: '11px' }}
              />
              <Typography variant="caption" sx={{ color: '#6b6375' }}>
                {formatDateDisplay(appointment.date)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 2 }}>
        {/* Pet Information */}
        <SectionTitle>Patient</SectionTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{ fontSize: 32, flexShrink: 0 }}>{speciesIcon}</Box>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#08060d' }}>
              {appointment.petName}
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b6375' }}>
              Owner: {appointment.ownerName}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        {/* Appointment Details */}
        <SectionTitle>Appointment Details</SectionTitle>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
          <DetailRow label="Date" value={formatDateDisplay(appointment.date)} />
          <DetailRow label="Duration" value={`${duration} min`} />
          <DetailRow label="Start Time" value={formatTimeDisplay(appointment.startTime)} />
          <DetailRow label="End Time" value={formatTimeDisplay(appointment.endTime)} />
          <DetailRow label="Type" value={`${TYPE_ICONS[appointment.type]} ${TYPE_LABELS[appointment.type]}`} />
          <DetailRow label="Status" value={STATUS_LABELS[appointment.status]} />
        </Box>

        <Divider sx={{ my: 1.5 }} />

        {/* Reason */}
        <SectionTitle>Reason for Visit</SectionTitle>
        <Typography variant="body2" sx={{ color: '#08060d', mb: 2 }}>
          {appointment.reason}
        </Typography>

        {/* Notes */}
        {appointment.notes && (
          <>
            <Divider sx={{ my: 1.5 }} />
            <SectionTitle>Notes</SectionTitle>
            <Typography variant="body2" sx={{ color: '#08060d', whiteSpace: 'pre-wrap' }}>
              {appointment.notes}
            </Typography>
          </>
        )}

        <Divider sx={{ my: 1.5 }} />
        <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
          <Typography variant="caption" sx={{ color: '#6b6375' }}>
            Created: {new Date(appointment.createdAt).toLocaleString()}
          </Typography>
          <Typography variant="caption" sx={{ color: '#6b6375' }}>
            Updated: {new Date(appointment.updatedAt).toLocaleString()}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">Close</Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          onClick={() => { onEdit(appointment); onClose(); }}
        >
          Edit Appointment
        </Button>
      </DialogActions>
    </Dialog>
  );
}