import { Box, Typography } from '@mui/material';
import { CalendarMonth, Pets, AttachMoney, Notifications } from '@mui/icons-material';
import { StatCard } from '../../../components/ui/StatCard';

interface KpiRowProps {
  appointmentsToday: number;
  newPatientsToday: number;
  revenueToday: number;
  pendingAlerts: number;
}

export function KpiRow({ appointmentsToday, newPatientsToday, revenueToday, pendingAlerts }: KpiRowProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
        gap: 2,
        mb: 3,
      }}
    >
      <StatCard
        icon={<CalendarMonth />}
        label="Appointments Today"
        value={appointmentsToday}
        color="#aa3bff"
      />
      <StatCard
        icon={<Pets />}
        label="New Patients"
        value={newPatientsToday}
        color="#2e7d32"
      />
      <StatCard
        icon={<AttachMoney />}
        label="Revenue Today"
        value={`$${revenueToday.toLocaleString()}`}
        trend={{ direction: 'up', percentage: 8 }}
        color="#1976d2"
      />
      <StatCard
        icon={<Notifications />}
        label="Pending Alerts"
        value={pendingAlerts}
        trend={{ direction: 'down', percentage: 2 }}
        color="#d32f2f"
      />
    </Box>
  );
}