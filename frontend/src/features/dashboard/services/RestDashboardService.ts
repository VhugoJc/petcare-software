import type { DashboardService } from './DashboardService';
import type { DashboardKPIs, Appointment, RevenueMonth, SpeciesDistribution, StaffMember, ActivityItem } from '../types';
import { API_ENDPOINTS } from '../../../config/api';
import { tokenStorage } from '../../auth/utils/tokenStorage';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = tokenStorage.getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/* ------------------------------------------------------------------ */
/*  RestDashboardService                                               */
/* ------------------------------------------------------------------ */

export class RestDashboardService implements DashboardService {
  private fetchPromise: Promise<any> | null = null;

  private async fetchDashboard(): Promise<any> {
    if (this.fetchPromise) return this.fetchPromise;

    this.fetchPromise = (async () => {
      const response = await fetch(API_ENDPOINTS.dashboard.get, {
        headers: getAuthHeaders(),
      });
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.error?.message || 'Failed to load dashboard');
      }
      return body.data;
    })();

    try {
      return await this.fetchPromise;
    } finally {
      this.fetchPromise = null;
    }
  }

  async getKPIs(): Promise<DashboardKPIs> {
    const data = await this.fetchDashboard();
    return {
      appointmentsToday: data.summary.todayAppointments,
      newPatientsToday: 0,
      revenueToday: 0,
      pendingAlerts: 0,
    };
  }

  async getTodayAppointments(): Promise<Appointment[]> {
    const data = await this.fetchDashboard();
    return data.upcomingAppointments.map((a: any) => ({
      id: a.id,
      time: a.startTime,
      patientName: a.petName,
      patientSpecies: a.petSpecies,
      ownerName: a.ownerName,
      reason: a.reason,
      veterinarian: '',
      status: a.status,
    }));
  }

  async getRevenue(): Promise<RevenueMonth[]> {
    return [];
  }

  async getSpeciesDistribution(): Promise<SpeciesDistribution[]> {
    return [];
  }

  async getStaffActivity(): Promise<StaffMember[]> {
    return [];
  }

  async getActivityFeed(): Promise<ActivityItem[]> {
    return [];
  }
}