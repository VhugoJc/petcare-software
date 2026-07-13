import { Tooltip, IconButton, CircularProgress } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

/* ------------------------------------------------------------------ */
/*  RefreshButton                                                      */
/* ------------------------------------------------------------------ */

interface RefreshButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function RefreshButton({ onClick, isLoading = false, disabled = false }: RefreshButtonProps) {
  return (
    <Tooltip title="Refresh">
      <span>
        <IconButton
          onClick={onClick}
          disabled={disabled || isLoading}
          sx={{ color: '#6b6375' }}
          size="small"
        >
          {isLoading ? (
            <CircularProgress size={20} sx={{ color: '#aa3bff' }} />
          ) : (
            <RefreshIcon fontSize="small" />
          )}
        </IconButton>
      </span>
    </Tooltip>
  );
}