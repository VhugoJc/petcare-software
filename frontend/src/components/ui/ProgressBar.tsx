import { Box, Typography } from '@mui/material';

interface ProgressBarProps {
  label: string;
  value: number;
  max?: number;
  color?: string;
  showPercentage?: boolean;
}

export function ProgressBar({ label, value, max = 100, color = '#aa3bff', showPercentage = true }: ProgressBarProps) {
  const pct = Math.min(Math.round((value / max) * 100), 100);

  return (
    <Box sx={{ mb: 1.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2" sx={{ color: '#08060d', fontWeight: 500 }}>
          {label}
        </Typography>
        {showPercentage && (
          <Typography variant="body2" sx={{ color: '#6b6375', fontWeight: 500 }}>
            {pct}%
          </Typography>
        )}
      </Box>
      <Box
        sx={{
          width: '100%',
          height: 8,
          borderRadius: '4px',
          bgcolor: '#e5e4e7',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            width: `${pct}%`,
            height: '100%',
            borderRadius: '4px',
            backgroundColor: color,
            transition: 'width 0.6s ease',
          }}
        />
      </Box>
    </Box>
  );
}