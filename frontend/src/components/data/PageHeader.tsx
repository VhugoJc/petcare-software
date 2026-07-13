import { Box, Typography, Button } from '@mui/material';
import type { ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/*  PageHeader — Consistent page title area                           */
/* ------------------------------------------------------------------ */

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    icon?: ReactNode;
    onClick: () => void;
  };
  children?: ReactNode;
}

export function PageHeader({ title, subtitle, action, children }: PageHeaderProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h1"
            sx={{ fontSize: '28px', fontWeight: 700, color: '#08060d' }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" sx={{ mt: 0.5, color: '#6b6375' }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        {action && (
          <Button
            variant="contained"
            color="primary"
            startIcon={action.icon}
            onClick={action.onClick}
            size="medium"
            sx={{ flexShrink: 0 }}
          >
            {action.label}
          </Button>
        )}
      </Box>

      {children}
    </Box>
  );
}