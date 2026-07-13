import { IconButton, Tooltip, Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { useState, useCallback } from 'react';
import type { Action } from './DataTable.types';

/* ------------------------------------------------------------------ */
/*  RowActionsMenu — Dropdown menu of row-level actions               */
/* ------------------------------------------------------------------ */

interface RowActionsMenuProps<T> {
  actions: Action<T>[];
  row: T;
  size?: 'small' | 'medium';
}

export function RowActionsMenu<T>({ actions, row, size = 'small' }: RowActionsMenuProps<T>) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleAction = useCallback(
    (action: Action<T>) => {
      handleClose();
      action.onClick(row);
    },
    [row, handleClose],
  );

  const visibleActions = actions.filter((a) => !a.disabled?.(row));

  if (visibleActions.length === 0) return null;

  return (
    <>
      <Tooltip title="Actions">
        <IconButton
          size={size}
          onClick={handleOpen}
          sx={{ color: '#6b6375' }}
          aria-label="Row actions"
        >
          <MoreVert fontSize="small" />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            sx: {
              minWidth: 160,
              borderRadius: '8px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
            },
          },
        }}
      >
        {visibleActions.map((action, index) => (
          <div key={action.label}>
            {action.divider && index > 0 && <Divider />}
            <MenuItem
              onClick={() => handleAction(action)}
              sx={{ py: 0.75, px: 1.5 }}
            >
              {action.icon && (
                <ListItemIcon sx={{ minWidth: 32, color: action.color ?? '#6b6375' }}>
                  {action.icon}
                </ListItemIcon>
              )}
              <ListItemText
                primary={action.label}
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '14px',
                    color: action.color ? `${action.color}.main` : '#08060d',
                  },
                }}
              />
            </MenuItem>
          </div>
        ))}
      </Menu>
    </>
  );
}