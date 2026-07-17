import { RestDashboardService } from './RestDashboardService';
import type { DashboardService } from './DashboardService';

export const dashboardService: DashboardService = new RestDashboardService();