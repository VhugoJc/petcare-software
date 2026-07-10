import { MockDashboardService } from './MockDashboardService';
import type { DashboardService } from './DashboardService';

export const dashboardService: DashboardService = new MockDashboardService();