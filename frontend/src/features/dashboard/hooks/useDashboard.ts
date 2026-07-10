import { useState, useEffect, useCallback } from 'react';
import type { DashboardKPIs, Appointment, RevenueMonth, SpeciesDistribution, StaffMember, ActivityItem } from '../types';
import { dashboardService } from '../services';

interface UseDashboardResult {
  kpis: DashboardKPIs | null;
  appointments: Appointment[];
  revenue: RevenueMonth[];
  species: SpeciesDistribution[];
  staff: StaffMember[];
  activity: ActivityItem[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useDashboard(): UseDashboardResult {
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [revenue, setRevenue] = useState<RevenueMonth[]>([]);
  const [species, setSpecies] = useState<SpeciesDistribution[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [kpisData, appointmentsData, revenueData, speciesData, staffData, activityData] = await Promise.all([
        dashboardService.getKPIs(),
        dashboardService.getTodayAppointments(),
        dashboardService.getRevenue(),
        dashboardService.getSpeciesDistribution(),
        dashboardService.getStaffActivity(),
        dashboardService.getActivityFeed(),
      ]);

      setKpis(kpisData);
      setAppointments(appointmentsData);
      setRevenue(revenueData);
      setSpecies(speciesData);
      setStaff(staffData);
      setActivity(activityData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load dashboard data';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    kpis,
    appointments,
    revenue,
    species,
    staff,
    activity,
    isLoading,
    error,
    refresh: fetchAll,
  };
}