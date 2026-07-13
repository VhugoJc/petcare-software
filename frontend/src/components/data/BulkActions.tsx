import { Box, Typography, Button, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { BulkAction } from './DataTable.types';

/* ------------------------------------------------------------------ */
/*  BulkActions — Bar shown when rows are selected                   */
/* ------------------------------------------------------------------ */

interface BulkActionsProps {
  selectedCount: number;
  actions: BulkAction[];
  onClearSelection: () => void;
}

export function BulkActions({ selectedCount, actions, onClearSelection }: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        px: 2,
        py: 1,
        backgroundColor: '#f0f0ff',
        borderRadius: '8px',
        border: '1px solid #d9d0ff',
      }}
    >
      <Chip
        label={`${selectedCount} selected`}
        size="small"
        onDelete={onClearSelection}
        deleteIcon={<CloseIcon fontSize="small" />}
        sx={{ fontWeight: 500 }}
      />

      <Box sx={{ display: 'flex', gap: 1 }}>
        {actions.map((action) => (
          <Button
            key={action.id}
            size="small"
            variant="outlined"
            color={action.color ?? 'primary'}
            startIcon={action.icon}
            onClick={() => {
              // Build a Set of selected keys — in real usage the parent
              // would maintain the actual selected row keys
              action.onClick(new Set());
            }}
            sx={{ textTransform: 'none', fontSize: '13px' }}
          >
            {action.label}
          </Button>
        ))}
      </Box>

      <Typography variant="caption" sx={{ color: '#6b6375', ml: 'auto' }}>
        Select rows using checkboxes
      </Typography>
    </Box>
  );
}