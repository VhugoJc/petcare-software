import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  trend?: {
    direction: 'up' | 'down';
    percentage: number;
  };
  color?: string;
}

export function StatCard({ icon, label, value, trend, color = '#aa3bff' }: StatCardProps) {
  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 2,
        bgcolor: '#ffffff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        flex: 1,
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: `${color}15`,
          color,
          flexShrink: 0,
          fontSize: 22,
        }}
      >
        {icon}
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" sx={{ color: '#6b6375', mb: 0.25 }}>
          {label}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#08060d', lineHeight: 1.2 }}>
          {value}
        </Typography>
        {trend && (
          <Typography
            variant="caption"
            sx={{
              color: trend.direction === 'up' ? '#2e7d32' : '#d32f2f',
              display: 'flex',
              alignItems: 'center',
              gap: 0.25,
              mt: 0.25,
            }}
          >
            {trend.direction === 'up' ? '▲' : '▼'} {trend.percentage}% vs last period
          </Typography>
        )}
      </Box>
    </Box>
  );
}