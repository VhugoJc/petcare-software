import type { DashboardService } from './DashboardService';
import type { DashboardKPIs, Appointment, RevenueMonth, SpeciesDistribution, StaffMember, ActivityItem } from '../types';
import {
  MOCK_KPIS,
  MOCK_APPOINTMENTS,
  MOCK_REVENUE,
  MOCK_SPECIES,
  MOCK_STAFF,
  MOCK_ACTIVITY,
} from '../utils/mockData';

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export class MockDashboardService implements DashboardService {
  async getKPIs(): Promise<DashboardKPIs> {
    await delay();
    return { ...MOCK_KPIS };
  }

  async getTodayAppointments(): Promise<Appointment[]> {
    await delay();
    return [...MOCK_APPOINTMENTS];
  }

  async getRevenue(): Promise<RevenueMonth[]> {
    await delay();
    return [...MOCK_REVENUE];
  }

  async getSpeciesDistribution(): Promise<SpeciesDistribution[]> {
    await delay();
    return [...MOCK_SPECIES];
  }

  async getStaffActivity(): Promise<StaffMember[]> {
    await delay();
    return [...MOCK_STAFF];
  }

  async getActivityFeed(): Promise<ActivityItem[]> {
    await delay();
    return [...MOCK_ACTIVITY];
  }
}