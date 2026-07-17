import type { OwnerResponse } from '../../owners/types/index';
import type { PetResponse } from '../../pets/types/index';
import type { AppointmentResponse } from '../../appointments/types/index';

/* ------------------------------------------------------------------ */
/*  Dashboard — aggregated response                                   */
/* ------------------------------------------------------------------ */

export interface DashboardSummary {
  totalOwners: number;
  totalPets: number;
  totalAppointments: number;
  todayAppointments: number;
}

export interface DashboardResponse {
  summary: DashboardSummary;
  recentOwners: OwnerResponse[];
  recentPets: PetResponse[];
  upcomingAppointments: AppointmentResponse[];
}