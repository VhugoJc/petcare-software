import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface ActivityItem {
  id: string | number;
  icon: ReactNode;
  text: string;
  timestamp: string;
}

interface ActivityFeedProps {
  items: ActivityItem[];
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  if (items.length === 0) {
    return (
      <Typography variant="body2" sx={{ color: '#6b6375', py: 2, textAlign: 'center' }}>
        No recent activity.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {items.map((item, index) => (
        <Box
          key={item.id}
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1.5,
            py: 1.25,
            borderTop: index === 0 ? 'none' : '1px solid #e5e4e7',
          }}
        >
          <Box sx={{ fontSize: 18, flexShrink: 0, mt: 0.25 }}>{item.icon}</Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ color: '#08060d' }}>
              {item.text}
            </Typography>
            <Typography variant="caption" sx={{ color: '#6b6375' }}>
              {item.timestamp}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}