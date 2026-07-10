import { Box, Typography } from '@mui/material';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import type { Appointment } from '../types';

interface TodayScheduleProps {
  appointments: Appointment[];
}

const SPECIES_EMOJI: Record<string, string> = {
  dog: '🐕',
  cat: '🐱',
  bird: '🐦',
  rabbit: '🐰',
  other: '🐾',
};

export function TodaySchedule({ appointments }: TodayScheduleProps) {
  if (appointments.length === 0) {
    return (
      <Typography variant="body2" sx={{ color: '#6b6375', py: 2, textAlign: 'center' }}>
        No appointments scheduled for today.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {appointments.slice(0, 5).map((apt) => (
        <Box
          key={apt.id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            py: 1,
            px: 1.5,
            borderRadius: 1,
            bgcolor: '#f9f9f9',
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: '#08060d', minWidth: 44, fontSize: '13px' }}
          >
            {apt.time}
          </Typography>
          <Box sx={{ fontSize: 18 }}>{SPECIES_EMOJI[apt.patientSpecies] ?? '🐾'}</Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: '#08060d' }}>
              {apt.patientName}
            </Typography>
            <Typography variant="caption" sx={{ color: '#6b6375' }}>
              {apt.reason}
            </Typography>
          </Box>
          <StatusBadge label={apt.status} />
        </Box>
      ))}
      {appointments.length > 5 && (
        <Typography variant="caption" sx={{ color: '#6b6375', textAlign: 'center', pt: 0.5 }}>
          +{appointments.length - 5} more appointments
        </Typography>
      )}
    </Box>
  );
}