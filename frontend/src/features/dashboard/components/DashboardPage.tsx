import { Box, Typography, Alert } from '@mui/material';
import { useAuth } from '../../auth/hooks/useAuth';
import { useDashboard } from '../hooks/useDashboard';
import { KpiRow } from './KpiRow';
import { TodaySchedule } from './TodaySchedule';
import { RevenueChart } from './RevenueChart';
import { SpeciesDistributionWidget } from './SpeciesDistribution';
import { StaffActivityWidget } from './StaffActivity';
import { RecentActivitySection } from './RecentActivitySection';
import { WidgetCard } from '../../../components/ui/WidgetCard';
import { MOCK_SPECIES_TOTAL } from '../utils/mockData';

export function DashboardPage() {
  const { state: authState } = useAuth();
  const { kpis, appointments, revenue, species, staff, activity, error, refresh } = useDashboard();

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h1">Dashboard</Typography>
        <Typography variant="body1" sx={{ mt: 0.5, color: '#6b6375' }}>
          Welcome back, {authState.user?.name?.split(' ')[0] ?? 'User'} — here's your clinic today
        </Typography>
      </Box>

      {/* Error banner */}
      {error && (
        <Alert severity="error" onClose={refresh} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* KPI Row */}
      {kpis && (
        <KpiRow
          appointmentsToday={kpis.appointmentsToday}
          newPatientsToday={kpis.newPatientsToday}
          revenueToday={kpis.revenueToday}
          pendingAlerts={kpis.pendingAlerts}
        />
      )}

      {/* Middle row — Schedule + Revenue */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 60%' }, minWidth: 0 }}>
          <WidgetCard title="📋 Today's Schedule" actionLabel="View All">
            <TodaySchedule appointments={appointments} />
          </WidgetCard>
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 35%' }, minWidth: 0 }}>
          <WidgetCard title="📊 Monthly Revenue">
            <RevenueChart data={revenue} />
          </WidgetCard>
        </Box>
      </Box>

      {/* Bottom row — Species + Staff + Activity */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 30%' }, minWidth: 0 }}>
          <WidgetCard title="🐕 Patients by Species">
            <SpeciesDistributionWidget data={species} total={MOCK_SPECIES_TOTAL} />
          </WidgetCard>
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 30%' }, minWidth: 0 }}>
          <WidgetCard title="👩‍⚕️ Staff Today">
            <StaffActivityWidget staff={staff} />
          </WidgetCard>
        </Box>
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 30%' }, minWidth: 0 }}>
          <WidgetCard title="🔔 Recent Activity">
            <RecentActivitySection items={activity} />
          </WidgetCard>
        </Box>
      </Box>
    </Box>
  );
}