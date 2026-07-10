import { Typography } from '@mui/material';

interface TrendIndicatorProps {
  direction: 'up' | 'down';
  percentage: number;
}

export function TrendIndicator({ direction, percentage }: TrendIndicatorProps) {
  return (
    <Typography
      variant="caption"
      sx={{
        color: direction === 'up' ? '#2e7d32' : '#d32f2f',
        display: 'flex',
        alignItems: 'center',
        gap: 0.25,
        fontWeight: 500,
      }}
    >
      {direction === 'up' ? '▲' : '▼'} {percentage}%
    </Typography>
  );
}