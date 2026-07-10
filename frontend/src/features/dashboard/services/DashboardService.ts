import type { DashboardKPIs, Appointment, RevenueMonth, SpeciesDistribution, StaffMember, ActivityItem } from '../types';

export interface DashboardService {
  getKPIs(): Promise<DashboardKPIs>;
  getTodayAppointments(): Promise<Appointment[]>;
  getRevenue(): Promise<RevenueMonth[]>;
  getSpeciesDistribution(): Promise<SpeciesDistribution[]>;
  getStaffActivity(): Promise<StaffMember[]>;
  getActivityFeed(): Promise<ActivityItem[]>;
}