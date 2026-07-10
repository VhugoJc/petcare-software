import { Box, Typography, Button } from '@mui/material';
import { ChevronRight } from '@mui/icons-material';
import type { ReactNode } from 'react';

interface WidgetCardProps {
  title: string;
  children: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export function WidgetCard({ title, children, actionLabel, onAction }: WidgetCardProps) {
  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 2,
        bgcolor: '#ffffff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h2" sx={{ fontSize: '16px', fontWeight: 600, color: '#08060d' }}>
          {title}
        </Typography>
        {actionLabel && (
          <Button
            size="small"
            endIcon={<ChevronRight sx={{ fontSize: 16 }} />}
            onClick={onAction}
            sx={{ textTransform: 'none', color: '#aa3bff', fontWeight: 500, fontSize: '13px' }}
          >
            {actionLabel}
          </Button>
        )}
      </Box>
      {children}
    </Box>
  );
}