export type AppointmentStatus = 'confirmed' | 'checked-in' | 'in-progress' | 'completed' | 'cancelled';

// Re-exported from shared types for cross-module consistency
export type { Species } from '../../../types';

export interface Appointment {
  id: string;
  time: string;
  patientName: string;
  patientSpecies: Species;
  ownerName: string;
  reason: string;
  veterinarian: string;
  status: AppointmentStatus;
}

export interface DashboardKPIs {
  appointmentsToday: number;
  newPatientsToday: number;
  revenueToday: number;
  pendingAlerts: number;
}

export interface RevenueMonth {
  month: string;
  value: number;
}

export interface SpeciesDistribution {
  species: Species;
  count: number;
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'veterinarian' | 'receptionist';
  isOnline: boolean;
  patientsAttended: number;
}

export interface ActivityItem {
  id: string;
  icon: string;
  text: string;
  timestamp: string;
}

export interface DashboardData {
  kpis: DashboardKPIs;
  appointments: Appointment[];
  revenue: RevenueMonth[];
  species: SpeciesDistribution[];
  staff: StaffMember[];
  activity: ActivityItem[];
}