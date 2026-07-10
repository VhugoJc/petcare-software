import { Chip } from '@mui/material';

type StatusVariant = 'success' | 'warning' | 'info' | 'error' | 'default';

const STATUS_COLORS: Record<string, StatusVariant> = {
  confirmed: 'info',
  'checked-in': 'success',
  'in-progress': 'warning',
  completed: 'success',
  cancelled: 'error',
  pending: 'warning',
  paid: 'success',
  overdue: 'error',
  active: 'success',
  inactive: 'default',
};

interface StatusBadgeProps {
  label: string;
  variant?: StatusVariant;
}

export function StatusBadge({ label, variant }: StatusBadgeProps) {
  const color = variant ?? STATUS_COLORS[label.toLowerCase()] ?? 'default';

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        fontWeight: 500,
        fontSize: '12px',
        borderRadius: '6px',
        height: 24,
      }}
      color={color === 'default' ? undefined : color}
      variant={color === 'default' ? 'outlined' : 'filled'}
    />
  );
}