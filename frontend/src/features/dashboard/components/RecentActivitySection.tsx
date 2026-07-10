import { Box } from '@mui/material';
import { ActivityFeed } from '../../../components/ui/ActivityFeed';
import type { ActivityItem } from '../types';

interface RecentActivitySectionProps {
  items: ActivityItem[];
}

export function RecentActivitySection({ items }: RecentActivitySectionProps) {
  /* Map domain ActivityItem → generic ActivityFeed shape */
  const feedItems = items.map((item) => ({
    id: item.id,
    icon: <Box sx={{ fontSize: 18 }}>{item.icon}</Box>,
    text: item.text,
    timestamp: item.timestamp,
  }));

  return <ActivityFeed items={feedItems} />;
}