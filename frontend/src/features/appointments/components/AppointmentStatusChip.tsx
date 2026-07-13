import { Chip, Menu, MenuItem, ListItemText, Box } from '@mui/material';
import { useState, useCallback } from 'react';
import type { AppointmentStatus } from '../types';
import { STATUS_LABELS, STATUS_COLORS, getAvailableTransitions } from '../utils/appointmentHelpers';

/* ------------------------------------------------------------------ */
/*  AppointmentStatusChip — Clickable status badge with transitions   */
/* ------------------------------------------------------------------ */

interface AppointmentStatusChipProps {
  status: AppointmentStatus;
  onStatusChange?: (newStatus: AppointmentStatus) => void;
  readonly?: boolean;
}

export function AppointmentStatusChip({ status, onStatusChange, readonly = false }: AppointmentStatusChipProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!readonly && onStatusChange) {
      setAnchorEl(e.currentTarget);
    }
  }, [readonly, onStatusChange]);

  const handleSelect = useCallback((newStatus: AppointmentStatus) => {
    setAnchorEl(null);
    onStatusChange?.(newStatus);
  }, [onStatusChange]);

  const availableTransitions = readonly ? [] : getAvailableTransitions(status);
  const color = STATUS_COLORS[status] as 'success' | 'warning' | 'info' | 'error' | 'default';

  return (
    <>
      <Chip
        label={STATUS_LABELS[status]}
        size="small"
        onClick={handleClick}
        color={color === 'default' ? undefined : color}
        variant={color === 'default' ? 'outlined' : 'filled'}
        sx={{
          fontWeight: 500,
          fontSize: '12px',
          borderRadius: '6px',
          height: 24,
          cursor: availableTransitions.length > 0 && !readonly ? 'pointer' : 'default',
          '& .MuiChip-deleteIcon': {
            fontSize: '14px',
            color: 'inherit',
            opacity: 0.7,
          },
        }}
      />

      {availableTransitions.length > 0 && (
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
          transformOrigin={{ horizontal: 'left', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          slotProps={{
            paper: {
              sx: { minWidth: 160, borderRadius: '8px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)' },
            },
          }}
        >
          {availableTransitions.map((t) => (
            <MenuItem key={t} onClick={() => handleSelect(t)} sx={{ py: 0.75, px: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: STATUS_COLORS[t],
                    flexShrink: 0,
                  }}
                />
                <ListItemText
                  primary={STATUS_LABELS[t]}
                  sx={{ '& .MuiTypography-root': { fontSize: '14px' } }}
                />
              </Box>
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  );
}