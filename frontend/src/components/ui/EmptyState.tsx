import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        px: 2,
        textAlign: 'center',
      }}
    >
      {icon && <Box sx={{ fontSize: 48, mb: 2, opacity: 0.4 }}>{icon}</Box>}
      <Typography variant="h2" sx={{ fontSize: '18px', fontWeight: 600, color: '#08060d', mb: 0.5 }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" sx={{ color: '#6b6375', maxWidth: 360, mb: 2 }}>
          {description}
        </Typography>
      )}
      {action && <Box>{action}</Box>}
    </Box>
  );
}