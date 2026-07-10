import { Box, Typography } from '@mui/material';
import type { RevenueMonth } from '../types';

interface RevenueChartProps {
  data: RevenueMonth[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  if (data.length === 0) {
    return (
      <Typography variant="body2" sx={{ color: '#6b6375', py: 2, textAlign: 'center' }}>
        No revenue data available.
      </Typography>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, height: 160, pt: 2 }}>
      {data.map((item) => {
        const heightPct = (item.value / maxValue) * 100;
        return (
          <Box
            key={item.month}
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
              height: '100%',
              justifyContent: 'flex-end',
            }}
          >
            <Typography variant="caption" sx={{ color: '#6b6375', fontSize: '11px', fontWeight: 500 }}>
              ${(item.value / 1000).toFixed(0)}k
            </Typography>
            <Box
              sx={{
                width: '100%',
                maxWidth: 40,
                height: `${heightPct}%`,
                minHeight: 8,
                borderRadius: '6px 6px 0 0',
                background: 'linear-gradient(180deg, #aa3bff 0%, #d9a8ff 100%)',
                transition: 'height 0.5s ease',
              }}
            />
            <Typography variant="caption" sx={{ color: '#6b6375', fontSize: '11px' }}>
              {item.month}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}